import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { toDateKey } from '../utils/dateUtils'

const EMPTY_TRACKING = {
  meal_0_done: false, meal_1_done: false, meal_2_done: false,
  meal_3_done: false, meal_4_done: false, meal_5_done: false,
  meal_6_done: false,
  creatine_done: false, omega3_done: false, whey_done: false,
  magie_done: false,   zinc_done: false,
  water_cups: 0,
}

export function useMealTracking(date) {
  const { user } = useAuth()
  const dateKey = toDateKey(date)
  const [tracking, setTracking] = useState(EMPTY_TRACKING)
  const [loading,  setLoading]  = useState(true)

  // Fetch when date changes
  useEffect(() => {
    if (!user) return
    setLoading(true)
    setTracking(EMPTY_TRACKING)

    supabase
      .from('meal_tracking')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', dateKey)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setTracking({ ...EMPTY_TRACKING, ...data })
        setLoading(false)
      })
  }, [user, dateKey])

  /** Patch one or more fields; creates the row if it doesn't exist */
  const update = useCallback(async (fields) => {
    if (!user) return
    const next = { ...tracking, ...fields }
    setTracking(next) // optimistic update

    await supabase.from('meal_tracking').upsert({
      user_id:    user.id,
      date:       dateKey,
      ...next,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,date' })
  }, [user, dateKey, tracking])

  const toggleMeal  = (idx)     => update({ [`meal_${idx}_done`]: !tracking[`meal_${idx}_done`] })
  const toggleSupp  = (key)     => update({ [key]: !tracking[key] })
  const setWater    = (cups)    => update({ water_cups: cups })

  /** Completion rate 0–1 (activity meals & suppls included) */
  const mealCount   = 7
  const suppCount   = 5
  const mealDone    = Array.from({length: mealCount}, (_,i) => tracking[`meal_${i}_done`]).filter(Boolean).length
  const suppDone    = ['creatine_done','omega3_done','whey_done','magie_done','zinc_done'].filter(k => tracking[k]).length
  const completion  = (mealDone + suppDone) / (mealCount + suppCount)

  return { tracking, loading, toggleMeal, toggleSupp, setWater, completion, mealDone, suppDone }
}

/** Fetch tracking data for a range of dates (used for streak & compliance history) */
export async function fetchTrackingRange(userId, startDate, endDate) {
  const { data } = await supabase
    .from('meal_tracking')
    .select('date, meal_0_done, meal_1_done, meal_2_done, meal_3_done, meal_4_done, meal_5_done, meal_6_done, creatine_done, omega3_done, whey_done, magie_done, zinc_done')
    .eq('user_id', userId)
    .gte('date', toDateKey(startDate))
    .lte('date', toDateKey(endDate))
    .order('date', { ascending: false })
  return data ?? []
}
