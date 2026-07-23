import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CTABanner() {
  const ref = useRef()
  const inView = useInView(ref, { once: true })
  const nav = useNavigate()

  return (
    <section ref={ref} style={{ padding: '80px 24px', background: 'var(--color-accent)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}
      >
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'white', marginBottom: 16 }}>
          Your wardrobe. Reimagined.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, marginBottom: 36 }}>
          Join thousands building a smarter, more intentional wardrobe with AI.
        </p>
        <button
          onClick={() => nav('/signup')}
          style={{ border: '2px solid white', background: 'transparent', color: 'white', borderRadius: 'var(--radius-btn)', padding: '14px 36px', fontSize: 16, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}
          onMouseEnter={e => { e.target.style.background = 'white'; e.target.style.color = 'var(--color-accent)' }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'white' }}
        >
          Start For Free
        </button>
      </motion.div>
    </section>
  )
}
