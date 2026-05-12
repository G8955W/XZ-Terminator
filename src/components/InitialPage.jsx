import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from './Navigation'

function InitialPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [options, setOptions] = useState(['', '', '', ''])

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ''])
    }
  }

  const removeOption = (index) => {
    if (options.length > 4) {
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validOptions = options.filter(opt => opt.trim() !== '')
    if (validOptions.length >= 4) {
      navigate('/classic/elimination/game', { state: { options: validOptions } })
    }
  }

  const isValid = options.filter(opt => opt.trim() !== '').length >= 4

  return (
    <div className="min-h-screen bg-notion-dark text-notion-text">
      <Navigation title={t('elimination-title')} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 py-8"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="text-6xl mb-4"
            >
              ⚔️
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-notion-accent">
              {t('elimination-title')}
            </h1>
            <p className="text-center text-gray-400 text-lg">
              {t('elimination-input')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="text-notion-accent font-semibold min-w-[2rem]">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={t('elimination-placeholder', { index: index + 1 })}
                  className="flex-1 bg-notion-gray border border-notion-light rounded-lg px-4 py-3 text-notion-text placeholder-gray-500 focus:outline-none focus:border-notion-accent transition-colors"
                />
                {options.length > 4 && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeOption(index)}
                    className="text-red-400 hover:text-red-300 transition-colors p-2"
                  >
                    ✕
                  </motion.button>
                )}
              </motion.div>
            ))}

            {options.length < 10 && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addOption}
                className="w-full py-3 border-2 border-dashed border-notion-light rounded-lg text-gray-400 hover:border-notion-accent hover:text-notion-accent transition-colors"
              >
                {t('elimination-add')}
              </motion.button>
            )}

            <motion.button
              type="submit"
              disabled={!isValid}
              whileHover={isValid ? { scale: 1.02 } : {}}
              whileTap={isValid ? { scale: 0.98 } : {}}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                isValid
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-xl cursor-pointer'
                  : 'bg-notion-gray text-gray-500 cursor-not-allowed'
              }`}
            >
              {t('elimination-start')}
            </motion.button>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-gray-500 mt-6 text-sm"
          >
            {t('elimination-title') === '淘汰赛' ? '至少需要 4 个选项才能开始' : 'At least 4 options required'}
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default InitialPage