import { useAuth } from '../../contexts/AuthContext'
import { useStreak } from '../../hooks/useStreak'

export default function Header() {
  const { user, signOut } = useAuth()
  const { streak } = useStreak()

  return (
    <header className="app-header">
      <div className="container">
        <div className="header-inner">
          <div className="streak-badge" title={`${streak} ngày liên tiếp hoàn thành ≥50% kế hoạch`}>
            🔥 {streak} <span className="streak-label">ngày</span>
          </div>

          <h1 className="app-title">EatClean 🥗</h1>

          <button className="avatar-btn" onClick={signOut} title="Đăng xuất">
            {user?.user_metadata?.avatar_url
              ? <img src={user.user_metadata.avatar_url} alt="avatar" className="avatar-img" />
              : <span className="avatar-fallback">{user?.email?.[0]?.toUpperCase() ?? '?'}</span>
            }
          </button>
        </div>
      </div>
    </header>
  )
}
