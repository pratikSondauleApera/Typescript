import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import bcrypt from "bcryptjs"
const prisma = new PrismaClient()

export const signUp: RequestHandler = async (req, res) => {
    try {
        const firstName = (req.body as { firstName: string }).firstName
        const lastName = (req.body as { lastName: string }).lastName
        const email = (req.body as { email: string }).email
        const password = (req.body as { password: string }).password

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: "Each and every field is required" })
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (existingUser) {
            return res.status(503).json({ error: "User already exist" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const userData = {
            firstName,
            lastName,
            email,
            password: hashedPassword
        }

        const registerUser = await prisma.user.create({
            data: userData
        })

        return res.status(201).json({ msg: "User registered successfully", registerUser })

    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong while registering a user", error })
    }
}