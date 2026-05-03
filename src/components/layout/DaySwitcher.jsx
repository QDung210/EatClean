import { WEEK_CONFIG } from '../../data/mealPlans'
import { getCurrentWeekDates, toDisplayDate, isToday, isFuture, toDateKey } from '../../utils/dateUtils'

export default function DaySwitcher({ selectedDate, onSelect, weekCompletions = {} }) {
  const weekDates = getCurrentWeekDates() // indexed by getDay() (0=Sun…6=Sat)

  return (
    <div className="day-switcher-wrap">
      <div className="container">
        <div className="day-switcher">
          {WEEK_CONFIG.map(({ dow, label, type, icon }) => {
            const date      = weekDates[dow]
            const dateKey   = toDateKey(date)
            const today     = isToday(date)
            const future    = isFuture(date)
            const selected  = toDateKey(selectedDate) === dateKey
            const rate      = weekCompletions[dateKey] ?? 0
            const hasData   = rate > 0

            return (
              <button
                key={dow}
                className={[
                  'day-pill',
                  type,
                  today    ? 'today'    : '',
                  selected ? 'selected' : '',
                  future   ? 'future'   : '',
                ].join(' ')}
                onClick={() => onSelect(date)}
                aria-label={`${label} ${toDisplayDate(date)}`}
              >
                <div className="dp-icon">{icon}</div>
                <div className="dp-label">{label}</div>
                <div className="dp-date">{toDisplayDate(date)}</div>
                <div className={`dp-dot ${hasData ? 'has-data' : ''}`} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
