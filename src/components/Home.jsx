import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const modes = [
    {
      id: 'classic',
      title: t('home-classic'),
      subtitle: 'Elimination · Wheel · Intuition',
      icon: '⚔️',
      gradient: 'from-purple-600 to-blue-600',
      path: '/classic',
      description: t('home-classic-desc')
    },
    {
      id: 'tyrant',
      title: t('home-tyrant'),
      subtitle: 'Burn · Irreversible',
      icon: '👑',
      gradient: 'from-red-600 to-rose-800',
      path: '/tyrant',
      description: t('home-tyrant-desc')
    },
    {
      id: 'pain-transfer',
      title: t('home-pain-transfer'),
      subtitle: 'Social · Delegate',
      icon: '🎯',
      gradient: 'from-yellow-500 to-orange-600',
      path: '/pain-transfer',
      description: t('home-pain-transfer-desc')
    },
    {
      id: 'toxicity',
      title: t('home-toxicity'),
      subtitle: 'Reverse · Elimination',
      icon: '☠️',
      gradient: 'from-green-600 to-emerald-800',
      path: '/toxicity',
      description: t('home-toxicity-desc')
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40, rotateX: -15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100
      }
    }
  }

  return (
    <div className="min-h-screen bg-notion-dark text-notion-text overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center min-h-screen px-4 py-12"
      >
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', damping: 10 }}
          className="text-center mb-16"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              textShadow: [
                '0 0 20px rgba(139, 92, 246, 0.5)',
                '0 0 40px rgba(236, 72, 153, 0.5)',
                '0 0 20px rgba(139, 92, 246, 0.5)'
              ]
            }}
            transition={{ 
              backgroundPosition: { duration: 4, repeat: Infinity },
              textShadow: { duration: 2, repeat: Infinity }
            }}
          >
            {t('app-title')}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto"
          >
            {t('app-title') === '选择终结者' ? '当命运需要被审判，让心理学为你做出最终裁决' : 'When fate demands judgment, let psychology make the final decision for you'}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 h-1 w-48 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full"
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl"
        >
          {modes.map((mode) => (
            <motion.button
              key={mode.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.03, 
                y: -8,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(mode.path)}
              className="relative overflow-hidden rounded-3xl p-8 text-left group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
              
              <div className="relative z-10">
                <motion.div
                  className="text-5xl md:text-6xl mb-4"
                  whileHover={{ 
                    rotate: [0, -10, 10, -5, 5, 0],
                    scale: 1.1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {mode.icon}
                </motion.div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {mode.title}
                </h2>
                
                <p className="text-white/80 text-sm md:text-base mb-3 font-medium">
                  {mode.subtitle}
                </p>
                
                <p className="text-white/60 text-sm">
                  {mode.description}
                </p>
              </div>

              <motion.div
                className="absolute bottom-4 right-4 text-white/50 group-hover:text-white/90 transition-colors duration-300"
                whileHover={{ x: 5 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.div>

              <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-500"
              />
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 text-sm">
            {t('app-title') === '选择终结者' ? '每一种模式都基于心理学原理设计，帮助你突破选择困境' : 'Each mode is designed based on psychological principles to help you break through decision dilemmas'}
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.5 }}
      >
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut'
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

export default Home