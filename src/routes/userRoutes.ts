import  express  from "express";
import { createNewUser } from "../controllers/userController";

const router = express.Router()


router.post('/new', createNewUser)

export default router 