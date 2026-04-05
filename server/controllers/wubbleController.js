import { wubbleService } from '../services/wubbleService.js'
import { userService } from '../services/userService.js'
import { ApiResponse } from '../utils/apiResponse.js'

export const provisionWubble = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id)
    try { await wubbleService.createUser(user.email) } catch { /* already exists */ }
    const keyData = await wubbleService.createApiKey(`user-${req.user.id}`)
    const apiKey = keyData.key || keyData.apiKey || keyData.token
    await userService.saveWubbleApiKey(req.user.id, apiKey)
    res.json(new ApiResponse('Wubble provisioned', { apiKey }))
  } catch (err) { next(err) }
}

export const getCredits = async (req, res, next) => {
  try {
    const credits = await wubbleService.getCredits()
    res.json(new ApiResponse('Credits fetched', { credits }))
  } catch (err) { next(err) }
}
