import { musicService } from '../services/musicService.js'
import { wubbleService } from '../services/wubbleService.js'
import { ApiResponse } from '../utils/apiResponse.js'

export const generateTrack = async (req, res) => {
  const { prompt, mood, contentType, tempo, instruments } = req.body
  const track = await musicService.createTrack({
    userId: req.user.id,
    prompt,
    mood: mood || 'energetic',
    contentType: contentType || 'reel',
    tempo,
    instruments
  })
  res.status(201).json(new ApiResponse('Music generation started', { track }))
}

export const pollTrack = async (req, res) => {
  const track = await musicService.pollTrack(req.params.id, req.user.id)
  res.json(new ApiResponse('Track status', { track }))
}

export const getMyTracks = async (req, res) => {
  const { page = 1, limit = 20 } = req.query
  const result = await musicService.getUserTracks(req.user.id, {
    page: parseInt(page),
    limit: parseInt(limit)
  })
  res.json(new ApiResponse('Tracks fetched', result))
}

export const deleteTrack = async (req, res) => {
  await musicService.deleteTrack(req.params.id, req.user.id)
  res.json(new ApiResponse('Track deleted', null))
}

export const getCredits = async (req, res) => {
  const credits = await wubbleService.getCredits()
  res.json(new ApiResponse('Credits fetched', { credits }))
}
