import express, { Router } from 'express';
import { addTask, allTask, renewTask, removeTask, retrieveTask } from '../controllers/taskControllers';

const router: Router = express.Router();

router.get('/', allTask);
router.post('/new', addTask);
router.delete('/:id', removeTask);
router.patch('/:id', renewTask);
router.get('/:id', retrieveTask);

export default router;
