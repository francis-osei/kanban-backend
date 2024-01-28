import express from 'express';
import {
    allUsers,
    addUser,
    deleteUser,
    renewUser,
    retrieveUser,
} from '../controllers/userController';
import protect from '../middlewares/protect';

const router = express.Router();

router.post('/new', addUser);
router.delete('/:id', deleteUser);
router.patch('/:id', renewUser);
router.get('/',protect, allUsers);
router.get('/:id', retrieveUser);

export default router;
