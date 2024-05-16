import { PrismaClient, Role } from "@prisma/client";
import { RequestHandler } from "express";
// import multer from "multer"

const prisma = new PrismaClient()

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads');
//     },
//     filename: function (req, file, cb) {
//         const uniqueImageName = `image-${Math.floor(Math.random() * 1E9)}-${file.originalname}`
//         cb(null, uniqueImageName);
//     }
// })

// export const upload = multer({ storage: storage })

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