import { useState } from 'react'

function Burst({ x, y, onDone }) {
  const emojis = ['✨','🎉','💪','🔥','⚡']
  const emoji  = emojis[Math.floor(Math.random() * emojis.length)]
  return (
    <div
      className="burst"
      style={{ left: x, top: y }}
      onAnimationEnd={onDone}
    >{emoji}</div>
  )
}

function MealEntry({ meal, index, done, onToggle }) {
  const [bursts, setBursts] = useState([])

  const handleClick = (e) => {
    if (meal.isActivity) return
    onToggle(index)
    if (!done) {
      setBursts(b => [...b, { id: Date.now(), x: e.clientX, y: e.clientY }])
    }
  }

  const pillsHtml = meal.isActivity
    ? (
      <>
        <span className="pill pill-burn">~{meal.burn} kcal đốt</span>
        <span className="pill pill-cardio">Cardio</span>
      </>
    ) : (
      <>
        <span className="pill pill-cal">{meal.cal} kcal</span>
        <span className="pill pill-prot">P {meal.prot}g</span>
        <span className="pill pill-carb">C {meal.carb}g</span>
        <span className="pill pill-fat">F {meal.fat}g</span>
      </>
    )

  return (
    <>
      {bursts.map(b => (
        <Burst key={b.id} x={b.x} y={b.y} onDone={() => setBursts(prev => prev.filter(p => p.id !== b.id))} />
      ))}

      <div className={`meal-entry${done ? ' done' : ''}`}>
        <div className="meal-dot">
          <div className={`dot ${meal.dotCls || ''}`} />
        </div>

        <div
          className={`meal-card ${meal.cardCls}${meal.isActivity ? ' activity' : ''}`}
          onClick={handleClick}
          role={meal.isActivity ? undefined : 'button'}
          tabIndex={meal.isActivity ? -1 : 0}
          onKeyDown={e => e.key === 'Enter' && handleClick(e)}
        >
          <div className={`meal-time-label ${meal.timeCls || ''}`}>⏰ {meal.time}</div>

          <div className="meal-name">
            {!meal.isActivity && <div className="meal-check" aria-hidden="true">✓</div>}
            {meal.icon} {meal.name}
          </div>

          <div className="meal-macro-pills">{pillsHtml}</div>

          <ul className="food-list">
            {meal.foods.map(([ic, txt], i) => (
              <li key={i}>
                <span className="food-icon">{ic}</span>
                <span dangerouslySetInnerHTML={{ __html: txt }} />
              </li>
            ))}
          </ul>

          {meal.supps?.length > 0 && (
            <div className="supp-row">
              <span className="supp-label">💊 Uống:</span>
              {meal.supps.map((s, i) => (
                <span key={i} className={`supp-badge ${s.c}`}>{s.n}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default function Timeline({ meals, tracking, onToggleMeal }) {
  return (
    <div className="timeline">
      {meals.map((meal, i) => (
        <MealEntry
          key={i}
          meal={meal}
          index={i}
          done={tracking[`meal_${i}_done`] ?? false}
          onToggle={onToggleMeal}
        />
      ))}
    </div>
  )
}
