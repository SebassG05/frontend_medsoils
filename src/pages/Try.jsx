import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion'
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle2, XCircle, Trophy, Leaf, BookOpen, Clock, Lock, LogIn, UserPlus, Medal, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buildSession, QUESTIONS_PER_SESSION } from '../data/quizQuestions'
import { saveResult, getLeaderboard, formatTime, deleteResult, getMyResult } from '../data/quizLeaderboard'

const TIMER_DURATION = 15 // seconds per question

/* ─── Animation variants ────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
}

const optionVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: 'easeOut', delay: i * 0.07 },
  }),
}

/* ─── Score helpers ─────────────────────────────────────────── */
function getResult(score, total) {
  const pct = score / total
  if (pct >= 0.9) return { label: 'Expert',       emoji: '🏆', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' }
  if (pct >= 0.7) return { label: 'Advanced',     emoji: '🌿', color: 'text-green-600',  bg: 'bg-green-50 border-green-200'  }
  if (pct >= 0.5) return { label: 'Intermediate', emoji: '📗', color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200'    }
  return              { label: 'Beginner',     emoji: '🌱', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' }
}

/* ─── Shared page shell ─────────────────────────────────────── */
const Shell = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-b from-orange-50/60 via-white to-white">
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-orange-100/80 border border-orange-300/60 text-orange-600 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Knowledge Check
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">
            Soil Science{' '}
            <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
              Quiz
            </span>
          </h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Test your knowledge about Mediterranean soils, climate impact, and sustainable land management.
          </p>
        </div>
      </motion.div>

      {children}
    </div>
  </div>
)

/* ─── Leaderboard component ───────────────────────────────────── */
const RANK_STYLES = [
  { ring: 'ring-yellow-300',  bg: 'bg-gradient-to-br from-yellow-50  to-amber-50',    badge: 'bg-yellow-400  text-white', label: '#1' },
  { ring: 'ring-slate-300',   bg: 'bg-gradient-to-br from-slate-50   to-gray-50',     badge: 'bg-slate-400   text-white', label: '#2' },
  { ring: 'ring-orange-300',  bg: 'bg-gradient-to-br from-orange-50  to-amber-50',    badge: 'bg-orange-400  text-white', label: '#3' },
]

const LeaderboardRow = ({ entry, index, currentUser }) => {
  const style    = RANK_STYLES[index] ?? { ring: 'ring-gray-200', bg: 'bg-white', badge: 'bg-gray-300 text-white', label: `#${index + 1}` }
  const isYou    = currentUser && entry.name === currentUser
  const initials = entry.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: 'easeOut' }}
      className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl ring-1 ${
        isYou ? `${style.ring} ${style.bg}` : 'ring-gray-100 bg-gray-50/60'
      }`}
    >
      {/* Rank badge */}
      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${style.badge}`}>
        {style.label}
      </span>

      {/* Avatar */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
        index === 0 ? 'bg-yellow-100 text-yellow-700'
        : index === 1 ? 'bg-slate-100  text-slate-600'
        : index === 2 ? 'bg-orange-100 text-orange-600'
        : 'bg-gray-100 text-gray-500'
      }`}>
        {initials}
      </div>

      {/* Name + date */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">
          {entry.name}
          {isYou && (
            <span className="ml-2 text-[10px] font-bold text-orange-500 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded-full">
              YOU
            </span>
          )}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          {new Date(entry.achievedAt ?? entry.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="text-right">
          <p className="text-base font-bold text-gray-900">{entry.score}<span className="text-xs font-medium text-gray-400">/{QUESTIONS_PER_SESSION}</span></p>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Score</p>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="text-right">
          <p className="text-base font-bold text-gray-900">{formatTime(entry.totalTime)}</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Time</p>
        </div>
      </div>
    </motion.div>
  )
}

const Leaderboard = ({ currentUser, refreshKey, onDelete }) => {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError  ] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getLeaderboard(5)
      .then((data) => { if (!cancelled) { setEntries(data); setLoading(false) } })
      .catch((e)   => { if (!cancelled) { setError(e.message); setLoading(false) } })
    return () => { cancelled = true }
  }, [refreshKey])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/60 overflow-hidden"
    >
      <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500" />
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 flex items-center justify-center">
            <Medal className="w-4 h-4 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Top Performers</h3>
            <p className="text-[11px] text-gray-400">Best score • Fastest time</p>
          </div>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 rounded-full border-2 border-orange-300 border-t-orange-500 animate-spin" />
          </div>
        ) : error ? (
          <p className="text-center text-sm text-red-400 py-6">{error}</p>
        ) : entries.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-5 h-5 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-400">No results yet.</p>
            <p className="text-xs text-gray-300 mt-1">Complete the quiz to claim the #1 spot!</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {entries.map((e, i) => (
              <LeaderboardRow key={e._id ?? i} entry={e} index={i} currentUser={currentUser} />
            ))}
          </div>
        )}

        {/* Delete my record */}
        {onDelete && currentUser && (
          <div className="mt-5 pt-4 border-t border-gray-100 flex justify-center">
            {!confirmDelete ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setConfirmDelete(true)}
                className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete my record
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-2"
              >
                <p className="text-xs text-gray-500 font-medium">Are you sure? This cannot be undone.</p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={async () => {
                      setDeleting(true)
                      await onDelete()
                      setDeleting(false)
                      setConfirmDelete(false)
                    }}
                    disabled={deleting}
                    className="cursor-pointer inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm disabled:opacity-60 transition-colors"
                  >
                    {deleting
                      ? <span className="w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      : <Trash2 className="w-3 h-3" />}
                    Yes, delete it
                  </motion.button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="cursor-pointer text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ─── Auth Gate ──────────────────────────────────────────────── */
const AuthGate = () => (
  <Shell>
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
      className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/60 overflow-hidden"
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400" />

      <div className="px-8 py-12 md:px-14 md:py-16 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8 text-orange-500" strokeWidth={1.8} />
          </div>
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </span>
        </div>

        {/* Copy */}
        <span className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200/80 text-orange-600 text-[10px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          Members only
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
          Sign in to access<br />
          <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
            the Quiz
          </span>
        </h2>
        <p className="text-gray-500 text-base max-w-sm mx-auto mb-10 leading-relaxed">
          This knowledge check is available exclusively to registered members of the MedSoils Challenge community.
        </p>

        {/* Divider with features */}
        <div className="w-full max-w-xs mb-10 space-y-2.5">
          {[
            'Access all 15 quiz questions',
            'Track your progress over time',
            'Compete with other researchers',
          ].map((feat) => (
            <div key={feat} className="flex items-center gap-3 text-sm text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              {feat}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.dispatchEvent(new Event('medsoil:open-login'))}
            className="cursor-pointer flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-6 py-3.5 rounded-full shadow-lg shadow-orange-200/60 hover:shadow-orange-300/60 transition-shadow"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.dispatchEvent(new Event('medsoil:open-signup'))}
            className="cursor-pointer flex-1 inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold px-6 py-3.5 rounded-full hover:bg-gray-50 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Register
          </motion.button>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Free to join &mdash; takes less than a minute.
        </p>
      </div>
    </motion.div>

    <Leaderboard currentUser={null} refreshKey={0} />
  </Shell>
)

/* ─── Main component ─────────────────────────────────────────── */
const Try = () => {
  // ── Auth check (reads localStorage, re-syncs on storage events) ──
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })

  useEffect(() => {
    const sync = () => {
      try { setUser(JSON.parse(localStorage.getItem('user'))) } catch { setUser(null) }
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const [session, setSession]     = useState([])
  const [phase, setPhase]         = useState('start')   // 'start' | 'quiz' | 'result'
  const [current, setCurrent]     = useState(0)
  const [selected, setSelected]   = useState(null)      // chosen option string
  const [revealed, setRevealed]   = useState(false)     // show correct/wrong colours
  const [answers, setAnswers]     = useState([])        // { correct: bool, timeout?: bool }[]
  const [rank, setRank]           = useState(null)      // leaderboard rank after quiz
  const [lbKey, setLbKey]         = useState(0)         // bump to refresh Leaderboard
  const [hasRecord, setHasRecord] = useState(false)     // whether user has a leaderboard entry
  const [alias, setAlias]         = useState('')        // user 3-char tag for leaderboard
  const [chars, setChars]         = useState(['', '', '']) // individual letter boxes
  const [scoreSaved, setScoreSaved] = useState(false)   // whether score has been submitted
  const [saving, setSaving]       = useState(false)     // loading state for save button
  const [anonChoice, setAnonChoice] = useState(null)   // null | 'yes' | 'no'
  const pendingTimeRef            = useRef(null)        // total quiz time, set on result
  const timerProgress             = useMotionValue(1)   // 1 = full, 0 = empty
  const animCtrlRef               = useRef(null)
  const quizStartRef              = useRef(null)        // timestamp when quiz began
  const boxRef0                   = useRef(null)
  const boxRef1                   = useRef(null)
  const boxRef2                   = useRef(null)
  const boxRefs                   = [boxRef0, boxRef1, boxRef2]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // ── Check if user already has a record on mount / user change ────
  useEffect(() => {
    if (!user) { setHasRecord(false); return }
    getMyResult().then((r) => setHasRecord(!!r)).catch(() => setHasRecord(false))
  }, [user])

  // ── Timer ───────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'quiz') return
    // Reset MotionValue to full immediately (no batching issues — it's not React state)
    timerProgress.set(1)
    // animate() drives the MotionValue independently of the DOM
    animCtrlRef.current = animate(timerProgress, 0, {
      duration: TIMER_DURATION,
      ease: 'linear',
      onComplete: () => {
        setRevealed(true)
        setAnswers(prev => [...prev, { correct: false, timeout: true }])
      },
    })
    return () => animCtrlRef.current?.stop()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, phase])

  // ── Auto-advance after timeout ────────────────────────────────
  useEffect(() => {
    if (phase !== 'quiz' || !revealed || selected !== null) return
    const t = setTimeout(handleNext, 2000)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, phase, selected])

  const startQuiz = useCallback(() => {
    setSession(buildSession())
    setCurrent(0)
    setSelected(null)
    setRevealed(false)
    setAnswers([])
    setRank(null)
    setAlias('')
    setChars(['', '', ''])
    setScoreSaved(false)
    setAnonChoice(null)
    pendingTimeRef.current = null
    quizStartRef.current = Date.now()
    setPhase('quiz')
  }, [])

  const handleSelect = (option) => {
    if (revealed) return
    animCtrlRef.current?.stop()
    setSelected(option)
    setRevealed(true)
    setAnswers((prev) => [...prev, { correct: option === session[current].correct }])
  }

  const handleNext = useCallback(() => {
    const nextIndex = current + 1
    if (nextIndex >= session.length) {
      setPhase('result')
    } else {
      setCurrent(nextIndex)
      setSelected(null)
      setRevealed(false)
    }
  }, [current, session.length])

  const score  = answers.filter((a) => a.correct).length
  const result = getResult(score, QUESTIONS_PER_SESSION)

  // ── Capture total time when quiz ends ────────────────────────────────────
  useEffect(() => {
    if (phase !== 'result' || !quizStartRef.current) return
    pendingTimeRef.current = (Date.now() - quizStartRef.current) / 1000
    quizStartRef.current = null
    setAlias('')
    setChars(['', '', ''])
    setScoreSaved(false)
    setAnonChoice(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // ── Auto-save with real name when user chooses NOT to be anonymous ────────
  useEffect(() => {
    if (anonChoice !== 'no' || scoreSaved || saving) return
    handleSaveScore()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anonChoice])

  // ── Manual save triggered by the alias form ────────────────
  const handleSaveScore = useCallback(async () => {
    if (!user || pendingTimeRef.current === null || saving) return
    const finalAlias = chars.join('')
    setSaving(true)
    try {
      const { rank: r } = await saveResult({
        score,
        totalTime: pendingTimeRef.current,
        alias: finalAlias.length === 3 ? finalAlias : undefined,
      })
      setRank(r)
      setScoreSaved(true)
      setHasRecord(true)
      setLbKey((k) => k + 1) // always refresh so the new name/alias appears
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chars, score, saving, user])

  // ── Delete record ─────────────────────────────────────────────
  const handleDeleteRecord = useCallback(async () => {
    try {
      await deleteResult()
      setRank(null)
      setHasRecord(false)
      setScoreSaved(false)
      setAnonChoice(null)
      setChars(['', '', ''])
      setAlias('')
      setLbKey((k) => k + 1)
    } catch (e) {
      console.error(e)
    }
  }, [])

  // ── Guard: show auth gate if not logged in ────────────────
  if (!user) return <AuthGate />

  /* ── START SCREEN ─────────────────────────────────────────── */
  if (phase === 'start') {
    return (
      <Shell>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/60 overflow-hidden"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400" />
          <div className="p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Leaf className="w-9 h-9 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to test yourself?</h2>
            <p className="text-gray-500 mb-10 max-w-md mx-auto">
              {QUESTIONS_PER_SESSION} randomised questions drawn from a bank of 15. Answers are shuffled on every attempt.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                { icon: <BookOpen className="w-4 h-4" />,    label: `${QUESTIONS_PER_SESSION} Questions`    },
                { icon: <CheckCircle2 className="w-4 h-4" />, label: '4 Options each'                       },
                { icon: <Clock className="w-4 h-4" />,        label: `${TIMER_DURATION}s per question`       },
                { icon: <RotateCcw className="w-4 h-4" />,   label: 'New order every time'                  },
              ].map(({ icon, label }) => (
                <span key={label} className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
                  <span className="text-orange-500">{icon}</span>
                  {label}
                </span>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={startQuiz}
              className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-10 py-4 rounded-full shadow-lg shadow-orange-200/60 hover:shadow-orange-300/60 transition-shadow"
            >
              Start Quiz
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <Leaderboard currentUser={user?.name} refreshKey={lbKey} onDelete={hasRecord ? handleDeleteRecord : undefined} />
      </Shell>
    )
  }

  /* ── RESULT SCREEN ────────────────────────────────────────── */
  if (phase === 'result') {
    const circumference = 2 * Math.PI * 50
    return (
      <Shell>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/60 overflow-hidden"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400" />
          <div className="p-8 md:p-12 text-center">
            {/* Animated score ring */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                <motion.circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke="url(#scoreGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: circumference * (1 - score / QUESTIONS_PER_SESSION) }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{score}</span>
                <span className="text-xs text-gray-400 font-medium">/ {QUESTIONS_PER_SESSION}</span>
              </div>
            </div>

            <span className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full border mb-4 ${result.bg} ${result.color}`}>
              {result.emoji} {result.label}
            </span>

            {rank && (
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 px-4 py-1.5 rounded-full mb-4 ml-2"
              >
                <Medal className="w-4 h-4 text-yellow-500" />
                Leaderboard #{rank}
              </motion.p>
            )}

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {score >= 8 ? 'Excellent work!' : score >= 5 ? 'Good effort!' : 'Keep learning!'}
            </h2>
            <p className="text-gray-500 mb-8">
              You answered <strong className="text-gray-700">{score} out of {QUESTIONS_PER_SESSION}</strong> questions correctly.
            </p>

            {/* Per-question dots */}
            <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-xs mx-auto">
              {answers.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.05 * i, type: 'spring', stiffness: 260 }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    a.correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                  }`}
                >
                  {a.correct
                    ? <CheckCircle2 className="w-4 h-4" />
                    : <XCircle className="w-4 h-4" />}
                </motion.div>
              ))}
            </div>

            {/* ── Leaderboard save flow ────────────────────────────── */}
            <div className="mb-8">
              {scoreSaved ? (

                /* ── Step 3: confirmation ──────────────────────────────── */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 px-5 py-2.5 rounded-full shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Score saved as{' '}
                    <span className="tracking-widest font-extrabold">
                      {chars.join('') || user?.name?.split(' ')[0]}
                    </span>
                  </div>
                  {rank && (
                    <p className="text-xs text-gray-400 mt-1">
                      You are currently <strong className="text-gray-600">#{rank}</strong> on the leaderboard
                    </p>
                  )}
                </motion.div>

              ) : anonChoice === null ? (

                /* ── Step 1: ask if user wants to be anonymous ─────────── */
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto max-w-sm bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 flex flex-col items-center gap-4 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-800 mb-0.5">Save to Leaderboard</p>
                    <p className="text-xs text-gray-400">How do you want to appear?</p>
                  </div>
                  <div className="flex flex-col gap-2.5 w-full">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -3, boxShadow: '0 8px 24px rgba(251,146,60,0.18)' }}
                      whileTap={{ scale: 0.97, y: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      onClick={() => {
                        setAnonChoice('yes')
                        setTimeout(() => boxRef0.current?.focus(), 50)
                      }}
                      className="cursor-pointer w-full flex items-center justify-center border-2 border-orange-300 text-orange-600 font-semibold text-sm px-5 py-3 rounded-xl hover:bg-orange-50 transition-colors"
                    >
                      Anonymous tag
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -3, boxShadow: '0 8px 24px rgba(234,88,12,0.28)' }}
                      whileTap={{ scale: 0.97, y: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      onClick={() => setAnonChoice('no')}
                      disabled={saving}
                      className="cursor-pointer w-full flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-md shadow-orange-200/60 disabled:opacity-60"
                    >
                      {saving
                        ? <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        : 'Use my name'}
                    </motion.button>
                  </div>
                </motion.div>

              ) : (

                /* ── Step 2: alias input ────────────────────────────────── */
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto max-w-sm bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 flex flex-col items-center gap-5 shadow-sm"
                >
                  {/* Header */}
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-800 mb-0.5">Choose your tag</p>
                    <p className="text-xs text-gray-400">3 letters or numbers — this is how you'll appear on the leaderboard</p>
                  </div>

                  {/* 3 Letter boxes */}
                  <div className="flex items-center justify-center gap-3">
                    {[0, 1, 2].map((i) => (
                      <input
                        key={i}
                        ref={boxRefs[i]}
                        type="text"
                        inputMode="text"
                        maxLength={1}
                        value={chars[i]}
                        placeholder={['A', 'B', 'C'][i]}
                        onChange={(e) => {
                          const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-1)
                          const next = [...chars]
                          next[i] = v
                          setChars(next)
                          setAlias(next.join(''))
                          if (v && i < 2) boxRefs[i + 1].current?.focus()
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !chars[i] && i > 0) {
                            boxRefs[i - 1].current?.focus()
                          }
                          if (e.key === 'Enter' && chars.join('').length === 3) handleSaveScore()
                        }}
                        className={`w-14 h-14 text-center text-2xl font-extrabold tracking-widest rounded-xl border-2 outline-none uppercase transition-all ${
                          chars[i]
                            ? 'border-orange-400 bg-orange-50 text-orange-600 shadow-md shadow-orange-100'
                            : 'border-gray-200 bg-white text-gray-800 focus:border-orange-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Progress dots */}
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          chars[i] ? 'bg-orange-400' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Action row */}
                  <div className="flex flex-col items-center gap-2 w-full">
                    <motion.button
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSaveScore}
                      disabled={saving || chars.join('').length !== 3}
                      className="cursor-pointer w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm py-3 rounded-xl shadow-md shadow-orange-200/60 disabled:opacity-50 transition-opacity"
                    >
                      {saving
                        ? <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        : <Trophy className="w-4 h-4" />}
                      Save to leaderboard
                    </motion.button>
                    <button
                      onClick={() => { setAnonChoice(null); setChars(['', '', '']); setAlias('') }}
                      className="cursor-pointer flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ArrowLeft className="w-3 h-3" /> Back
                    </button>
                  </div>
                </motion.div>

              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={startQuiz}
                className="cursor-pointer inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-orange-200/60"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </motion.button>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold px-8 py-3.5 rounded-full hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <Leaderboard currentUser={alias || user?.name} refreshKey={lbKey} onDelete={hasRecord ? handleDeleteRecord : undefined} />
      </Shell>
    )
  }

  /* ── QUIZ SCREEN ──────────────────────────────────────────── */
  const q        = session[current]
  const progress = (current / session.length) * 100

  return (
    <Shell>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/60 overflow-hidden"
      >
        {/* Progress bar */}
        <div className="h-1.5 w-full bg-gray-100">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        <div className="p-8 md:p-10">
          {/* Header row */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Question {current + 1} <span className="text-gray-300">/ {session.length}</span>
            </span>

            {/* Mini progress dots */}
            <div className="flex gap-1.5 items-center">
              {session.map((_, i) => (
                <span
                  key={i}
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    i < current
                      ? answers[i]?.correct ? 'bg-green-400 w-4' : 'bg-red-400 w-4'
                      : i === current
                      ? 'bg-orange-500 w-4'
                      : 'bg-gray-200 w-2'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question + options */}
          <AnimatePresence mode="wait">
            <motion.div key={current} variants={fadeUp} initial="hidden" animate="visible" exit="exit">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 leading-snug">
                {q.question}
              </h2>

              <div className="grid gap-3 mb-8">
                {q.options.map((option, i) => {
                  const isCorrect  = option === q.correct
                  const isSelected = option === selected

                  let style = 'border-gray-200 bg-gray-50/50 hover:border-orange-300 hover:bg-orange-50/40 cursor-pointer'
                  if (revealed) {
                    if (isCorrect)        style = 'border-green-400 bg-green-50 cursor-default'
                    else if (isSelected)  style = 'border-red-400 bg-red-50 cursor-default'
                    else                  style = 'border-gray-100 bg-gray-50/30 opacity-40 cursor-default'
                  }

                  return (
                    <motion.button
                      key={option}
                      custom={i}
                      variants={optionVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={() => handleSelect(option)}
                      disabled={revealed}
                      className={`w-full flex items-center justify-between gap-4 text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 ${style}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center text-xs font-bold border transition-colors ${
                          revealed && isCorrect
                            ? 'bg-green-500 border-green-500 text-white'
                            : revealed && isSelected
                            ? 'bg-red-500 border-red-500 text-white'
                            : 'bg-white border-gray-200 text-gray-400'
                        }`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="font-medium text-gray-800">{option}</span>
                      </span>

                      {revealed && isCorrect  && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
                      {revealed && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                    </motion.button>
                  )
                })}
              </div>

              {/* Timer bar */}
              {!revealed && (
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mb-6">
                  <motion.div
                    className="h-full w-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400"
                    style={{ scaleX: timerProgress, transformOrigin: 'left' }}
                  />
                </div>
              )}

              {/* Feedback + Next button */}
              <AnimatePresence>
                {revealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between gap-4 flex-wrap"
                  >
                    <span className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full ${
                      selected === q.correct
                        ? 'bg-green-100 text-green-700'
                        : selected === null
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {selected === q.correct
                        ? <><CheckCircle2 className="w-4 h-4" /> Correct!</>
                        : selected === null
                        ? <><Clock className="w-4 h-4" /> Time&rsquo;s up! Correct: <strong className="ml-1">{q.correct}</strong></>
                        : <><XCircle className="w-4 h-4" /> Correct answer: <strong className="ml-1">{q.correct}</strong></>}
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.04, x: 4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleNext}
                      className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-7 py-2.5 rounded-full shadow-md shadow-orange-200/50"
                    >
                      {current + 1 < session.length
                        ? <> Next <ArrowRight className="w-4 h-4" /> </>
                        : <> See Results <Trophy className="w-4 h-4" /> </>}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </Shell>
  )
}

export default Try
