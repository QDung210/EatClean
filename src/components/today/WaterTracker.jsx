const TOTAL_CUPS = 10 // 10 × 300ml = 3L

export default function WaterTracker({ cups, onSetWater }) {
  const toggle = (i) => {
    // Clicking a filled cup unfills it and all after; clicking empty fills up to that cup
    const newCount = cups > i ? i : i + 1
    onSetWater(newCount)
  }

  return (
    <section className="water-section">
      <div className="section-head">
        <div className="section-icon blue">💧</div>
        <div>
          <div className="section-title">Theo dõi nước uống</div>
          <div className="section-subtitle">Mục tiêu: 2.5–3L / ngày</div>
        </div>
      </div>
      <div className="card">
        <div className="water-cups">
          {Array.from({ length: TOTAL_CUPS }, (_, i) => (
            <button
              key={i}
              className={`water-cup ${i < cups ? 'filled' : ''}`}
              onClick={() => toggle(i)}
              aria-label={`Ly ${i + 1}: ${i < cups ? 'đã uống' : 'chưa uống'}`}
              title={`Ly ${i + 1} (~300ml)`}
            />
          ))}
        </div>
        <div className="water-target">
          Đã uống: <b style={{ color: 'var(--blue)' }}>{cups}</b> / {TOTAL_CUPS} ly
          &nbsp;(~<b style={{ color: 'var(--blue)' }}>{(cups * 0.3).toFixed(1)}</b>L)
        </div>
      </div>
    </section>
  )
}
