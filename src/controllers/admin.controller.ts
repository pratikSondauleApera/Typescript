import { PrismaClient, Role } from "@prisma/client";
import { RequestHandler } from "express";

const prisma = new PrismaClient()

export const getAllBlogs: RequestHandler = async (req, res) => {
    const userId = (req.user as { id: string }).id
    const userRole = (req.user as { id: string }).id

    const getUser = await prisma.user.findUnique({
        where: {
            id: userId,
        }
    })

    if (!getUser) {
        return res.status(404).json({ error: "User not found" })
    }

    if (userRole == Role.ADMIN) {
        try {
            const getAllBlogs = await prisma.blogPost.findMany()

            return res.status(201).json({ msg: "Blog fetched successfully", getAllBlogs })

        } catch (error) {
            return res.status(500).json({ msg: "Something went wrong while feching blog", error })
        }
    } else {
        return res.status(500).json({ msg: "You don't have permission to fetch all blogs" })
    }
}