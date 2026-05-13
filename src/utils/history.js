import { supabase, getDeviceId } from '../supabaseClient'

export const saveToHistory = async (type, options, winner) => {
  const deviceId = getDeviceId()
  
  const { error } = await supabase
    .from('decision_history')
    .insert({
      device_id: deviceId,
      type,
      options,
      winner,
      timestamp: new Date().toISOString()
    })
  
  if (error) {
    console.error('Error saving to history:', error)
    // Fallback to localStorage
    const history = JSON.parse(localStorage.getItem('decisionHistory') || '[]')
    history.unshift({
      id: Date.now(),
      type,
      options,
      winner,
      timestamp: new Date().toISOString()
    })
    localStorage.setItem('decisionHistory', JSON.stringify(history.slice(0, 50)))
  }
}