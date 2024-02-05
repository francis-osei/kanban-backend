import crypto from 'crypto';

import { NextFunction, Request, Response } from 'express';

import {
    addBulkUsers,
    addNewUser,
    deleteAllUsers,
    findUserById,
    getAllUsers,
    getUser,
    removeUser,
    updateUser,
    updateUserProfile,
} from '../services/userServices';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { UserInput } from '../models/userModel';
import { sendClaimAccountMail } from '../services/emailServices';
import { UpdateWithNewPassword } from '../services/passwordServices';
import { SuccessCodes } from '../utils/statusCode';

export const addUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { user, radnomPassword } = await addNewUser(req.body);
        radnomPassword;
        const response = sendClaimAccountMail(user, radnomPassword);

        if (response instanceof AppError) {
            return next(new AppError(response.message, response.statusCode));
        }

        res.status(SuccessCodes.ok).json({
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

        res.status(SuccessCodes.noContent).json({
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

        res.status(SuccessCodes.ok).json({
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

    res.status(SuccessCodes.ok).json({
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

        res.status(SuccessCodes.ok).json({
            status: 'success',
            data: { user: response },
        });
    }
);

export const bulkInput = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const usersData = req.body;

        if (!usersData.length) {
            return next(new AppError('Object cannot not empty', 404));
        }

        const users = usersData.map((user: UserInput) => {
            const randomPassword = crypto.randomBytes(10).toString('hex');

            return {
                ...user,
                password: randomPassword,
                confirmPassword: randomPassword,
            };
        });

        await addBulkUsers(users);

        res.status(SuccessCodes.ok).json({
            status: 'success',
            result: usersData.length,
            message: 'Bulk input was successful',
        });
    }
);

export const removeAllUsers = catchAsync(
    async (_req: Request, res: Response, next: NextFunction) => {
        const response = await deleteAllUsers();

        if (response instanceof AppError)
            return next(new AppError(response.message, response.statusCode));

        res.status(SuccessCodes.ok).json({
            status: 'success',
            message: 'All users deleted successfully',
        });
    }
);

export const updatePassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { oldPassword, password, confirmPassword } = req.body;

        const userId = 'user' in req ? (req.user as { id: string }).id : '';

        const user = await findUserById(
            userId,
            '+password -confirmPassword -updatedAt -createdAt'
        );

        if (user === null) {
            return;
        }

        if (!(await user.comparePasswords(oldPassword, user.password))) {
            return next(new AppError('Incorrect password', 401));
        }

        await UpdateWithNewPassword(user, {
            password,
            confirmPassword,
        });

        res.status(SuccessCodes.ok).json({
            status: 'success',
            message: 'Password update was successful',
        });
    }
);

export const updateUserInfo = catchAsync(
    async (req: Request, res: Response) => {
        const { fullName, email, specialization, rank, about } = req.body;

        const userID = 'user' in req ? (req.user as { id: string }).id : '';

        const userData = {
            fullName,
            email,
            specialization,
            rank,
            about,
        };

        await updateUserProfile(userData, userID);

        res.status(SuccessCodes.ok).json({
            status: 'success',
            message: 'Profile was update successful',
        });
    }
);
