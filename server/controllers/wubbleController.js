import { wubbleService } from '../services/wubbleService.js'
import { userService } from '../services/userService.js'
import { ApiResponse } from '../utils/apiResponse.js'
import asyncHandler from 'express-async-handler'

// Creates a Wubble sub-user + API key for this app user
export const provisionWubble = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.id)

  // Create a Wubble user scoped to this account
  let wubbleUser
  try {
    wubbleUser = await wubbleService.createUser(user.email)
  } catch {
    // User may already exist — that's fine
    wubbleUser = { email: user.email }
  }

  // Create an API key via Wubble
  const keyData = await wubbleService.createApiKey(`user-${req.user.id}`)
  const apiKey = keyData.key || keyData.apiKey || keyData.token

  await userService.saveWubbleApiKey(req.user.id, apiKey)

  res.json(new ApiResponse('Wubble provisioned', { apiKey }))
})

export const getCredits = asyncHandler(async (req, res) => {
  const credits = await wubbleService.getCredits()
  res.json(new ApiResponse('Credits fetched', { credits }))
})
