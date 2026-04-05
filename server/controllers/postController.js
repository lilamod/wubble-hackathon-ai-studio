import { aiService } from '../services/aiService.js'
import { postService } from '../services/postService.js'
import { wubbleService } from '../services/wubbleService.js'
import { ApiResponse } from '../utils/apiResponse.js'
import asyncHandler from 'express-async-handler'

export const generatePost = asyncHandler(async (req, res) => {
  const { audience, niche } = req.body
  const userId = req.user.id

  // Generate AI content
  const postData = await aiService.generateViralPost(audience, niche)
  
  // Get Wubble prediction
  const prediction = await wubbleService.predictPostPerformance(
    postData.content, 
    req.user.wubbleAccountId
  )
  
  // Save to database
  const post = await postService.createPost({
    ...postData,
    userId,
    prediction,
    audienceInsights: audience
  })

  res.status(201).json(
    new ApiResponse('Viral post generated', post)
  )
})

export const getMyPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, tone, niche } = req.query
  const userId = req.user.id

  const { posts, pagination } = await postService.getUserPosts(
    userId, 
    { page: parseInt(page), limit: parseInt(limit), tone, niche }
  )

  res.json(
    new ApiResponse('Posts fetched', { posts, pagination })
  )
})

export const getPostStats = asyncHandler(async (req, res) => {
  const stats = await postService.getStats(req.query)
  
  res.json(
    new ApiResponse('Stats generated', stats)
  )
})