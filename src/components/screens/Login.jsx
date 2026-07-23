import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState('')
  const { signIn } = useAuth()
  const nav = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading('Signing in...')
    try {
      await signIn(email, password)
      nav('/app')
    } catch(err) {
      setError(err.message)
    } finally { setLoading('') }
  }

  async function handleForgot() {
    if (!email) { setError('Enter your email above first'); return }
    const { supabase } = await import('../../services/supabaseClient')
    await supabase.auth.resetPasswordForEmail(email)
    setError(''); alert('Password reset email sent!')
  }

  return (
    <div className="auth-screen">
      <motion.div className="auth-box" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="auth-logo">StyleMind AI</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your account</p>
        {error && <div className="auth-error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={!!loading}>
            {loading || 'Sign In'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={handleForgot} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: 14 }}>Forgot password?</button>
        </div>
        <div className="auth-link">Don't have an account? <Link to="/signup">Sign up free</Link></div>
      </motion.div>
    </div>
  )
}
