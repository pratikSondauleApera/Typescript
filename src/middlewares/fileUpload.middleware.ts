import { Request } from 'express'
import multer from 'multer'

type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback): void => {
        const uniqueImageName = `image-${Math.floor(Math.random() * 1E9)}-${file.originalname}`
        cb(null, uniqueImageName);
    }
})

export const upload = multer({ storage: storage })