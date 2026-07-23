import Navbar from './Navbar'
import Hero from './Hero'
import Features from './Features'
import HowItWorks from './HowItWorks'
import StylistCardPreview from './StylistCardPreview'
import CTABanner from './CTABanner'
import Footer from './Footer'

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--color-bg)' }}>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <StylistCardPreview />
      <CTABanner />
      <Footer />
    </div>
  )
}
