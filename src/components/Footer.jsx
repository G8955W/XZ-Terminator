import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

function Footer() {
  const { t } = useTranslation()

  const currentYear = new Date().getFullYear()

  const features = [
    { name: t('wheel-title') || '命运转盘', path: '/classic/elimination/wheel' },
    { name: t('coin-title') || '抛硬币', path: '/coin' },
    { name: t('radar-title') || '理性天平', path: '/radar' },
    { name: t('intuition-title') || '直觉探测', path: '/classic/elimination/intuition' },
    { name: t('tyrant-title') || '暴君模式', path: '/tyrant' },
    { name: t('history-title') || '决断档案', path: '/history' },
  ]

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-notion-dark border-t border-notion-gray/50 py-12 mt-auto"
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
            >
              {t('app-title') || '选择终结者'}
            </motion.h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('app-title') === '选择终结者' 
                ? '专业的决策辅助工具集，帮助你突破选择困难症，轻松做出艰难决策。' 
                : 'A professional decision-making toolset to help you overcome decision paralysis.'}
            </p>
          </div>

          <div>
            <motion.h4
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white font-semibold mb-4"
            >
              {t('app-title') === '选择终结者' ? '决策工具' : 'Tools'}
            </motion.h4>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <motion.li
                  key={feature.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <a
                    href={feature.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {feature.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <motion.h4
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white font-semibold mb-4"
            >
              {t('app-title') === '选择终结者' ? '关于我们' : 'About'}
            </motion.h4>
            <ul className="space-y-2">
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('app-title') === '选择终结者' ? '使用指南' : 'Guide'}
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('app-title') === '选择终结者' ? '隐私政策' : 'Privacy'}
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('app-title') === '选择终结者' ? '联系我们' : 'Contact'}
                </a>
              </motion.li>
            </ul>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t border-notion-gray/30 pt-8 text-center"
        >
          <p className="text-gray-500 text-sm">
            © {currentYear} {t('app-title') || '选择终结者'} | {t('app-title') === '选择终结者' ? '让每一次选择都成为命运的礼物' : 'Make every choice a gift of fate'}
          </p>
          <p className="text-gray-600 text-xs mt-2">
            {t('app-title') === '选择终结者' ? '基于心理学原理设计，帮助你突破选择困境' : 'Designed based on psychological principles'}
          </p>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer