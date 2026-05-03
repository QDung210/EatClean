import { useState } from 'react'
import { useProfile } from '../../hooks/useProfile'
import { useAuth } from '../../contexts/AuthContext'
import { calcBMR, calcTDEE, calcTargets, GOAL_LABELS } from '../../utils/macroCalc'

export default function SettingsTab() {
  const { user, signOut } = useAuth()
  const { profile, updateProfile } = useProfile()
  const [form, setForm]   = useState(null)  // null = not editing
  const [saved, setSaved] = useState(false)

  const editing = form ?? profile

  const handleSave = async (e) => {
    e.preventDefault()
    await updateProfile({
      height: parseInt(editing.height),
      weight: parseFloat(editing.weight),
      age:    parseInt(editing.age),
      goal:   editing.goal,
    })
    setForm(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const bmr       = calcBMR(profile)
  const tdeeGym   = calcTDEE(bmr, 'gym_work')
  const tdeePickle= calcTDEE(bmr, 'pickle_sun')
  const tGym      = calcTargets(profile, 'gym_work')
  const tPickle   = calcTargets(profile, 'pickle_sun')

  return (
    <div className="tab-content">
      {/* Profile */}
      <section style={{ marginBottom: 28 }}>
        <div className="section-head">
          <div className="section-icon teal">👤</div>
          <div>
            <div className="section-title">Hồ sơ của bạn</div>
            <div className="section-subtitle">{user?.email}</div>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSave}>
            <div className="form-grid">
              <div className="form-field">
                <label>Chiều cao (cm)</label>
                <input
                  type="number" min="140" max="220"
                  value={editing.height}
                  onChange={e => setForm(f => ({ ...(f ?? profile), height: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label>Cân nặng (kg)</label>
                <input
                  type="number" min="30" max="200" step="0.1"
                  value={editing.weight}
                  onChange={e => setForm(f => ({ ...(f ?? profile), weight: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label>Tuổi</label>
                <input
                  type="number" min="15" max="70"
                  value={editing.age}
                  onChange={e => setForm(f => ({ ...(f ?? profile), age: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label>Mục tiêu</label>
                <select
                  value={editing.goal}
                  onChange={e => setForm(f => ({ ...(f ?? profile), goal: e.target.value }))}
                >
                  {Object.entries(GOAL_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className={`btn-primary ${saved ? 'saved' : ''}`}>
              {saved ? '✓ Đã lưu' : 'Lưu hồ sơ'}
            </button>
          </form>
        </div>
      </section>

      {/* Calculated Macros */}
      <section style={{ marginBottom: 28 }}>
        <div className="section-head">
          <div className="section-icon purple">🧮</div>
          <div>
            <div className="section-title">Macro được tính toán</div>
            <div className="section-subtitle">Dựa trên hồ sơ của bạn</div>
          </div>
        </div>
        <div className="card">
          <div className="calc-row">
            <span className="calc-label">BMR (năng lượng cơ bản)</span>
            <span className="calc-val">{bmr.toLocaleString('vi-VN')} kcal</span>
          </div>
          <div className="calc-row">
            <span className="calc-label">TDEE ngày Gym</span>
            <span className="calc-val">{tdeeGym.toLocaleString('vi-VN')} kcal</span>
          </div>
          <div className="calc-row">
            <span className="calc-label">TDEE ngày Pickleball</span>
            <span className="calc-val">{tdeePickle.toLocaleString('vi-VN')} kcal</span>
          </div>

          <div className="calc-divider" />

          <div className="calc-section-label">🏋️ Target ngày Gym ({GOAL_LABELS[profile.goal]})</div>
          <div className="calc-row"><span className="calc-label">Calories</span><span className="calc-val amber">{tGym.cal.toLocaleString('vi-VN')} kcal</span></div>
          <div className="calc-row"><span className="calc-label">Protein</span><span className="calc-val teal">{tGym.prot}g</span></div>
          <div className="calc-row"><span className="calc-label">Carbs</span><span className="calc-val green">{tGym.carb}g</span></div>
          <div className="calc-row"><span className="calc-label">Chất béo</span><span className="calc-val purple">{tGym.fat}g</span></div>

          <div className="calc-divider" />

          <div className="calc-section-label">🏓 Target ngày Pickleball</div>
          <div className="calc-row"><span className="calc-label">Calories</span><span className="calc-val amber">{tPickle.cal.toLocaleString('vi-VN')} kcal</span></div>
          <div className="calc-row"><span className="calc-label">Protein</span><span className="calc-val teal">{tPickle.prot}g</span></div>
          <div className="calc-row"><span className="calc-label">Carbs</span><span className="calc-val green">{tPickle.carb}g</span></div>
          <div className="calc-row"><span className="calc-label">Chất béo</span><span className="calc-val purple">{tPickle.fat}g</span></div>
        </div>
      </section>

      {/* Account */}
      <section style={{ marginBottom: 28 }}>
        <div className="section-head">
          <div className="section-icon rose">🔐</div>
          <div>
            <div className="section-title">Tài khoản</div>
          </div>
        </div>
        <div className="card">
          <div className="account-row">
            <span style={{ fontSize: 13, color: 'var(--t2)' }}>
              {user?.user_metadata?.full_name ?? user?.email}
            </span>
            <button className="btn-danger" onClick={signOut}>Đăng xuất</button>
          </div>
        </div>
      </section>
    </div>
  )
}
