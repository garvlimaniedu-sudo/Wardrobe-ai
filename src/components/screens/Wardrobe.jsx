import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWardrobe } from '../../hooks/useWardrobe'
import { useAuth } from '../../hooks/useAuth'
import PhotoUpload from '../app/PhotoUpload'
import SkeletonCard from '../app/SkeletonCard'

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Footwear', 'Accessories', 'Outerwear']
const CATEGORY_OPTIONS = ['Tops', 'Bottoms', 'Footwear', 'Accessories', 'Outerwear']
const SEASONS = ['All Season', 'Summer', 'Winter']
const OCCASIONS_OPT = ['Everyday', 'Work', 'Party', 'Gym', 'Festival']

export default function Wardrobe() {
  const { items, loading, addItem, deleteItem } = useWardrobe()
  const { user } = useAuth()
  const [filter, setFilter] = useState('All')
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [longPress, setLongPress] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [form, setForm] = useState({ name: '', category: 'Tops', subcategory: '', colour: '', season: 'All Season', occasion: 'Everyday', notes: '' })

  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter)

  function handlePhoto(file) { setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file)) }

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Item name is required'); return }
    setSaving(true); setError('')
    try {
      await addItem(form, photoFile)
      setShowAdd(false)
      setForm({ name: '', category: 'Tops', subcategory: '', colour: '', season: 'All Season', occasion: 'Everyday', notes: '' })
      setPhotoFile(null); setPhotoPreview('')
    } catch(e) { setError(e.message) }
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!confirm('Remove this item from your wardrobe?')) return
    try { await deleteItem(id) } catch(e) { alert(e.message) }
    setLongPress(null)
  }

  let timer
  function startLong(id) { timer = setTimeout(() => setLongPress(id), 600) }
  function endLong() { clearTimeout(timer) }

  return (
    <div style={{ padding: '24px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700 }}>My Wardrobe</h1>
        <span style={{ color: 'var(--color-secondary)', fontSize: 14 }}>{items.length} items</span>
      </div>

      <div className="scroll-row" style={{ marginBottom: 20 }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 50, border: '1.5px solid ' + (filter === c ? 'var(--color-accent)' : 'var(--color-border)'),
              background: filter === c ? 'var(--color-accent)' : 'white', color: filter === c ? 'white' : 'var(--color-text)',
              fontSize: 14, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[1,2,3,4].map(n => <SkeletonCard key={n} height={180} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 48, marginBottom: 12 }}>🧺</div>
          <h3>{filter === 'All' ? 'No clothes yet' : 'No ' + filter + ' yet'}</h3>
          <p style={{ fontSize: 15 }}>Tap the + button to add your first item.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <AnimatePresence>
            {filtered.map(item => (
              <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                onTouchStart={() => startLong(item.id)} onTouchEnd={endLong}
                onMouseDown={() => startLong(item.id)} onMouseUp={endLong}
                style={{ background: 'white', borderRadius: 'var(--radius-card)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', cursor: 'pointer', position: 'relative' }}>
                <div style={{ height: 160, background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.photo_url ? <img src={item.photo_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 40 }}>👕</span>}
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                  <span className="tag">{item.category}</span>
                </div>
                {longPress === item.id && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-card)' }}>
                    <button onClick={() => handleDelete(item.id)} style={{ background: '#E63946', color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Delete</button>
                    <button onClick={() => setLongPress(null)} style={{ background: 'white', color: 'var(--color-text)', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginLeft: 8 }}>Cancel</button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add button */}
      <button onClick={() => setShowAdd(true)}
        style={{ position: 'fixed', bottom: 90, right: 24, width: 56, height: 56, borderRadius: '50%', background: 'var(--color-accent)', color: 'white', fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(201,132,122,0.4)', cursor: 'pointer', border: 'none', zIndex: 50 }}>
        +
      </button>

      {/* Add modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}
            onClick={e => { if (e.target === e.currentTarget) setShowAdd(false) }}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
              style={{ background: 'white', borderRadius: '20px 20px 0 0', padding: '24px 20px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>Add Clothing Item</h2>
                <button onClick={() => setShowAdd(false)} style={{ fontSize: 22, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-secondary)' }}>×</button>
              </div>
              {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}
              <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <PhotoUpload label="Photo" hint="Tap to add a photo" onFile={handlePhoto} preview={photoPreview} />
                <div className="form-group"><label>Item name *</label><input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. White linen shirt" required /></div>
                <div className="form-group"><label>Category</label>
                  <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Colour</label><input className="form-input" value={form.colour} onChange={e => setForm(f => ({ ...f, colour: e.target.value }))} placeholder="e.g. White, Navy, Beige" /></div>
                <div className="form-group"><label>Season</label>
                  <select className="form-input" value={form.season} onChange={e => setForm(f => ({ ...f, season: e.target.value }))}>
                    {SEASONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Occasion</label>
                  <select className="form-input" value={form.occasion} onChange={e => setForm(f => ({ ...f, occasion: e.target.value }))}>
                    {OCCASIONS_OPT.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Notes (optional)</label><textarea className="form-input" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any notes about this piece..." rows={2} /></div>
                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={saving}>{saving ? 'Saving...' : 'Add to Wardrobe'}</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
