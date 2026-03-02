import { useNavigate } from 'react-router-dom'
import Login from '../components/layout/Login'
import SignUp from '../components/layout/SignUp'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Leaf, BookOpen, Users, Trophy, Globe } from 'lucide-react'

const PERKS = [
  { icon: BookOpen, text: 'Access curated soil-science articles & resources' },
  { icon: Users,    text: 'Join a community of researchers and students'     },
  { icon: Trophy,   text: 'Compete in quizzes and climb the leaderboard'     },
  { icon: Globe,    text: 'Explore the global MEDSOILS Challenge programme'  },
]

export default function LoginPage() {
  const navigate  = useNavigate()
  const [showSignUp, setShowSignUp] = useState(false)
  const handleClose = () => navigate(-1)

  return (
    <div className="min-h-screen flex">

      {/* ─── Left branding panel (lg+) ─── */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #ea580c 0%, #f97316 45%, #fbbf24 100%)' }}
      >
        {/* subtle grid */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="auth-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
        {/* glow blobs */}
        <div className="absolute -top-28 -left-28 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -right-28 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        {/* logo */}
        <div className="relative z-10">
          <button onClick={() => navigate('/')} className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm ring-1 ring-white/30 group-hover:bg-white/30 transition">
              <Leaf size={22} className="text-white" />
            </div>
            <span className="text-white font-extrabold text-3xl tracking-tight">MedSoils</span>
          </button>
        </div>

        {/* headline + perks */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-5xl font-extrabold text-white leading-tight mb-4">
              Advancing soil<br />science together.
            </h2>
            <p className="text-orange-100 text-lg leading-relaxed max-w-md">
              The platform built for the MEDSOILS Challenge community — researchers, educators and students.
            </p>
          </div>
          <ul className="space-y-3.5">
            {PERKS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0 backdrop-blur-sm ring-1 ring-white/20">
                  <Icon size={18} className="text-white" />
                </div>
                <span className="text-white/95 text-base">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* footnote */}
        <p className="relative z-10 text-orange-100/60 text-xs">
          © {new Date().getFullYear()} MEDSOILS Challenge · IUSS
        </p>
      </div>

      {/* ─── Right form panel ─── */}
      <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">

        {/* top bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 font-medium transition-colors"
          >
            <ArrowLeft size={15} />
            Back to home
          </button>
          {/* mobile brand */}
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 lg:hidden">
            <Leaf size={15} className="text-orange-500" />
            <span className="font-bold text-gray-800 text-sm">MedSoils</span>
          </button>
        </div>

        {/* centered card */}
        <div className="flex-1 flex items-center justify-center px-5 py-8">
          <AnimatePresence mode="wait">
            {showSignUp ? (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}
                transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/70 border border-gray-100 p-8 sm:p-10"
              >
                <SignUp onClose={handleClose} onLoginClick={() => setShowSignUp(false)} />
              </motion.div>
            ) : (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 32 }}
                transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/70 border border-gray-100 p-8 sm:p-10"
              >
                <Login onClose={handleClose} onSignUpClick={() => setShowSignUp(true)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
