import crypto from 'crypto';

import { NextFunction, Request, Response } from 'express';
import cloudinary from '../configs/cloundinaryConfig';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { findUserByEmail, findUserByObject } from '../services/userServices';
import {
    sendResetPasswordMail,
    sendWelcomeMail,
} from '../services/emailServices';
import { UserMethods } from '../models/userModel';
import { createToken } from '../utils/helpers';
import { loginUser } from '../services/authServices';
import {
    passwordResetToken,
    saveNewPassword,
} from '../services/passwordServices';
import { STATUS_RESPONSE, SUCCESS_CODE } from '../constants/status';

export const uploadPhoto = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.file) {
            return next(new AppError('file upload cannot be empty', 400));
        }
        const randomString = crypto.randomBytes(10).toString('hex');

        const fileName = `user-${randomString}-${Date.now()}`;

        const response = await cloudinary.uploader.upload(req.file?.path, {
            folder: 'kanban/users',
            public_id: fileName,
            width: 500,
            height: 500,
            crop: 'fill',
            quality: 'auto',
        });

        res.status(SUCCESS_CODE.OK).json({
            status: STATUS_RESPONSE.SUCCESS,
            data: {
                image_url: response.secure_url,
            },
        });
    }
);

export const login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        const user: UserMethods | AppError = await loginUser(email, password);

        if (user instanceof AppError) {
            return next(new AppError(user.message, user.statusCode));
        }

        let response;
        if (!user.isFirstTimeLogin) {
            response = await sendWelcomeMail(user);
        }

        user.isAuthenticated=true
        user.isFirstTimeLogin = true;
        await user.save({ validateBeforeSave: false });

        user.password = undefined;
        user.isFirstTimeLogin = undefined;

        if (response instanceof AppError) {
            return next(new AppError(response.message, response.statusCode));
        }

        const userId = user._id;
        const token = createToken(userId, res);

        res.status(SUCCESS_CODE.OK).json({
            status: STATUS_RESPONSE.SUCCESS,
            token,
            data: { user },
        });
    }
);

export const forgotPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;

        const user: UserMethods | AppError = await findUserByEmail(email);

        if (user instanceof AppError) {
            return next(new AppError(user.message, user.statusCode));
        }

        const resetToken = passwordResetToken(user);
        await user.save({ validateBeforeSave: false });

        const response: boolean | AppError = await sendResetPasswordMail(
            user,
            resetToken
        );

        if (response instanceof AppError) {
            return next(new AppError(response.message, response.statusCode));
        }

        res.status(SUCCESS_CODE.OK).json({
            status: STATUS_RESPONSE.SUCCESS,
            message: 'Send reset password instructions to the provided email',
        });
    }
);

export const resetPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { token } = req.params;

        const { password, confirmPassword } = req.body;

        const hashToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        type PasswordResetQuery = {
            passwordResetToken: string;
            passwordResetExpires: { $gt: Date };
        };

        const query: PasswordResetQuery = {
            passwordResetToken: hashToken,
            passwordResetExpires: { $gt: new Date(Date.now()) },
        };

        const user = await findUserByObject(query);

        if (user instanceof AppError)
            return next(new AppError(user.message, user.statusCode));

        const inputPassword = { password, confirmPassword };

        await saveNewPassword(inputPassword, user);

        res.status(SUCCESS_CODE.OK).json({
            status: STATUS_RESPONSE.SUCCESS,
            message: 'Password reset was successful',
        });
    }
);
