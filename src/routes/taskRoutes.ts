import express, { Router } from 'express';
import { addTask, allTask, removeTask } from '../controllers/taskControllers';

const router: Router = express.Router();

router.get('/', allTask);
router.post('/new', addTask);
router.delete('/:id', removeTask);

export default router;
