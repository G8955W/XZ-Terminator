import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

function LanguageHandler() {
  const { i18n } = useTranslation()

  useEffect(() => {
    // 更新 HTML 的 lang 属性
    const updateLangAttribute = () => {
      const lang = i18n.language === 'zh' ? 'zh-CN' : 'en'
      document.documentElement.lang = lang
    }

    // 初始化设置
    updateLangAttribute()

    // 监听语言变化
    i18n.on('languageChanged', updateLangAttribute)

    // 清理函数：移除监听器
    return () => {
      i18n.off('languageChanged', updateLangAttribute)
    }
  }, [i18n])

  // 动态设置页面标题和 meta 信息
  const getPageTitle = () => {
    if (i18n.language === 'zh') {
      return '选择终结者 - 告别选择困难症 | XZ Terminator'
    }
    return 'Decision Terminator - Overcome Decision Paralysis | XZ Terminator'
  }

  const getMetaDescription = () => {
    if (i18n.language === 'zh') {
      return '选择终结者是一款专业的决策辅助工具集，包含命运转盘、抛硬币、理性天平、直觉测试、暴君模式等多种决策方式，帮助你突破选择困难症，轻松做出艰难决策。'
    }
    return 'Decision Terminator is a professional decision-making toolset featuring Wheel of Destiny, Coin Flip, Rational Balance, Intuition Test, Tyrant Mode and more to help you overcome decision paralysis.'
  }

  const getMetaKeywords = () => {
    if (i18n.language === 'zh') {
      return '选择困难症,决策工具,随机选择,命运转盘,抛硬币,决策辅助,心理测试,选择终结者,XZ Terminator'
    }
    return 'decision paralysis,decision making tool,random choice,wheel of fortune,coin flip,decision aid,psychological test,Decision Terminator,XZ Terminator'
  }

  const getOgTitle = () => {
    if (i18n.language === 'zh') {
      return '选择终结者 - 告别选择困难症'
    }
    return 'Decision Terminator - Overcome Decision Paralysis'
  }

  const getOgDescription = () => {
    if (i18n.language === 'zh') {
      return '专业的决策辅助工具集，帮助你突破选择困境'
    }
    return 'Professional decision-making tools to help you overcome decision paralysis'
  }

  return (
    <Helmet>
      <html lang={i18n.language === 'zh' ? 'zh-CN' : 'en'} />
      <title>{getPageTitle()}</title>
      <meta name="description" content={getMetaDescription()} />
      <meta name="keywords" content={getMetaKeywords()} />
      <meta property="og:title" content={getOgTitle()} />
      <meta property="og:description" content={getOgDescription()} />
      <meta property="twitter:title" content={getOgTitle()} />
      <meta property="twitter:description" content={getOgDescription()} />
    </Helmet>
  )
}

export default LanguageHandler