import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function StylistCardPreview() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} style={{ padding: '100px 24px', maxWidth: 680, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: 'var(--color-accent)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>The Experience</div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Meet your AI Stylist</h2>
        <p style={{ color: 'var(--color-secondary)', marginTop: 12, fontSize: 16 }}>Every suggestion feels personal — like advice from a friend who really knows fashion.</p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="stylist-card"
        style={{ maxWidth: 520, margin: '0 auto' }}
      >
        <div className="stylist-card-label">✦ Your Stylist</div>
        <div className="stylist-card-text">
          <strong>Today's outfit:</strong> Your white linen shirt with the navy slim-cut trousers and white sneakers.
          <br /><br />
          This combination works beautifully with your medium skin tone — the crisp white brightens your complexion while the navy grounds the look with sophistication.
          <br /><br />
          <strong>Tip to elevate it:</strong> Add a thin brown leather belt to define your waist and give the look a polished, intentional finish. 🤎
        </div>
      </motion.div>
    </section>
  )
}
