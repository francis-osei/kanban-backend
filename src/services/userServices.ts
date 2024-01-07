import UserModel, { UserInput, UserMethods } from '../models/userModel';
import AppError from '../utils/appError';

export const createAdmin = async (input: UserInput): Promise<UserInput> => {
    const user = await UserModel.create(input);

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
