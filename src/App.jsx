import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Header from './components/layout/Header'
import CookieBanner from './components/cookies/CookieBanner'
import { initGA4 } from './utils/analyticsManager'
import Home from './pages/Home'
import About from './pages/About'
import Admission from './pages/Admission'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import Settings from './pages/Settings'
import ResetPassword from './pages/ResetPassword'
import Try from './pages/Try'
import AboutProgram from './pages/AboutProgram'
import LoginPage from './pages/LoginPage'
import Resources from './pages/Resources'
import AddVideoResource from './pages/AddVideoResource'
import AddPdfResource from './pages/AddPdfResource'
import Reviews from './pages/Reviews'
import PartnerDetail from './pages/PartnerDetail'
import AvisoLegal from './pages/AvisoLegal'
import PoliticaPrivacidad from './pages/PoliticaPrivacidad'
import PoliticaCookies from './pages/PoliticaCookies'

// Bootstrap GA4 Consent Mode v2 immediately (before any render)
initGA4()

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

/** Redirects users that must reset their password to the forced-reset page */
function ForceResetGuard({ children }) {
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const isOnResetPage = location.pathname === '/reset-password'

  if (user?.mustResetPassword && !isOnResetPage) {
    return <Navigate to="/reset-password?forced=true" replace />
  }
  return children
}

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-white">
          <Header />
          <CookieBanner />
          <main className="pt-24">
            <Routes>
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/" element={<ForceResetGuard><Home /></ForceResetGuard>} />
              <Route path="/about" element={<ForceResetGuard><About /></ForceResetGuard>} />
              <Route path="/admission" element={<ForceResetGuard><Admission /></ForceResetGuard>} />
              <Route path="/blog" element={<ForceResetGuard><Blog /></ForceResetGuard>} />
              <Route path="/blog/events" element={<ForceResetGuard><Blog /></ForceResetGuard>} />
              <Route path="/blog/eventos" element={<ForceResetGuard><Blog /></ForceResetGuard>} />
              <Route path="/blog/:id" element={<ForceResetGuard><BlogPost /></ForceResetGuard>} />
              <Route path="/contact" element={<ForceResetGuard><Contact /></ForceResetGuard>} />
              <Route path="/settings" element={<ForceResetGuard><Settings /></ForceResetGuard>} />
              <Route path="/try" element={<ForceResetGuard><Try /></ForceResetGuard>} />
              <Route path="/about-program" element={<ForceResetGuard><AboutProgram /></ForceResetGuard>} />
              <Route path="/login" element={<ForceResetGuard><LoginPage /></ForceResetGuard>} />
              <Route path="/resources" element={<ForceResetGuard><Resources /></ForceResetGuard>} />
              <Route path="/reviews" element={<ForceResetGuard><Reviews /></ForceResetGuard>} />
              <Route path="/partners/:slug" element={<ForceResetGuard><PartnerDetail /></ForceResetGuard>} />
              <Route path="/resources/add/video" element={<ForceResetGuard><AddVideoResource /></ForceResetGuard>} />
              <Route path="/resources/add/pdf" element={<ForceResetGuard><AddPdfResource /></ForceResetGuard>} />
              <Route path="/aviso-legal" element={<AvisoLegal />} />
              <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
              <Route path="/politica-cookies" element={<PoliticaCookies />} />
              <Route path="*" element={<ForceResetGuard><Home /></ForceResetGuard>} />
            </Routes>
          </main>
        </div>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App
