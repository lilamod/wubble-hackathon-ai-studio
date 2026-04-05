import { wubbleService } from '../services/wubbleService.js'
import { userService } from '../services/userService.js'
import { ApiResponse } from '../utils/apiResponse.js'

// Auto-provision: create Wubble user + API key using their email
export const provisionWubble = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id)

    // Create user (ignore error if already exists)
    try { await wubbleService.createUser(user.email) } catch { /* already exists */ }

    // Create API key — just needs email, no auth
    const keyData = await wubbleService.createApiKey(user.email)
    const apiKey = keyData.apiKey || keyData.key || keyData.token

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
