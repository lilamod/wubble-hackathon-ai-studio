import express from 'express'
import { generateTrack, pollTrack, getMyTracks, deleteTrack, getCredits } from '../controllers/musicController.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

router.post('/generate', authMiddleware, generateTrack)
router.get('/poll/:id', authMiddleware, pollTrack)
router.get('/my-tracks', authMiddleware, getMyTracks)
router.delete('/:id', authMiddleware, deleteTrack)
router.get('/credits', authMiddleware, getCredits)

export default router
