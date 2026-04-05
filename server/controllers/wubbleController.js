import { wubbleService } from '../services/wubbleService.js'
import { userService } from '../services/userService.js'
import { ApiResponse } from '../utils/apiResponse.js'

export const provisionWubble = async (req, res) => {
  const user = await userService.getProfile(req.user.id)

  let wubbleUser
  try {
    wubbleUser = await wubbleService.createUser(user.email)
  } catch {
    wubbleUser = { email: user.email }
  }

  const keyData = await wubbleService.createApiKey(`user-${req.user.id}`)
  const apiKey = keyData.key || keyData.apiKey || keyData.token

  await userService.saveWubbleApiKey(req.user.id, apiKey)

  res.json(new ApiResponse('Wubble provisioned', { apiKey }))
}

export const getCredits = async (req, res) => {
  const credits = await wubbleService.getCredits()
  res.json(new ApiResponse('Credits fetched', { credits }))
}
