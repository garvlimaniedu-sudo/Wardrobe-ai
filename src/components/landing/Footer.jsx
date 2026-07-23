import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const nav = useNavigate()
  return (
    <footer style={{ borderTop: '1px solid var(--color-border)', padding: '40px 24px', background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--color-accent)' }}>StyleMind AI</div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {['Home', 'Features', 'How It Works'].map(l => (
            <a key={l} href="#" style={{ color: 'var(--color-secondary)', fontSize: 14, transition: 'color 0.2s' }}
               onMouseEnter={e => e.target.style.color = 'var(--color-accent)'}
               onMouseLeave={e => e.target.style.color = 'var(--color-secondary)'}>{l}</a>
          ))}
          <a href="#" onClick={e => { e.preventDefault(); nav('/login') }} style={{ color: 'var(--color-secondary)', fontSize: 14 }}>Login</a>
          <a href="#" onClick={e => { e.preventDefault(); nav('/signup') }} style={{ color: 'var(--color-secondary)', fontSize: 14 }}>Sign Up</a>
        </div>
        <div style={{ color: 'var(--color-secondary)', fontSize: 13 }}>© 2025 StyleMind AI. All rights reserved.</div>
      </div>
    </footer>
  )
}
