import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../services/supabaseClient'
import { useAuth } from '../../hooks/useAuth'
import PhotoUpload from '../app/PhotoUpload'

const TOTAL_STEPS = 5

const BODY_TYPES = [
  { value: 'Slim', desc: 'Lean build, narrow shoulders and hips' },
  { value: 'Athletic', desc: 'Muscular, broad shoulders' },
  { value: 'Average', desc: 'Balanced proportions' },
  { value: 'Curvy', desc: 'Defined waist, fuller hips and bust' },
  { value: 'Plus', desc: 'Fuller figure, all proportions' },
]
const SKIN_TONES = [
  { value: 'Fair', color: '#FDDBB4' },
  { value: 'Light', color: '#F5C5A3' },
  { value: 'Medium', color: '#D4956A' },
  { value: 'Olive', color: '#B07D52' },
  { value: 'Dark', color: '#7C4F2F' },
  { value: 'Deep', color: '#4A2912' },
]
const STYLES = ['Casual', 'Formal', 'Streetwear', 'Minimalist', 'Bohemian', 'Mix']
const COLOURS = [
  { value: 'Black', color: '#1A1A1A' }, { value: 'White', color: '#F8F7F4' },
  { value: 'Navy', color: '#1B3A6B' }, { value: 'Grey', color: '#9E9E9E' },
  { value: 'Beige', color: '#D4B896' }, { value: 'Brown', color: '#7C5C3E' },
  { value: 'Red', color: '#E63946' }, { value: 'Green', color: '#2A9D5C' },
  { value: 'Blue', color: '#2196F3' }, { value: 'Pink', color: '#F48FB1' },
  { value: 'Yellow', color: '#FFD600' }, { value: 'Orange', color: '#FF8C00' },
]
const OCCASIONS = ['Everyday', 'Work', 'Gym', 'Parties', 'Festivals']

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    full_name: '', gender: '', age: '',
    height: '', body_type: '', skin_tone: '', wears_spectacles: false,
    preferred_styles: [], favourite_colours: [], occasions: [],
  })
  const [faceFile, setFaceFile] = useState(null)
  const [bodyFile, setBodyFile] = useState(null)
  const [facePreview, setFacePreview] = useState('')
  const [bodyPreview, setBodyPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user, refreshProfile } = useAuth()
  const nav = useNavigate()

  const set = (key, val) => setData(d => ({ ...d, [key]: val }))
  const toggle = (key, val) => setData(d => ({
    ...d, [key]: d[key].includes(val) ? d[key].filter(v => v !== val) : [...d[key], val]
  }))

  function handleFace(file) { setFaceFile(file); setFacePreview(URL.createObjectURL(file)) }
  function handleBody(file) { setBodyFile(file); setBodyPreview(URL.createObjectURL(file)) }

  function validate() {
    if (step === 1 && !data.full_name.trim()) { setError('Please enter your name'); return false }
    if (step === 2 && !data.body_type) { setError('Please select your body type'); return false }
    return true
  }

  function next() {
    setError('')
    if (!validate()) return
    if (step < TOTAL_STEPS) setStep(s => s + 1)
  }

  async function finish() {
    setLoading(true); setError('')
    try {
      let face_url = null, body_url = null
      const uploadPhoto = async (file, label) => {
        const ext = file.name.split('.').pop()
        const path = user.id + '/' + label + '-' + Date.now() + '.' + ext
        const { error: upErr } = await supabase.storage.from('user-photos').upload(path, file)
        if (!upErr) {
          const { data: pd } = supabase.storage.from('user-photos').getPublicUrl(path)
          return pd.publicUrl
        }
        return null
      }
      if (faceFile) face_url = await uploadPhoto(faceFile, 'face')
      if (bodyFile) body_url = await uploadPhoto(bodyFile, 'body')

      const { error: dbErr } = await supabase.from('profiles').upsert({
        user_id: user.id,
        ...data,
        age: data.age ? parseInt(data.age) : null,
        height: data.height ? parseInt(data.height) : null,
        face_photo_url: face_url,
        body_photo_url: body_url,
        onboarding_complete: true,
      })
      if (dbErr) throw dbErr
      await refreshProfile()
      nav('/app')
    } catch(e) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  const progress = (step / TOTAL_STEPS) * 100

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '24px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--color-accent)', marginBottom: 20 }}>StyleMind AI</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-secondary)', marginBottom: 8 }}>
            <span>Step {step} of {TOTAL_STEPS}</span>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: progress + '%' }} /></div>
        </div>

        {error && <div className="auth-error" style={{ marginBottom: 20 }}>{error}</div>}

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>

            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Let's get to know you</h2>
                <p style={{ color: 'var(--color-secondary)', marginBottom: 32 }}>Basic information to personalise your style profile.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="form-group"><label>Your full name</label><input className="form-input" value={data.full_name} onChange={e => set('full_name', e.target.value)} placeholder="e.g. Garv Limani" /></div>
                  <div className="form-group"><label>Gender</label>
                    <div className="pills">
                      {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map(g => (
                        <button key={g} className={'pill' + (data.gender === g ? ' active' : '')} onClick={() => set('gender', g)}>{g}</button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group"><label>Age</label><input className="form-input" type="number" min="13" max="99" value={data.age} onChange={e => set('age', e.target.value)} placeholder="Your age" /></div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Your body profile</h2>
                <p style={{ color: 'var(--color-secondary)', marginBottom: 32 }}>Helps the AI suggest clothes that genuinely flatter you.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div className="form-group"><label>Height (cm)</label><input className="form-input" type="number" min="100" max="250" value={data.height} onChange={e => set('height', e.target.value)} placeholder="e.g. 175" /></div>
                  <div className="form-group"><label>Body type</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {BODY_TYPES.map(b => (
                        <button key={b.value} onClick={() => set('body_type', b.value)}
                          style={{ padding: '12px 16px', borderRadius: 10, border: '1.5px solid ' + (data.body_type === b.value ? 'var(--color-accent)' : 'var(--color-border)'),
                            background: data.body_type === b.value ? '#FFF0EE' : 'white', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}>
                          <div style={{ fontWeight: 600, color: data.body_type === b.value ? 'var(--color-accent)' : 'var(--color-text)' }}>{b.value}</div>
                          <div style={{ fontSize: 13, color: 'var(--color-secondary)' }}>{b.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group"><label>Skin tone</label>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {SKIN_TONES.map(s => (
                        <button key={s.value} onClick={() => set('skin_tone', s.value)} title={s.value}
                          style={{ width: 44, height: 44, borderRadius: '50%', background: s.color, border: '3px solid ' + (data.skin_tone === s.value ? 'var(--color-accent)' : 'transparent'),
                            cursor: 'pointer', transition: 'border 0.2s', outline: '2px solid ' + (data.skin_tone === s.value ? 'var(--color-accent)' : 'transparent') }} />
                      ))}
                    </div>
                    {data.skin_tone && <div style={{ fontSize: 13, color: 'var(--color-secondary)', marginTop: 6 }}>Selected: {data.skin_tone}</div>}
                  </div>
                  <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ margin: 0 }}>Wear spectacles?</label>
                    <label className="toggle">
                      <input type="checkbox" checked={data.wears_spectacles} onChange={e => set('wears_spectacles', e.target.checked)} />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Your style preferences</h2>
                <p style={{ color: 'var(--color-secondary)', marginBottom: 32 }}>Pick all that apply — the AI uses this every day.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                  <div className="form-group"><label>Preferred style (multi-select)</label>
                    <div className="pills">{STYLES.map(s => <button key={s} className={'pill' + (data.preferred_styles.includes(s) ? ' active' : '')} onClick={() => toggle('preferred_styles', s)}>{s}</button>)}</div>
                  </div>
                  <div className="form-group"><label>Favourite colours</label>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {COLOURS.map(c => (
                        <button key={c.value} onClick={() => toggle('favourite_colours', c.value)} title={c.value}
                          style={{ width: 36, height: 36, borderRadius: 8, background: c.color, border: '3px solid ' + (data.favourite_colours.includes(c.value) ? 'var(--color-accent)' : c.value === 'White' ? '#eee' : 'transparent'), cursor: 'pointer', transition: 'all 0.2s' }} />
                      ))}
                    </div>
                  </div>
                  <div className="form-group"><label>Occasions (multi-select)</label>
                    <div className="pills">{OCCASIONS.map(o => <button key={o} className={'pill' + (data.occasions.includes(o) ? ' active' : '')} onClick={() => toggle('occasions', o)}>{o}</button>)}</div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Upload your photos</h2>
                <p style={{ color: 'var(--color-secondary)', marginBottom: 12 }}>These help the AI give you more accurate, personalised styling advice.</p>
                <div style={{ background: '#FFF8F7', border: '1px solid #FDDDD9', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: 'var(--color-secondary)' }}>
                  🔒 Your photos are private and stored securely. They are only used to improve your style suggestions.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <PhotoUpload label="Clear face photo" hint="Tap to upload your face photo" onFile={handleFace} preview={facePreview} />
                  <PhotoUpload label="Full body photo" hint="Tap to upload a full body photo" onFile={handleBody} preview={bodyPreview} />
                </div>
              </div>
            )}

            {step === 5 && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, marginBottom: 12 }}>You're all set, {data.full_name.split(' ')[0]}!</h2>
                <p style={{ color: 'var(--color-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
                  Your profile is ready. Your AI stylist is waiting to help you look amazing every single day.
                </p>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        <div style={{ marginTop: 40, display: 'flex', gap: 12 }}>
          {step > 1 && step < 5 && (
            <button className="btn-ghost" onClick={() => setStep(s => s - 1)} style={{ flex: 1 }}>Back</button>
          )}
          {step < 4 && <button className="btn-primary" onClick={next} style={{ flex: 1 }}>Continue</button>}
          {step === 4 && <button className="btn-primary" onClick={next} style={{ flex: 1 }}>Continue</button>}
          {step === 5 && (
            <button className="btn-primary" onClick={finish} style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Setting up...' : 'Go to My Wardrobe'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
