import { useRef } from 'react'

export default function PhotoUpload({ onFile, preview, label, hint }) {
  const ref = useRef()

  const handleChange = e => {
    const file = e.target.files[0]
    if (file) onFile(file)
  }

  return (
    <div>
      {label && <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{label}</div>}
      <div
        onClick={() => ref.current.click()}
        style={{
          border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-card)',
          padding: preview ? 0 : '32px 16px', cursor: 'pointer', textAlign: 'center',
          overflow: 'hidden', minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: preview ? 'black' : '#faf9f7', transition: 'border-color 0.2s',
          position: 'relative'
        }}
      >
        {preview ? (
          <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 280, objectFit: 'cover' }} />
        ) : (
          <div>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
            <div style={{ fontSize: 14, color: 'var(--color-secondary)' }}>{hint || 'Tap to upload photo'}</div>
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" capture="environment" onChange={handleChange} style={{ display: 'none' }} />
    </div>
  )
}
