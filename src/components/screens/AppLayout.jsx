import { Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from '../app/BottomNav'
import Home from './Home'
import Wardrobe from './Wardrobe'
import DressingRoom from './DressingRoom'
import Profile from './Profile'

export default function AppLayout() {
  return (
    <div className="app-layout">
      <div className="app-content">
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="wardrobe" element={<Wardrobe />} />
          <Route path="dressing-room" element={<DressingRoom />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="home" replace />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  )
}
