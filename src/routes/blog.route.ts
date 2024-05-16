import express, { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { addBlog, editBlog, getUserBlog } from "../controllers/blog.controller";
import { upload } from "../middlewares/fileUpload.middleware";

const router = Router()

router.post('/addBlog', authMiddleware, upload.single('image'), addBlog)

router.put('/updateBlog/:id', authMiddleware, upload.single('image'), editBlog)

router.get('/getBlog', authMiddleware, getUserBlog)

router.use('/uploads', express.static('uploads'))

export default router