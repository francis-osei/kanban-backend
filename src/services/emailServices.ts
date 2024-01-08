import { UserInput } from '../models/userModel';
import AppError from '../utils/appError';
import Email from '../utils/email';

export const sendVerificationMail = async (
    currentUser: UserInput,
    url: string | undefined
): Promise<boolean | AppError> => {
    const response = await new Email(currentUser, url).sendVerification();

    if (response === undefined) return true;

    return new AppError(
        'could not send email. username and password not accepted',
        500
    );
};

export const sendResetPasswordMail = async (
    user: UserInput,
    resetToken: string
) => {
    const resetURL = `${process.env.FRONT_END_URL}api/auth/resetPassword/${resetToken}`;

    const response = await new Email(user, resetURL).sendPasswordReset();

    if (response === undefined) return true;

    return new AppError(
        'could not send email. username and password not accepted',
        500
    );
};

export const sendWelcomeMail = async (user: UserInput) => {
    const response = await new Email(user, undefined).sendWelcome();

    if (response === undefined) return true;

    return new AppError(
        'could not send email. username and password not accepted',
        500
    );
};
