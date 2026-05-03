import { useState, useEffect } from 'react'
import { fetchTrackingRange } from './useMealTracking'
import { toDateKey } from '../utils/dateUtils'
import { useAuth } from '../contexts/AuthContext'

const COMPLETION_THRESHOLD = 0.5 // ≥50% to count as "done day"
const MEAL_KEYS  = Array.from({length:7}, (_,i) => `meal_${i}_done`)
const SUPP_KEYS  = ['creatine_done','omega3_done','whey_done','magie_done','zinc_done']
const ALL_KEYS   = [...MEAL_KEYS, ...SUPP_KEYS]

function getRate(row) {
  if (!row) return 0
  const done = ALL_KEYS.filter(k => row[k]).length
  return done / ALL_KEYS.length
}

export function useStreak() {
  const { user } = useAuth()
  const [streak,  setStreak]  = useState(0)
  const [history, setHistory] = useState([]) // [{ date, rate }] last 30 days

  useEffect(() => {
    if (!user) return
    const end   = new Date()
    const start = new Date(); start.setDate(start.getDate() - 60)

    fetchTrackingRange(user.id, start, end).then(rows => {
      const byDate = Object.fromEntries(rows.map(r => [r.date, r]))

      // Build last-30-days history
      const hist = Array.from({length:30}, (_,i) => {
        const d = new Date(); d.setDate(d.getDate() - (29 - i))
        const key = toDateKey(d)
        return { date: key, rate: getRate(byDate[key]) }
      })
      setHistory(hist)

      // Calculate streak going back from today
      let s = 0
      const today = new Date()
      for (let i = 0; i < 60; i++) {
        const d = new Date(today); d.setDate(today.getDate() - i)
        if (i === 0 && getRate(byDate[toDateKey(d)]) === 0) break // today not started yet, don't break streak
        if (i > 0 && getRate(byDate[toDateKey(d)]) < COMPLETION_THRESHOLD) break
        if (i > 0) s++
      }
      setStreak(s)
    })
  }, [user])

  return { streak, history }
}
