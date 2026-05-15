import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from './Navigation'
import { Helmet } from 'react-helmet-async'
import ShareButton from './ShareButton'

const BOX_COLORS = [
  { bg: '#ffde59', border: '#000' },
  { bg: '#7ed6fb', border: '#000' },
  { bg: '#ff6b9d', border: '#000' },
  { bg: '#c44dff', border: '#000' },
  { bg: '#50fa7b', border: '#000' },
  { bg: '#ff8c42', border: '#000' },
]

function MysteryBoxMode() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t, i18n } = useTranslation()
  const [mode, setMode] = useState('input')
  const [options, setOptions] = useState(['', ''])
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [winner, setWinner] = useState(null)
  const [shakeIndex, setShakeIndex] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [autoPlayTriggered, setAutoPlayTriggered] = useState(false)

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, ''])
    }
  }

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
    }
  }

  const handleGenerateBoxes = () => {
    const validOptions = options.filter(opt => opt.trim() !== '')
    if (validOptions.length < 2) return
    setMode('boxes')
  }

  const handleBoxClick = (index) => {
    if (shakeIndex !== null || showResult) return

    const validOptions = options.filter(opt => opt.trim() !== '')
    const winnerIndex = Math.floor(Math.random() * validOptions.length)
    const winnerOption = validOptions[winnerIndex]

    setShakeIndex(index)

    setTimeout(() => {
      setShakeIndex(null)
      setSelectedIndex(index)
      setWinner(winnerOption)
      setShowResult(true)
    }, 800)
  }

  const handleRestart = () => {
    setMode('input')
    setOptions(['', ''])
    setSelectedIndex(null)
    setWinner(null)
    setShakeIndex(null)
    setShowResult(false)
    setAutoPlayTriggered(false)
  }

  // 从URL参数读取选项并自动播放
  useEffect(() => {
    const optionsParam = searchParams.get('options')
    const autoPlay = searchParams.get('autoPlay') === 'true'
    
    if (optionsParam) {
      try {
        const decodedOptions = decodeURIComponent(optionsParam).split(',').filter(opt => opt.trim())
        if (decodedOptions.length >= 2) {
          setOptions(decodedOptions)
          setMode('boxes')
          
          if (autoPlay && !autoPlayTriggered) {
            setTimeout(() => {
              const randomIndex = Math.floor(Math.random() * decodedOptions.length)
              handleBoxClick(randomIndex)
              setAutoPlayTriggered(true)
            }, 1000)
          }
        }
      } catch (e) {
        console.error('Failed to parse options:', e)
      }
    }
  }, [searchParams, autoPlayTriggered])

  const validOptionsCount = options.filter(opt => opt.trim() !== '').length

  if (mode === 'boxes') {
    const validOptions = options.filter(opt => opt.trim() !== '')

    return (
      <div className="min-h-screen bg-white text-notion-text">
        <Helmet>
          <title>盲盒命运 - 纯平手绘盲盒 - XZ Terminator</title>
          <meta name="description" content="纯平手绘盲盒，随机命运决策模式。" />
        </Helmet>
        <Navigation title={t('mystery-box-title')} />

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-black text-black border-b-4 border-black pb-2 inline-block">
              {t('mystery-box-pick-title')}
            </h2>
            <p className="text-gray-800 mt-2 font-bold">
              {t('mystery-box-pick-desc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {validOptions.map((_, index) => {
              const boxColor = BOX_COLORS[index % BOX_COLORS.length]
              const isSelected = selectedIndex === index
              const isShaking = shakeIndex === index
              const isDimmed = showResult && !isSelected

              return (
                <motion.button
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: isDimmed ? 0.2 : 1,
                    rotate: isShaking ? [0, -15, 15, -10, 10, -5, 5, 0] : 0
                  }}
                  transition={{
                    opacity: { duration: 0.3 },
                    rotate: { duration: 0.5 }
                  }}
                  onClick={() => !showResult && handleBoxClick(index)}
                  className={`
                    relative w-28 h-36 md:w-36 md:h-44 
                    border-4 md:border-6 border-black 
                    rounded-xl md:rounded-2xl
                    flex flex-col items-center justify-center
                    transition-all
                    ${isSelected ? 'ring-4 ring-yellow-400' : ''}
                  `}
                  style={{
                    backgroundColor: boxColor.bg,
                    boxShadow: isDimmed 
                      ? 'none' 
                      : '6px 6px 0px 0px rgba(0,0,0,1)'
                  }}
                  disabled={showResult}
                >
                  <span className="text-5xl md:text-7xl font-black text-black">
                    {isSelected ? '✨' : '?'}
                  </span>
                  {isSelected && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="absolute -top-3 -right-3 text-2xl md:text-3xl"
                    >
                      🎉
                    </motion.span>
                  )}
                </motion.button>
              )
            })}
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ scale: 0, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 12 }}
                className="bg-yellow-300 border-4 md:border-6 border-black rounded-xl md:rounded-2xl p-6 md:p-8 text-center"
                style={{ boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}
              >
                <p className="text-sm md:text-base text-black font-bold mb-2">
                  {t('mystery-box-your-fate')}
                </p>
                <p className="text-2xl md:text-4xl font-black text-red-600">
                  {winner}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {showResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRestart}
                className="px-6 py-3 bg-white border-4 border-black rounded-xl font-black text-lg"
                style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
              >
                🔄 {t('mystery-box-try-again')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-pink-400 border-4 border-black rounded-xl font-black text-lg"
                style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
              >
                🏠 {t('mystery-box-back-menu')}
              </motion.button>
            </motion.div>
          )}

          <div className="mt-8 text-4xl">
            🎲 🎁 📦 🎯 ✨
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-notion-text">
      <Helmet>
        <title>盲盒命运 - 纯平手绘盲盒 - XZ Terminator</title>
        <meta name="description" content="纯平手绘盲盒，随机命运决策模式。" />
      </Helmet>
      <Navigation title={t('mystery-box-title')} />

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="bg-orange-200 border-4 md:border-6 border-black rounded-2xl p-6 md:p-8" style={{ boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
            <div className="text-center mb-6">
              <motion.div
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-6xl md:text-7xl mb-4 inline-block"
              >
                🎁
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-black text-black border-b-4 border-black pb-2">
                {t('mystery-box-input-title')}
              </h2>
              <p className="text-gray-800 mt-2 font-bold">
                {t('mystery-box-input-desc')}
              </p>
            </div>

            <div className="space-y-3">
              {options.map((opt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`${t('mystery-box-option')} ${index + 1}`}
                    className="flex-1 bg-white border-4 border-black rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none transition-colors"
                    style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                  />
                  {options.length > 2 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveOption(index)}
                      className="px-3 bg-red-400 border-4 border-black rounded-xl font-black text-white"
                      style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                    >
                      ✕
                    </motion.button>
                  )}
                </motion.div>
              ))}

              {options.length < 6 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddOption}
                  className="w-full py-3 bg-white border-4 border-dashed border-black rounded-xl text-black font-bold hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                >
                  + {t('mystery-box-add-option')}
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGenerateBoxes}
                disabled={validOptionsCount < 2}
                className={`
                  w-full py-4 bg-yellow-300 border-4 border-black rounded-xl font-black text-xl
                  transition-all mt-4
                  ${validOptionsCount < 2 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                style={{ boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)' }}
              >
                🎁 {t('mystery-box-generate')}
              </motion.button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
              >
                <ShareButton options={options} autoPlay={true} />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 bg-blue-200 border-4 border-black rounded-xl"
              style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
            >
              <p className="text-black text-sm text-center font-bold">
                💡 {t('mystery-box-hint')}
              </p>
            </motion.div>
          </div>

          <div className="mt-8 flex justify-center gap-3 text-3xl md:text-4xl">
            <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 1, repeat: Infinity }}>
              🎲
            </motion.span>
            <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.1 }}>
              🎰
            </motion.span>
            <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}>
              ✨
            </motion.span>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default MysteryBoxMode