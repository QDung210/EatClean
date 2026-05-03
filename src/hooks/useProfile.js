import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const DEFAULT_PROFILE = { height: 174, weight: 70, age: 21, goal: 'recomp' }

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (data && !error) setProfile({ ...DEFAULT_PROFILE, ...data })
        setLoading(false)
      })
  }, [user])

  const updateProfile = useCallback(async (updates) => {
    if (!user) return
    const next = { ...profile, ...updates }
    setProfile(next) // optimistic
    await supabase.from('profiles').upsert({ id: user.id, ...next, updated_at: new Date().toISOString() })
  }, [user, profile])

  return { profile, loading, updateProfile }
}
