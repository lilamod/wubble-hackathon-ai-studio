import { User, MusicTrack, ApiResponse } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export class ApiClient {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }

  private get headers() {
    const h: Record<string, string> = { 'Content-Type': 'application/json' }
    if (this.token) h.Authorization = `Bearer ${this.token}`
    return h
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...this.headers, ...(options.headers as Record<string, string>) }
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || err.message || `HTTP ${res.status}`)
    }
    return res.json()
  }

  // Auth
  async login(email: string, password: string) {
    const r = await this.request<ApiResponse<{ user: User; token: string }>>(
      '/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }
    )
    this.setToken(r.data.token)
    return r.data.user
  }

  async register(email: string, password: string) {
    const r = await this.request<ApiResponse<{ user: User; token: string }>>(
      '/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }
    )
    this.setToken(r.data.token)
    return r.data.user
  }

  async getMe() {
    return this.request<ApiResponse<User>>('/api/auth/me')
  }

  // Wubble provisioning
  async provisionWubble() {
    return this.request<ApiResponse<{ apiKey: string }>>('/api/wubble/provision', { method: 'POST' })
  }

  async getCredits() {
    return this.request<ApiResponse<{ credits: any }>>('/api/wubble/credits')
  }

  // Music
  async generateTrack(params: {
    prompt: string
    mood: string
    contentType: string
    tempo?: string
    instruments?: string
  }) {
    return this.request<ApiResponse<{ track: MusicTrack }>>(
      '/api/music/generate', { method: 'POST', body: JSON.stringify(params) }
    )
  }

  async pollTrack(id: string) {
    return this.request<ApiResponse<{ track: MusicTrack }>>(`/api/music/poll/${id}`)
  }

  async getMyTracks() {
    return this.request<ApiResponse<{ tracks: MusicTrack[]; pagination: any }>>('/api/music/my-tracks')
  }

  async deleteTrack(id: string) {
    return this.request<ApiResponse<null>>(`/api/music/${id}`, { method: 'DELETE' })
  }
}

export const api = new ApiClient()
