import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import cloudinary from '../configs/cloundinaryConfig';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import {
    createAdmin,
    findUserByEmail,
    findUserByObject,
    loginUser,
    passwordResetToken,
    saveNewPassword,
} from '../services/userServices';
import {
    sendResetPasswordMail,
    sendVerificationMail,
    sendWelcomeMail,
} from '../services/emailServices';
import { UserMethods } from '../models/userModel';
import { createToken } from '../utils/helpers';
// import { createToken } from '../utils/helpers';

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

        res.status(200).json({
            status: 'success',
            data: {
                image_url: response.secure_url,
            },
        });
    }
);

export const registerAdmin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if (Object.keys(req.body).length === 0) {
            return next(new AppError('body cannot be empty', 400));
        }

        const user = await createAdmin(req.body);

        const url = process.env.LOGIN_URL;

        const response = await sendVerificationMail(user, url);

        if (response instanceof AppError) {
            return next(new AppError(response.message, response.statusCode));
        }

        res.status(201).json({
            status: 'success',
            message: 'Registration successful. Welcome aboard!',
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

        user.isFirstTimeLogin = true;
        await user.save({ validateBeforeSave: false });

        user.password = undefined;
        user.isFirstTimeLogin = undefined;

        if (response instanceof AppError) {
            return next(new AppError(response.message, response.statusCode));
        }

        const userId = user._id;
        const token = createToken(userId, res);

        res.status(200).json({
            status: 'success',
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

        res.status(200).json({
            status: 'success',
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

        res.status(200).json({
            status: 'success',
            message: 'Password reset was successful',
        });
    }
);
