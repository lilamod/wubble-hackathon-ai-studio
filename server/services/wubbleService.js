import fetch from 'node-fetch'

const BASE = 'https://api.wubble.ai/api/v1'

export class WubbleService {
  constructor() {
    this.apiKey = process.env.WUBBLE_API_KEY
  }

  get headers() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    }
  }

  async createUser(email) {
    const res = await fetch(`${BASE}/users`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ email })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Wubble createUser error: ${res.status}`)
    return data
  }

  async getCredits() {
    const res = await fetch(`${BASE}/credits`, { headers: this.headers })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Wubble credits error: ${res.status}`)
    return data
  }

  async createApiKey(label = 'wubble-studio') {
    const res = await fetch(`${BASE}/keys`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ label })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Wubble createApiKey error: ${res.status}`)
    return data
  }

  // Conversational music generation
  // prompt: text describing the music, optional fileUrl for reference audio
  async generateMusic({ prompt, fileUrl = null }) {
    const body = { message: prompt }
    if (fileUrl) body.fileUrl = fileUrl

    const res = await fetch(`${BASE}/chat`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Wubble chat error: ${res.status}`)
    // Returns { requestId, status, ... }
    return data
  }

  // Poll until done or failed
  async pollStatus(requestId) {
    const res = await fetch(`${BASE}/polling/${requestId}`, { headers: this.headers })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Wubble poll error: ${res.status}`)
    return data
  }

  async pollChatStatus(requestId) {
    const res = await fetch(`${BASE}/polling/chat/${requestId}`, { headers: this.headers })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Wubble chat poll error: ${res.status}`)
    return data
  }

  // Upload a reference audio file (multipart)
  async uploadFile(fileBuffer, filename, mimetype) {
    const { FormData, Blob } = await import('node-fetch')
    const form = new FormData()
    form.append('file', new Blob([fileBuffer], { type: mimetype }), filename)

    const res = await fetch(`${BASE}/files`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      body: form
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Wubble upload error: ${res.status}`)
    return data
  }
}

export const wubbleService = new WubbleService()
