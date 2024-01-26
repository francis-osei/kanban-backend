import { Request, Response, NextFunction } from 'express';

import AppError from '../utils/appError';
import logger from '../logger/logs';

const handleDuplicateFiedsDB = (err: AppError) => {
    const value = err.message!.match(/(["'])(\\?.)*?\1/)?.[0] || null;
    const message = `Duplicate field value: ${value}. Please use another value`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err: AppError) => {
    const error = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${error.join('. ')}`;
    return new AppError(message, 400);
};

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }

        logger.info(err);

        res.status(500).json({
            status: 'error',
            message: 'something went wrong!',
        });
    }
};

const sendErrorDev = (err: AppError, req: Request, res: Response) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
};

export default (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        if (err.code === 11000) error = handleDuplicateFiedsDB(error);
        if (err.name === 'ValidationError')
            error = handleValidationErrorDB(error);

        sendErrorProd(error, req, res);
    }
    next();
};
