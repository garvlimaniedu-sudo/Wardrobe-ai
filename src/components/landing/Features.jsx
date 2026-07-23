import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const features = [
  {
    icon: '👗',
    title: 'Wardrobe Manager',
    desc: 'Digitise your entire wardrobe. Organise by season, occasion, or mood — and always know what you own.'
  },
  {
    icon: '📷',
    title: 'AI Dressing Room',
    desc: 'Take a photo in-store. Get instant AI feedback on whether those clothes actually suit your body and skin tone.'
  },
  {
    icon: '✨',
    title: 'Daily Outfit Picker',
    desc: 'Every morning, your AI stylist picks the perfect outfit from your wardrobe — with tips to elevate it further.'
  }
]

export default function Features() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} style={{ padding: '100px 24px', maxWidth: 'var(--max-width)', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: 'var(--color-accent)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>What It Does</div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
          Your complete style intelligence
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            whileHover={{ y: -4, boxShadow: 'var(--shadow-card-hover)' }}
            style={{ background: 'white', borderRadius: 'var(--radius-card)', padding: 32, boxShadow: 'var(--shadow-card)', cursor: 'default' }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
            <p style={{ color: 'var(--color-secondary)', lineHeight: 1.7, fontSize: 15 }}>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
