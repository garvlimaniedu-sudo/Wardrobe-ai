import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../services/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const nav = useNavigate()

  function startEdit() {
    setForm({
      full_name: profile?.full_name || '',
      height: profile?.height || '',
      body_type: profile?.body_type || '',
      skin_tone: profile?.skin_tone || '',
      wears_spectacles: profile?.wears_spectacles || false,
    })
    setEditing(true)
  }

  async function saveEdit(e) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const { error: dbErr } = await supabase.from('profiles').update({
        full_name: form.full_name,
        height: form.height ? parseInt(form.height) : null,
        body_type: form.body_type,
        skin_tone: form.skin_tone,
        wears_spectacles: form.wears_spectacles,
      }).eq('user_id', user.id)
      if (dbErr) throw dbErr
      await refreshProfile()
      setEditing(false)
    } catch(e) { setError(e.message) }
    finally { setSaving(false) }
  }

  async function handleLogout() {
    await signOut()
    nav('/')
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  if (!profile) return <div style={{ padding: 24, color: 'var(--color-secondary)' }}>Loading profile...</div>

  return (
    <div style={{ padding: '24px 20px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--color-border)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {profile.face_photo_url ? <img src={profile.face_photo_url} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 32 }}>👤</span>}
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>{profile.full_name || 'Your Name'}</h1>
            <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
              {profile.body_type && <span className="tag">{profile.body_type}</span>}
              {profile.skin_tone && <span className="tag">{profile.skin_tone} skin</span>}
              {profile.height && <span className="tag">{profile.height}cm</span>}
            </div>
          </div>
        </div>

        {!editing ? (
          <>
            {profile.preferred_styles?.length > 0 && (
              <div style={{ background: 'white', borderRadius: 'var(--radius-card)', padding: '20px', boxShadow: 'var(--shadow-card)', marginBottom: 16 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>My Style Preferences</h3>
                <div className="pills">{profile.preferred_styles.map(s => <span key={s} className="pill active" style={{ cursor: 'default' }}>{s}</span>)}</div>
                {profile.occasions?.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12, color: 'var(--color-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Occasions</div>
                    <div className="pills">{profile.occasions.map(o => <span key={o} className="pill" style={{ cursor: 'default' }}>{o}</span>)}</div>
                  </div>
                )}
              </div>
            )}

            <div style={{ background: 'white', borderRadius: 'var(--radius-card)', padding: '20px', boxShadow: 'var(--shadow-card)', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Account</h3>
              <div style={{ fontSize: 14, color: 'var(--color-secondary)', marginBottom: 16 }}>{user?.email}</div>
              <button onClick={startEdit} className="btn-ghost" style={{ width: '100%', marginBottom: 10 }}>Edit Profile</button>
              <button onClick={handleLogout} style={{ width: '100%', padding: '12px', border: '1.5px solid #FDDDD9', borderRadius: 'var(--radius-btn)', background: 'transparent', color: '#E63946', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 15 }}>
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <div style={{ background: 'white', borderRadius: 'var(--radius-card)', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Edit Profile</h3>
            {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}
            <form onSubmit={saveEdit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group"><label>Full name</label><input className="form-input" value={form.full_name} onChange={e => set('full_name', e.target.value)} /></div>
              <div className="form-group"><label>Height (cm)</label><input className="form-input" type="number" value={form.height} onChange={e => set('height', e.target.value)} /></div>
              <div className="form-group"><label>Body type</label>
                <select className="form-input" value={form.body_type} onChange={e => set('body_type', e.target.value)}>
                  {['Slim', 'Athletic', 'Average', 'Curvy', 'Plus'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Skin tone</label>
                <select className="form-input" value={form.skin_tone} onChange={e => set('skin_tone', e.target.value)}>
                  {['Fair', 'Light', 'Medium', 'Olive', 'Dark', 'Deep'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn-ghost" onClick={() => setEditing(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  )
}
