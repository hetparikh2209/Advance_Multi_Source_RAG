import styles from './Message.module.css'

export default function Message({ message }) {
  const { role, content, sources, error } = message
  const isUser = role === 'user'

  return (
    <div className={`${styles.row} ${isUser ? styles.user : styles.bot}`}>
      <div className={`${styles.avatar} ${isUser ? styles.userAvatar : styles.botAvatar}`}>
        {isUser ? 'You' : 'AI'}
      </div>
      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.botBubble} ${error ? styles.errorBubble : ''}`}>
        <p className={styles.text}>{content}</p>

        {sources && sources.length > 0 && (
          <div className={styles.sources}>
            <span className={styles.sourcesLabel}>Sources</span>
            <div className={styles.sourceTags}>
              {sources.map((src, i) => (
                <span key={i} className={styles.tag}>{src}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
