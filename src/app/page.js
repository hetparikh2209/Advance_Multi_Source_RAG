'use client'

import { useState, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import styles from './page.module.css'

export default function Home() {
  const [colabUrl, setColabUrl] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [nChunks, setNChunks] = useState(3)
  const [files, setFiles] = useState([])
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAddFile = useCallback((file) => {
    setFiles((prev) => {
      if (prev.find((f) => f.name === file.name)) return prev
      return [...prev, { file, status: 'ready' }]
    })
  }, [])

  const handleRemoveFile = useCallback((name) => {
    setFiles((prev) => prev.filter((f) => f.file.name !== name))
  }, [])

  const handleSend = useCallback(
    async (query) => {
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

      // Ensure session exists
      let sid = sessionId
      if (!sid) {
        try {
          const res = await fetch('/api/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ colabUrl: baseUrl }),
          })
          const data = await res.json()
          sid = data.session_id
          setSessionId(sid)
        } catch {
          sid = crypto.randomUUID()
          setSessionId(sid)
        }
      }

      const userMsg = { id: Date.now(), role: 'user', content: query }
      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            session_id: sid,
            n_chunks: nChunks,
            colabUrl: baseUrl,
          }),
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
            content: `Error: ${err.message}. Make sure your Colab notebook is running and the ngrok URL is correct.`,
            error: true,
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [colabUrl, sessionId, nChunks, isLoading]
  )

  const handleUpload = useCallback(
    async (file) => {
      const baseUrl = colabUrl.trim().replace(/\/$/, '')
      if (!baseUrl) return

      setFiles((prev) =>
        prev.map((f) => (f.file.name === file.name ? { ...f, status: 'uploading' } : f))
      )

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('colabUrl', baseUrl)

        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        if (!res.ok) throw new Error('Upload failed')

        setFiles((prev) =>
          prev.map((f) => (f.file.name === file.name ? { ...f, status: 'done' } : f))
        )
      } catch {
        setFiles((prev) =>
          prev.map((f) => (f.file.name === file.name ? { ...f, status: 'error' } : f))
        )
      }
    },
    [colabUrl]
  )

  return (
    <div className={styles.layout}>
      <Sidebar
        colabUrl={colabUrl}
        onColabUrlChange={setColabUrl}
        sessionId={sessionId}
        nChunks={nChunks}
        onChunksChange={setNChunks}
        files={files}
        onAddFile={handleAddFile}
        onRemoveFile={handleRemoveFile}
        onUpload={handleUpload}
      />
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSend={handleSend}
      />
    </div>
  )
}
