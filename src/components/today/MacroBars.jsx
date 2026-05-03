export default function MacroBars({ tracking, meals, targets }) {
  // Sum macros from checked (non-activity) meals
  const totals = meals.reduce((acc, meal, i) => {
    if (!meal.isActivity && tracking[`meal_${i}_done`]) {
      acc.cal  += meal.cal
      acc.prot += meal.prot
      acc.carb += meal.carb
      acc.fat  += meal.fat
    }
    return acc
  }, { cal: 0, prot: 0, carb: 0, fat: 0 })

  const pct = (val, max) => Math.min(100, Math.round((val / max) * 100))

  const rows = [
    { label: '🔥 Calories', key: 'cal',  unit: 'kcal', cls: 'bar-cal',  max: targets.cal  },
    { label: '💪 Protein',  key: 'prot', unit: 'g',    cls: 'bar-prot', max: targets.prot },
    { label: '⚡ Carbs',    key: 'carb', unit: 'g',    cls: 'bar-carb', max: targets.carb },
    { label: '🥑 Chất béo', key: 'fat',  unit: 'g',    cls: 'bar-fat',  max: targets.fat  },
  ]

  return (
    <section className="macro-section">
      <div className="card">
        <div className="card-label">Phân bổ Macro hôm nay</div>
        {rows.map(r => (
          <div className="macro-row" key={r.key}>
            <div className="macro-header">
              <span className="macro-name">{r.label}</span>
              <span className="macro-nums">
                <b>{totals[r.key]}</b> / {r.max}{r.unit}
              </span>
            </div>
            <div className="bar-track">
              <div
                className={`bar-fill ${r.cls}`}
                style={{ width: `${pct(totals[r.key], r.max)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
