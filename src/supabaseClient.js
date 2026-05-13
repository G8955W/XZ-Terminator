import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId')
  if (!deviceId) {
    deviceId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    localStorage.setItem('deviceId', deviceId)
  }
  return deviceId
}