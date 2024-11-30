import { PrismaClient, Role } from "@prisma/client"
import { RequestHandler } from "express"
import { Md5 } from "ts-md5";
import jwt from "jsonwebtoken"

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

        const hashedPassword = Md5.hashStr(password)

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

        return res.status(201).json({ msg: "User registered successfully" })

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
            res.status(404).json({ error: "User does not exist" })
        }

        const hashedPassword = Md5.hashStr(password)

        if (user?.password !== hashedPassword) {
            res.status(401).json({ error: "Invalid credentials" })
        }

        const payload = {
            id: user?.id,
            role: user?.role
        }

        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: "7d"
        });

        return res.status(200).json({ msg: "Login successfully", token })

    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong while login", error })
    }
}
