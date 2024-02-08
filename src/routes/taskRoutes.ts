import express, { Router } from 'express';
import { addTask, removeTask } from '../controllers/taskControllers';

const router: Router = express.Router();

router.post('/new', addTask);
router.delete('/:id', removeTask);

export default router;
