import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Home from './components/Home'
import HubPage from './components/HubPage'
import InitialPage from './components/InitialPage'
import EliminationPage from './components/EliminationPage'
import DecisionCirclePage from './components/DecisionCirclePage'
import WheelPage from './components/WheelPage'
import IntuitionPage from './components/IntuitionPage'
import CoinFlipPage from './components/CoinFlipPage'
import RadarPage from './components/RadarPage'
import HistoryPage from './components/HistoryPage'
import TyrantMode from './components/TyrantMode'
import PainTransfer from './components/PainTransfer'
import ToxicityTest from './components/ToxicityTest'
import TextRpgMode from './components/TextRpgMode'
import MysteryBoxMode from './components/MysteryBoxMode'
import ScenarioPage from './components/ScenarioPage'
import BottomAdBanner from './components/BottomAdBanner'
import Footer from './components/Footer'
import LanguageHandler from './components/LanguageHandler'

function App() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh'
    i18n.changeLanguage(newLang)
  }

  return (
    <Router>
      <div className="min-h-screen bg-notion-dark text-notion-text flex flex-col">
        <LanguageHandler />
        <button
          onClick={toggleLanguage}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-notion-gray/80 backdrop-blur-sm border border-notion-light/50 rounded-lg text-sm font-medium text-notion-text hover:bg-notion-light transition-colors shadow-lg"
        >
          {i18n.language === 'zh' ? 'EN' : '中文'}
        </button>
        
        <div className="flex-1 pb-20 md:pb-28">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/classic" element={<HubPage />} />
            <Route path="/classic/elimination" element={<InitialPage />} />
            <Route path="/classic/elimination/game" element={<EliminationPage />} />
            <Route path="/classic/elimination/decision" element={<DecisionCirclePage />} />
            <Route path="/classic/elimination/wheel" element={<WheelPage />} />
            <Route path="/classic/elimination/intuition" element={<IntuitionPage />} />
            <Route path="/classic/coin" element={<CoinFlipPage />} />
            <Route path="/classic/radar" element={<RadarPage />} />
            <Route path="/classic/history" element={<HistoryPage />} />

            <Route path="/tyrant" element={<TyrantMode />} />
            <Route path="/pain-transfer" element={<PainTransfer />} />
            <Route path="/toxicity" element={<ToxicityTest />} />
            <Route path="/text-rpg" element={<TextRpgMode />} />
            <Route path="/mystery-box" element={<MysteryBoxMode />} />

            <Route path="/what-to-eat" element={<ScenarioPage />} />
            <Route path="/truth-or-dare" element={<ScenarioPage />} />
            <Route path="/who-pays" element={<ScenarioPage />} />
            <Route path="/coin-flip" element={<ScenarioPage />} />

            <Route path="/coin" element={<CoinFlipPage />} />
            <Route path="/radar" element={<RadarPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
          <BottomAdBanner />
        </div>
        
        <Footer />
      </div>
    </Router>
  )
}

export default App