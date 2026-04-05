import { musicService } from '../services/musicService.js'
import { wubbleService } from '../services/wubbleService.js'
import { userService } from '../services/userService.js'
import { ApiResponse } from '../utils/apiResponse.js'

export const generateTrack = async (req, res, next) => {
  try {
    const { prompt, mood, contentType, tempo, instruments } = req.body
    const user = await userService.getProfile(req.user.id)
    if (!user.wubbleApiKey) return res.status(400).json({ success: false, error: 'Wubble not connected. Please provision first.' })

    const track = await musicService.createTrack({
      userId: req.user.id,
      wubbleApiKey: user.wubbleApiKey,
      prompt, mood: mood || 'energetic',
      contentType: contentType || 'reel',
      tempo, instruments
    })
    res.status(201).json(new ApiResponse('Music generation started', { track }))
  } catch (err) { next(err) }
}

export const pollTrack = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id)
    const track = await musicService.pollTrack(req.params.id, req.user.id, user.wubbleApiKey)
    res.json(new ApiResponse('Track status', { track }))
  } catch (err) { next(err) }
}

export const getMyTracks = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const result = await musicService.getUserTracks(req.user.id, {
      page: parseInt(page), limit: parseInt(limit)
    })
    res.json(new ApiResponse('Tracks fetched', result))
  } catch (err) { next(err) }
}

export const deleteTrack = async (req, res, next) => {
  try {
    await musicService.deleteTrack(req.params.id, req.user.id)
    res.json(new ApiResponse('Track deleted', null))
  } catch (err) { next(err) }
}

export const getCredits = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id)
    if (!user.wubbleApiKey) return res.status(400).json({ success: false, error: 'Wubble not connected.' })
    const credits = await wubbleService.getCredits(user.wubbleApiKey)
    res.json(new ApiResponse('Credits fetched', { credits }))
  } catch (err) { next(err) }
}
