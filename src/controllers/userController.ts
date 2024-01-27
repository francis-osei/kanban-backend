import { NextFunction, Request, Response } from 'express';

import {
    addNewUser,
    getAllUsers,
    getUser,
    removeUser,
    updateUser,
} from '../services/userServices';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { UserInput } from '../models/userModel';
import { sendClaimAccountMail } from '../services/emailServices';

export const addUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { user, radnomPassword } = await addNewUser(req.body);
        radnomPassword;
        const response = sendClaimAccountMail(user, radnomPassword);

        if (response instanceof AppError) {
            return next(new AppError(response.message, response.statusCode));
        }

        res.status(200).json({
            status: 'success',
            data: { user },
        });
    }
);

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

const isMessage = (
    input: UserInput[] | { message: string }
): input is { message: string } => {
    return (input as { message: string }).message !== undefined;
};

export const allUsers = catchAsync(async (_req: Request, res: Response) => {
    const users = await getAllUsers();

    const results =
        typeof users === 'object' ? (users as UserInput[]).length : 0;

    const data = isMessage(users) ? users.message : users;

    res.status(200).json({
        status: 'success',
        results,
        data,
    });
});

export const retrieveUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;

        const response = await getUser(userId);

        if (response instanceof AppError) {
            return next(new AppError(response.message, response.statusCode));
        }

        res.status(200).json({
            status: 'success',
            data: { user: response },
        });
    }
);
