import fetch from 'node-fetch'

const BASE = 'https://api.wubble.ai/api'

class WubbleService {
  headers(apiKey) {
    return {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  }

  // POST /api/user — requires master API key as Bearer auth
  async createUser(email) {
    const res = await fetch(`${BASE}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.WUBBLE_API_KEY}`
      },
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
    return data
  }

  // GET /api/v1/credits
  async getCredits(apiKey) {
    const res = await fetch(`${BASE}/v1/credits`, { headers: this.headers(apiKey) })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Wubble credits error: ${res.status}`)
    return data
  }

  // POST /api/v1/chat
  async generateMusic({ prompt, fileUrl = null }, apiKey) {
    const body = { message: prompt }
    if (fileUrl) body.fileUrl = fileUrl
    const res = await fetch(`${BASE}/v1/chat`, {
      method: 'POST',
      headers: this.headers(apiKey),
      body: JSON.stringify(body)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Wubble chat error: ${res.status}`)
    return data
  }

  // GET /api/v1/request/:requestId/status
  async pollStatus(requestId, apiKey) {
    const res = await fetch(`${BASE}/v1/request/${requestId}/status`, { headers: this.headers(apiKey) })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Wubble poll error: ${res.status}`)
    return data
  }

  async predictPostPerformance() {
    return {}
  }
}

export const wubbleService = new WubbleService()
