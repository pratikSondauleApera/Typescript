import { Router } from "express";
import { signUp } from "../controller/user.controller";

const router = Router()

router.post('/signup', signUp)

export default router