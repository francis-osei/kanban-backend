import UserModel, { UserMethods } from '../models/userModel';
import AppError from '../utils/appError';

export const loginUser = async (
    email: string,
    password: string
): Promise<UserMethods | AppError> => {
    if (!email || !password) {
        return new AppError('Please provide an email or password', 400);
    }

    const user: UserMethods = await UserModel.findOne({ email }).select(
        '+password +isFirstTimeLogin -createdAt -updatedAt -status -__v'
    );

    if (!user || !(await user.comparePasswords(password, user.password))) {
        return new AppError('Incorrect email or password', 401);
    }

    return user;
};
