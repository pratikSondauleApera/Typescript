import express from 'express'
import dotenv from 'dotenv'
import userRouter from './routes/user.route'

dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(express.json());
app.use('/user', userRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})