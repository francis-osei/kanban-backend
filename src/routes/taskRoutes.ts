import express, { Router } from 'express';
import { addTask } from '../controllers/taskControllers';

const router: Router = express.Router();

router.post('/new', addTask);

export default router;
