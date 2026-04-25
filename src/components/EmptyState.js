import styles from './EmptyState.module.css'

const SUGGESTIONS = [
  'What is this document about?',
  'Summarize the key points',
  'What are the main topics covered?',
  'Explain retrieval parameters',
  'What are the core concepts?',
  'Give me a quick overview',
]

export default function EmptyState({ onSuggestion }) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </div>
      <h2 className={styles.title}>Ask your documents anything</h2>
      <p className={styles.sub}>
        Upload files via the sidebar, set your Colab URL, then start chatting.
        <br />
        Conversation history is preserved across follow-up questions.
      </p>

      <div className={styles.grid}>
        {SUGGESTIONS.map((s) => (
          <button key={s} className={styles.chip} onClick={() => onSuggestion(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className={styles.steps}>
        <div className={styles.step}>
          <span className={styles.stepNum}>1</span>
          <span className={styles.stepText}>Paste your ngrok URL in the sidebar</span>
        </div>
        <div className={styles.stepDivider} />
        <div className={styles.step}>
          <span className={styles.stepNum}>2</span>
          <span className={styles.stepText}>Upload PDF / DOCX / TXT files</span>
        </div>
        <div className={styles.stepDivider} />
        <div className={styles.step}>
          <span className={styles.stepNum}>3</span>
          <span className={styles.stepText}>Ask questions below</span>
        </div>
      </div>
    </div>
  )
}
