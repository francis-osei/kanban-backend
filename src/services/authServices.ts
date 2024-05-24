import { CLIENT_ERROR_CODE } from '../constants/status';
import UserModel, { UserMethods } from '../models/userModel';
import AppError from '../utils/appError';

export const loginUser = async (
    email: string,
    password: string
): Promise<UserMethods | AppError> => {
    if (!email || !password) {
        return new AppError('Please provide an email or password', CLIENT_ERROR_CODE.BAD_REQUEST);
    }

    const user: UserMethods = await UserModel.findOne({ email }).select(
        '+password +isFirstTimeLogin -createdAt -updatedAt -status -__v'
    );

    if (!user || !(await user.comparePasswords(password, user.password))) {
        return new AppError('Incorrect email or password', CLIENT_ERROR_CODE.UNAUTHORIZED);
    }

    return user;
};
