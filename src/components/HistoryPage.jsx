import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from './Navigation'
import { supabase, getDeviceId } from '../supabaseClient'

function HistoryPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [history, setHistory] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setLoading(true)
    const deviceId = getDeviceId()
    const { data, error } = await supabase
      .from('decision_history')
      .select('*')
      .eq('device_id', deviceId)
      .order('timestamp', { ascending: false })
    
    if (error) {
      console.error('Error fetching history:', error)
      const localHistory = JSON.parse(localStorage.getItem('decisionHistory') || '[]')
      setHistory(localHistory)
    } else {
      setHistory(data || [])
    }
    setLoading(false)
  }

  const deleteItem = async (id) => {
    const deviceId = getDeviceId()
    const { error } = await supabase
      .from('decision_history')
      .delete()
      .eq('id', id)
      .eq('device_id', deviceId)
    
    if (error) {
      console.error('Error deleting item:', error)
    }
    
    const newHistory = history.filter(item => item.id !== id)
    setHistory(newHistory)
    setSelectedItem(null)
  }

  const clearAll = async () => {
    const deviceId = getDeviceId()
    const { error } = await supabase
      .from('decision_history')
      .delete()
      .eq('device_id', deviceId)
    
    if (error) {
      console.error('Error clearing history:', error)
    }
    
    setHistory([])
    setSelectedItem(null)
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'elimination': return '⚔️'
      case 'coin': return '🪙'
      case 'radar': return '⚖️'
      case 'wheel': return '🎡'
      case 'intuition': return '🔮'
      default: return '🎯'
    }
  }

  const getTypeName = (type) => {
    switch (type) {
      case 'elimination': return '淘汰赛'
      case 'coin': return '硬币'
      case 'radar': return '天平'
      case 'wheel': return '转盘'
      case 'intuition': return '直觉'
      default: return '决策'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'elimination': return 'from-purple-500 to-blue-600'
      case 'coin': return 'from-yellow-500 to-orange-600'
      case 'radar': return 'from-green-500 to-teal-600'
      case 'wheel': return 'from-pink-500 to-rose-600'
      case 'intuition': return 'from-indigo-500 to-purple-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-notion-dark flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-4xl"
        >
          🎯
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-notion-dark text-notion-text">
      <Navigation title={t('history-title')} />
      
      <div className="pt-14 px-4 py-8">
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)]"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="text-8xl mb-6"
            >
              📜
            </motion.div>
            <h2 className="text-2xl font-bold mb-2 text-gray-300">
              {t('history-empty-title')}
            </h2>
            <p className="text-gray-500 mb-8">
              {t('history-empty-desc')}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-notion-accent text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              {t('back-to-menu')}
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400">
                {t('history-title') === '决断档案馆' ? '共' : 'Total'} {history.length} {t('history-title') === '决断档案馆' ? '条记录' : 'records'}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAll}
                className="text-red-400 hover:text-red-300 text-sm transition-colors"
              >
                {t('history-title') === '决断档案馆' ? '清空全部' : 'Clear All'}
              </motion.button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5, rotate: Math.random() * 4 - 2 }}
                  onClick={() => setSelectedItem(item)}
                  className="bg-notion-gray rounded-xl overflow-hidden shadow-lg cursor-pointer group"
                  style={{ transform: `rotate(${Math.random() * 3 - 1.5}deg)` }}
                >
                  <div className={`h-2 bg-gradient-to-r ${getTypeColor(item.type)}`} />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{getTypeIcon(item.type)}</span>
                      <span className="text-sm text-gray-400">{getTypeName(item.type)}</span>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">
                {t('history-title') === '决断档案馆' ? '最终选择' : 'Final Choice'}
              </p>
                      <p className="text-lg font-semibold text-white truncate">
                        {item.winner}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.options.slice(0, 3).map((opt, i) => (
                        <span 
                          key={i} 
                          className="text-xs px-2 py-1 bg-notion-dark rounded text-gray-400 truncate max-w-[100px]"
                        >
                          {opt}
                        </span>
                      ))}
                      {item.options.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-notion-dark rounded text-gray-500">
                          +{item.options.length - 3}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500">
                      {formatDate(item.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-notion-gray rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
              >
                <div className={`h-3 bg-gradient-to-r ${getTypeColor(selectedItem.type)}`} />
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">{getTypeIcon(selectedItem.type)}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{getTypeName(selectedItem.type)}</h3>
                      <p className="text-sm text-gray-400">{formatDate(selectedItem.timestamp)}</p>
                    </div>
                  </div>

                  <div className="bg-notion-dark rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-400 mb-2">
                      {t('history-title') === '决断档案馆' ? '最终选择' : 'Final Choice'}
                    </p>
                    <p className="text-2xl font-bold text-white">{selectedItem.winner}</p>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-2">
                      {t('history-title') === '决断档案馆' ? '参与选项' : 'Options'}
                    </p>
                    <div className="space-y-2">
                      {selectedItem.options.map((opt, i) => (
                        <div 
                          key={i}
                          className={`p-3 rounded-lg ${
                            opt === selectedItem.winner 
                              ? 'bg-green-900/30 border border-green-700' 
                              : 'bg-notion-gray'
                          }`}
                        >
                          <span className={opt === selectedItem.winner ? 'text-green-400' : 'text-gray-300'}>
                            {opt}
                          </span>
                          {opt === selectedItem.winner && (
                            <span className="ml-2 text-green-400">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedItem(null)}
                      className="flex-1 py-3 bg-notion-dark text-white rounded-lg font-semibold hover:bg-notion-light transition-colors"
                    >
                      {t('history-title') === '决断档案馆' ? '关闭' : 'Close'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => deleteItem(selectedItem.id)}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      {t('history-title') === '决断档案馆' ? '删除' : 'Delete'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default HistoryPage