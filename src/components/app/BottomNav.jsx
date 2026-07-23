import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/app/home', label: 'Home', icon: '🏠' },
  { to: '/app/wardrobe', label: 'Wardrobe', icon: '👗' },
  { to: '/app/dressing-room', label: 'Try On', icon: '📷' },
  { to: '/app/profile', label: 'Profile', icon: '👤' },
]

export default function BottomNav() {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 768, background: 'white',
      borderTop: '1px solid var(--color-border)',
      display: 'flex', zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      {tabs.map(t => (
        <NavLink key={t.to} to={t.to} style={({ isActive }) => ({
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '10px 4px', fontSize: 10, fontFamily: 'Inter, sans-serif',
          color: isActive ? 'var(--color-accent)' : 'var(--color-secondary)',
          transition: 'color 0.2s', gap: 3, fontWeight: isActive ? 600 : 400
        })}>
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          {t.label}
        </NavLink>
      ))}
    </nav>
  )
}
