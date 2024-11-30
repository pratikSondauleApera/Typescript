import express from 'express'
import userRouter from './routes/user.route'
import blogRouter from './routes/blog.route'
import adminRouter from './routes/admin.route'

const app = express()
const PORT = process.env.PORT

app.use(express.json());

app.get('/', (req, res) => { res.send("Hello World!!") })

app.use('/user', userRouter)
app.use('/blog', blogRouter)
app.use('/admin', adminRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})