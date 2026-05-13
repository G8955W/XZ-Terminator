import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from './Navigation'


function RadarChart({ data, size = 300, criteria }) {
  const centerX = size / 2
  const centerY = size / 2
  const radius = size / 2 - 40
  const levels = 5
  const categories = criteria || Object.keys(data[0] || {}).filter(k => k !== 'name')
  const angleStep = (2 * Math.PI) / categories.length

  const getPoint = (value, index) => {
    const angle = index * angleStep - Math.PI / 2
    const r = (value / 10) * radius
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    }
  }

  return (
    <svg width={size} height={size} className="mx-auto">
      {[...Array(levels)].map((_, level) => {
        const r = (radius / levels) * (level + 1)
        return (
          <circle
            key={level}
            cx={centerX}
            cy={centerY}
            r={r}
            fill="none"
            stroke="#373c3f"
            strokeWidth="1"
          />
        )
      })}
      
      {categories.map((_, index) => {
        const angle = index * angleStep - Math.PI / 2
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)
        return (
          <line
            key={index}
            x1={centerX}
            y1={centerY}
            x2={x}
            y2={y}
            stroke="#373c3f"
            strokeWidth="1"
          />
        )
      })}

      {categories.map((cat, index) => {
        const angle = index * angleStep - Math.PI / 2
        const x = centerX + (radius + 25) * Math.cos(angle)
        const y = centerY + (radius + 25) * Math.sin(angle)
        return (
          <text
            key={cat}
            x={x}
            y={y}
            fill="#9ca3af"
            fontSize="12"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {cat}
          </text>
        )
      })}

      {data.map((item, dataIndex) => {
        const colors = ['#8B5CF6', '#3B82F6', '#10B981']
        const points = categories.map((cat, catIndex) => {
          const point = getPoint(item[cat], catIndex)
          return `${catIndex === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
        }).join(' ') + ' Z'

        return (
          <motion.path
            key={dataIndex}
            d={points}
            fill={colors[dataIndex % colors.length]}
            fillOpacity={0.3}
            stroke={colors[dataIndex % colors.length]}
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: dataIndex * 0.2, duration: 0.5 }}
          />
        )
      })}

      {data.map((item, dataIndex) => {
        const colors = ['#8B5CF6', '#3B82F6', '#10B981']
        return categories.map((cat, catIndex) => {
          const point = getPoint(item[cat], catIndex)
          return (
            <motion.circle
              key={`${dataIndex}-${catIndex}`}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={colors[dataIndex % colors.length]}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: dataIndex * 0.2 + catIndex * 0.05 }}
            />
          )
        })
      })}
    </svg>
  )
}

function RadarPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [phase, setPhase] = useState('input')
  const [options, setOptions] = useState(['', '', ''])
  const [criteria, setCriteria] = useState([
    t('radar-dimension-importance'),
    t('radar-dimension-feasibility'),
    t('radar-dimension-cost'),
    t('radar-dimension-time'),
    t('radar-dimension-satisfaction')
  ])
  const [scores, setScores] = useState({})
  const [currentOptionIndex, setCurrentOptionIndex] = useState(0)
  const [currentCriteriaIndex, setCurrentCriteriaIndex] = useState(0)
  const [results, setResults] = useState([])
  const [winner, setWinner] = useState(null)

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const isValid = options.every(opt => opt.trim() !== '')

  const startScoring = () => {
    if (!isValid) return
    setPhase('scoring')
    const initialScores = {}
    options.forEach(opt => {
      initialScores[opt] = {}
      criteria.forEach(c => {
        initialScores[opt][c] = 5
      })
    })
    setScores(initialScores)
  }

  const handleScoreChange = (value) => {
    const option = options[currentOptionIndex]
    const criterion = criteria[currentCriteriaIndex]
    setScores(prev => ({
      ...prev,
      [option]: {
        ...prev[option],
        [criterion]: value
      }
    }))
  }

  const nextScore = () => {
    if (currentCriteriaIndex < criteria.length - 1) {
      setCurrentCriteriaIndex(prev => prev + 1)
    } else if (currentOptionIndex < options.length - 1) {
      setCurrentOptionIndex(prev => prev + 1)
      setCurrentCriteriaIndex(0)
    } else {
      calculateResults()
    }
  }

  const calculateResults = () => {
    const resultsData = options.map(opt => {
      const total = criteria.reduce((sum, c) => sum + scores[opt][c], 0)
      return {
        name: opt,
        total,
        ...scores[opt]
      }
    }).sort((a, b) => b.total - a.total)

    setResults(resultsData)
    setWinner(resultsData[0].name)
    setPhase('result')
    saveToHistory(resultsData[0].name, resultsData)
  }

  const saveToHistory = (winner, data) => {
    const history = JSON.parse(localStorage.getItem('decisionHistory') || '[]')
    history.unshift({
      id: Date.now(),
      type: 'radar',
      options: options,
      winner: winner,
      scores: data,
      timestamp: new Date().toISOString()
    })
    localStorage.setItem('decisionHistory', JSON.stringify(history.slice(0, 50)))
  }

  const handleRestart = () => {
    setOptions(['', '', ''])
    setScores({})
    setResults([])
    setWinner(null)
    setCurrentOptionIndex(0)
    setCurrentCriteriaIndex(0)
    setPhase('input')
  }

  const totalSteps = options.length * criteria.length
  const currentStep = currentOptionIndex * criteria.length + currentCriteriaIndex + 1

  return (
    <div className="min-h-screen bg-notion-dark text-notion-text">
      <Navigation title={t('radar-title')} />
      
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 py-8">
        <AnimatePresence mode="wait">
          {phase === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="text-6xl mb-4"
                >
                  ⚖️
                </motion.div>
                <h2 className="text-3xl font-bold mb-2 text-notion-accent">
                  {t('radar-title')}
                </h2>
                <p className="text-gray-400">
                  {t('radar-title') === '理性天平' ? '用理性分析帮你做出最优选择' : 'Use rational analysis to make the best choice'}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-notion-accent font-semibold min-w-[1.5rem]">
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`选项 ${index + 1}`}
                      className="flex-1 bg-notion-gray border border-notion-light rounded-lg px-4 py-3 text-notion-text placeholder-gray-500 focus:outline-none focus:border-notion-accent transition-colors"
                    />
                  </motion.div>
                ))}
              </div>

              <div className="bg-notion-gray rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-400 mb-2">
                  {t('radar-title') === '理性天平' ? '评分维度：' : 'Scoring Dimensions:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {criteria.map((c, i) => (
                    <span key={i} className="px-3 py-1 bg-notion-dark rounded-full text-sm text-gray-300">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startScoring}
                disabled={!isValid}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  isValid
                    ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white hover:shadow-xl'
                    : 'bg-notion-gray text-gray-500 cursor-not-allowed'
                }`}
              >
                {t('radar-calculate')}
              </motion.button>
            </motion.div>
          )}

          {phase === 'scoring' && (
            <motion.div
              key="scoring"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md"
            >
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>{t('radar-title') === '理性天平' ? '进度' : 'Progress'}</span>
                  <span>{currentStep} / {totalSteps}</span>
                </div>
                <div className="h-2 bg-notion-gray rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-teal-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-notion-gray rounded-2xl p-6 mb-6">
                <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm mb-2">
                    {t('radar-title') === '理性天平' ? '正在评估' : 'Evaluating'}
                  </p>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {options[currentOptionIndex]}
                  </h3>
                  <p className="text-notion-accent">
                    {criteria[currentCriteriaIndex]}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="text-gray-400">1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scores[options[currentOptionIndex]]?.[criteria[currentCriteriaIndex]] || 5}
                    onChange={(e) => handleScoreChange(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-notion-dark rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <span className="text-gray-400">10</span>
                </div>

                <div className="text-center">
                  <motion.div
                    key={scores[options[currentOptionIndex]]?.[criteria[currentCriteriaIndex]] || 5}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-5xl font-bold text-green-400"
                  >
                    {scores[options[currentOptionIndex]]?.[criteria[currentCriteriaIndex]] || 5}
                  </motion.div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextScore}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
              >
                {currentStep === totalSteps ? '查看结果' : '下一个'}
              </motion.button>
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="text-6xl mb-4"
                >
                  🏆
                </motion.div>
                <h2 className="text-3xl font-bold mb-2 text-notion-accent">
                  {t('radar-title') === '理性天平' ? '分析结果' : 'Analysis Result'}
                </h2>
              </div>

              <div className="bg-notion-gray rounded-2xl p-6 mb-6">
                <RadarChart data={results} size={280} />
              </div>

              <div className="space-y-3 mb-6">
                {results.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      index === 0 
                        ? 'bg-gradient-to-r from-green-600 to-teal-600' 
                        : 'bg-notion-gray'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                      <span className="font-semibold">{item.name}</span>
                    </div>
                    <span className="text-xl font-bold">{item.total}{t('radar-title') === '理性天平' ? '分' : ' pts'}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-center mb-6"
              >
                <p className="text-gray-200 mb-2">{t('radar-title') === '理性天平' ? '推荐选择' : 'Recommended Choice'}</p>
                <p className="text-2xl font-bold text-white">{winner}</p>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRestart}
                className="w-full py-4 bg-notion-gray text-white rounded-xl font-semibold hover:bg-notion-light transition-colors"
              >
                {t('radar-title') === '理性天平' ? '再来一次' : 'Try Again'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default RadarPage