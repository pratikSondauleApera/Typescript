import express from 'express'
import userRouter from './routes/user.route'

const app = express()
const PORT = process.env.PORT

app.use(express.json());
app.use('/user', userRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})