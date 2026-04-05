import GeneratedPost from '../models/GeneratedPost.js'

export class PostService {
  async createPost({ content, hashtags, emoji, cta, tone, niche, userId, prediction, audienceInsights }) {
    const post = await GeneratedPost.create({
      userId,
      content,
      hashtags: hashtags || [],
      emoji: emoji || '',
      cta: cta || '',
      tone: tone || 'casual',
      niche: niche || 'general',
      prediction: prediction || {},
      audienceInsights: audienceInsights || {}
    })
    return post
  }

  async getUserPosts(userId, { page = 1, limit = 10, tone, niche } = {}) {
    const filter = { userId }
    if (tone) filter.tone = tone
    if (niche) filter.niche = niche

    const skip = (page - 1) * limit
    const [posts, total] = await Promise.all([
      GeneratedPost.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      GeneratedPost.countDocuments(filter)
    ])

    return {
      posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    }
  }

  async getStats({ userId } = {}) {
    const filter = userId ? { userId } : {}
    const total = await GeneratedPost.countDocuments(filter)
    const byTone = await GeneratedPost.aggregate([
      { $match: filter },
      { $group: { _id: '$tone', count: { $sum: 1 } } }
    ])
    return { total, byTone }
  }
}

export const postService = new PostService()
