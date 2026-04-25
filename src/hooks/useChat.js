'use client'

import { useState, useCallback } from 'react'

export function useChat(colabUrl, nChunks) {
  const [messages, setMessages] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const ensureSession = useCallback(async (baseUrl) => {
    if (sessionId) return sessionId
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colabUrl: baseUrl }),
      })
      const data = await res.json()
      setSessionId(data.session_id)
      return data.session_id
    } catch {
      const fallback = crypto.randomUUID()
      setSessionId(fallback)
      return fallback
    }
  }, [sessionId])

  const sendMessage = useCallback(async (query) => {
    if (!query.trim() || isLoading) return

    const baseUrl = colabUrl.trim().replace(/\/$/, '')
    if (!baseUrl) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'bot',
          content: 'Please enter your Colab ngrok URL in the sidebar first.',
          error: true,
        },
      ])
      return
    }

    const sid = await ensureSession(baseUrl)
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', content: query }])
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, session_id: sid, n_chunks: nChunks, colabUrl: baseUrl }),
      })
      if (!res.ok) throw new Error(`Server responded ${res.status}`)
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          content: data.answer || data.response || 'No response returned.',
          sources: data.sources || [],
        },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          content: `Error: ${err.message}. Make sure Colab is running and the ngrok URL is correct.`,
          error: true,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [colabUrl, nChunks, isLoading, ensureSession])

  const clearMessages = useCallback(() => {
    setMessages([])
    setSessionId(null)
  }, [])

  return { messages, isLoading, sessionId, sendMessage, clearMessages }
}
