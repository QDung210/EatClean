import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { toDateKey } from '../utils/dateUtils'

export function useDayOverride(date) {
  const { user } = useAuth()
  const dateKey = toDateKey(date)
  const [override, setOverride] = useState(null)

  useEffect(() => {
    if (!user) return
    supabase
      .from('day_overrides')
      .select('plan_key')
      .eq('user_id', user.id)
      .eq('date', dateKey)
      .maybeSingle()
      .then(({ data }) => setOverride(data?.plan_key ?? null))
  }, [user, dateKey])

  const setOverridePlan = useCallback(async (planKey) => {
    if (!user) return
    setOverride(planKey) // optimistic
    if (planKey === null) {
      await supabase.from('day_overrides').delete().eq('user_id', user.id).eq('date', dateKey)
    } else {
      await supabase.from('day_overrides').upsert(
        { user_id: user.id, date: dateKey, plan_key: planKey },
        { onConflict: 'user_id,date' }
      )
    }
  }, [user, dateKey])

  return { override, setOverridePlan }
}
