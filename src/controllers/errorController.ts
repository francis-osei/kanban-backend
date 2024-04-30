import { Request, Response, NextFunction } from 'express';

import AppError from '../utils/appError';
import { CLIENT_ERROR_CODE, SERVER_ERROR_CODES } from '../constants/status';

const handleCastErrorDB = (err: AppError) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, CLIENT_ERROR_CODE.BAD_REQUEST);
};

const handleDuplicateFiedsDB = (err: AppError) => {
    const value = err.message!.match(/(["'])(\\?.)*?\1/)?.[0] || null;
    const message = `Duplicate field value: ${value}. Please use another value`;
    return new AppError(message, CLIENT_ERROR_CODE.BAD_REQUEST);
};

const handleValidationErrorDB = (err: AppError) => {
    const error = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${error.join('. ')}`;
    return new AppError(message, CLIENT_ERROR_CODE.BAD_REQUEST);
};

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }


        res.status(SERVER_ERROR_CODES.INTERNAL_SERVER_ERROR).json({
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
    err.statusCode = err.statusCode || SERVER_ERROR_CODES.INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicateFiedsDB(error);
        if (err.name === 'ValidationError')
            error = handleValidationErrorDB(error);

        sendErrorProd(error, req, res);
    }
    next();
};
