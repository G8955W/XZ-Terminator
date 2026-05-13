import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from './Navigation'
import { Helmet } from 'react-helmet-async'

function InitialPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()
  const [options, setOptions] = useState(['', '', '', ''])
  const [showShareLink, setShowShareLink] = useState(false)

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

  // 读取 URL 参数并自动填充选项
  useEffect(() => {
    const optionsParam = searchParams.get('options')
    if (optionsParam) {
      try {
        const decodedOptions = decodeURIComponent(optionsParam).split(',').filter(opt => opt.trim())
        if (decodedOptions.length >= 4) {
          // 确保有至少4个空的输入框
          const filledOptions = [...decodedOptions]
          while (filledOptions.length < 4) {
            filledOptions.push('')
          }
          setOptions(filledOptions)
        }
      } catch (e) {
        console.error('Failed to parse options:', e)
      }
    }
  }, [searchParams])

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
        alert(t('elimination-title') === '淘汰赛' ? '分享链接已复制到剪贴板！' : 'Share link copied!')
      } catch (e) {
        console.error('Failed to copy:', e)
      }
    }
  }

  const shareLink = generateShareLink()

  return (
    <div className="min-h-screen bg-notion-dark text-notion-text">
      <Helmet>
        <title>淘汰赛 - 输入选项 - XZ Terminator</title>
        <meta name="description" content="淘汰赛输入页面，请输入至少4个选项进行对决。" />
      </Helmet>
      <Navigation title={t('elimination-title')} />
      
      <motion.main
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

            {shareLink && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 bg-notion-gray/50 rounded-xl p-4 border border-notion-light/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm font-medium">
                    {t('elimination-title') === '淘汰赛' ? '🔗 分享链接' : '🔗 Share Link'}
                  </span>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyShareLink}
                    className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                  >
                    {t('elimination-title') === '淘汰赛' ? '复制链接' : 'Copy Link'}
                  </motion.button>
                </div>
                <p className="text-gray-500 text-xs break-all font-mono">
                  {shareLink}
                </p>
              </motion.div>
            )}
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
      </motion.main>
    </div>
  )
}

export default InitialPage