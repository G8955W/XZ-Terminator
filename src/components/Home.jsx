import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

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
      <Helmet>
        <title>选择终结者 - 告别选择困难症 - XZ Terminator</title>
        <meta name="description" content="选择终结者是一款帮助你做出艰难决策的工具集，包含命运转盘、抛硬币、理性天平、直觉测试等多种决策方式。" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "选择终结者",
              "description": "一款帮助你做出艰难决策的工具集，通过多种心理学原理设计的决策方式，帮助用户突破选择困境",
              "url": "https://yourdomain.com",
              "applicationCategory": "Utility",
              "features": [
                "命运转盘 - 随机选择工具，独特的反悔机制帮助确认内心真实想法",
                "抛硬币 - 经典的随机决策方式，快速做出二选一决定",
                "理性天平 - 加权评分系统，基于因素权重做出理性决策",
                "直觉探测器 - 通过身体反应测试，发现内心真实偏好",
                "暴君模式 - 强制选择机制，帮助克服选择拖延",
                "毒性测试 - 通过两两对比，淘汰最不可接受的选项"
              ],
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "CNY"
              }
            }
          `}
        </script>
      </Helmet>
      <motion.main
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

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="w-full max-w-4xl mb-16"
        >
          <div className="bg-gradient-to-br from-notion-gray/50 to-notion-dark/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-notion-light/20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="text-4xl">🎯</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {t('app-title') === '选择终结者' ? '关于选择终结者' : 'About XZ Terminator'}
              </h2>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-gray-300 text-base md:text-lg leading-relaxed mb-6"
            >
              {t('app-title') === '选择终结者' 
                ? '在这个信息爆炸的时代，我们每天都面临着无数的选择。从早餐吃什么，到职业发展方向，每一个决定都可能引发焦虑和拖延。选择困难症不再是个别现象，而是现代社会普遍存在的心理挑战。' 
                : 'In this era of information explosion, we face countless choices every day. From what to eat for breakfast to career development directions, every decision can trigger anxiety and procrastination. Decision paralysis is no longer an individual phenomenon but a prevalent psychological challenge in modern society.'}
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="text-gray-300 text-base md:text-lg leading-relaxed mb-6"
            >
              {t('app-title') === '选择终结者' 
                ? 'XZ-Terminator 选择终结者应运而生。我们相信，每一个艰难的选择背后，都隐藏着内心真实的渴望。通过融合心理学原理与现代科技，我们打造了一套完整的决策辅助工具矩阵。无论是命运转盘的随机性、抛硬币的二元抉择，还是理性天平的加权分析，每一种工具都经过精心设计，帮助你突破思维瓶颈，找到内心的答案。' 
                : 'XZ-Terminator was born to address this. We believe that behind every difficult choice lies a true inner desire. By integrating psychological principles with modern technology, we have created a comprehensive matrix of decision-making tools. From the randomness of the Wheel of Fortune to the binary choice of coin flipping, and the weighted analysis of the Rational Scale, each tool is carefully designed to help you break through mental bottlenecks and find your inner answer.'}
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="text-gray-300 text-base md:text-lg leading-relaxed"
            >
              {t('app-title') === '选择终结者' 
                ? '我们的使命是帮助每一位用户告别选择焦虑，让决策变得轻松而有趣。无论你是面临人生重大抉择，还是只是想为晚餐吃什么找个借口，选择终结者都将是你最可靠的决策伙伴。让每一次选择，都成为命运的礼物。' 
                : 'Our mission is to help every user say goodbye to decision anxiety and make decision-making easy and fun. Whether you are facing a major life decision or just looking for an excuse for dinner, XZ-Terminator will be your most reliable decision-making partner. Let every choice become a gift of fate.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { icon: '🧠', label: '科学决策', desc: '心理学原理' },
                { icon: '⚡', label: '高效便捷', desc: '一键操作' },
                { icon: '🔒', label: '隐私保护', desc: '本地存储' },
                { icon: '🌐', label: '多语言', desc: '全球服务' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6 + index * 0.1 }}
                  className="text-center p-4 bg-notion-dark/50 rounded-2xl border border-notion-light/10"
                >
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <div className="text-white font-semibold text-sm">{feature.label}</div>
                  <div className="text-gray-500 text-xs mt-1">{feature.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

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

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="w-full max-w-3xl mt-16"
        >
          <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 shadow-xl shadow-indigo-100/50 border border-indigo-100">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="text-4xl">🧠</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {t('home-science-title')}
              </h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="space-y-4 text-gray-600 text-base md:text-lg leading-relaxed"
            >
              <p>
                {t('home-science-buridan-desc')}
              </p>
              
              <p>
                {t('home-science-paradox-desc')}
              </p>
              
              <p>
                {t('home-science-cognitive-desc')}
              </p>
              
              <p className="pt-4 border-t border-indigo-200 text-gray-700 font-medium">
                {t('home-science-mission-desc')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
              {[
                { term: t('home-science-buridan'), desc: t('home-science-tag-1') },
                { term: t('home-science-paradox'), desc: t('home-science-tag-2') },
                { term: t('home-science-cognitive'), desc: t('home-science-tag-3') }
              ].map((item, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-white/80 rounded-full shadow-sm border border-indigo-200"
                >
                  <span className="text-sm font-semibold text-indigo-700">{item.term}</span>
                  <span className="text-xs text-gray-500 ml-2">({item.desc})</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      </motion.main>

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