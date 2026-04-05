import { aiService } from '../services/aiService.js'
import { postService } from '../services/postService.js'
import { wubbleService } from '../services/wubbleService.js'
import { ApiResponse } from '../utils/apiResponse.js'

export const generatePost = async (req, res, next) => {
  try {
    const { audience, niche } = req.body
    const postData = await aiService.generateViralPost(audience, niche)
    const prediction = await wubbleService.predictPostPerformance(postData.content, req.user.wubbleAccountId)
    const post = await postService.createPost({ ...postData, userId: req.user.id, prediction, audienceInsights: audience })
    res.status(201).json(new ApiResponse('Viral post generated', post))
  } catch (err) { next(err) }
}

export const getMyPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, tone, niche } = req.query
    const { posts, pagination } = await postService.getUserPosts(req.user.id, {
      page: parseInt(page), limit: parseInt(limit), tone, niche
    })
    res.json(new ApiResponse('Posts fetched', { posts, pagination }))
  } catch (err) { next(err) }
}

export const getPostStats = async (req, res, next) => {
  try {
    const stats = await postService.getStats(req.query)
    res.json(new ApiResponse('Stats generated', stats))
  } catch (err) { next(err) }
}
