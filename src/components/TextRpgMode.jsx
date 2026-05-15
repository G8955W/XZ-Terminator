import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from './Navigation'
import { Helmet } from 'react-helmet-async'
import ShareButton from './ShareButton'

const STORY_TEMPLATES = {
  zh: [
    {
      title: '🔮 水晶球预言',
      template: '老巫师凝视着水晶球，迷雾渐渐散去。他摇了摇头，排除了【{eliminated}】的可能。随后他大喊一声：命运的指引是——【{winner}】！'
    },
    {
      title: '☢️ 废土补给箱',
      template: '你在辐射区搜寻了三天三夜，终于撬开了一个旧世界补给箱。你以为里面会有【{eliminated}】，但命运的齿轮开始转动，静静躺在里面的居然是最高指令：【{winner}】！'
    },
    {
      title: '🏛️ 古罗马斗兽场',
      template: '狮子已经饿了七天，驯兽师的哨声响起。你必须选择你的命运！狮子扑向【{eliminated}】的瞬间，角斗士的剑指向了——【{winner}】！'
    },
    {
      title: '🚀 星际联邦投票',
      template: '银河议会厅内，各星系代表争执不下。经过七七四十九小时的辩论，AI仲裁官终于宣布：经过量子随机算法分析，符合全宇宙利益的答案是——【{winner}】！'
    },
    {
      title: '🎰 拉斯维加斯老虎机',
      template: '霓虹闪烁，筹码飞舞。你深吸一口气，拉下拉杆。符号开始旋转...停止！三个【{winner}】！庄家瞪大了眼睛，而你微微一笑：命运已经做出了选择！'
    }
  ],
  en: [
    {
      title: '🔮 Crystal Ball Prophecy',
      template: 'The old wizard stared into the crystal ball as the mist gradually cleared. He shook his head, eliminating 【{eliminated}】. Then he shouted: The guidance of fate is—【{winner}】!'
    },
    {
      title: '☢️ Wasteland Supply Crate',
      template: 'After three days and nights searching the radiation zone, you finally pried open an old world supply crate. You thought there would be 【{eliminated}】 inside, but the gears of fate began to turn, and what quietly lay inside was the highest directive: 【{winner}】!'
    },
    {
      title: '🏛️ Roman Colosseum',
      template: 'The lion had been hungry for seven days. As the trainer\'s whistle sounded, you must choose your fate! As the lion pounced toward 【{eliminated}】, the gladiator\'s sword pointed to—【{winner}】!'
    },
    {
      title: '🚀 Galactic Federation Vote',
      template: 'Representatives from various galaxies argued endlessly in the galactic council chamber. After 49 hours of debate, the AI arbitrator finally announced: Through quantum random algorithm analysis, the answer that serves the interests of the entire universe is—【{winner}】!'
    },
    {
      title: '🎰 Las Vegas Slot Machine',
      template: 'Neon lights flickered, chips flying. You took a deep breath and pulled the lever. The symbols began to spin... Stop! Three 【{winner}】s! The dealer\'s eyes widened as you smiled slightly: Fate has made its choice!'
    }
  ]
}

function TextRpgMode() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t, i18n } = useTranslation()
  const [mode, setMode] = useState('input')
  const [options, setOptions] = useState(['', ''])
  const [optionCount, setOptionCount] = useState(2)
  const [winner, setWinner] = useState(null)
  const [eliminated, setEliminated] = useState([])
  const [displayedText, setDisplayedText] = useState('')
  const [currentTemplate, setCurrentTemplate] = useState(null)
  const [storyPhase, setStoryPhase] = useState('intro')
  const [autoPlayTriggered, setAutoPlayTriggered] = useState(false)

  const templates = STORY_TEMPLATES[i18n.language] || STORY_TEMPLATES.zh

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, ''])
      setOptionCount(optionCount + 1)
    }
  }

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
      setOptionCount(optionCount - 1)
    }
  }

  const handleStartStory = () => {
    const validOptions = options.filter(opt => opt.trim() !== '')
    if (validOptions.length < 2) return

    const winnerIndex = Math.floor(Math.random() * validOptions.length)
    const winnerOption = validOptions[winnerIndex]
    const eliminatedOptions = validOptions.filter((_, i) => i !== winnerIndex)

    setWinner(winnerOption)
    setEliminated(eliminatedOptions.join('、'))

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
    setCurrentTemplate(randomTemplate)

    setMode('story')
    setStoryPhase('intro')
    setDisplayedText('')
  }

  const typeWriter = useCallback((text, callback) => {
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1))
        index++
      } else {
        clearInterval(interval)
        if (callback) callback()
      }
    }, 50)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (mode === 'story' && currentTemplate && storyPhase === 'intro') {
      const fullText = currentTemplate.template
        .replace('{winner}', winner)
        .replace('{eliminated}', eliminated)

      const timer = setTimeout(() => {
        typeWriter(fullText, () => {
          setStoryPhase('reveal')
        })
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [mode, currentTemplate, storyPhase, winner, eliminated, typeWriter])

  const handleRestart = () => {
    setMode('input')
    setOptions(['', ''])
    setOptionCount(2)
    setWinner(null)
    setEliminated([])
    setDisplayedText('')
    setCurrentTemplate(null)
    setStoryPhase('intro')
    setAutoPlayTriggered(false)
  }

  // 从URL参数读取选项并自动播放
  useEffect(() => {
    const optionsParam = searchParams.get('options')
    const autoPlay = searchParams.get('autoPlay') === 'true'
    
    if (optionsParam) {
      try {
        const decodedOptions = decodeURIComponent(optionsParam).split(',').filter(opt => opt.trim())
        if (decodedOptions.length >= 2) {
          setOptions(decodedOptions)
          setOptionCount(decodedOptions.length)
          
          if (autoPlay && !autoPlayTriggered) {
            setTimeout(() => {
              handleStartStory()
              setAutoPlayTriggered(true)
            }, 1000)
          }
        }
      } catch (e) {
        console.error('Failed to parse options:', e)
      }
    }
  }, [searchParams, autoPlayTriggered])

  const validOptionsCount = options.filter(opt => opt.trim() !== '').length

  if (mode === 'story') {
    return (
      <div className="min-h-screen bg-[#f5e6c8] text-notion-text">
        <Helmet>
          <title>文字冒险 - 命运裁决 - XZ Terminator</title>
        </Helmet>
        <Navigation title={t('text-rpg-title')} />

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 py-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl"
          >
            <div className="relative bg-[#fff8dc] border-4 border-black rounded-lg p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="absolute -top-4 left-4 bg-yellow-300 border-4 border-black rounded-full px-4 py-1">
                <span className="text-xl">📜</span>
              </div>

              <div className="absolute top-2 right-4 flex gap-2">
                <span className="text-2xl">✏️</span>
                <span className="text-2xl">🗑️</span>
              </div>

              <div className="mt-6 mb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-black border-b-4 border-black pb-2 mb-4">
                  {currentTemplate?.title}
                </h2>
              </div>

              <div className="min-h-[120px] md:min-h-[80px] mb-6">
                <p className="text-lg md:text-xl leading-relaxed text-black font-medium">
                  {displayedText}
                  {storyPhase !== 'reveal' && (
                    <span className="inline-block w-3 h-6 bg-black ml-1 animate-pulse" />
                  )}
                </p>
              </div>

              {storyPhase === 'reveal' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="bg-gradient-to-br from-yellow-200 to-yellow-400 border-4 border-black rounded-xl p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <p className="text-sm md:text-base text-black mb-2 font-bold">
                    {i18n.language === 'zh' ? '✨ 天命之选 ✨' : '✨ Heaven\'s Choice ✨'}
                  </p>
                  <p className="text-2xl md:text-4xl font-black text-red-700">
                    {winner}
                  </p>
                </motion.div>
              )}

              {storyPhase === 'reveal' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRestart}
                    className="px-6 py-3 bg-white border-4 border-black rounded-xl font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-100 transition-colors"
                  >
                    {i18n.language === 'zh' ? '🔄 再来一次' : '🔄 Try Again'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-blue-400 border-4 border-black rounded-xl font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-300 transition-colors"
                  >
                    {i18n.language === 'zh' ? '🏠 返回主页' : '🏠 Back to Menu'}
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-8 text-6xl"
          >
            🎲
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#87ceeb] text-notion-text">
      <Helmet>
        <title>文字冒险 - 剧情选择 - XZ Terminator</title>
        <meta name="description" content="文字冒险剧情风格随机决策模式，让命运为你做出选择。" />
      </Helmet>
      <Navigation title={t('text-rpg-title')} />

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="bg-[#fff8dc] border-4 border-black rounded-2xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-center mb-6">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                📖
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-black text-black border-b-4 border-black pb-2">
                {t('text-rpg-input-title')}
              </h2>
              <p className="text-gray-700 mt-2 font-medium">
                {t('text-rpg-input-desc')}
              </p>
            </div>

            <div className="space-y-4">
              {[...Array(optionCount)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={options[index] || ''}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`${t('text-rpg-option')} ${index + 1}`}
                    className="flex-1 bg-white border-4 border-black rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                  {optionCount > 2 && (
                    <button
                      onClick={() => handleRemoveOption(index)}
                      className="px-3 bg-red-400 border-4 border-black rounded-xl font-bold text-white hover:bg-red-300 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      ✕
                    </button>
                  )}
                </motion.div>
              ))}

              {optionCount < 4 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddOption}
                  className="w-full py-3 bg-white border-4 border-dashed border-black rounded-xl text-black font-bold hover:border-yellow-400 hover:bg-yellow-50 transition-colors"
                >
                  + {t('text-rpg-add-option')}
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartStory}
                disabled={validOptionsCount < 2}
                className={`w-full py-4 bg-yellow-400 border-4 border-black rounded-xl font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  validOptionsCount < 2
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-yellow-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                🎭 {t('text-rpg-enter-story')}
              </motion.button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
              >
                <ShareButton options={options} autoPlay={true} />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-blue-200 border-4 border-black rounded-xl"
            >
              <p className="text-black text-sm text-center font-medium">
                💡 {t('text-rpg-hint')}
              </p>
            </motion.div>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <span className="text-4xl">⚔️</span>
            <span className="text-4xl">🛡️</span>
            <span className="text-4xl">💎</span>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default TextRpgMode