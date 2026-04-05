import mongoose from 'mongoose'

const musicTrackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  prompt: { type: String, required: true },
  mood: { type: String, default: 'energetic' },
  contentType: { type: String, default: 'reel' }, // reel, story, podcast, youtube
  requestId: { type: String },                     // Wubble requestId for polling
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  audioUrl: { type: String },
  duration: { type: Number },
  title: { type: String },
  wubbleResponse: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true })

musicTrackSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.model('MusicTrack', musicTrackSchema)
