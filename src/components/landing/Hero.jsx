import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'

const words = ['Dress', 'Smarter.', 'Look', 'Better.', 'Every', 'Day.']

const silhouettes = [
  { top: '15%', left: '5%', size: 80, delay: 0, speed: 0.3, shape: 'M40,0 C60,0 80,20 80,50 C80,70 60,80 40,80 C20,80 0,70 0,50 C0,20 20,0 40,0' },
  { top: '60%', left: '2%', size: 60, delay: 1, speed: 0.2, shape: 'M30,0 L60,80 L0,80 Z' },
  { top: '20%', right: '4%', size: 90, delay: 0.5, speed: 0.25, shape: 'M0,0 L90,0 L90,90 L0,90 Z' },
  { top: '55%', right: '6%', size: 70, delay: 1.5, speed: 0.35, shape: 'M35,0 C55,0 70,15 70,35 C70,55 55,70 35,70 C15,70 0,55 0,35 C0,15 15,0 35,0' },
  { top: '80%', left: '15%', size: 50, delay: 2, speed: 0.15, shape: 'M25,0 L50,50 L25,100 L0,50 Z' },
]

export default function Hero() {
  const nav = useNavigate()
  const ref = useRef()
  const { scrollYProgress } = useScroll({ target: ref })
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <section ref={ref} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: 80 }}>
      {/* Floating silhouettes */}
      {silhouettes.map((s, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: s.top, left: s.left, right: s.right,
            width: s.size, height: s.size, opacity: 0.06,
          }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        >
          <svg viewBox={`0 0 ${s.size} ${s.size}`} fill="#C9847A" width="100%" height="100%">
            <path d={s.shape} />
          </svg>
        </motion.div>
      ))}

      <motion.div style={{ y }} className="hero-content" style={{ textAlign: 'center', padding: '0 24px', maxWidth: 800, zIndex: 1, y }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontSize: 11, letterSpacing: 3, color: 'var(--color-accent)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 24 }}
        >
          AI-Powered Personal Styling
        </motion.div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 28 }}>
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              style={{ display: 'inline-block', marginRight: word.endsWith('.') ? 16 : 10 }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: 'var(--color-secondary)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}
        >
          Your AI personal stylist that learns your body, your wardrobe, and your unique style — then helps you dress your best, daily.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <button className="btn-primary" onClick={() => nav('/signup')} style={{ padding: '16px 36px', fontSize: 16 }}>
            Get Started Free — It&apos;s Free
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}
