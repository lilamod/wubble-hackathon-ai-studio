import MusicTrack from '../models/MusicTrack.js'
import { wubbleService } from './wubbleService.js'

export class MusicService {
  // Build a rich music prompt from user inputs
  buildMusicPrompt({ prompt, mood, contentType, tempo, instruments }) {
    const contentMap = {
      reel: 'short-form social media reel (15-30 seconds)',
      story: 'Instagram/Snapchat story (10-15 seconds)',
      podcast: 'podcast intro/outro (30-60 seconds)',
      youtube: 'YouTube video background (60-120 seconds)',
      ad: 'advertisement or brand video (15-30 seconds)'
    }
    const moodMap = {
      energetic: 'high-energy, upbeat, motivating',
      chill: 'relaxed, lo-fi, calm',
      dramatic: 'cinematic, intense, emotional',
      happy: 'cheerful, fun, positive',
      dark: 'mysterious, dark, brooding',
      romantic: 'soft, romantic, warm',
      epic: 'epic, orchestral, powerful'
    }

    const parts = [
      `Create background music for a ${contentMap[contentType] || contentType}.`,
      `Mood: ${moodMap[mood] || mood}.`,
      prompt ? `Theme/context: ${prompt}.` : '',
      tempo ? `Tempo: ${tempo} BPM.` : '',
      instruments ? `Instruments: ${instruments}.` : '',
      'No vocals. Optimized for social media content.'
    ].filter(Boolean)

    return parts.join(' ')
  }

  async createTrack({ userId, prompt, mood, contentType, tempo, instruments }) {
    const musicPrompt = this.buildMusicPrompt({ prompt, mood, contentType, tempo, instruments })

    // Kick off Wubble generation
    const wubbleRes = await wubbleService.generateMusic({ prompt: musicPrompt })

    const track = await MusicTrack.create({
      userId,
      prompt: musicPrompt,
      mood,
      contentType,
      requestId: wubbleRes.requestId || wubbleRes.id || null,
      status: 'processing',
      title: `${mood} ${contentType} track`,
      wubbleResponse: wubbleRes
    })

    return track
  }

  async pollTrack(trackId, userId) {
    const track = await MusicTrack.findOne({ _id: trackId, userId })
    if (!track) throw new Error('Track not found')
    if (track.status === 'completed') return track
    if (!track.requestId) throw new Error('No requestId for this track')

    const pollRes = await wubbleService.pollStatus(track.requestId)

    // Normalize Wubble response — adapt field names as their API evolves
    const status = pollRes.status?.toLowerCase()
    const audioUrl = pollRes.audioUrl || pollRes.audio_url || pollRes.url || null
    const duration = pollRes.duration || null

    if (status === 'completed' || audioUrl) {
      track.status = 'completed'
      track.audioUrl = audioUrl
      track.duration = duration
      track.wubbleResponse = pollRes
      await track.save()
    } else if (status === 'failed' || status === 'error') {
      track.status = 'failed'
      await track.save()
    } else {
      track.status = 'processing'
      await track.save()
    }

    return track
  }

  async getUserTracks(userId, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit
    const [tracks, total] = await Promise.all([
      MusicTrack.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      MusicTrack.countDocuments({ userId })
    ])
    return { tracks, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }
  }

  async deleteTrack(trackId, userId) {
    await MusicTrack.findOneAndDelete({ _id: trackId, userId })
  }
}

export const musicService = new MusicService()
