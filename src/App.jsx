import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import LandingPage from './components/landing/LandingPage'
import Login from './components/screens/Login'
import Signup from './components/screens/Signup'
import Onboarding from './components/screens/Onboarding'
import AppLayout from './components/screens/AppLayout'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#8A8A8A', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 32, height: 32, border: '3px solid #F0EDE9', borderTop: '3px solid #C9847A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading, profile } = useAuth()
  if (loading) return null
  if (user) return <Navigate to={profile?.onboarding_complete ? '/app' : '/onboarding'} replace />
  return children
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/app/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  )
}
