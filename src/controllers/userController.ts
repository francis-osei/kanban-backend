import { NextFunction, Request, Response } from 'express';

import { createUser, removeUser, updateUser } from '../services/userServices';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

export const createNewUser = catchAsync(async (req: Request, res: Response) => {
    const user = await createUser(req.body);

    res.status(200).json({
        status: 'success',
        data: { user },
    });
});

export const deleteUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;

        const response = await removeUser(userId);

        if (response instanceof AppError) {
            return next(
                new AppError(
                    `${response.message}; user not found or does not exist`,
                    response.statusCode
                )
            );
        }

        res.status(200).json({
            status: 'success',
            message: 'User was sccessfully delete',
        });
    }
);

export const renewUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;

        const response = await updateUser(userId, req.body);

        if (response instanceof AppError) {
            return next(new AppError(response.message, response.statusCode));
        }

        res.status(200).json({
            status: 'success',
            message: 'Updated user successfully',
        });
    }
);
