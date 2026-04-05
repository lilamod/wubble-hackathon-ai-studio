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
    console.log('[Wubble] createApiKey response:', JSON.stringify(keyData))
    const apiKey = keyData.apiKey || keyData.key || keyData.token || keyData.api_key

    if (!apiKey) return res.status(500).json({ success: false, error: 'Could not extract API key from Wubble response', raw: keyData })

    await userService.saveWubbleApiKey(req.user.id, apiKey)
    res.json(new ApiResponse('Wubble provisioned', { apiKey }))
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
