import mongoose from 'mongoose'

const generatedPostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 280
  },
  hashtags: [{
    type: String,
    maxlength: 50
  }],
  emoji: {
    type: String,
    maxlength: 10
  },
  cta: {
    type: String,
    maxlength: 100
  },
  tone: {
    type: String,
    enum: ['funny', 'inspirational', 'controversial', 'educational', 'casual'],
    required: true
  },
  prediction: {
    predictedLikes: Number,
    predictedComments: Number,
    predictedShares: Number,
    engagementScore: Number,
    viralProbability: Number,
    bestPostTime: String
  },
  niche: {
    type: String,
    default: 'general'
  },
  audienceInsights: {
    demographics: [mongoose.Schema.Types.Mixed],
    interests: [String],
    peakTimes: [String]
  }
}, {
  timestamps: true
})

generatedPostSchema.index({ userId: 1, createdAt: -1 })
generatedPostSchema.index({ tone: 1, niche: 1 })

export default mongoose.model('GeneratedPost', generatedPostSchema)