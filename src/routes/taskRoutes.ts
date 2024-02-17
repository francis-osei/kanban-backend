import express, { Router } from 'express';
import { addTask, allTask, renewTask, removeTask } from '../controllers/taskControllers';

const router: Router = express.Router();

router.get('/', allTask);
router.post('/new', addTask);
router.delete('/:id', removeTask);
router.patch('/:id', renewTask);

export default router;
