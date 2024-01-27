import crypto from 'crypto';

import UserModel, { UserInput, UserMethods } from '../models/userModel';
import AppError from '../utils/appError';

export const findUserByEmail = async (
    email: string
): Promise<UserMethods | AppError> => {
    const user: UserMethods | null = await UserModel.findOne({ email });

    if (!user) {
        return new AppError('There is no user with the email address', 404);
    }

    return user;
};

export const findUserByObject = async (query: Partial<UserInput>) => {
    const user = await UserModel.findOne(query);

    if (!user) return new AppError('Token is invalid or has expired', 400);

    return user;
};

export const addNewUser = async (input: Partial<UserInput>) => {
    const radnomPassword = crypto.randomBytes(10).toString('hex');

    const user = await UserModel.create({
        ...input,
        password: radnomPassword,
        confirmPassword: radnomPassword,
    });

    return { user, radnomPassword };
};

export const removeUser = async (id: string): Promise<boolean | AppError> => {
    const user = await UserModel.deleteOne({
        _id: id,
        role: 'user',
    });

    if (user.deletedCount) return true;

    return new AppError('could not delete user', 500);
};

export const updateUser = async (
    userId: string,
    requestBody: Partial<UserInput>
): Promise<UserInput | AppError | null> => {
    const currentUser = await UserModel.findOne({ _id: userId, role: 'user' });

    if (currentUser === null) {
        return new AppError('User not found', 404);
    }

    const update = {
        fullName: requestBody.fullName,
        email: requestBody.email,
        specialization: requestBody.specialization,
        rank: requestBody.rank,
    };

    const user = await UserModel.findByIdAndUpdate(
        { _id: currentUser.id },
        update,
        {
            new: true,
            runValidators: true,
        }
    );

    return user;
};

export const getAllUsers = async (): Promise<
    UserInput[] | { message: string }
> => {
    const users = await UserModel.find({ role: 'user' }).select(
        '-isFirstTimeLogin -createdAt -updatedAt -__v'
    );

    if (users.length === 0) {
        return { message: 'There are no users' };
    }

    return users;
};

export const getUser = async (
    userId: string
): Promise<UserInput | AppError> => {
    const user = await UserModel.findOne({ _id: userId, role: 'user' }).select(
        '-isFirstTimeLogin -createdAt -updatedAt -__v'
    );

    if (user === null) {
        return new AppError('User not found', 404);
    }

    return user;
};
