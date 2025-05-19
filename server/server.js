import express from 'express'
import cors from 'cors'
import 'dotenv/config.js'
import connectDB from './config/mongodb.js';
import userRouter from './Route/userRoute.js';
import imageRouter from './Route/imageRoute.js';

const PORT = 4000;

const app = express()

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token']
}))
await connectDB()

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)

app.get('/', (req, res) => res.send("API Working fine"))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})