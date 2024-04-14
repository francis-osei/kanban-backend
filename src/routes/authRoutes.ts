import express from 'express';

import {
    uploadPhoto,
    login,
    forgotPassword,
    resetPassword,
} from '../controllers/authController';
import { photo } from '../middlewares/uploadPhoto';
import { registerAdmin } from '../controllers/adminController';

const router = express.Router();

router.post('/upload/image', photo, uploadPhoto);
router.post('/admin/register', registerAdmin);
router.post('/auth/login', login);
router.post('/auth/forgotPassword', forgotPassword);
router.post('/auth/resetPassword/:token', resetPassword);

export default router;
