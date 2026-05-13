import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from './Navigation'


function TyrantMode() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [options, setOptions] = useState([])
  const [inputOptions, setInputOptions] = useState(['', '', ''])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isEliminating, setIsEliminating] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [finalOption, setFinalOption] = useState(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const mode = urlParams.get('mode')
    const encodedOptions = urlParams.get('options')
    
    if (mode === 'tyrant' && encodedOptions) {
      try {
        const decoded = atob(encodedOptions)
        const opts = decoded.split(',')
        if (opts.length >= 2) {
          const shuffled = opts.sort(() => Math.random() - 0.5)
          setOptions(shuffled)
        }
      } catch (e) {
        console.error('Failed to decode options:', e)
      }
    }
  }, [])

  const handleStart = (e) => {
    e.preventDefault()
    const validOptions = inputOptions.filter(opt => opt.trim() !== '')
    if (validOptions.length >= 2) {
      const shuffled = [...validOptions].sort(() => Math.random() - 0.5)
      setOptions(shuffled)
    }
  }

  const handleInputChange = (index, value) => {
    const newInputs = [...inputOptions]
    newInputs[index] = value
    setInputOptions(newInputs)
  }

  const handleAddOption = () => {
    setInputOptions([...inputOptions, ''])
  }

  const handleFlip = () => {
    setIsFlipped(true)
  }

  const handleAccept = () => {
    if (currentIndex >= options.length - 1) {
      setFinalOption(options[currentIndex])
      setIsFinished(true)
      saveToHistory(options[currentIndex])
    } else {
      setIsFlipped(false)
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
      }, 300)
    }
  }

  const handleDiscard = () => {
    if (currentIndex >= options.length - 1) return
    
    setIsEliminating(true)
  }

  const handleEliminationComplete = () => {
    const newOptions = options.filter((_, i) => i !== currentIndex)
    setOptions(newOptions)
    setIsEliminating(false)
    setIsFlipped(false)
    
    if (newOptions.length === 1) {
      setFinalOption(newOptions[0])
      setIsFinished(true)
      saveToHistory(newOptions[0])
    }
  }

  const saveToHistory = (winner) => {
    const history = JSON.parse(localStorage.getItem('decisionHistory') || '[]')
    history.unshift({
      id: Date.now(),
      type: 'tyrant',
      options: options,
      winner: winner,
      timestamp: new Date().toISOString()
    })
    localStorage.setItem('decisionHistory', JSON.stringify(history.slice(0, 50)))
  }

  const isLastOption = currentIndex >= options.length - 1

  if (options.length === 0) {
    return (
      <div className="min-h-screen bg-notion-dark text-notion-text">
        <Navigation title={t('tyrant-title')} />
        
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg"
          >
            <div className="text-center mb-8">
              <motion.div
                className="text-6xl mb-4"
                animate={{ 
                  rotate: [0, -5, 5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                👑
              </motion.div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-red-400 to-rose-600 bg-clip-text text-transparent">
                {t('tyrant-title')}
              </h2>
              <p className="text-gray-400">
                {t('tyrant-title') === '暴君模式' ? '阅后即焚，不可逆转。你的每一个决定都是最终判决。' : 'Burn after reading, irreversible. Every decision is final.'}
              </p>
            </div>

            <form onSubmit={handleStart} className="space-y-4">
              {inputOptions.map((opt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder={t('tyrant-title') === '暴君模式' ? `选项 ${index + 1}` : `Option ${index + 1}`}
                    className="w-full bg-notion-gray border border-notion-light rounded-xl px-4 py-3 text-notion-text placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </motion.div>
              ))}
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddOption}
                className="w-full py-3 border-2 border-dashed border-notion-light rounded-xl text-gray-400 hover:border-red-500 hover:text-red-400 transition-colors"
              >
                {t('elimination-add')}
              </motion.button>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-red-500/20 transition-all"
              >
                {t('tyrant-title') === '暴君模式' ? '开始审判' : 'Start Dictatorship'}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 bg-red-900/20 border border-red-800 rounded-xl"
            >
              <p className="text-red-400 text-sm text-center">
                ⚠️ {t('tyrant-title') === '暴君模式' ? '警告：一旦决定，无法反悔。每一次选择都是最终命运。' : 'Warning: Once decided, no regrets. Every choice is final.'}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-notion-dark text-notion-text">
        <Navigation title={t('tyrant-title')} />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 1 }}
            className="text-8xl mb-8"
          >
            👑
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-4 text-red-400"
          >
            {t('tyrant-title') === '暴君模式' ? '最终判决' : 'Final Verdict'}
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-red-900/50 to-rose-900/50 border-2 border-red-600 rounded-2xl p-8 text-center"
          >
            <p className="text-4xl md:text-5xl font-bold text-white">
              {finalOption}
            </p>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="mt-8 px-8 py-3 bg-notion-gray text-white rounded-xl font-semibold hover:bg-notion-light transition-colors"
          >
            {t('back-to-menu')}
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-notion-dark text-notion-text overflow-hidden">
      <Navigation title={t('tyrant-title')} />
      
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <p className="text-gray-500 text-sm mb-2">
            {t('tyrant-title') === '暴君模式' ? '卡片' : 'Card'} {currentIndex + 1} / {options.length}
          </p>
          <div className="flex gap-2 justify-center">
            {[...Array(options.length)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full ${i <= currentIndex ? 'bg-red-500' : 'bg-notion-light'}`}
                animate={i === currentIndex ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.5, repeat: i === currentIndex ? Infinity : 0 }}
              />
            ))}
          </div>
        </motion.div>

        <div className="perspective-1000">
          <motion.div
            className="relative w-72 h-96 cursor-pointer"
            animate={
              isEliminating 
                ? { 
                    y: [0, 0, 800],
                    rotateX: [0, 0, 60],
                    scale: [1, 1, 0.2],
                    opacity: [1, 1, 0]
                  }
                : isFlipped 
                  ? { rotateY: 180 }
                  : {}
            }
            transition={
              isEliminating 
                ? { duration: 0.8, ease: 'easeIn' }
                : { duration: 0.6, type: 'spring', stiffness: 100 }
            }
            onAnimationComplete={() => {
              if (isEliminating) {
                handleEliminationComplete()
              }
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-red-900 to-rose-950 rounded-3xl flex flex-col items-center justify-center p-8 border-4 border-red-700 shadow-2xl"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-6"
              >
                🔒
              </motion.div>
              <p className="text-xl text-red-300 font-semibold text-center">
                {t('tyrant-title') === '暴君模式' ? '点击翻开命运' : 'Click to reveal fate'}
              </p>
              {!isFlipped && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFlip}
                  className="mt-8 px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-500 transition-colors"
                >
                  {t('tyrant-flip')}
                </motion.button>
              )}
            </motion.div>

            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-rose-900 to-red-950 rounded-3xl flex flex-col items-center justify-center p-8 border-4 border-rose-600 shadow-2xl"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <p className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
                {options[currentIndex]}
              </p>
              
              <div className="space-y-4 w-full">
                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAccept}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-green-500/30 transition-all"
                >
                  ✓ {t('tyrant-accept')}
                </motion.button>
                
                {!isLastOption ? (
                  <motion.button
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDiscard}
                    className="w-full py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-gray-500/30 transition-all"
                  >
                    ✕ {t('tyrant-discard')}
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-700 text-white rounded-xl font-bold text-lg text-center"
                  >
                    👑 {t('tyrant-last')}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 text-xs max-w-xs">
            {isLastOption 
              ? (t('tyrant-title') === '暴君模式' ? '你已经丢弃了太多选项，这是最后的机会' : 'You have discarded too many options, this is your last chance')
              : (t('tyrant-title') === '暴君模式' ? '选择“丢弃”将永远消除这个选项，无法撤销' : 'Choosing "Discard" will permanently eliminate this option, cannot be undone')}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default TyrantMode