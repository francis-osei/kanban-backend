import express from 'express';
import {
    allUsers,
    createNewUser,
    deleteUser,
    renewUser,
} from '../controllers/userController';

const router = express.Router();

router.post('/new', createNewUser);
router.delete('/:id', deleteUser);
router.patch('/:id', renewUser);
router.get('/', allUsers);

export default router;
