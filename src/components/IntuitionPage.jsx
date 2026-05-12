import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from './Navigation'

function IntuitionPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showOption, setShowOption] = useState(true)
  const [showBlur, setShowBlur] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const [responses, setResponses] = useState([])
  const [showResults, setShowResults] = useState(false)

  const options = location.state?.options || []
  const originalOptions = location.state?.originalOptions || []

  useEffect(() => {
    if (!options.length) {
      navigate('/classic/elimination')
    }
  }, [options, navigate])

  useEffect(() => {
    if (showOption && !showResults) {
      const timer = setTimeout(() => {
        setShowOption(false)
        setShowBlur(true)
        setTimeout(() => {
          setShowQuestion(true)
        }, 500)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showOption, showResults, currentIndex])

  const handleResponse = (response) => {
    const newResponses = [...responses, { option: options[currentIndex], response }]
    setResponses(newResponses)

    setShowQuestion(false)
    setShowBlur(false)

    if (currentIndex < options.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
        setShowOption(true)
      }, 300)
    } else {
      setTimeout(() => {
        setShowResults(true)
      }, 500)
    }
  }

  const getRecommendedOption = () => {
    const relaxedResponses = responses.filter(r => r.response === 'relaxed')
    if (relaxedResponses.length > 0) {
      return relaxedResponses[0].option
    }
    return responses[0]?.option || options[0]
  }

  const handleConfirm = () => {
    saveToHistory(getRecommendedOption())
    navigate('/')
  }

  const saveToHistory = (winner) => {
    const history = JSON.parse(localStorage.getItem('decisionHistory') || '[]')
    history.unshift({
      id: Date.now(),
      type: 'intuition',
      options: originalOptions.length > 0 ? originalOptions : options,
      winner: winner,
      timestamp: new Date().toISOString()
    })
    localStorage.setItem('decisionHistory', JSON.stringify(history.slice(0, 50)))
  }

  if (!options.length) return null

  return (
    <div className="min-h-screen bg-notion-dark text-notion-text">
      <Navigation title={t('intuition-title')} />
      
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 py-8 relative overflow-hidden">
        <AnimatePresence>
          {showBlur && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-notion-dark blur-screen z-40"
            >
              <div className="noise-overlay" />
            </motion.div>
          )}
        </AnimatePresence>

        {!showResults ? (
          <>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-8 z-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-notion-accent">
                {t('intuition-title')}
              </h2>
              <p className="text-gray-400">
                {t('intuition-title') === '直觉探测器' ? '测试选项' : 'Testing option'} {currentIndex + 1} / {options.length}
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {showOption && (
                <motion.div
                  key={`option-${currentIndex}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="z-10"
                >
                  <div className="bg-notion-gray rounded-2xl p-8 md:p-12 max-w-lg w-full text-center shadow-2xl">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="text-6xl mb-6">💭</div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                        {options[currentIndex]}
                      </h3>
                      <p className="text-gray-400">
                        {t('intuition-title') === '直觉探测器' ? '请仔细思考这个选项...' : 'Please think carefully about this option...'}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {showQuestion && (
                <motion.div
                  key={`question-${currentIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="z-50 w-full max-w-lg"
                >
                  <div className="bg-notion-gray rounded-2xl p-8 text-center shadow-2xl border-2 border-notion-accent">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="text-6xl mb-6"
                    >
                      🤔
                    </motion.div>
                    
                    <h3 className="text-xl md:text-2xl font-bold mb-8 text-white">
                      {t('intuition-question')}
                    </h3>

                    <div className="space-y-4">
                      <motion.button
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleResponse('tense')}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
                      >
                        😰 {t('intuition-tense')}
                      </motion.button>

                      <motion.button
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.02, x: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleResponse('relaxed')}
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
                      >
                        😌 {t('intuition-relaxed')}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-10 w-full max-w-2xl"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-notion-accent">
                {t('intuition-result')}
              </h2>
              <p className="text-gray-400">
                {t('intuition-title') === '直觉探测器' ? '你的身体不会撒谎' : 'Your body does not lie'}
              </p>
            </div>

            <div className="bg-notion-gray rounded-2xl p-6 md:p-8 shadow-2xl mb-6">
              <div className="space-y-4">
                {responses.map((item, index) => (
                  <motion.div
                    key={item.option}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      item.response === 'relaxed' 
                        ? 'bg-green-900/30 border border-green-700' 
                        : 'bg-red-900/30 border border-red-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {item.response === 'relaxed' ? '😌' : '😰'}
                      </span>
                      <span className="font-semibold">{item.option}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.response === 'relaxed'
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}>
                      {item.response === 'relaxed' ? t('intuition-relaxed') : t('intuition-tense')}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-green-900/50 to-teal-900/50 rounded-2xl p-6 md:p-8 border-2 border-green-600 text-center"
            >
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2 text-green-400">
                {t('intuition-recommend')}
              </h3>
              <p className="text-2xl md:text-3xl font-bold text-white mb-4">
                {getRecommendedOption()}
              </p>
              <p className="text-gray-300 text-sm">
                {t('intuition-title') === '直觉探测器' ? '这个选项让你的身体感到最放松，相信你的直觉！' : 'This option made your body feel most relaxed, trust your intuition!'}
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirm}
              className="w-full mt-6 py-4 bg-gradient-to-r from-notion-accent to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
            >
              {t('submit')}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default IntuitionPage