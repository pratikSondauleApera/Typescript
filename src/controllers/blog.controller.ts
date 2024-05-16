import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";

const prisma = new PrismaClient()

export const addBlog: RequestHandler = async (req, res) => {
    const userId = (req.user as { id: string }).id
    const title = (req.body as { title: string }).title

    const content = (req.body as { content: string }).content

    if (!title || !content) {
        return res.status(400).json({ error: "Title and Content is required" })
    }

    const image = req.file?.filename

    console.log("File ", req.file)

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        return res.status(404).json({ error: "User not found" })
    }

    try {

        const blogData = {
            authorId: user?.id,
            title,
            image: image,
            content
        }

        const addBlog = await prisma.blogPost.create({
            data: blogData
        })

        return res.status(201).json({ msg: "Blog posted successfully", addBlog })

    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong while adding blog", error })
    }
}

export const editBlog: RequestHandler = async (req, res) => {
    const blogId = req.params.id

    const title = (req.body as { title: string }).title
    const content = (req.body as { content: string }).content
    const image = req.file?.filename

    const userId = (req.user as { id: string }).id

    const getUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!getUser) {
        return res.status(404).json({ error: "User not found" })
    }

    const getBlog = await prisma.blogPost.findUnique({
        where: {
            id: blogId
        }
    })

    if (!getBlog) {
        return res.status(404).json({ error: "Blog not found" })
    }

    try {
        const blogData = {
            title: title || getBlog.title,
            image: image || getBlog.image,
            content: content || getBlog.content,
            updatedAt: new Date(),
        }

        const updateBlog = await prisma.blogPost.update({
            where: {
                id: getBlog.id
            },
            data: blogData
        })

        return res.status(200).json({ msg: "Updated blog successfully", updateBlog })

    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong while editing blog", error })
    }
}

export const getUserBlog: RequestHandler = async (req, res) => {
    const userId = (req.user as { id: string }).id

    const getUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!getUser) {
        return res.status(404).json({ error: "User not found" })
    }

    try {
        const getUserBlog = await prisma.blogPost.findMany({
            where: {
                authorId: getUser.id,
                deletedAt: null
            }
        })

        return res.status(200).json({ msg: "Blog found successfully", getUserBlog })

    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong while fetching blog", error })
    }
}

export const deleteBlog: RequestHandler = async (req, res) => {
    const blogId = req.params.id

    const getBlog = await prisma.blogPost.findUnique({
        where: {
            id: blogId
        }
    })

    if (!getBlog) {
        return res.status(404).json({ error: "Blog not found" })
    }

    try {
        const deleteBlog = await prisma.blogPost.update({
            where: {
                id: getBlog.id
            },
            data: {
                deletedAt: new Date()
            }
        })

        return res.status(200).json({ msg: "Deleted blog successfully", deleteBlog })

    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong while deleting blog", error })
    }
}