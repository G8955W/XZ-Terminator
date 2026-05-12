import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from './Navigation'

function DecisionCirclePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    if (!location.state?.finalOptions) {
      navigate('/classic/elimination')
    }
  }, [location.state, navigate])

  if (!location.state?.finalOptions) return null

  const { finalOptions, originalOptions } = location.state

  const handleWheelSelect = () => {
    navigate('/classic/elimination/wheel', { 
      state: { 
        options: finalOptions,
        originalOptions: originalOptions 
      } 
    })
  }

  const handleIntuitionSelect = () => {
    navigate('/classic/elimination/intuition', { 
      state: { 
        options: finalOptions,
        originalOptions: originalOptions 
      } 
    })
  }

  return (
    <div className="min-h-screen bg-notion-dark text-notion-text">
      <Navigation title={t('decision-circle')} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 py-8"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-notion-accent">
            {t('decision-circle')}
          </h2>
          <p className="text-gray-400 mb-8">
            {t('decision-circle') === '决策圈' ? '经过激烈淘汰，现在只剩下 3 个选项' : 'After intense elimination, only 3 options remain'}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {finalOptions.map((option, index) => (
              <motion.div
                key={option}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-notion-gray rounded-xl px-6 py-4 shadow-lg"
              >
                <p className="text-lg font-semibold">{option}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-md space-y-4"
        >
          <p className="text-center text-gray-300 mb-6">
            {t('decision-circle') === '决策圈' ? '选择你的决策方式' : 'Choose your decision method'}
          </p>

          <motion.button
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWheelSelect}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="flex items-center justify-center gap-4">
              <span className="text-4xl">🎡</span>
              <div className="text-left">
                <h3 className="text-xl font-bold mb-1">{t('decision-wheel')}</h3>
                <p className="text-sm text-gray-200">
                  {t('decision-wheel') === '命运转盘' ? '测运气与潜意识' : 'Test luck and subconscious'}
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02, x: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleIntuitionSelect}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="flex items-center justify-center gap-4">
              <span className="text-4xl">🔮</span>
              <div className="text-left">
                <h3 className="text-xl font-bold mb-1">{t('decision-intuition')}</h3>
                <p className="text-sm text-gray-200">
                  {t('decision-intuition') === '直觉探测器' ? '测躯体反应' : 'Test physical response'}
                </p>
              </div>
            </div>
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-500 mt-8 text-sm"
        >
          {t('decision-circle') === '决策圈' ? '两种方式都能帮你找到内心真正的答案' : 'Both methods can help you find your true inner answer'}
        </motion.p>
      </motion.div>
    </div>
  )
}

export default DecisionCirclePage