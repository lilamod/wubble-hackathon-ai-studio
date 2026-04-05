export interface User {
  id: string
  email: string
  wubbleApiKey?: string
}

export type TrackStatus = 'pending' | 'processing' | 'completed' | 'failed'

export type Mood = 'energetic' | 'chill' | 'dramatic' | 'happy' | 'dark' | 'romantic' | 'epic'

export type ContentType = 'reel' | 'story' | 'podcast' | 'youtube' | 'ad'

export interface MusicTrack {
  _id: string
  userId: string
  prompt: string
  mood: Mood
  contentType: ContentType
  requestId?: string
  status: TrackStatus
  audioUrl?: string
  duration?: number
  title: string
  createdAt: string
  updatedAt: string
}

export interface AudienceInsight {
  demographics: { label: string; percentage: number }[]
  peak_times: string[]
  interests: string[]
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  timestamp: string
}
