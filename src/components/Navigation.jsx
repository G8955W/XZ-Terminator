import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

function Navigation({ title, showBack = true }) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 h-14 bg-notion-dark/95 backdrop-blur-sm border-b border-notion-gray z-40"
    >
      <div className="h-full max-w-4xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
              <span className="text-sm">{t('back')}</span>
            </motion.button>
          )}
        </div>
        
        {title && (
          <h1 className="text-lg font-semibold text-white">
            {title}
          </h1>
        )}
        
        <div className="w-16" />
      </div>
    </motion.nav>
  )
}

export default Navigation