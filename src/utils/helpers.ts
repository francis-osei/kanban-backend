import { Response } from 'express';
import jwt from 'jsonwebtoken';

const signToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET || '', {
        expiresIn: process.env.JWT_EPIRES_IN,
    });
};

export const createToken = (userId: string, res: Response) => {
    const token = signToken(userId);

    const cookieOption: {
        expires: Date;
        httpOnly: boolean;
        secure?: boolean;
        sameSite: 'strict' | 'lax' | 'none';
    } = {
        expires: new Date(
            Date.now() +
                Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 69 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    };

    res.cookie('jwt', token, cookieOption);

    return token;
};

export const formatDate = (date: string): Date => {
    const currentTime = new Date();
    const [year, month, day] = date.split('-').map(Number);
    currentTime.setFullYear(year, month - 1, day);

    return currentTime;
};
