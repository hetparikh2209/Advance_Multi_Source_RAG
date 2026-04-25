'use client'

import { useState, useCallback } from 'react'

const ALLOWED_EXTS = ['pdf', 'docx', 'txt']

export function useFileUpload(colabUrl) {
  const [files, setFiles] = useState([])

  const addFile = useCallback((file) => {
    const ext = file.name.split('.').pop().toLowerCase()
    if (!ALLOWED_EXTS.includes(ext)) return
    setFiles((prev) => {
      if (prev.find((f) => f.file.name === file.name)) return prev
      return [...prev, { file, status: 'ready' }]
    })
  }, [])

  const removeFile = useCallback((name) => {
    setFiles((prev) => prev.filter((f) => f.file.name !== name))
  }, [])

  const uploadFile = useCallback(async (file) => {
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
  }, [colabUrl])

  const uploadAll = useCallback(async () => {
    const pending = files.filter((f) => f.status === 'ready')
    for (const { file } of pending) {
      await uploadFile(file)
    }
  }, [files, uploadFile])

  return { files, addFile, removeFile, uploadFile, uploadAll }
}
