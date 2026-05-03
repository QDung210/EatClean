import { useState } from 'react'
import { useStreak } from '../../hooks/useStreak'
import { useWeightLogs } from '../../hooks/useWeightLogs'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts'

function WeekCalendar({ history }) {
  // Last 7 days
  const last7 = history.slice(-7)
  const dayLabels = ['CN','T2','T3','T4','T5','T6','T7']

  return (
    <div className="week-calendar">
      {last7.map((d, i) => {
        const date = new Date(d.date)
        const pct  = Math.round(d.rate * 100)
        const cls  = d.rate >= 0.7 ? 'high' : d.rate >= 0.4 ? 'mid' : d.rate > 0 ? 'low' : 'none'
        return (
          <div key={i} className={`wc-cell ${cls}`} title={`${d.date}: ${pct}%`}>
            <div className="wc-pct">{pct > 0 ? `${pct}%` : '—'}</div>
            <div className="wc-label">{dayLabels[date.getDay()]}</div>
          </div>
        )
      })}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <div className="ct-date">{label}</div>
      <div className="ct-val">{payload[0].value} kg</div>
    </div>
  )
}

export default function ProgressTab() {
  const { streak, history }    = useStreak()
  const { logs, logWeight, todayWeight } = useWeightLogs()
  const [weightInput, setWeightInput] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    const val = parseFloat(weightInput)
    if (!val || val < 30 || val > 200) return
    await logWeight(val)
    setWeightInput('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Format chart data
  const chartData = logs.slice(-30).map(l => ({
    date: l.date.slice(5), // MM-DD
    weight: parseFloat(l.weight),
  }))

  const avgRate = history.length
    ? Math.round((history.reduce((s, d) => s + d.rate, 0) / history.length) * 100)
    : 0

  return (
    <div className="tab-content">
      {/* Streak + Compliance */}
      <div className="progress-top-grid">
        <div className="card streak-card">
          <div className="streak-big">🔥 {streak}</div>
          <div className="streak-desc">Ngày liên tiếp</div>
          <div className="streak-sub">Hoàn thành ≥50%</div>
        </div>
        <div className="card compliance-card">
          <div className="compliance-big">{avgRate}%</div>
          <div className="compliance-desc">Tuân thủ TB</div>
          <div className="compliance-sub">30 ngày qua</div>
        </div>
      </div>

      {/* Weekly Compliance Calendar */}
      <section style={{ marginBottom: 28 }}>
        <div className="section-head">
          <div className="section-icon teal">📅</div>
          <div>
            <div className="section-title">7 ngày gần nhất</div>
            <div className="section-subtitle">🟢 ≥70%  🟡 40–69%  🔴 &lt;40%</div>
          </div>
        </div>
        <div className="card">
          <WeekCalendar history={history} />
        </div>
      </section>

      {/* Weight log */}
      <section style={{ marginBottom: 28 }}>
        <div className="section-head">
          <div className="section-icon blue">⚖️</div>
          <div>
            <div className="section-title">Cân nặng hôm nay</div>
            <div className="section-subtitle">
              {todayWeight ? `Đã nhập: ${todayWeight} kg` : 'Chưa nhập hôm nay'}
            </div>
          </div>
        </div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="weight-entry">
            <input
              type="number"
              className="weight-input"
              placeholder="Nhập cân nặng (kg)"
              min="30" max="200" step="0.1"
              value={weightInput}
              onChange={e => setWeightInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
            <button
              className={`btn-primary ${saved ? 'saved' : ''}`}
              onClick={handleSave}
            >
              {saved ? '✓ Đã lưu' : 'Lưu'}
            </button>
          </div>
        </div>

        {/* Weight Chart */}
        {chartData.length >= 2 ? (
          <div className="card">
            <div className="card-label">Biểu đồ cân nặng (30 ngày)</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#14b8a6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
                <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone" dataKey="weight"
                  stroke="#14b8a6" strokeWidth={2}
                  fill="url(#wGrad)" dot={{ fill: '#14b8a6', r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="card empty-chart">
            <div className="empty-icon">📊</div>
            <div>Nhập cân nặng ≥2 ngày để hiện biểu đồ</div>
          </div>
        )}
      </section>

      {/* 30-day compliance heatmap */}
      <section style={{ marginBottom: 28 }}>
        <div className="section-head">
          <div className="section-icon purple">🗓️</div>
          <div>
            <div className="section-title">30 ngày tuân thủ</div>
            <div className="section-subtitle">Màu đậm = hoàn thành nhiều hơn</div>
          </div>
        </div>
        <div className="card">
          <div className="heatmap">
            {history.map((d, i) => {
              const pct = Math.round(d.rate * 100)
              const cls = d.rate >= 0.8 ? 'h4' : d.rate >= 0.6 ? 'h3' : d.rate >= 0.4 ? 'h2' : d.rate > 0 ? 'h1' : 'h0'
              return (
                <div key={i} className={`hm-cell ${cls}`} title={`${d.date}: ${pct}%`} />
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
