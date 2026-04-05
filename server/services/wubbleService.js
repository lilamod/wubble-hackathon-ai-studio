import fetch from 'node-fetch'

const BASE = 'https://api.wubble.ai/api'

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

  // POST /api/user — no auth required
  async createUser(email) {
    const res = await fetch(`${BASE}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Wubble createUser error: ${res.status}`)
    return data
  }

  // POST /api/v1/apikeys — no auth required, body: { email }
  async createApiKey(email) {
    const res = await fetch(`${BASE}/v1/apikeys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Wubble createApiKey error: ${res.status}`)
    // returns { apiKey, ... } or { key, ... }
    return data
  }

  // GET /api/v1/credits — bearer auth
  async getCredits() {
    const res = await fetch(`${BASE}/v1/credits`, { headers: this.headers })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Wubble credits error: ${res.status}`)
    return data
  }

  // POST /api/v1/chat — bearer auth
  async generateMusic({ prompt, fileUrl = null }) {
    const body = { message: prompt }
    if (fileUrl) body.fileUrl = fileUrl
    const res = await fetch(`${BASE}/v1/chat`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Wubble chat error: ${res.status}`)
    return data
  }

  // GET /api/v1/request/:requestId/status — bearer auth
  async pollStatus(requestId) {
    const res = await fetch(`${BASE}/v1/request/${requestId}/status`, { headers: this.headers })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Wubble poll error: ${res.status}`)
    return data
  }

  async predictPostPerformance() {
    return {}
  }

  // Upload a reference audio file (multipart)
  async uploadFile(fileBuffer, filename, mimetype) {
    const form = new FormData()
    form.set('file', new Blob([fileBuffer], { type: mimetype }), filename)
    const res = await fetch(`${BASE}/v1/files`, {
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
