import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { useWardrobe } from '../../hooks/useWardrobe'
import { getDailyOutfit } from '../../services/geminiService'
import StylistCard from '../app/StylistCard'
import SkeletonCard from '../app/SkeletonCard'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Home() {
  const { profile } = useAuth()
  const { items, loading: wLoading } = useWardrobe()
  const [outfit, setOutfit] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  useEffect(() => {
    if (!wLoading && items.length > 0 && !outfit) fetchOutfit()
  }, [wLoading, items])

  async function fetchOutfit() {
    if (!profile) return
    setAiLoading(true); setAiError('')
    try {
      const result = await getDailyOutfit(profile, items)
      setOutfit(result || '')
    } catch(e) {
      setAiError('Could not load outfit suggestion. Please try again.')
    } finally { setAiLoading(false) }
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <div style={{ padding: '24px 20px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 13, color: 'var(--color-secondary)' }}>{greeting()},</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>{firstName} ✨</h1>
        </div>

        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Today's Outfit</h2>
          {items.length > 0 && (
            <button onClick={fetchOutfit} disabled={aiLoading}
              style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer', color: 'var(--color-accent)', fontFamily: 'Inter, sans-serif' }}>
              {aiLoading ? '...' : '↻ Refresh'}
            </button>
          )}
        </div>

        {wLoading ? (
          <SkeletonCard height={140} />
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48, marginBottom: 12 }}>👗</div>
            <h3>Your wardrobe is empty</h3>
            <p style={{ fontSize: 15 }}>Add some clothes to get your daily AI outfit suggestions.</p>
          </div>
        ) : aiError ? (
          <div className="auth-error">{aiError} <button onClick={fetchOutfit} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 600 }}>Retry</button></div>
        ) : (
          <StylistCard text={outfit} loading={aiLoading} />
        )}

        {items.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Your Wardrobe</h3>
            <div className="scroll-row">
              {items.slice(0, 8).map(item => (
                <div key={item.id} style={{ flexShrink: 0, width: 100, textAlign: 'center' }}>
                  <div style={{ width: 100, height: 100, borderRadius: 12, background: item.photo_url ? 'transparent' : 'var(--color-border)', overflow: 'hidden', marginBottom: 6 }}>
                    {item.photo_url ? <img src={item.photo_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 32 }}>👕</div>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
