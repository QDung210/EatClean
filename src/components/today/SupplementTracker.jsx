import { SUPPS } from '../../data/mealPlans'

export default function SupplementTracker({ tracking, suppTimings, onToggleSupp }) {
  return (
    <section className="supps-section">
      <div className="section-head">
        <div className="section-icon purple">💊</div>
        <div>
          <div className="section-title">Supplement Tracker</div>
          <div className="section-subtitle">Tick vào khi đã uống</div>
        </div>
      </div>
      <div className="supps-grid">
        {SUPPS.map(s => {
          const done = tracking[s.key] ?? false
          return (
            <div
              key={s.key}
              className={`supp-item${done ? ' checked' : ''}`}
              onClick={() => onToggleSupp(s.key)}
              role="checkbox"
              aria-checked={done}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && onToggleSupp(s.key)}
            >
              <div className="supp-checkbox" aria-hidden="true">✓</div>
              <div>
                <div className="supp-name">{s.icon} {s.name}</div>
                <div className="supp-timing">{suppTimings[s.key] ?? ''}</div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
