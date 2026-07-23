import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  { num: '01', title: 'Build Your Style Profile', desc: 'Tell us your body type, skin tone, and style preferences. Upload a photo so our AI knows you.' },
  { num: '02', title: 'Add Your Wardrobe', desc: 'Photograph and catalogue every piece you own. Organise by season, occasion, and category.' },
  { num: '03', title: 'Get Styled Daily by AI', desc: 'Every morning your AI stylist picks the perfect outfit from your wardrobe with tips to elevate it.' },
]

export default function HowItWorks() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} style={{ padding: '100px 24px', background: 'white' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: 'var(--color-accent)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>How It Works</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Three steps to dressing better</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 40, position: 'relative' }}>
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              style={{ position: 'relative' }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 80, fontWeight: 800, color: 'var(--color-border)', lineHeight: 1, marginBottom: -16, userSelect: 'none' }}>{s.num}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 12 }}>{s.title}</h3>
              <p style={{ color: 'var(--color-secondary)', lineHeight: 1.7, fontSize: 15 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
