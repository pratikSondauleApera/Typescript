import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const uniqueImageName = `image-${Math.floor(Math.random() * 1E9)}-${file.originalname}`
        cb(null, uniqueImageName);
    }
})

export const upload = multer({ storage: storage })