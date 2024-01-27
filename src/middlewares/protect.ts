import { NextFunction, Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserModel, { UserInput } from '../models/userModel';

interface AuthenticatedRequest extends Request {
    user: UserInput;
}

const protect = catchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
        const token = req.cookies.jwt;

        if (!token) {
            return next(
                new AppError("You don't pemission to perfom this action", 403)
            );
        }

        const decode = jwt.verify(
            token,
            process.env.JWT_SECRET ?? ''
        ) as JwtPayload;

        const currentUser = await UserModel.findById(decode.id);
        if (!currentUser) {
            return next(
                new AppError(
                    'The user belonging to this token does not exist',
                    401
                )
            );
        }

        (req as AuthenticatedRequest)['user'] = currentUser;

        next();
    }
);

export default protect;
