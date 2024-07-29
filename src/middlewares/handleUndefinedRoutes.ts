import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

const handleUndefinedRoutes = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    next(new AppError(`can't find ${req.originalUrl} on tihs server`, 404));
};

export default handleUndefinedRoutes;
