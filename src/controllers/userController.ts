import { NextFunction, Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { createAdmin } from '../services/userServices';

export const registerAdmin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if (Object.keys(req.body).length === 0) {
            return next(new AppError('body cannot be empty', 400));
        }

        await createAdmin(req.body);

        res.status(201).json({
            status: 'success',
            message: 'Registration successful. Welcome aboard!',
        });
    }
);
