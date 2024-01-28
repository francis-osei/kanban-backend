import { Request, Response, NextFunction } from 'express';

import AppError from '../utils/appError';

export interface RequestWithUser extends Request {
    user: {
        role: string;
    };
}

const restrictTo = (roles: string[]) => {
    return (
        req: Request | RequestWithUser,
        _res: Response,
        next: NextFunction
    ) => {
        if (
            'user' in req &&
            !roles.includes((req as RequestWithUser).user.role)
        )
            return next(
                new AppError(
                    'You do not have pemission to perform this action',
                    403
                )
            );
        next();
    };
};

export default restrictTo;
