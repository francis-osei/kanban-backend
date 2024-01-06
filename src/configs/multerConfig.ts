import multer from 'multer';
import { Request } from 'express';

import AppError from '../utils/appError';

const multerStorage = multer.memoryStorage();

const multerFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(null, false);
        cb(new AppError('Not an image. Please upload only images', 400));
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

export default upload;
