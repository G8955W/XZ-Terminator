import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from './Navigation'

function WheelPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [timeLeft, setTimeLeft] = useState(180)
  const [reason, setReason] = useState('')
  const [isLocked, setIsLocked] = useState(false)
  const wheelRef = useRef(null)

  const options = location.state?.options || []
  const originalOptions = location.state?.originalOptions || []

  useEffect(() => {
    if (!options.length) {
      navigate('/classic/elimination')
    }
  }, [options, navigate])

  const segmentAngle = 360 / options.length

  const spinWheel = () => {
    if (isSpinning) return
    
    setIsSpinning(true)
    const randomAngle = Math.random() * 360
    const spins = 5 * 360
    const finalRotation = rotation + spins + randomAngle
    
    setRotation(finalRotation)
    
    setTimeout(() => {
      const normalizedRotation = finalRotation % 360
      const selectedIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % options.length
      setSelectedOption(options[selectedIndex])
      setIsSpinning(false)
      setShowModal(true)
      setTimeLeft(180)
    }, 5000)
  }

  useEffect(() => {
    let interval
    if (showModal && !isLocked && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && !isLocked) {
      setIsLocked(true)
      saveToHistory(selectedOption)
    }
    return () => clearInterval(interval)
  }, [showModal, timeLeft, isLocked, selectedOption])

  const handleConfirm = () => {
    setIsLocked(true)
    saveToHistory(selectedOption)
  }

  const handleRespin = () => {
    setShowModal(false)
    setReason('')
    setSelectedOption(null)
  }

  const saveToHistory = (winner) => {
    const history = JSON.parse(localStorage.getItem('decisionHistory') || '[]')
    history.unshift({
      id: Date.now(),
      type: 'wheel',
      options: originalOptions.length > 0 ? originalOptions : options,
      winner: winner,
      timestamp: new Date().toISOString()
    })
    localStorage.setItem('decisionHistory', JSON.stringify(history.slice(0, 50)))
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!options.length) return null

  return (
    <div className="min-h-screen bg-notion-dark text-notion-text">
      <Navigation title={t('wheel-title')} />
      
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 py-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-notion-accent">
            {t('wheel-title')}
          </h2>
          <p className="text-gray-400">
            {t('wheel-title') === '命运转盘' ? '让命运为你做出选择' : 'Let fate decide for you'}
          </p>
        </motion.div>

        <div className="relative w-72 h-72 md:w-96 md:h-96 mb-8">
          <motion.div
            ref={wheelRef}
            animate={{ rotate: rotation }}
            transition={{ duration: 5, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {options.map((option, index) => {
                const startAngle = index * segmentAngle
                const endAngle = (index + 1) * segmentAngle
                const startRad = (startAngle - 90) * (Math.PI / 180)
                const endRad = (endAngle - 90) * (Math.PI / 180)
                
                const x1 = 50 + 50 * Math.cos(startRad)
                const y1 = 50 + 50 * Math.sin(startRad)
                const x2 = 50 + 50 * Math.cos(endRad)
                const y2 = 50 + 50 * Math.sin(endRad)
                
                const largeArcFlag = segmentAngle > 180 ? 1 : 0
                
                const colors = ['#8B5CF6', '#3B82F6', '#10B981']
                
                return (
                  <g key={option}>
                    <path
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={colors[index % colors.length]}
                      stroke="#1F2937"
                      strokeWidth="0.5"
                    />
                    <text
                      x={50 + 30 * Math.cos((startRad + endRad) / 2)}
                      y={50 + 30 * Math.sin((startRad + endRad) / 2)}
                      fill="white"
                      fontSize="4"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${startAngle + segmentAngle / 2 - 90}, ${50 + 30 * Math.cos((startRad + endRad) / 2)}, ${50 + 30 * Math.sin((startRad + endRad) / 2)})`}
                    >
                      {option.substring(0, 6)}
                    </text>
                  </g>
                )
              })}
            </svg>
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={spinWheel}
              disabled={isSpinning}
              className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg shadow-xl z-10 ${
                isSpinning ? 'cursor-not-allowed opacity-70' : 'hover:shadow-2xl'
              }`}
            >
              {isSpinning ? '...' : t('wheel-spin')}
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4"
          >
            <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-white drop-shadow-lg" />
          </motion.div>
        </div>

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-notion-gray rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl"
              >
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold mb-2 text-notion-accent">
                    {t('wheel-title') === '命运转盘' ? '命运选择了' : 'Fate has chosen'}
                  </h3>
                  <p className="text-3xl font-bold text-white mb-4">
                    {selectedOption}
                  </p>
                  
                  {!isLocked && (
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-yellow-400 mb-2">
                        {formatTime(timeLeft)}
                      </div>
                      <p className="text-gray-400 text-sm">
                        {t('wheel-regret-time')}
                      </p>
                    </div>
                  )}

                  {!isLocked && (
                    <div className="mb-6">
                      <label className="block text-left text-sm font-medium mb-2 text-gray-300">
                        {t('wheel-regret-hint')}
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder={t('wheel-title') === '命运转盘' ? '如果你真的想反悔，请写下理由...' : 'If you truly regret, write your reason...'}
                        className="w-full bg-notion-dark border border-notion-light rounded-lg px-4 py-3 text-notion-text placeholder-gray-500 focus:outline-none focus:border-notion-accent transition-colors resize-none"
                        rows="3"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {!isLocked ? (
                    <>
                      {reason.trim() && (
                        <motion.button
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleRespin}
                          className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                          {t('wheel-regret-retry')}
                        </motion.button>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConfirm}
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        {t('wheel-regret-confirm')}
                      </motion.button>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-4"
                    >
                      <div className="text-2xl mb-2">🔒</div>
                      <p className="text-green-400 font-semibold">
                        {t('wheel-title') === '命运转盘' ? '选择已锁定' : 'Choice locked'}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/')}
                        className="mt-4 px-8 py-2 bg-notion-dark text-white rounded-lg font-semibold hover:bg-notion-light transition-colors"
                      >
                        {t('back-to-menu')}
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default WheelPage