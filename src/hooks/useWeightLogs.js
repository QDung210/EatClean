import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { toDateKey } from '../utils/dateUtils'

export function useWeightLogs() {
  const { user } = useAuth()
  const [logs,    setLogs]    = useState([])   // [{ date, weight }]
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('weight_logs')
      .select('date, weight')
      .eq('user_id', user.id)
      .order('date', { ascending: true })
      .limit(90) // last ~3 months
      .then(({ data }) => {
        setLogs(data ?? [])
        setLoading(false)
      })
  }, [user])

  const logWeight = useCallback(async (weight) => {
    if (!user) return
    const today = toDateKey(new Date())
    const entry = { date: today, weight: parseFloat(weight) }

    // Optimistic: replace or add
    setLogs(prev => {
      const without = prev.filter(l => l.date !== today)
      return [...without, entry].sort((a,b) => a.date.localeCompare(b.date))
    })

    await supabase.from('weight_logs').upsert(
      { user_id: user.id, ...entry },
      { onConflict: 'user_id,date' }
    )
  }, [user])

  const todayWeight = logs.find(l => l.date === toDateKey(new Date()))?.weight ?? null

  return { logs, loading, logWeight, todayWeight }
}
