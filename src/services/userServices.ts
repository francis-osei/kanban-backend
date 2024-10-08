import { Document, Types } from 'mongoose';
import crypto from 'crypto';

import UserModel, { UserInput, UserMethods } from '../models/userModel';
import AppError from '../utils/appError';
import { CLIENT_ERROR_CODE, SERVER_ERROR_CODES } from '../constants/status';

export const findUserByEmail = async (
    email: string
): Promise<UserMethods | AppError> => {
    const user: UserMethods | null = await UserModel.findOne({ email });

    if (!user) {
        return new AppError(
            'There is no user with the email address',
            CLIENT_ERROR_CODE.NOT_FOUND
        );
    }

    return user;
};

export const findUserByObject = async (query: Partial<UserInput>) => {
    const user = await UserModel.findOne(query);

    if (!user)
        return new AppError(
            'Token is invalid or has expired',
            CLIENT_ERROR_CODE.BAD_REQUEST
        );

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

    return new AppError(
        'could not delete user',
        SERVER_ERROR_CODES.INTERNAL_SERVER_ERROR
    );
};

export const updateUser = async (
    userId: string,
    requestBody: Partial<UserInput>
): Promise<UserInput | AppError | null> => {
    const currentUser = await UserModel.findOne({ _id: userId, role: 'user' });

    if (currentUser === null) {
        return new AppError('User not found', CLIENT_ERROR_CODE.NOT_FOUND);
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
        '-isFirstTimeLogin -createdAt -updatedAt -confirmPassword -__v'
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
        '-isFirstTimeLogin -createdAt -confirmPassword -updatedAt -__v'
    );

    if (user === null) {
        return new AppError('User not found', CLIENT_ERROR_CODE.NOT_FOUND);
    }

    return user;
};

export const addBulkUsers = async (bulkInput: Partial<UserInput>[]) => {
    const users = await UserModel.insertMany(bulkInput);

    return users;
};

export const deleteAllUsers = async () => {
    const deleteUsers = await UserModel.deleteMany({ role: 'user' });

    if (deleteUsers.deletedCount) return true;

    return new AppError(
        'There are no users to be deleted',
        SERVER_ERROR_CODES.INTERNAL_SERVER_ERROR
    );
};

export const findUserById = async (
    id: string,
    selectFields?: string
): Promise<
    | (Document<unknown, object, UserInput> &
          UserInput &
          UserMethods & {
              _id: Types.ObjectId;
          })
    | null
> => {
    const query = selectFields
        ? UserModel.findById(id).select(selectFields)
        : UserModel.findById(id);

    const user = await query;

    return user as
        | (Document<unknown, object, UserInput> &
              UserInput &
              UserMethods & {
                  _id: Types.ObjectId;
              })
        | null;
};

export const updateUserProfile = async (
    input: Partial<UserInput>,
    id: string
): Promise<UserInput | null> => {
    const user = await UserModel.findByIdAndUpdate({ _id: id }, input, {
        new: true,
        runValidators: true,
    });

    return user;
};

export const findUsersIn = async (userName: string[]) => {
    const users = await UserModel.find({ fullName: { $in: userName } });

    return users;
};
