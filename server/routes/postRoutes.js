import express from 'express'
import { generatePost, getMyPosts, getPostStats } from '../controllers/postController.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

router.post('/generate', authMiddleware, generatePost)
router.get('/my-posts', authMiddleware, getMyPosts)
router.get('/stats', authMiddleware, getPostStats)

export default router