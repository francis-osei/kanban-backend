import { NextFunction, Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserModel, { UserInput } from '../models/userModel';
import { RequestWithUser } from '../middlewares/restrictTo';

export interface AuthenticatedRequest extends Request {
    user: UserInput;
}

const protect = catchAsync(
    async (
        req: Request | RequestWithUser,
        _res: Response,
        next: NextFunction
    ) => {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

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
        
        if (!currentUser?.isAuthenticated) {
            return next(new AppError('User is not authenticated', 401));
        }

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
