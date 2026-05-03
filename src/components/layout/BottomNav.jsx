const TABS = [
  { id: 'today',    icon: '🏠', label: 'Hôm nay'  },
  { id: 'progress', icon: '📊', label: 'Tiến độ'  },
  { id: 'utils',    icon: '🛒', label: 'Tiện ích' },
  { id: 'settings', icon: '⚙️', label: 'Cài đặt'  },
]

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {TABS.map(t => (
        <button
          key={t.id}
          className={`nav-btn ${activeTab === t.id ? 'active' : ''}`}
          onClick={() => onTabChange(t.id)}
          aria-current={activeTab === t.id ? 'page' : undefined}
        >
          <span className="nav-icon" aria-hidden="true">{t.icon}</span>
          <span className="nav-label">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
