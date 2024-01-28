import express from 'express';
import {
    allUsers,
    addUser,
    deleteUser,
    renewUser,
    retrieveUser,
} from '../controllers/userController';

const router = express.Router();

router.post('/new', addUser);
router.delete('/:id', deleteUser);
router.patch('/:id', renewUser);
router.get('/', allUsers);
router.get('/:id', retrieveUser);

export default router;
