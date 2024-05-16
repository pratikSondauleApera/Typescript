import express, { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { addBlog } from "../controllers/blog.controller";
import { upload } from "../middlewares/fileUpload.middleware";

const router = Router()

router.post('/addBlog', authMiddleware, upload.single('image'), addBlog)

router.get('/')

router.use('/uploads', express.static('uploads'))

export default router