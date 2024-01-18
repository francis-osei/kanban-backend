import  express  from "express";
import { createNewUser, deleteUser } from "../controllers/userController";

const router = express.Router()


router.post('/new', createNewUser)
router.delete('/:id', deleteUser)

export default router 