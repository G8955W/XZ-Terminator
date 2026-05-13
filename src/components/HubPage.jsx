import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

function HubPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const menuItems = [
    {
      id: 'elimination',
      title: t('hub-classic'),
      subtitle: t('hub-classic') === '经典淘汰赛' ? '三选一 · 逐轮对决' : 'Three in one · Round by round',
      icon: '⚔️',
      gradient: 'from-purple-600 to-blue-600',
      path: '/classic/elimination'
    },
    {
      id: 'coin',
      title: t('hub-coin'),
      subtitle: t('hub-coin') === '极速二选一' ? '薛定谔的硬币' : 'Schrödinger\'s Coin',
      icon: '🪙',
      gradient: 'from-yellow-500 to-orange-600',
      path: '/classic/coin'
    },
    {
      id: 'radar',
      title: t('hub-radar'),
      subtitle: t('hub-radar') === '理性天平' ? '雷达图打分决策' : 'Radar chart scoring',
      icon: '⚖️',
      gradient: 'from-green-500 to-teal-600',
      path: '/classic/radar'
    },
    {
      id: 'history',
      title: t('hub-history'),
      subtitle: t('hub-history') === '决断档案馆' ? '历史记录回顾' : 'History records',
      icon: '📜',
      gradient: 'from-pink-500 to-rose-600',
      path: '/classic/history'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-notion-dark flex flex-col items-center justify-center px-4 py-8">
      <Helmet>
        <title>经典模式 - 决策工具中心 - XZ Terminator</title>
        <meta name="description" content="经典模式决策工具中心，包含淘汰赛、命运转盘、直觉探测器等多种经典决策方式。" />
      </Helmet>
      <motion.main
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          {t('app-title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-lg md:text-xl"
        >
          {t('app-title') === '选择终结者' ? '让每一次选择都成为命运的礼物' : 'Make every choice a gift of fate'}
        </motion.p>
      </motion.main>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
      >
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(item.path)}
            className={`relative overflow-hidden rounded-2xl p-6 md:p-8 text-left shadow-xl group`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
            <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-10 transition-opacity" />

            <div className="relative z-10">
              <motion.div
                className="text-4xl md:text-5xl mb-4"
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {item.icon}
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {item.title}
              </h2>
              <p className="text-white/80 text-sm md:text-base">
                {item.subtitle}
              </p>
            </div>

            <motion.div
              className="absolute bottom-4 right-4 text-white/50 group-hover:text-white/80 transition-colors"
              initial={{ x: -10, opacity: 0 }}
              whileHover={{ x: 0, opacity: 1 }}
            >
              →
            </motion.div>
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-500 text-sm">
          {t('app-title') === '选择终结者' ? '选择困难？让我们帮你终结它' : 'Decision paralysis? Let us help you end it'}
        </p>
      </motion.div>

      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.5 }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-notion-accent rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

export default HubPage