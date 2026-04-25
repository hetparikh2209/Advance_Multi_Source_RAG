'use client'

import { useEffect, useRef } from 'react'
import Message from './Message'
import ChatInput from './ChatInput'
import EmptyState from './EmptyState'
import styles from './ChatWindow.module.css'

export default function ChatWindow({ messages, isLoading, onSend }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className={styles.window}>
      <div className={styles.header}>
        <span className={styles.statusDot} />
        <span className={styles.headerText}>ChromaDB · all-MiniLM-L6-v2 · Llama 3.1-8B</span>
      </div>

      <div className={styles.messages}>
        {messages.length === 0 && !isLoading ? (
          <EmptyState onSuggestion={onSend} />
        ) : (
          <>
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className={styles.typingRow}>
                <div className={styles.avatar}>AI</div>
                <div className={styles.typingBubble}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      <ChatInput onSend={onSend} isLoading={isLoading} />
    </div>
  )
}
