import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js'
import wubbleRoutes from './routes/wubbleRoutes.js'
import musicRoutes from './routes/musicRoutes.js'
import postRoutes from './routes/postRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import connectDB from './config/db.config.js'

const app = express()
const PORT = process.env.PORT || 3001

connectDB()

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }))
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/wubble', wubbleRoutes)
app.use('/api/music', musicRoutes)
app.use('/api/posts', postRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'OK', mongodb: mongoose.connection.readyState === 1 })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
