export const VI_DAYS = ['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy']
export const VI_SHORT = ['CN','T2','T3','T4','T5','T6','T7']

/** Format a Date to 'YYYY-MM-DD' (used as localStorage / Supabase key) */
export function toDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

/** Format to 'DD/MM' for display */
export function toDisplayDate(date = new Date()) {
  return `${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}`
}

/** Format to 'Thứ X, DD/MM/YYYY' */
export function toFullDisplay(date = new Date()) {
  return `${VI_DAYS[date.getDay()]}, ${toDisplayDate(date)}/${date.getFullYear()}`
}

/**
 * Returns an array of 7 Date objects for the current ISO week,
 * ordered Sun–Sat (index = getDay() value).
 */
export function getCurrentWeekDates() {
  const today = new Date()
  const todayDow = today.getDay() // 0=Sun

  return Array.from({ length: 7 }, (_, dow) => {
    const diff = dow - todayDow
    const d = new Date(today)
    d.setDate(today.getDate() + diff)
    d.setHours(0, 0, 0, 0)
    return d
  })
}

/** Is a date today? */
export function isToday(date) {
  const t = new Date()
  return (
    date.getFullYear() === t.getFullYear() &&
    date.getMonth() === t.getMonth() &&
    date.getDate() === t.getDate()
  )
}

/** Is a date in the future? */
export function isFuture(date) {
  const t = new Date()
  t.setHours(0,0,0,0)
  return date > t
}
