import express from 'express';

import {
    uploadPhoto,
    registerAdmin,
    login,
    forgotPassword,
} from '../controllers/authController';
import { photo } from '../middlewares/uploadPhoto';

const router = express.Router();

router.post('/upload/image', photo, uploadPhoto);
router.post('/admin/register', registerAdmin);
router.post('/auth/login', login);
router.post('/auth/forgotPassword', forgotPassword);

export default router;
