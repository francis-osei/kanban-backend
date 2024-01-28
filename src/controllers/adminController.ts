import { NextFunction, Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { createAdmin } from '../services/adminServices';
import { sendVerificationMail } from '../services/emailServices';

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
