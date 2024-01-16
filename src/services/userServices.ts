import crypto from 'crypto';

import { Document, Types } from 'mongoose';
import UserModel, { UserInput, UserMethods } from '../models/userModel';
import AppError from '../utils/appError';

export const createAdmin = async (input: UserInput): Promise<UserInput> => {
    const user = await UserModel.create(input);

    return user;
};

export const loginUser = async (
    email: string,
    password: string
): Promise<UserMethods | AppError> => {
    if (!email || !password) {
        return new AppError('Please provide an email or password', 400);
    }

    const user: UserMethods = await UserModel.findOne({ email }).select(
        '+password'
    );

    if (!user || !(await user.comparePasswords(password, user.password))) {
        return new AppError('Incorrect email or password', 401);
    }

    return user;
};

export const findUserByEmail = async (
    email: string
): Promise<UserMethods | AppError> => {
    const user: UserMethods | null = await UserModel.findOne({ email });

    if (!user) {
        return new AppError('There is no user with the email address', 404);
    }

    return user;
};

export const passwordResetToken = (user: UserMethods): string => {
    return user.createPasswordResetToken();
};

export const findUserByObject = async (query: Partial<UserInput>) => {
    const user = await UserModel.findOne(query);

    if (!user) return new AppError('Token is invalid or has expired', 400);

    return user;
};

export const saveNewPassword = async (
    inputPassword: { password: string; confirmPassword: string },
    user: Document<unknown, object, UserInput> &
        UserInput & {
            _id: Types.ObjectId;
        }
) => {
    user.password = inputPassword.password;
    user.confirmPassword = inputPassword.confirmPassword;
    user.passwordResetExpires = null;
    user.passwordResetToken = null;
    await user.save();
};

export const createUser = async (input: Partial<UserInput>) => {
    const radnomPassword = crypto.randomBytes(10).toString('hex');

    const user = new UserModel({
        ...input,
        password: radnomPassword,
        confirmPassword: radnomPassword,
    });

    await user.save();

    return user;
};

export const removeUser = async (id: string): Promise<boolean | AppError> => {
    const user = await UserModel.deleteOne({
        _id: id,
        role: 'user',
    });

    if (user.deletedCount) return true;

    return new AppError('could not delete user', 500);
};