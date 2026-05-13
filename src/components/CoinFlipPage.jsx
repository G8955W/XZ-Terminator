import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from './Navigation'
import { Helmet } from 'react-helmet-async'
import DecisionCard from './DecisionCard'

function CoinFlipPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()
  const [options, setOptions] = useState(['', ''])
  const [phase, setPhase] = useState('input')
  const [isFlipping, setIsFlipping] = useState(false)
  const [showIntercept, setShowIntercept] = useState(false)
  const [result, setResult] = useState(null)
  const [coinRotation, setCoinRotation] = useState(0)
  const [showDecisionCard, setShowDecisionCard] = useState(false)
  const [hasAutoFlipped, setHasAutoFlipped] = useState(false)

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const isValid = options.every(opt => opt.trim() !== '')

  // 读取 URL 参数并自动填充选项
  useEffect(() => {
    const optionsParam = searchParams.get('options')
    if (optionsParam) {
      try {
        const decodedOptions = decodeURIComponent(optionsParam).split(',').filter(opt => opt.trim())
        if (decodedOptions.length >= 2) {
          // 确保有两个选项
          setOptions([decodedOptions[0], decodedOptions[1] || ''])
        }
      } catch (e) {
        console.error('Failed to parse options:', e)
      }
    }
  }, [searchParams])

  // 如果有 URL 参数且还没有自动翻转，就自动开始翻转
  useEffect(() => {
    const optionsParam = searchParams.get('options')
    if (optionsParam && isValid && !hasAutoFlipped && !isFlipping && phase === 'input') {
      // 延迟一点时间让界面加载完成
      const timer = setTimeout(() => {
        flipCoin()
        setHasAutoFlipped(true)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [searchParams, isValid, hasAutoFlipped, isFlipping, phase])

  // 生成分享链接
  const generateShareLink = () => {
    const validOptions = options.filter(opt => opt.trim() !== '')
    if (validOptions.length < 2) return null
    
    const encodedOptions = encodeURIComponent(validOptions.join(','))
    const url = `${window.location.origin}${window.location.pathname}?options=${encodedOptions}`
    return url
  }

  const copyShareLink = async () => {
    const link = generateShareLink()
    if (link) {
      try {
        await navigator.clipboard.writeText(link)
        alert(t('coin-title') === "Schrödinger's Coin" ? '分享链接已复制到剪贴板！' : 'Share link copied!')
      } catch (e) {
        console.error('Failed to copy:', e)
      }
    }
  }

  const shareLink = generateShareLink()

  const flipCoin = () => {
    if (!isValid) return
    
    setPhase('flipping')
    setIsFlipping(true)
    
    const finalRotation = 1800 + Math.random() * 360
    setCoinRotation(prev => prev + finalRotation)
    
    setTimeout(() => {
      setIsFlipping(false)
      setShowIntercept(true)
    }, 1500)
  }

  const handleIntercept = (selectedIndex) => {
    setShowIntercept(false)
    setResult(options[selectedIndex])
    setPhase('result')
    saveToHistory(options[selectedIndex])
  }

  const handleContinueFlip = () => {
    setShowIntercept(false)
    const finalIndex = Math.random() > 0.5 ? 0 : 1
    setResult(options[finalIndex])
    setPhase('result')
    saveToHistory(options[finalIndex])
  }

  const saveToHistory = (winner) => {
    const history = JSON.parse(localStorage.getItem('decisionHistory') || '[]')
    history.unshift({
      id: Date.now(),
      type: 'coin',
      options: options,
      winner: winner,
      timestamp: new Date().toISOString()
    })
    localStorage.setItem('decisionHistory', JSON.stringify(history.slice(0, 50)))
  }

  const handleRestart = () => {
    setOptions(['', ''])
    setPhase('input')
    setResult(null)
    setCoinRotation(0)
  }

  return (
    <div className="min-h-screen bg-notion-dark text-notion-text">
      <Helmet>
        <title>在线抛硬币 - 随机决策工具 - XZ Terminator</title>
        <meta name="description" content="在线抛硬币工具，帮你快速做出二选一的随机决策。薛定谔的硬币，在落地前揭示你的真实想法。" />
      </Helmet>
      <Navigation title={t('coin-title')} />
      
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 py-8">
        <AnimatePresence mode="wait">
          {phase === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="text-6xl mb-4"
                >
                  🪙
                </motion.div>
                <h2 className="text-3xl font-bold mb-2 text-notion-accent">
                  {t('hub-coin')}
                </h2>
                <p className="text-gray-400">
                  {t('coin-title') === "Schrödinger's Coin" ? 'Enter two options and let the coin decide' : '输入两个选项，让硬币帮你决定'}
                </p>
              </div>

              <div className="space-y-4">
                {options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}>
                      {index === 0 ? 'A' : 'B'}
                    </div>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`${t('coin-option-a', { index: index === 0 ? 'A' : 'B' })} ${index === 0 ? 'A' : 'B'}`}
                      className="flex-1 bg-notion-gray border border-notion-light rounded-lg px-4 py-3 text-notion-text placeholder-gray-500 focus:outline-none focus:border-notion-accent transition-colors"
                    />
                  </motion.div>
                ))}
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={flipCoin}
                disabled={!isValid}
                className={`w-full mt-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                  isValid
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:shadow-xl'
                    : 'bg-notion-gray text-gray-500 cursor-not-allowed'
                }`}
              >
                🪙 {t('coin-flip')}
              </motion.button>

              {shareLink && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 bg-notion-gray/50 rounded-xl p-4 border border-notion-light/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm font-medium">
                      {t('coin-title') === "Schrödinger's Coin" ? '🔗 Share Link' : '🔗 分享链接'}
                    </span>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyShareLink}
                      className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                    >
                      {t('coin-title') === "Schrödinger's Coin" ? 'Copy' : '复制'}
                    </motion.button>
                  </div>
                  <p className="text-gray-500 text-xs break-all font-mono">
                    {shareLink}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {phase === 'flipping' && (
            <motion.div
              key="flipping"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-48 h-48 perspective-1000">
                <motion.div
                  animate={{ 
                    rotateY: coinRotation,
                    y: isFlipping ? [0, -100, 0] : 0
                  }}
                  transition={{ 
                    rotateY: { duration: 2, ease: 'easeInOut' },
                    y: { duration: 2, ease: 'easeOut' }
                  }}
                  className="w-full h-full relative"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div 
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center shadow-2xl"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <span className="text-6xl">A</span>
                  </div>
                  <div 
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center shadow-2xl"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <span className="text-6xl">B</span>
                  </div>
                </motion.div>
              </div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-gray-400 text-lg"
              >
                {t('coin-title') === "Schrödinger's Coin" ? 'Coin is spinning in the air...' : '硬币正在空中旋转...'}
              </motion.p>
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div
          key="result"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="text-8xl mb-6"
          >
            🎯
          </motion.div>
          
          <h2 className="text-2xl font-bold mb-4 text-gray-300">
            {t('coin-title') === "Schrödinger's Coin" ? 'Fate has chosen' : '命运选择了'}
          </h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-8 mb-8"
          >
            <p className="text-3xl font-bold text-white">
              {result}
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDecisionCard(true)}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all mb-3"
          >
            🎨 {t('coin-title') === "Schrödinger's Coin" ? 'Generate Decision Card' : '生成手绘裁决卡'}
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRestart}
            className="w-full py-3 bg-notion-gray text-white rounded-lg font-semibold hover:bg-notion-light transition-colors"
          >
            {t('coin-title') === "Schrödinger's Coin" ? 'Try again' : '再来一次'}
          </motion.button>
        </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDecisionCard && (
            <DecisionCard
              result={result}
              isChinese={t('coin-title') !== "Schrödinger's Coin"}
              onClose={() => setShowDecisionCard(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showIntercept && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-notion-gray rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="text-6xl mb-6"
                >
                  🤔
                </motion.div>
                
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {t('coin-pause-title')}
                </h3>
                <p className="text-gray-300 mb-8 text-lg">
                  {t('coin-pause-question')}
                </p>

                <div className="space-y-3">
                  {options.map((option, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleIntercept(index)}
                      className={`w-full py-4 rounded-xl font-semibold text-white ${
                        index === 0 
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' 
                          : 'bg-gradient-to-r from-orange-500 to-orange-600'
                      }`}
                    >
                      {option}
                    </motion.button>
                  ))}
                  
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContinueFlip}
                    className="w-full py-3 bg-notion-dark text-gray-300 rounded-xl font-semibold hover:bg-notion-light transition-colors"
                  >
                    {t('coin-title') === "Schrödinger's Coin" ? 'Let the coin decide' : '让硬币自己决定'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default CoinFlipPage