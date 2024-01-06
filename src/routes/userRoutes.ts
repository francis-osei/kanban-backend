import express from 'express';

import { uploadPhoto, registerAdmin } from '../controllers/userController';
import { photo } from '../middlewares/uploadPhoto';

const router = express.Router();

router.post('/upload/image', photo, uploadPhoto);
router.post('/admin/register', registerAdmin);

export default router;
