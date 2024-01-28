class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    code: number;
    path: string;
    value: string;
    errors: {
        [key: string]: {
            message: string;
        };
    } = {};

    constructor(message: string, statusCode: number) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.code = 0;
        this.path = '';
        this.value = '';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
