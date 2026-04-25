'use client'

import styles from './FileItem.module.css'

const EXT_COLORS = {
  pdf: styles.pdf,
  docx: styles.docx,
  txt: styles.txt,
}

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

export default function FileItem({ file, status, onRemove, onUpload, colabUrl }) {
  const ext = file.name.split('.').pop().toLowerCase()

  return (
    <div className={styles.item}>
      <div className={`${styles.icon} ${EXT_COLORS[ext] || styles.txt}`}>
        {ext.toUpperCase()}
      </div>
      <div className={styles.info}>
        <span className={styles.name}>{file.name}</span>
        <span className={styles.size}>{formatSize(file.size)}</span>
      </div>
      <div className={styles.actions}>
        {status === 'ready' && colabUrl && (
          <button className={styles.uploadBtn} onClick={onUpload} title="Upload to Colab">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 11V3M5 6l3-3 3 3" />
              <path d="M2 13h12" />
            </svg>
          </button>
        )}
        {status === 'uploading' && (
          <span className={styles.spinner} />
        )}
        {status === 'done' && (
          <span className={styles.dot} style={{ background: 'var(--green)' }} />
        )}
        {status === 'error' && (
          <span className={styles.dot} style={{ background: 'var(--red)' }} />
        )}
        <button className={styles.removeBtn} onClick={onRemove} title="Remove">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>
    </div>
  )
}
