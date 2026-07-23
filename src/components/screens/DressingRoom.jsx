import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { getDressingRoomAssessment } from '../../services/geminiService'
import { supabase } from '../../services/supabaseClient'
import StylistCard from '../app/StylistCard'
import PhotoUpload from '../app/PhotoUpload'

export default function DressingRoom() {
  const { user, profile } = useAuth()
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [expanded, setExpanded] = useState(null)

  function handlePhoto(file) { setPhoto(file); setPreview(URL.createObjectURL(file)); setResult(''); setError('') }

  async function fileToBase64(file) {
    return new Promise((res, rej) => {
      const r = new FileReader()
      r.onload = () => res(r.result.split(',')[1])
      r.onerror = rej
      r.readAsDataURL(file)
    })
  }

  async function handleAssess() {
    if (!photo) return
    if (!profile) { setError('Profile not loaded yet. Please wait.'); return }
    setLoading(true); setError('')
    try {
      const b64 = await fileToBase64(photo)
      const mimeType = photo.type || 'image/jpeg'
      const assessment = await getDressingRoomAssessment(profile, b64, mimeType)
      setResult(assessment)

      // Upload photo and save to DB
      const ext = photo.name?.split('.').pop() || 'jpg'
      const filePath = user.id + '/dressing-' + Date.now() + '.' + ext
      const { data: upData } = await supabase.storage.from('user-photos').upload(filePath, photo)
      let photoUrl = null
      if (upData) {
        const { data: urlData } = supabase.storage.from('user-photos').getPublicUrl(filePath)
        photoUrl = urlData.publicUrl
      }
      await supabase.from('ai_assessments').insert([{
        user_id: user.id, type: 'dressing_room', photo_url: photoUrl,
        ai_response: assessment
      }])
      setHistory(h => [{ id: Date.now(), photo_url: photoUrl, ai_response: assessment, created_at: new Date().toISOString() }, ...h])
    } catch(e) {
      setError('Could not get assessment: ' + e.message)
    } finally { setLoading(false) }
  }

  return (
    <div style={{ padding: '24px 20px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, marginBottom: 8 }}>AI Dressing Room</h1>
      <p style={{ color: 'var(--color-secondary)', marginBottom: 28, fontSize: 15 }}>
        Take or upload a photo wearing clothes you want to assess. Your AI stylist gives you honest, personalised feedback.
      </p>

      <PhotoUpload hint="Take or upload a photo of your outfit" onFile={handlePhoto} preview={preview} />

      {preview && !loading && (
        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="btn-primary" onClick={handleAssess} style={{ width: '100%', marginTop: 16, padding: '14px' }}>
          ✦ Ask My Stylist
        </motion.button>
      )}

      {error && <div className="auth-error" style={{ marginTop: 16 }}>{error}</div>}

      {(loading || result) && <div style={{ marginTop: 24 }}><StylistCard text={result} loading={loading} /></div>}

      {history.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Past Assessments</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {history.map((h, i) => (
              <div key={h.id} style={{ background: 'white', borderRadius: 'var(--radius-card)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                <button onClick={() => setExpanded(expanded === i ? null : i)}
                  style={{ width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter, sans-serif' }}>
                  {h.photo_url && <img src={h.photo_url} alt="outfit" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Outfit Assessment</div>
                    <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>{new Date(h.created_at).toLocaleDateString('en-IN')}</div>
                  </div>
                  <span style={{ color: 'var(--color-secondary)', fontSize: 18 }}>{expanded === i ? '▲' : '▼'}</span>
                </button>
                <AnimatePresence>
                  {expanded === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 16px 16px', fontSize: 14, color: 'var(--color-text)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{h.ai_response}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
