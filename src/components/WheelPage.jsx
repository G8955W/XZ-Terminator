import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from './Navigation'
import { Helmet } from 'react-helmet-async'
import DecisionCard from './DecisionCard'
import ShareButton from './ShareButton'

function WheelPage({ presetOptions, scenario }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t, i18n } = useTranslation()
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [timeLeft, setTimeLeft] = useState(180)
  const [reason, setReason] = useState('')
  const [isLocked, setIsLocked] = useState(false)
  const [showDecisionCard, setShowDecisionCard] = useState(false)
  const [options, setOptions] = useState([])
  const [originalOptions, setOriginalOptions] = useState([])
  const [hasAutoSpun, setHasAutoSpun] = useState(false)
  const wheelRef = useRef(null)

  // 初始化选项
  useEffect(() => {
    // 如果有预设选项（场景化路由），优先使用
    if (presetOptions && presetOptions.length >= 2) {
      setOptions(presetOptions)
      setOriginalOptions(presetOptions)
      return
    }

    // 首先尝试从 URL 参数读取
    const optionsParam = searchParams.get('options')
    if (optionsParam) {
      try {
        const decodedOptions = decodeURIComponent(optionsParam).split(',').filter(opt => opt.trim())
        if (decodedOptions.length >= 2) {
          setOptions(decodedOptions)
          setOriginalOptions(decodedOptions)
          return
        }
      } catch (e) {
        console.error('Failed to parse options:', e)
      }
    }

    // 然后尝试从 state 读取
    if (location.state?.options) {
      setOptions(location.state.options)
      setOriginalOptions(location.state.originalOptions || location.state.options)
    }
  }, [location.state, searchParams, presetOptions])

  // 没有选项时跳转，但如果有 state 数据则等待加载
  useEffect(() => {
    if (options.length === 0 && !location.state?.options) {
      navigate('/classic/elimination')
    }
  }, [options, navigate, location.state])

  // 如果有 URL 参数且还没有自动旋转，就自动开始旋转
  useEffect(() => {
    if (options.length >= 2 && searchParams.get('options') && !hasAutoSpun && !isSpinning) {
      // 延迟一点时间让界面加载完成
      const timer = setTimeout(() => {
        spinWheel()
        setHasAutoSpun(true)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [options, searchParams, hasAutoSpun, isSpinning])

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
      <Helmet>
        <title>命运转盘 - 随机选择工具 - XZ Terminator</title>
        <meta name="description" content="命运转盘随机选择工具，让运气帮你做出艰难的决策。独特的反悔机制，帮助你确认内心真实想法。" />
      </Helmet>
      <Navigation title={t('wheel-title')} />
      
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 py-8">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-xl mt-6"
        >
          <ShareButton options={options} autoPlay={true} />
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-xl mt-12"
        >
          <div className="bg-gradient-to-br from-notion-gray/50 to-notion-dark/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-notion-light/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💡</span>
              <h2 className="text-xl font-bold text-white">
                {scenario ? scenario.contentMoat[i18n.language].title : (t('wheel-title') === '命运转盘' ? '如何使用随机转盘做决策' : 'How to Use the Random Wheel')}
              </h2>
            </div>
            
            <div className="text-gray-300 text-sm md:text-base leading-relaxed space-y-3">
              {scenario ? (
                scenario.contentMoat[i18n.language].points.map((point, index) => (
                  <p key={index}>{point}</p>
                ))
              ) : (
                <>
                  <p>
                    {t('wheel-title') === '命运转盘' 
                      ? '随机转盘是一种经典的决策工具，尤其适合在多个选项之间犹豫不决时使用。心理学研究表明，当我们难以做出选择时，随机性可以帮助我们突破思维定式，发现内心深处的真实偏好。' 
                      : 'The random wheel is a classic decision-making tool, especially useful when hesitating between multiple options. Psychological research shows that when we struggle to choose, randomness helps break through mental blocks and reveal our true inner preferences.'}
                  </p>
                  <p>
                    {t('wheel-title') === '命运转盘' 
                      ? '使用时，只需在输入框中添加你的选项，点击旋转按钮即可。我们独特的反悔机制允许你在选择后短暂思考，如果内心有强烈的抵触感，可以写下理由重新选择。这个过程能帮助你更好地了解自己的真实想法。' 
                      : 'Simply add your options, click spin, and let fate decide. Our unique regret mechanism allows you to reconsider after the wheel stops. If you feel strong resistance, write a reason and spin again. This process helps you better understand your true desires.'}
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: '🎯', label: '快速决策' },
                { icon: '⚖️', label: '公平公正' },
                { icon: '✨', label: '发现自我' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="text-center p-3 bg-notion-dark/50 rounded-xl"
                >
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="text-xs text-gray-400">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

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
                        onClick={() => setShowDecisionCard(true)}
                        className="mt-4 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        🎨 {t('wheel-title') === '命运转盘' ? '生成手绘裁决卡' : 'Generate Decision Card'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/')}
                        className="mt-3 w-full py-2 bg-notion-dark text-white rounded-lg font-semibold hover:bg-notion-light transition-colors"
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

        <AnimatePresence>
          {showDecisionCard && (
            <DecisionCard
              result={selectedOption}
              isChinese={t('wheel-title') === '命运转盘'}
              onClose={() => setShowDecisionCard(false)}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default WheelPage