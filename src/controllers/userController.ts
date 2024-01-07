import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import cloudinary from '../configs/cloundinaryConfig';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { createAdmin } from '../services/userServices';
import { sendVerificationMail } from '../services/emailServices';

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
