import { PrismaClient, Role } from "@prisma/client";
import { RequestHandler } from "express";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

const prisma = new PrismaClient()

export const signUp: RequestHandler = async (req, res) => {
    const firstName = (req.body as { firstName: string }).firstName
    const lastName = (req.body as { lastName: string }).lastName
    const email = (req.body as { email: string }).email
    const password = (req.body as { password: string }).password

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "Please fill the required details" })
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (existingUser) {
        return res.status(503).json({ error: "User already exist" })
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10)

        const userData = {
            firstName,
            lastName,
            email,
            role: Role.USER,
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

export const signIn: RequestHandler = async (req, res) => {
    const email = (req.body as { email: string }).email
    const password = (req.body as { password: string }).password

    if (!email || !password) {
        return res.status(400).json({ error: "Email and Password are required" })
    }

    try {

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            res.status(404).json({ msg: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user!.password);

        if (!isMatch) {
            res.status(401).json({ error: "Invalid credentials" })
        }

        const payload = {
            id: user?.id,
            role: user?.role
        }

        const token = jwt.sign(payload, "sothisisasecretkeyformernproject", {
            expiresIn: "1h"
        });

        return res.status(200).json({ msg: "Login successfully", token })

    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong while login", error })
    }
}