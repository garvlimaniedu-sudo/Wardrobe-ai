import { useEffect, useState } from 'react'

export default function StylistCard({ text, loading }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    if (!text) { setDisplayed(''); return }
    setDisplayed('')
    let i = 0
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i))
      i += 3
      if (i > text.length) { setDisplayed(text); clearInterval(timer) }
    }, 12)
    return () => clearInterval(timer)
  }, [text])

  if (loading) return (
    <div className="stylist-card">
      <div className="stylist-card-label">✦ Your Stylist</div>
      <div className="skeleton" style={{ height: 80 }} />
    </div>
  )

  if (!text) return null

  return (
    <div className="stylist-card">
      <div className="stylist-card-label">✦ Your Stylist</div>
      <div className="stylist-card-text" style={{ whiteSpace: 'pre-wrap' }}>{displayed}</div>
    </div>
  )
}
