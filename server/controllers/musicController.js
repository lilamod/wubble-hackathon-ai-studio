import { musicService } from '../services/musicService.js'
import { wubbleService } from '../services/wubbleService.js'
import { ApiResponse } from '../utils/apiResponse.js'

export const generateTrack = async (req, res, next) => {
  try {
    const { prompt, mood, contentType, tempo, instruments } = req.body
    const track = await musicService.createTrack({
      userId: req.user.id, prompt,
      mood: mood || 'energetic',
      contentType: contentType || 'reel',
      tempo, instruments
    })
    res.status(201).json(new ApiResponse('Music generation started', { track }))
  } catch (err) { next(err) }
}

export const pollTrack = async (req, res, next) => {
  try {
    const track = await musicService.pollTrack(req.params.id, req.user.id)
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
    const credits = await wubbleService.getCredits()
    res.json(new ApiResponse('Credits fetched', { credits }))
  } catch (err) { next(err) }
}
