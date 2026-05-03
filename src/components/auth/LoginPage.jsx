import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const [mode,    setMode]    = useState('login')   // 'login' | 'register'
  const [email,   setEmail]   = useState('')
  const [password,setPassword]= useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)     // email confirm sent

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) setError(error.message)
    } else {
      const { error } = await signUp(email, password)
      if (error) setError(error.message)
      else setDone(true)
    }

    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🥗</div>
        <h1 className="login-title">EatClean Tracker</h1>
        <p className="login-sub">
          Theo dõi dinh dưỡng hàng ngày<br />
          Tăng cơ · Giảm mỡ · Nhất quán
        </p>

        <div className="login-stats">
          <div className="ls-item"><span className="ls-val">155g</span><span className="ls-label">Protein/ngày</span></div>
          <div className="ls-divider" />
          <div className="ls-item"><span className="ls-val">7×</span><span className="ls-label">Tập/tuần</span></div>
          <div className="ls-divider" />
          <div className="ls-item"><span className="ls-val">🔥</span><span className="ls-label">Streak</span></div>
        </div>

        {done ? (
          <div className="login-confirm-msg">
            Kiểm tra email <b>{email}</b> để xác nhận tài khoản, rồi đăng nhập lại.
          </div>
        ) : (
          <form className="login-form" onSubmit={handle}>
            <div className="form-field">
              <label>Email</label>
              <input
                type="email" required autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Mật khẩu</label>
              <input
                type="password" required autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder="••••••••"
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '...' : mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
            </button>

            <button
              type="button" className="btn-ghost"
              style={{ marginTop: 8 }}
              onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError('') }}
            >
              {mode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
            </button>
          </form>
        )}

        <p className="login-note">
          Dữ liệu lưu trên Supabase · Bảo mật với RLS
        </p>
      </div>
    </div>
  )
}
