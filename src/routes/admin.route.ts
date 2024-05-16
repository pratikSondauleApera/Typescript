import { Router } from "express";
import { getAllBlogs } from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router()

router.get('/getAllBlogs', authMiddleware, getAllBlogs)

export default router