import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from './Navigation'

const STORAGE_KEY = 'pain_transfer_state'

function PainTransfer() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [mode, setMode] = useState('choice')
  const [options, setOptions] = useState([])
  const [inputOptions, setInputOptions] = useState(['', ''])
  const [copied, setCopied] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [friendDecision, setFriendDecision] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const shareMode = params.get('mode')
    const encodedOptions = params.get('options')
    const decided = params.get('decided')
    const decision = params.get('decision')

    if (shareMode === 'share' && encodedOptions) {
      try {
        const decoded = decodeURIComponent(escape(atob(encodedOptions)))
        const opts = decoded.split(',')
        if (opts.length >= 2) {
          setOptions(opts)
          setMode('friend')
        }
      } catch (e) {
        console.error('Failed to decode options:', e)
      }
    }

    if (decided === 'true' && decision) {
      const decodedDecision = decodeURIComponent(decision)
      setFriendDecision(decodedDecision)
      setMode('result')
    }
  }, [])

  useEffect(() => {
    if (mode !== 'waiting') return

    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const state = JSON.parse(e.newValue)
          if (state.type === 'friend_decided' && state.options) {
            setFriendDecision(state.decision)
            setOptions(state.options)
            setMode('result')
            setIsWaiting(false)
          }
        } catch (err) {
          console.error('Failed to parse storage event:', err)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    const checkLocalStorage = () => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const state = JSON.parse(stored)
          if (state.type === 'friend_decided' && state.options) {
            setFriendDecision(state.decision)
            setOptions(state.options)
            setMode('result')
            setIsWaiting(false)
          }
        } catch (err) {
          console.error('Failed to parse localStorage:', err)
        }
      }
    }

    const interval = setInterval(checkLocalStorage, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [mode])

  const handleInputChange = (index, value) => {
    const newInputs = [...inputOptions]
    newInputs[index] = value
    setInputOptions(newInputs)
  }

  const handleAddOption = () => {
    setInputOptions([...inputOptions, ''])
  }

  const handleGenerateLink = () => {
    const validOptions = inputOptions.filter(opt => opt.trim() !== '')
    if (validOptions.length < 2) return

    const encoded = btoa(unescape(encodeURIComponent(validOptions.join(','))))
    const baseUrl = window.location.origin
    const shareUrl = `${baseUrl}/pain-transfer?mode=share&options=${encoded}`

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      type: 'waiting',
      options: validOptions,
      timestamp: Date.now()
    }))

    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setIsWaiting(true)
      setMode('waiting')
    }).catch(() => {
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setIsWaiting(true)
      setMode('waiting')
    })
  }

  const handleFriendChoice = (option) => {
    setSelectedOption(option)
    setShowConfetti(true)

    const stored = localStorage.getItem(STORAGE_KEY)
    let originalOptions = options
    if (stored) {
      try {
        const state = JSON.parse(stored)
        if (state.options) {
          originalOptions = state.options
        }
      } catch (e) {}
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      type: 'friend_decided',
      decision: option,
      options: originalOptions,
      timestamp: Date.now()
    }))

    setTimeout(() => {
      setShowConfetti(false)
      navigate(0)
    }, 3000)
  }

  if (mode === 'result') {
    return (
      <div className="min-h-screen bg-notion-dark text-notion-text overflow-hidden">
        <Navigation title={t('pain-transfer-result')} />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 0.5 }}
            className="text-8xl mb-8"
          >
            🎉
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold mb-4 text-yellow-400 text-center"
          >
            {t('pain-transfer-friend-decision')}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-2 border-yellow-600 rounded-2xl p-8 text-center"
          >
            <p className="text-4xl md:text-5xl font-bold text-white">
              {friendDecision}
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

        <AnimatePresence>
          {showConfetti && <Confetti />}
        </AnimatePresence>
      </div>
    )
  }

  if (mode === 'friend') {
    return (
      <div className="min-h-screen bg-notion-dark text-notion-text overflow-hidden">
        <Navigation title={t('pain-transfer-friend')} />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 px-4 pt-8"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🎯
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-yellow-400">
            {t('pain-transfer-friend-title')}
          </h2>
          <p className="text-gray-400">
            {t('pain-transfer-friend-desc')}
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-4 px-4">
          {options.map((option, index) => (
            <motion.button
              key={option + index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFriendChoice(option)}
              className={`w-full max-w-md py-6 px-8 bg-gradient-to-br from-yellow-600 to-orange-700 text-white rounded-2xl font-bold text-xl hover:shadow-xl hover:shadow-yellow-500/30 transition-all ${selectedOption === option ? 'ring-4 ring-yellow-300 scale-105' : ''}`}
            >
              {option}
            </motion.button>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-gray-500 text-sm mt-8 px-4"
        >
          {t('pain-transfer-friend-choice')}
        </motion.p>

        <AnimatePresence>
          {showConfetti && <Confetti />}
        </AnimatePresence>
      </div>
    )
  }

  if (mode === 'waiting') {
    return (
      <div className="min-h-screen bg-notion-dark text-notion-text overflow-hidden">
        <Navigation title={t('pain-transfer-waiting')} />

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4">
          <motion.div
            className="relative w-64 h-64 mb-8"
          >
            <motion.div
              className="absolute inset-0 border-4 border-yellow-500 rounded-full"
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                scale: { duration: 1.5, repeat: Infinity }
              }}
            />
            <motion.div
              className="absolute inset-4 border-4 border-orange-500 rounded-full"
              animate={{
                rotate: -360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 2.5, repeat: Infinity, ease: 'linear' },
                scale: { duration: 1.2, repeat: Infinity }
              }}
            />
            <motion.div
              className="absolute inset-8 border-4 border-red-500 rounded-full"
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                scale: { duration: 0.8, repeat: Infinity }
              }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <div className="text-5xl">🎯</div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold mb-2 text-yellow-400">
              {t('pain-transfer-scanning')}
            </h2>
            <p className="text-gray-400 mb-4">
              {t('pain-transfer-waiting-desc')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 p-4 bg-notion-gray rounded-xl max-w-md"
          >
            <p className="text-sm text-gray-400 text-center mb-2">
              {t('pain-transfer-copied')}
            </p>
            <p className="text-xs text-gray-500 text-center">
              {t('pain-transfer-share-hint')}
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY)
              setOptions([])
              setIsWaiting(false)
              setCopied(false)
              setMode('choice')
            }}
            className="mt-8 px-6 py-3 bg-notion-gray text-white rounded-xl font-semibold hover:bg-notion-light transition-colors"
          >
            {t('pain-transfer-restart')}
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-4 text-gray-500 text-xs"
          >
            {t('pain-transfer-stay-open')}
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-notion-dark text-notion-text">
      <Navigation title={t('pain-transfer')} />

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-8">
            <motion.div
              className="text-6xl mb-4"
              animate={{
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎯
            </motion.div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {t('pain-transfer-title')}
            </h2>
            <p className="text-gray-400">
              {t('pain-transfer-desc')}
            </p>
          </div>

          <div className="space-y-4">
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
                  placeholder={`${t('pain-transfer-option')} ${index + 1}`}
                  className="w-full bg-notion-gray border border-notion-light rounded-xl px-4 py-3 text-notion-text placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </motion.div>
            ))}

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddOption}
              className="w-full py-3 border-2 border-dashed border-notion-light rounded-xl text-gray-400 hover:border-yellow-500 hover:text-yellow-400 transition-colors"
            >
              + 添加更多选项
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateLink}
              disabled={inputOptions.filter(o => o.trim()).length < 2}
              className={`w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-yellow-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {copied ? '✓ ' + t('pain-transfer-copied') : t('pain-transfer-generate')}
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-yellow-900/20 border border-yellow-800 rounded-xl"
          >
            <p className="text-yellow-400 text-sm text-center">
              💡 提示：复制链接发送给朋友，他们点击后将直接为你做出选择
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

function Confetti() {
  const confettiPieces = [...Array(100)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)]
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            y: -20,
            x: `${piece.x}vw`,
            rotate: 0,
            opacity: 1
          }}
          animate={{
            y: '100vh',
            rotate: 720,
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeIn'
          }}
          className="absolute w-3 h-3"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </div>
  )
}

export default PainTransfer