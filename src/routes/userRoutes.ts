import express from 'express';

import {
    allUsers,
    addUser,
    deleteUser,
    renewUser,
    retrieveUser,
    bulkInput,
    removeAllUsers,
    updatePassword,
    updateUserInfo,
    updateUserStatus,
} from '../controllers/userController';
import protect from '../middlewares/protect';
import restrictTo from '../middlewares/restrictTo';

const router = express.Router();

router.use(protect);
router.get('/', restrictTo(['admin', 'user']), allUsers);
router.get('/:id', retrieveUser);
router.patch('/updatePassword', updatePassword);
router.patch('/UpdateUserInfo', updateUserInfo);

router.use(restrictTo(['admin']));
router.post('/new', addUser);
router.post('/bulk', bulkInput);
router.delete('/removeAllUsers', removeAllUsers);
router.delete('/:id', deleteUser);
router.patch('/:id', renewUser);
router.patch('/:id/status', updateUserStatus);

export default router;
