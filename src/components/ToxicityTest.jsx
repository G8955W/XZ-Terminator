import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from './Navigation'
import { saveToHistory } from '../utils/history'

function ToxicityTest() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [options, setOptions] = useState([])
  const [inputOptions, setInputOptions] = useState(['', '', ''])
  const [currentPair, setCurrentPair] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [eliminated, setEliminated] = useState(null)
  const [isEliminating, setIsEliminating] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [finalOption, setFinalOption] = useState(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const mode = urlParams.get('mode')
    const encodedOptions = urlParams.get('options')
    
    if (mode === 'toxicity' && encodedOptions) {
      try {
        const decoded = atob(encodedOptions)
        const opts = decoded.split(',')
        if (opts.length >= 2) {
          setOptions(opts)
        }
      } catch (e) {
        console.error('Failed to decode options:', e)
      }
    }
  }, [])

  useEffect(() => {
    if (options.length >= 2 && !isFinished) {
      setCurrentPair([options[0], options[1]])
    }
  }, [options, isFinished])

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

  const handleSelect = (selected) => {
    if (isEliminating) return
    
    const notSelected = currentPair.find(opt => opt !== selected)
    setEliminated(notSelected)
    setIsEliminating(true)
  }

  const handleEliminationComplete = () => {
    const newOptions = options.filter(opt => opt !== eliminated)
    setOptions(newOptions)
    setEliminated(null)
    setIsEliminating(false)
    
    if (newOptions.length === 1) {
      setFinalOption(newOptions[0])
      setIsFinished(true)
      handleSaveToHistory(newOptions[0])
    } else {
      setCurrentPair([newOptions[0], newOptions[1]])
    }
  }

  const handleSaveToHistory = async (winner) => {
    await saveToHistory('toxicity', options, winner)
  }

  if (options.length === 0) {
    return (
      <div className="min-h-screen bg-notion-dark text-notion-text">
        <Navigation title={t('toxicity-test')} />
        
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
                  scale: [1, 1.1, 1],
                  filter: ['hue-rotate(0deg)', 'hue-rotate(30deg)', 'hue-rotate(0deg)']
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ☠️
              </motion.div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                毒性测试
              </h2>
              <p className="text-gray-400">
                逆向淘汰法，找到{t('toxicity-result')}
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
                    placeholder={`${t('toxicity-option')} ${index + 1}`}
                    className="w-full bg-notion-gray border border-notion-light rounded-xl px-4 py-3 text-notion-text placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                  />
                </motion.div>
              ))}
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddOption}
                className="w-full py-3 border-2 border-dashed border-notion-light rounded-xl text-gray-400 hover:border-green-500 hover:text-green-400 transition-colors"
              >
                + {t('toxicity-add-option')}
              </motion.button>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-green-500/20 transition-all"
              >
                {t('toxicity-start')}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 bg-green-900/20 border border-green-800 rounded-xl"
            >
              <p className="text-green-400 text-sm text-center">
                💡 {t('toxicity-tip')}
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
        <Navigation title={t('toxicity-test')} />
        
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
            ☠️
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-4 text-green-400"
          >
            {t('toxicity-result')}
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-2 border-green-600 rounded-2xl p-8 text-center"
          >
            <p className="text-4xl md:text-5xl font-bold text-white">
              {finalOption}
            </p>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-gray-400 text-center max-w-md px-4"
          >
            这是所有选项中，即使发生最坏情况，你也能接受的那一个
          </motion.p>
          
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
      <Navigation title={t('toxicity-test')} />
      
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl md:text-3xl font-bold mb-4 text-red-500"
          >
            ⚠️ {t('toxicity-worst-case')}
          </motion.h1>
          <p className="text-xl text-gray-300 font-medium">
            {t('toxicity-question')}
          </p>
          <div className="mt-4 flex gap-2 justify-center">
            {[...Array(options.length)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  options.length - 1 === 1 ? 'bg-green-500' : 'bg-red-500'
                }`}
                animate={{ 
                  scale: options.length - eliminatedCount() <= i + 1 ? [1, 1.3, 1] : 1,
                  opacity: options.length - eliminatedCount() <= i + 1 ? [0.5, 1, 0.5] : 0.5
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-2">
            {t('toxicity-remaining')} {options.length} {t('toxicity-options')}
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-12 w-full max-w-4xl px-4">
          {currentPair.map((option, index) => (
            <motion.div
              key={option}
              initial={{ opacity: 0, x: index === 0 ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="flex-1"
            >
              <motion.button
                whileHover={!isEliminating ? { 
                  scale: 1.05, 
                  y: -10,
                  boxShadow: '0 20px 40px -10px rgba(239, 68, 68, 0.3)'
                } : {}}
                whileTap={!isEliminating ? { scale: 0.95 } : {}}
                onClick={() => handleSelect(option)}
                disabled={isEliminating}
                className={`w-full py-12 px-8 rounded-3xl text-xl md:text-2xl font-bold transition-all ${
                  eliminated === option
                    ? 'bg-red-900/50 border-2 border-red-500 opacity-50'
                    : 'bg-gradient-to-br from-red-800 to-rose-900 border-2 border-red-600 hover:border-red-400'
                } text-white shadow-2xl`}
              >
                <motion.div
                  animate={eliminated === option ? {
                    y: [0, 0, 300],
                    opacity: [1, 1, 0],
                    scale: [1, 1, 0.3]
                  } : {}}
                  transition={{ duration: 0.8, ease: 'easeIn' }}
                  className="mb-4 text-5xl"
                >
                  {index === 0 ? '👈' : '👉'}
                </motion.div>
                <p className="text-white">{option}</p>
                {eliminated !== option && (
                  <p className="text-white/60 text-sm mt-2 font-normal">
                    点击选择（能接受更差的）
                  </p>
                )}
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 text-sm max-w-xs">
            点击你更能承受其最坏结果的选项，另一个将被淘汰
          </p>
        </motion.div>
      </div>
    </div>
  )

  function eliminatedCount() {
    const pairOptions = currentPair
    return options.length - (pairOptions.includes(eliminated) ? 1 : 0)
  }
}

export default ToxicityTest