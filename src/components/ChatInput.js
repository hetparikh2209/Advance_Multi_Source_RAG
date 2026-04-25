'use client'

import { useRef } from 'react'
import styles from './ChatInput.module.css'

export default function ChatInput({ onSend, isLoading }) {
  const textareaRef = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const submit = () => {
    const val = textareaRef.current?.value.trim()
    if (!val || isLoading) return
    onSend(val)
    textareaRef.current.value = ''
    textareaRef.current.style.height = 'auto'
  }

  const autoResize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  return (
    <div className={styles.area}>
      <div className={styles.row}>
        <div className={styles.inputWrap}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            rows={1}
            placeholder="Ask a question about your documents…"
            onKeyDown={handleKeyDown}
            onInput={autoResize}
            disabled={isLoading}
          />
        </div>
        <button
          className={styles.sendBtn}
          onClick={submit}
          disabled={isLoading}
          aria-label="Send"
        >
          {isLoading ? (
            <span className={styles.spinner} />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </div>
      <p className={styles.hint}>Enter to send · Shift + Enter for new line</p>
    </div>
  )
}
