import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import WheelPage from './WheelPage'
import CoinFlipPage from './CoinFlipPage'
import { getScenarioById } from '../constants/scenarios'

function ScenarioPage() {
  const { i18n } = useTranslation()
  const pathSegments = window.location.pathname.split('/').filter(Boolean)
  const scenarioId = pathSegments[pathSegments.length - 1]
  const scenario = getScenarioById(scenarioId)

  if (!scenario) {
    return (
      <div className="min-h-screen bg-notion-dark text-notion-text flex items-center justify-center">
        <h1 className="text-2xl">Scenario not found</h1>
      </div>
    )
  }

  const lang = i18n.language
  const title = scenario.seoTitle[lang]
  const description = scenario.description[lang]

  const renderComponent = () => {
    switch (scenario.component) {
      case 'wheel':
        return <WheelPage presetOptions={scenario.presetOptions[lang]} scenario={scenario} />
      case 'coin':
        return <CoinFlipPage presetOptions={scenario.presetOptions[lang]} scenario={scenario} />
      default:
        return <WheelPage presetOptions={scenario.presetOptions[lang]} scenario={scenario} />
    }
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Helmet>
      {renderComponent()}
    </>
  )
}

export default ScenarioPage