import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from './Navigation'

function EliminationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [pool, setPool] = useState([])
  const [currentPair, setCurrentPair] = useState([])
  const [winner, setWinner] = useState(null)
  const [eliminated, setEliminated] = useState(null)
  const [originalOptions, setOriginalOptions] = useState([])

  useEffect(() => {
    if (location.state?.options) {
      const shuffled = [...location.state.options].sort(() => Math.random() - 0.5)
      setOriginalOptions(location.state.options)
      setPool(shuffled)
      setCurrentPair([shuffled[0], shuffled[1]])
    } else {
      navigate('/classic/elimination')
    }
  }, [location.state, navigate])

  const handleSelect = (selected) => {
    const loser = currentPair.find(opt => opt !== selected)
    setWinner(selected)
    setEliminated(loser)

    setTimeout(() => {
      const remainingPool = pool.filter(opt => opt !== loser)
      setPool(remainingPool)
      setEliminated(null)

      if (remainingPool.length <= 3) {
        navigate('/classic/elimination/decision', { 
          state: { 
            finalOptions: remainingPool,
            originalOptions: originalOptions
          } 
        })
      } else {
        const nextOpponent = remainingPool.find(opt => opt !== selected)
        setCurrentPair([selected, nextOpponent])
      }
    }, 600)
  }

  if (!currentPair.length) return null

  return (
    <div className="min-h-screen bg-notion-dark text-notion-text">
      <Navigation title={t('elimination-title')} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 py-8"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-notion-accent">
            {t('elimination-title')}
          </h2>
          <p className="text-gray-400">
            {t('elimination-title') === '淘汰赛' ? '剩余' : 'Remaining'} {pool.length} {t('elimination-title') === '淘汰赛' ? '个选项' : 'options'}
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {currentPair.map((option, index) => (
              <motion.button
                key={option}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: eliminated === option ? 0 : 1,
                  scale: eliminated === option ? 0.5 : winner === option ? 1.1 : 1,
                  rotate: eliminated === option ? 15 : 0
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.5,
                  rotate: 15,
                  y: 100
                }}
                transition={{ 
                  type: 'spring',
                  damping: eliminated === option ? 8 : 15,
                  stiffness: 100
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(option)}
                disabled={eliminated !== null}
                className={`flex-1 min-h-[200px] md:min-h-[250px] bg-notion-gray rounded-2xl p-6 md:p-8 text-center shadow-xl transition-all ${
                  eliminated === option ? 'pointer-events-none' : 'hover:bg-notion-light'
                }`}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-xl md:text-2xl font-semibold mb-2">
                    {t('elimination-title') === '淘汰赛' ? '选项' : 'Option'} {index + 1}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-notion-text">
                    {option}
                  </p>
                </motion.div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 mb-2">{t('elimination-subtitle')}</p>
          <div className="flex items-center justify-center gap-2">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-notion-accent rounded-full"
            />
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-notion-accent rounded-full"
            />
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 bg-notion-accent rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default EliminationPage