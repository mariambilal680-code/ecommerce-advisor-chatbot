const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export async function checkHealth() {
  const response = await fetch(`${API_URL}/health`)
  if (!response.ok) throw new Error('Advisor unavailable')
  return response.json()
}

export async function sendChat({ conversationId, messages }) {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 90000)
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: conversationId, messages }),
      signal: controller.signal,
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.detail || 'Advisor unavailable')
    if (!data.message?.content) throw new Error('Invalid advisor response')
    return data
  } finally {
    window.clearTimeout(timeout)
  }
}
