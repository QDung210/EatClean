import { useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import { useProfile } from './hooks/useProfile'
import LoginPage from './components/auth/LoginPage'
import Header from './components/layout/Header'
import DaySwitcher from './components/layout/DaySwitcher'
import BottomNav from './components/layout/BottomNav'
import TodayTab from './components/tabs/TodayTab'
import ProgressTab from './components/tabs/ProgressTab'
import UtilsTab from './components/tabs/UtilsTab'
import SettingsTab from './components/tabs/SettingsTab'

function AppShell() {
  const [activeTab,    setActiveTab]    = useState('today')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const { profile } = useProfile()

  return (
    <div className="app">
      <div className="bg-glow" />

      <Header />
      <DaySwitcher selectedDate={selectedDate} onSelect={setSelectedDate} />

      <main className="main-content">
        <div className="container">
          {activeTab === 'today'    && <TodayTab    selectedDate={selectedDate} profile={profile} />}
          {activeTab === 'progress' && <ProgressTab />}
          {activeTab === 'utils'    && <UtilsTab    selectedDate={selectedDate} />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="splash">
        <div className="splash-logo">🥗</div>
        <div className="spinner" />
      </div>
    )
  }

  return user ? <AppShell /> : <LoginPage />
}
