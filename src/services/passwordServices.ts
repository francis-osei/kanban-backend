import { Document, Types } from 'mongoose';
import { UserInput, UserMethods } from '../models/userModel';

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

export const passwordResetToken = (user: UserMethods): string => {
    return user.createPasswordResetToken();
};

export const UpdateWithNewPassword = async (
    user: Document<unknown, object, UserInput> &
        UserInput & {
            _id: Types.ObjectId;
        },
    passwords: { password: string; confirmPassword: string }
) => {
    user.password = passwords.password;
    user.confirmPassword = passwords.confirmPassword;

    await user.save();
};
