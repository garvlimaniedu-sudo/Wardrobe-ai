import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import LandingPage from './components/landing/LandingPage'
import Login from './components/screens/Login'
import Signup from './components/screens/Signup'
import Onboarding from './components/screens/Onboarding'
import AppLayout from './components/screens/AppLayout'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#8A8A8A' }}>Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading, profile } = useAuth()
  if (loading) return null
  if (user) return <Navigate to={profile?.onboarding_complete ? '/app' : '/onboarding'} replace />
  return children
}

function AppEntry() {
  const { user, loading, profile } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/" replace />
  if (!profile?.onboarding_complete) return <Navigate to="/onboarding" replace />
  return <Navigate to="/app" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/app/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
          <Route path="*" element={<AppEntry />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
