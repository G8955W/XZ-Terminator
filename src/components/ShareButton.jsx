import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

function ShareButton({ options, autoPlay = true, disabled = false, customText }) {
  const { t, i18n } = useTranslation()
  const [copied, setCopied] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const generateShareLink = () => {
    if (!options || options.length < 2) return null
    
    const validOptions = options.filter(opt => opt.trim() !== '')
    if (validOptions.length < 2) return null
    
    const encodedOptions = encodeURIComponent(validOptions.join(','))
    const baseUrl = `${window.location.origin}${window.location.pathname}`
    const url = `${baseUrl}?options=${encodedOptions}${autoPlay ? '&autoPlay=true' : ''}`
    return url
  }

  const handleShare = async () => {
    const link = generateShareLink()
    if (!link) return

    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setShowToast(true)
      
      setTimeout(() => {
        setCopied(false)
        setShowToast(false)
      }, 2500)
    } catch (e) {
      console.error('Failed to copy:', e)
    }
  }

  const link = generateShareLink()
  if (!link || disabled) return null

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleShare}
        className="group relative px-6 py-4 bg-yellow-300 border-4 border-black rounded-xl font-black text-lg text-black transition-all"
        style={{ boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)' }}
      >
        <span className="flex items-center justify-center gap-2">
          <span className="text-xl">🔗</span>
          <span>{customText || (i18n.language === 'zh' ? '生成整蛊链接' : 'Generate Prank Link')}</span>
        </span>
        
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-400 border-2 border-black rounded-full flex items-center justify-center">
          <span className="text-xs">✨</span>
        </div>
      </motion.button>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full left-1/2 mb-3 px-6 py-3 bg-green-400 border-4 border-black rounded-xl font-bold text-black text-center"
            style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">✅</span>
              <span>{i18n.language === 'zh' ? '复制成功！快去整蛊朋友吧！' : 'Copied! Go prank your friends!'}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ShareButton