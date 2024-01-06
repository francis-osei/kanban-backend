import express from 'express';
import { registerAdmin } from '../controllers/userController';

const router = express.Router();

router.post('/admin/register', registerAdmin);

export default router;
