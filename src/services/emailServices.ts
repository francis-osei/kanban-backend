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
