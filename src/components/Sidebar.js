'use client'

import { useRef } from 'react'
import FileItem from './FileItem'
import styles from './Sidebar.module.css'

export default function Sidebar({
  colabUrl,
  onColabUrlChange,
  sessionId,
  nChunks,
  onChunksChange,
  files,
  onAddFile,
  onRemoveFile,
  onUpload,
}) {
  const fileInputRef = useRef(null)

  const handleFiles = (fileList) => {
    Array.from(fileList).forEach((f) => {
      const ext = f.name.split('.').pop().toLowerCase()
      if (['pdf', 'docx', 'txt'].includes(ext)) onAddFile(f)
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove(styles.dragOver)
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add(styles.dragOver)
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove(styles.dragOver)
  }

  return (
    <aside className={styles.sidebar}>
      {/* Header */}
      <div className={styles.brand}>
        <div className={styles.logo}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M2 8h4M10 8h4M8 2v4M8 10v4" />
            <circle cx="8" cy="8" r="2" />
          </svg>
        </div>
        <span className={styles.brandName}>RAG Chat</span>
        <span className={styles.brandModel}>Llama 3.1</span>
      </div>

      {/* Colab URL */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Colab endpoint</div>
        <div className={styles.urlBox}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={styles.urlIcon}>
            <path d="M13 8a5 5 0 11-10 0 5 5 0 0110 0z" />
            <path d="M8 3v2M8 11v2M3 8H1M15 8h-2" />
          </svg>
          <input
            type="text"
            className={styles.urlInput}
            value={colabUrl}
            onChange={(e) => onColabUrlChange(e.target.value)}
            placeholder="https://xxxx.ngrok-free.app"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Upload */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Documents</div>
        <div
          className={styles.dropZone}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.dropIcon}>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className={styles.dropText}>Drop files or click to browse</p>
          <span className={styles.dropHint}>PDF · DOCX · TXT</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className={styles.fileList}>
          {files.map(({ file, status }) => (
            <FileItem
              key={file.name}
              file={file}
              status={status}
              onRemove={() => onRemoveFile(file.name)}
              onUpload={() => onUpload(file)}
              colabUrl={colabUrl}
            />
          ))}
        </div>
      )}

      {/* Settings */}
      <div className={styles.settingsBlock}>
        <div className={styles.sectionLabel}>Settings</div>
        <div className={styles.configRow}>
          <span className={styles.configLabel}>Context chunks</span>
          <div className={styles.chunkControl}>
            <button className={styles.chunkBtn} onClick={() => onChunksChange(Math.max(1, nChunks - 1))}>−</button>
            <span className={styles.chunkVal}>{nChunks}</span>
            <button className={styles.chunkBtn} onClick={() => onChunksChange(Math.min(8, nChunks + 1))}>+</button>
          </div>
        </div>

        <div className={styles.sessionBox}>
          <div className={styles.sessionLabel}>Session ID</div>
          <div className={styles.sessionId}>
            {sessionId ? sessionId.slice(0, 20) + '…' : 'not started'}
          </div>
        </div>
      </div>
    </aside>
  )
}
