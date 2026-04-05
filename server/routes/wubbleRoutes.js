import express from 'express'
import { provisionWubble, getCredits } from '../controllers/wubbleController.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

router.post('/provision', authMiddleware, provisionWubble)
router.get('/credits', authMiddleware, getCredits)

export default router
