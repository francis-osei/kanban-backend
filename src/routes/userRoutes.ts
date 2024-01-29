import express from 'express';

import {
    allUsers,
    addUser,
    deleteUser,
    renewUser,
    retrieveUser,
    bulkInput,
    removeAllUsers,
} from '../controllers/userController';
import protect from '../middlewares/protect';
import restrictTo from '../middlewares/restrictTo';

const router = express.Router();

router.use(protect);
router.get('/', restrictTo(['admin', 'user']), allUsers);
router.get('/:id', retrieveUser);

router.use(restrictTo(['admin']));
router.post('/new', addUser);
router.post('/bulk', bulkInput);
router.delete('/removeAllUsers', removeAllUsers);
router.delete('/:id', deleteUser);
router.patch('/:id', renewUser);

export default router;
