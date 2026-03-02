import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Users, ChevronLeft, ChevronRight, MessageSquare, Award } from 'lucide-react'
import Footer from '../components/layout/Footer'

const ease = [0.16, 1, 0.3, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, ease, delay },
  }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, ease, delay },
  }),
}

const DotGrid = ({ className = '' }) => (
  <svg className={`absolute pointer-events-none select-none ${className}`} width="320" height="320" viewBox="0 0 320 320">
    {Array.from({ length: 10 }).map((_, row) =>
      Array.from({ length: 10 }).map((_, col) => (
        <circle key={`${row}-${col}`} cx={col * 32 + 16} cy={row * 32 + 16} r="1.5" fill="#f97316" fillOpacity="0.18" />
      ))
    )}
  </svg>
)

function ReviewCard({ r, user, onDelete, deleting, onOpen }) {
  // Prioritize the custom name entered in the form over the registered user name
  const displayName = (r.name || r.createdBy?.name || 'Anonymous').toUpperCase()
  const isRegisteredUser = !!r.createdBy
  const createdById = r.createdBy ? (r.createdBy._id || r.createdBy) : null
  const userId = user ? (user._id || user.id) : null

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl border border-gray-100 p-8 h-full flex flex-col relative group overflow-hidden hover:shadow-2xl transition-all duration-500"
      style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}
      whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-6 mb-5">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Avatar */}
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0 shadow-lg transition-all duration-300 group-hover:scale-110 ${isRegisteredUser ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600' : 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800'}`}>
              {displayName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            
            {/* User info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-bold text-gray-900 truncate mb-1 tracking-tight">{displayName}</h4>
              <p className="text-sm text-gray-500 mb-2">{new Date(r.createdAt || r.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              {isRegisteredUser && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-semibold border border-emerald-200/60">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
          </div>
          
          {/* Rating */}
          <div className="shrink-0">
            <div className="flex items-baseline gap-1 bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-2.5 rounded-lg border border-orange-100/80">
              <span className="text-2xl font-black text-gray-900">{Number(r.rating || 0).toFixed(1)}</span>
              <Star className="w-5 h-5 text-amber-500 fill-amber-500 mb-0.5" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-5" />

        {/* Review text */}
        <div className="flex-1 mb-5">
          {(() => {
            const maxLen = 220
            const text = r.text || ''
            const isLong = text.length > maxLen
            return (
              <>
                <p className="text-[15px] text-gray-700 leading-relaxed font-normal">
                  <span className="text-orange-500 font-serif text-xl leading-none mr-1">"</span>
                  {isLong ? `${text.slice(0, maxLen).trim()}...` : text}
                  <span className="text-orange-500 font-serif text-xl leading-none ml-1">"</span>
                </p>
                {isLong && (
                  <button
                    type="button"
                    onClick={() => onOpen?.(r)}
                    className="mt-4 inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200 group/btn"
                  >
                    Read full review
                    <svg className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                )}
              </>
            )
          })()}
        </div>

        {/* Footer */}
        {user && createdById && userId && String(createdById) === String(userId) && (
          <>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />
            <div className="flex justify-end">
              <button
                onClick={() => onDelete(r)}
                disabled={deleting}
                className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 ${deleting ? 'text-gray-400 bg-gray-50 cursor-not-allowed' : 'text-red-600 hover:text-white hover:bg-red-600'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </>
        )}
      </div>
    </motion.article>
  )
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5116/api/v1'

export default function Reviews() {
  const navigate = useNavigate()

  const defaultReviews = [
    { id: 1, name: 'Ana Martínez', rating: 4.8, text: 'Great course materials and community support — highly recommended!', date: '2025-11-08' },
    { id: 2, name: 'Luca Rossi',    rating: 4.5, text: 'Practical resources and excellent lectures. The forum helped a lot.', date: '2025-10-02' },
    { id: 3, name: 'Marta Silva',   rating: 5.0, text: 'I loved the field examples — very relevant to our region.', date: '2025-09-15' },
    { id: 4, name: 'Omar Khaled',   rating: 4.2, text: 'Good content; would like more advanced case studies.', date: '2025-08-21' },
  ]

  const [reviews, setReviews] = useState(defaultReviews)
  const [deletingIds, setDeletingIds] = useState([])
  const [confirmReview, setConfirmReview] = useState(null)

  const [name, setName] = useState(() => {
    try {
      const stored = localStorage.getItem('medsoils:reviewName') || ''
      return stored.slice(0, 3).toUpperCase()
    } catch {
      return ''
    }
  })
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [success, setSuccess] = useState('')
  const [user, setUser] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [fullReview, setFullReview] = useState(null)

  // Handle responsive items per page
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1) // mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2) // tablet
      } else {
        setItemsPerPage(3) // desktop
      }
    }
    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [])

  // Load current user
  useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem('user')
        setUser(stored ? JSON.parse(stored) : null)
      } catch {
        setUser(null)
      }
    }
    loadUser()
    window.addEventListener('storage', loadUser)
    return () => window.removeEventListener('storage', loadUser)
  }, [])

  useEffect(() => {
    // only auto-fill from user if no name is stored in localStorage
    const storedName = localStorage.getItem('medsoils:reviewName')
    if (!storedName && user?.name && !name.trim()) {
      const truncatedName = user.name.slice(0, 3).toUpperCase()
      setName(truncatedName)
      localStorage.setItem('medsoils:reviewName', truncatedName)
    }
  }, [user, name])

  // Save name to localStorage when it changes
  useEffect(() => {
    if (name.trim()) {
      localStorage.setItem('medsoils:reviewName', name.slice(0, 3).toUpperCase())
    }
  }, [name])

  useEffect(() => {
    // try to load from backend; fallback to localStorage/default
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`${API_URL}/reviews`)
        if (!mounted) return
        if (res.ok) {
          const json = await res.json()
          setReviews(json.data || defaultReviews)
          return
        }
      } catch (e) {
        // ignore, will fallback to localStorage
      }

      try {
        const raw = localStorage.getItem('medsoils:reviews')
        if (raw) setReviews(JSON.parse(raw))
      } catch {}
    })()
    return () => { mounted = false }
  }, [])

  // persist reviews to localStorage so offline/optimistic state survives reloads
  useEffect(() => {
    try { localStorage.setItem('medsoils:reviews', JSON.stringify(reviews)) } catch {}
  }, [reviews])

  const avg = useMemo(() => {
    if (!reviews.length) return 0
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  }, [reviews])

  // open confirm modal for a review
  function requestDelete(review) {
    setConfirmReview(review)
  }

  // cancel modal
  function cancelDelete() {
    setConfirmReview(null)
  }

  // perform actual deletion (called from modal)
  async function performDelete() {
    const review = confirmReview
    if (!review) return
    const id = review._id || review.id
    if (!id) return

    // if it's a local-only optimistic review (no _id), just remove locally
    const isLocalOnly = !review._id

    // mark as deleting
    setDeletingIds(prev => Array.from(new Set([...prev, id])))

    // remove from UI optimistically
    setReviews(prev => prev.filter(r => (r._id || r.id) !== id))

    if (isLocalOnly) {
      try { localStorage.setItem('medsoils:reviews', JSON.stringify(reviews.filter(r => (r._id || r.id) !== id))) } catch {}
      setDeletingIds(prev => prev.filter(x => x !== id))
      setConfirmReview(null)
      return
    }

    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`${API_URL}/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      if (!res.ok) {
        // revert on failure by reloading from server
        try {
          const json = await (await fetch(`${API_URL}/reviews`)).json()
          setReviews(json.data || defaultReviews)
          setSuccess('Could not delete review (server responded).')
        } catch {
          setSuccess('Could not delete review.')
        }
      }
    } catch (err) {
      // network error: attempt reload
      try {
        const json = await (await fetch(`${API_URL}/reviews`)).json()
        setReviews(json.data || defaultReviews)
        setSuccess('Network error while deleting — refreshed list.')
      } catch {
        setSuccess('Network error while deleting review.')
      }
    } finally {
      setDeletingIds(prev => prev.filter(x => x !== id))
      setConfirmReview(null)
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    const payload = {
      name: (name.trim() || 'Anonymous').toUpperCase(),
      rating: Number(rating) || 5,
      text: text.trim(),
    }

    // optimistic update (attach createdBy for current user so they can delete before server response)
    const optimistic = { id: Date.now(), ...payload, date: new Date().toISOString(), createdBy: user ? (user._id || user.id) : null }
    setReviews(r => [optimistic, ...r])
    setText('')

    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const json = await res.json()
        // replace optimistic item with server item (match by optimistic id)
        setReviews(curr => curr.map(it => (it.id === optimistic.id ? json.data : it)))
        setSuccess('Thanks — your review has been added')
      } else {
        setSuccess('Saved locally — server unavailable')
        // persist locally
        try { localStorage.setItem('medsoils:reviews', JSON.stringify([optimistic, ...reviews])) } catch {}
      }
    } catch (err) {
      setSuccess('Saved locally — server unavailable')
      try { localStorage.setItem('medsoils:reviews', JSON.stringify([optimistic, ...reviews])) } catch {}
    }

    setTimeout(() => setSuccess(''), 3500)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, reviews.length - itemsPerPage)
      return prev >= maxIndex ? 0 : prev + 1
    })
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, reviews.length - itemsPerPage)
      return prev <= 0 ? maxIndex : prev - 1
    })
  }

  const visibleReviews = reviews.slice(currentIndex, currentIndex + itemsPerPage)

  function openFullReview(r) {
    setFullReview(r)
  }

  function closeFullReview() {
    setFullReview(null)
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      
      {/* ── HERO SECTION ──────────────────────────────────────────── */}
      <motion.section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #dcf6f8 0%, #edfcfd 50%, #dcf6f8 100%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease }}
      >
        {/* Geometric grid lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#f97316" strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Large glowing orb — top right */}
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)' }} />
        
        {/* Small glowing orb — bottom left */}
        <div className="absolute -bottom-20 -left-20 w-[340px] h-[340px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)' }} />

        {/* Floating orange dots pattern — top left */}
        <svg className="absolute top-8 left-8 opacity-20 pointer-events-none" width="180" height="180" viewBox="0 0 180 180">
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 6 }).map((_, col) => (
              <circle key={`${row}-${col}`} cx={col * 30 + 15} cy={row * 30 + 15} r="2" fill="#f97316" />
            ))
          )}
        </svg>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center gap-16">
          
          {/* Left column — text */}
          <div className="flex-1 min-w-0">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 mb-7"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <span className="h-px w-8 bg-orange-500" />
              <span className="text-[13px] font-bold tracking-[0.22em] text-orange-500 uppercase">Community Feedback</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-[6.5rem] font-extrabold leading-[1.05] mb-8 text-gray-900"
              variants={fadeUp}
              custom={0.15}
              initial="hidden"
              animate="visible"
            >
              <span className="text-orange-500">User</span>{' '}
              <span
                className="relative inline-block"
                style={{ WebkitTextStroke: '2.5px #f97316', color: 'transparent' }}
              >
                Reviews
              </span>
            </motion.h1>

            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="h-[3px] w-12 bg-orange-500 rounded-full" />
              <div className="h-[3px] w-4 bg-orange-500/40 rounded-full" />
            </motion.div>

            <motion.p
              className="text-gray-700 leading-relaxed text-lg lg:text-xl max-w-xl"
              variants={fadeUp}
              custom={0.35}
              initial="hidden"
              animate="visible"
            >
              What people say about <strong className="text-gray-900">MedSoils</strong> — community feedback and learner experiences.
            </motion.p>
          </div>

          {/* Right column — stat cards */}
          <motion.div
            className="flex-shrink-0 flex flex-col gap-6 w-full md:w-80"
            variants={fadeUp}
            custom={0.3}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="relative rounded-2xl border border-cyan-200 p-7 overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(12px)' }}
              whileHover={{ scale: 1.03, borderColor: 'rgba(249,115,22,0.6)' }}
            >
              <div className="absolute top-0 left-0 h-[3px] w-full bg-gradient-to-r from-orange-500 via-orange-300 to-transparent" />
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Star className="w-7 h-7 text-orange-500 fill-orange-500" />
                </div>
                <p className="text-5xl font-black text-orange-500">{avg.toFixed(1)}</p>
              </div>
              <p className="text-gray-900 font-bold text-lg">Average Rating</p>
              <p className="text-gray-500 text-base mt-1">From {reviews.length} reviews</p>
            </motion.div>

            <motion.div
              className="relative rounded-2xl border border-cyan-200 p-7 overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(12px)' }}
              whileHover={{ scale: 1.03, borderColor: 'rgba(249,115,22,0.6)' }}
            >
              <div className="absolute top-0 left-0 h-[3px] w-full bg-gradient-to-r from-orange-500 via-orange-300 to-transparent" />
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-orange-500" />
                </div>
                <p className="text-5xl font-black text-orange-500">{reviews.length}</p>
              </div>
              <p className="text-gray-900 font-bold text-lg">Total Reviews</p>
              <p className="text-gray-500 text-base mt-1">Community feedback</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom wave divider */}
        <div className="relative z-10 -mb-px">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#ffffff" />
          </svg>
        </div>
      </motion.section>

      {/* ── REVIEW FORM SECTION ──────────────────────────────────────── */}
      <section className="relative py-16 px-6 overflow-hidden bg-white">
        {/* abstract intersecting wavy orange lines */}
        <motion.svg
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <defs>
            <linearGradient id="fcw-h" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="fcw-v" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* diagonal ↘ — orange, top zone */}
          <motion.path fill="none" stroke="url(#fcw-h)" strokeWidth="0.45" opacity="0.32"
            d="M 0,8 C 3.9,10.3 8.0,11.2 12.5,10.5 C 17.0,9.8 21.1,10.7 25,13 C 28.9,15.3 33.0,16.2 37.5,15.5 C 42.0,14.8 46.1,15.7 50,18 C 53.9,20.3 58.0,21.2 62.5,20.5 C 67.0,19.8 71.1,20.7 75,23 C 78.9,25.3 83.0,26.2 87.5,25.5 C 92.0,24.8 96.1,25.7 100,28"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }} viewport={{ once: true }} />
          {/* horizontal — orange, center */}
          <motion.path fill="none" stroke="url(#fcw-h)" strokeWidth="0.45" opacity="0.28"
            d="M 0,50 C 3.1,48.8 9.4,48.8 12.5,50 C 15.6,51.2 21.9,51.2 25,50 C 28.1,48.8 34.4,48.8 37.5,50 C 40.6,51.2 46.9,51.2 50,50 C 53.1,48.8 59.4,48.8 62.5,50 C 65.6,51.2 71.9,51.2 75,50 C 78.1,48.8 84.4,48.8 87.5,50 C 90.6,51.2 96.9,51.2 100,50"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.3, delay: 0.9, ease: "easeInOut" }} viewport={{ once: true }} />
          {/* diagonal ↗ — orange, bottom zone */}
          <motion.path fill="none" stroke="#fb923c" strokeWidth="0.4" opacity="0.25"
            d="M 0,80 C 4.5,80.7 8.6,79.8 12.5,77.5 C 16.4,75.2 20.5,74.3 25,75 C 29.5,75.7 33.6,74.8 37.5,72.5 C 41.4,70.2 45.5,69.3 50,70 C 54.5,70.7 58.6,69.8 62.5,67.5 C 66.4,65.2 70.5,64.3 75,65 C 79.5,65.7 83.6,64.8 87.5,62.5 C 91.4,60.2 95.5,59.3 100,60"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.4, delay: 0.7, ease: "easeInOut" }} viewport={{ once: true }} />
          {/* reverse diagonal — cyan, upper-mid to lower-mid */}
          <motion.path fill="none" stroke="#67e8f9" strokeWidth="0.3" opacity="0.12"
            d="M 100,30 C 95.4,29.9 91.3,31.1 87.5,33.75 C 83.7,36.4 79.6,37.7 75,37.5 C 70.4,37.4 66.3,38.6 62.5,41.25 C 58.7,43.9 54.6,45.2 50,45 C 45.4,44.9 41.3,46.1 37.5,48.75 C 33.7,51.4 29.6,52.7 25,52.5 C 20.4,52.4 16.3,53.6 12.5,56.25 C 8.7,58.9 4.6,60.2 0,60"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.6, delay: 0.6, ease: "easeInOut" }} viewport={{ once: true }} />
          {/* vertical — cyan, right-center */}
          <motion.path fill="none" stroke="#67e8f9" strokeWidth="0.28" opacity="0.11"
            d="M 70,0 C 68.8,3.1 68.8,9.4 70,12.5 C 71.2,15.6 71.2,21.9 70,25 C 68.8,28.1 68.8,34.4 70,37.5 C 71.2,40.6 71.2,46.9 70,50 C 68.8,53.1 68.8,59.4 70,62.5 C 71.2,65.6 71.2,71.9 70,75 C 68.8,78.1 68.8,84.4 70,87.5 C 71.2,90.6 71.2,96.9 70,100"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.8, delay: 0.4, ease: "easeInOut" }} viewport={{ once: true }} />
        </motion.svg>

        <div className="max-w-5xl mx-auto relative z-10">
          
          {/* Top label */}


          <motion.div
            className="flex items-center gap-3 mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="h-[3px] w-12 bg-orange-500 rounded-full" />
            <div className="h-[3px] w-4 bg-orange-200 rounded-full" />
          </motion.div>

          {/* Form Container */}
          <motion.div
            className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true }}
          >
            {user ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Form Header with Icon */}
                <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center">
                    <MessageSquare className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Share Your Experience</h3>
                    <p className="text-gray-600 text-sm">Help others by sharing your honest feedback</p>
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Name Field */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Your Display Name
                      <span className="text-gray-400 font-normal ml-1">(max 3 chars)</span>
                    </label>
                    <div className="relative">
                      <input 
                        value={name} 
                        onChange={e => setName(e.target.value.slice(0, 3).toUpperCase())} 
                        placeholder="ABC" 
                        maxLength={3}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base font-medium focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 focus:bg-white uppercase tracking-wider" 
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                        {name.length}/3
                      </div>
                    </div>
                  </div>
                  
                  {/* Rating Field */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Your Rating</label>
                    <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                      {[1,2,3,4,5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            star <= rating 
                              ? 'text-orange-400 hover:text-orange-500 scale-110' 
                              : 'text-gray-300 hover:text-gray-400'
                          }`}
                        >
                          <Star 
                            className="w-7 h-7" 
                            fill={star <= rating ? 'currentColor' : 'none'}
                            strokeWidth={2}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-orange-500 text-lg">{rating}.0</span>
                      <span className="text-gray-500">/ 5 stars</span>
                    </div>
                  </div>

                  {/* Stats Preview */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Current Average</label>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border-2 border-orange-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex items-center justify-center">
                          <Star className="w-6 h-6 text-orange-500 fill-orange-500" />
                        </div>
                        <div>
                          <div className="text-3xl font-black text-orange-600">{avg.toFixed(1)}</div>
                          <div className="text-xs text-gray-600">{reviews.length} total reviews</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Text Area */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Your Review</label>
                  <textarea 
                    value={text} 
                    onChange={e => setText(e.target.value)} 
                    rows={5} 
                    placeholder="Share your experience with MedSoils... Tell us what you liked, what could be improved, and how it helped you."
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none leading-relaxed"
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{text.length}/500 characters</span>
                    <span className={`font-medium ${text.length > 450 ? 'text-orange-500' : 'text-gray-400'}`}>
                      {500 - text.length} remaining
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={!text.trim()}
                    className="w-full py-5 bg-gradient-to-r from-orange-500 to-amber-500 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl font-bold text-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:hover:scale-100 disabled:hover:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    <MessageSquare className="w-5 h-5" />
                    {text.trim() ? 'Submit Your Review' : 'Write your review first'}
                  </button>
                </div>
                
                {/* Success Message */}
                {success && (
                  <motion.div 
                    className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="text-base text-green-700 font-semibold">{success}</div>
                  </motion.div>
                )}
              </form>
            ) : (
              <div className="text-center py-16">
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Sign in required</h3>
                <p className="text-base text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
                  Join our community to share your experience and help others make informed decisions about MedSoils.
                </p>
                <button 
                  onClick={() => navigate('/login')} 
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In to Leave a Review
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── REVIEWS CAROUSEL SECTION ──────────────────────────────────── */}
      <section className="relative py-20 px-6 overflow-hidden bg-white">
        {/* abstract intersecting wavy orange lines */}
        <motion.svg
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <defs>
            <linearGradient id="rcw-h" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rcw-v" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* diagonal ↘ — orange, top zone */}
          <motion.path fill="none" stroke="url(#rcw-h)" strokeWidth="0.45" opacity="0.32"
            d="M 0,8 C 3.9,10.3 8.0,11.2 12.5,10.5 C 17.0,9.8 21.1,10.7 25,13 C 28.9,15.3 33.0,16.2 37.5,15.5 C 42.0,14.8 46.1,15.7 50,18 C 53.9,20.3 58.0,21.2 62.5,20.5 C 67.0,19.8 71.1,20.7 75,23 C 78.9,25.3 83.0,26.2 87.5,25.5 C 92.0,24.8 96.1,25.7 100,28"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }} viewport={{ once: true }} />
          {/* horizontal — orange, center */}
          <motion.path fill="none" stroke="url(#rcw-h)" strokeWidth="0.45" opacity="0.28"
            d="M 0,50 C 3.1,48.8 9.4,48.8 12.5,50 C 15.6,51.2 21.9,51.2 25,50 C 28.1,48.8 34.4,48.8 37.5,50 C 40.6,51.2 46.9,51.2 50,50 C 53.1,48.8 59.4,48.8 62.5,50 C 65.6,51.2 71.9,51.2 75,50 C 78.1,48.8 84.4,48.8 87.5,50 C 90.6,51.2 96.9,51.2 100,50"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.3, delay: 0.9, ease: "easeInOut" }} viewport={{ once: true }} />
          {/* diagonal ↗ — orange, bottom zone */}
          <motion.path fill="none" stroke="#fb923c" strokeWidth="0.4" opacity="0.25"
            d="M 0,80 C 4.5,80.7 8.6,79.8 12.5,77.5 C 16.4,75.2 20.5,74.3 25,75 C 29.5,75.7 33.6,74.8 37.5,72.5 C 41.4,70.2 45.5,69.3 50,70 C 54.5,70.7 58.6,69.8 62.5,67.5 C 66.4,65.2 70.5,64.3 75,65 C 79.5,65.7 83.6,64.8 87.5,62.5 C 91.4,60.2 95.5,59.3 100,60"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.4, delay: 0.7, ease: "easeInOut" }} viewport={{ once: true }} />
          {/* reverse diagonal — cyan, upper-mid to lower-mid */}
          <motion.path fill="none" stroke="#67e8f9" strokeWidth="0.3" opacity="0.12"
            d="M 100,30 C 95.4,29.9 91.3,31.1 87.5,33.75 C 83.7,36.4 79.6,37.7 75,37.5 C 70.4,37.4 66.3,38.6 62.5,41.25 C 58.7,43.9 54.6,45.2 50,45 C 45.4,44.9 41.3,46.1 37.5,48.75 C 33.7,51.4 29.6,52.7 25,52.5 C 20.4,52.4 16.3,53.6 12.5,56.25 C 8.7,58.9 4.6,60.2 0,60"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.6, delay: 0.6, ease: "easeInOut" }} viewport={{ once: true }} />
          {/* vertical — cyan, right-center */}
          <motion.path fill="none" stroke="#67e8f9" strokeWidth="0.28" opacity="0.11"
            d="M 70,0 C 68.8,3.1 68.8,9.4 70,12.5 C 71.2,15.6 71.2,21.9 70,25 C 68.8,28.1 68.8,34.4 70,37.5 C 71.2,40.6 71.2,46.9 70,50 C 68.8,53.1 68.8,59.4 70,62.5 C 71.2,65.6 71.2,71.9 70,75 C 68.8,78.1 68.8,84.4 70,87.5 C 71.2,90.6 71.2,96.9 70,100"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.8, delay: 0.4, ease: "easeInOut" }} viewport={{ once: true }} />
        </motion.svg>

        <div className="max-w-7xl mx-auto relative z-10 pt-4">
          
          {/* Section Header */}
          <div className="mb-16">
            <motion.div
              className="inline-flex items-center gap-2 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease }}
              viewport={{ once: true }}
            >
              <span className="h-px w-8 bg-orange-500" />
              <span className="text-[11px] font-bold tracking-[0.22em] text-orange-500 uppercase">What Our Community Says</span>
            </motion.div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <motion.h2
                  className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-[1.1] mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease }}
                  viewport={{ once: true }}
                >
                  <span className="text-orange-500">Community</span> Reviews
                </motion.h2>
                
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="h-[3px] w-12 bg-orange-500 rounded-full" />
                  <div className="h-[3px] w-4 bg-orange-200 rounded-full" />
                </motion.div>
              </div>

              {/* Navigation Controls */}
              <motion.div 
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease }}
                viewport={{ once: true }}
              >
                <span className="text-sm text-gray-600 font-medium hidden sm:inline">
                  {currentIndex + 1} - {Math.min(currentIndex + itemsPerPage, reviews.length)} of {reviews.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={prevSlide}
                    disabled={currentIndex === 0}
                    className="p-3 rounded-xl border-2 border-orange-200 bg-white hover:bg-orange-50 hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 disabled:hover:bg-white"
                  >
                    <ChevronLeft className="w-5 h-5 text-orange-600" />
                  </button>
                  <button
                    onClick={nextSlide}
                    disabled={currentIndex >= reviews.length - itemsPerPage}
                    className="p-3 rounded-xl border-2 border-orange-200 bg-white hover:bg-orange-50 hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 disabled:hover:bg-white"
                  >
                    <ChevronRight className="w-5 h-5 text-orange-600" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Reviews Carousel */}
          <div className="relative py-4">
            <div className="overflow-hidden">
              <motion.div 
                className="flex gap-4 md:gap-6"
                animate={{ x: `${-currentIndex * (100 / itemsPerPage)}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {reviews.map(r => (
                  <div key={r._id || r.id} className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 py-2">
                    <ReviewCard r={r} user={user} onDelete={requestDelete} deleting={deletingIds.includes(r._id || r.id)} onOpen={openFullReview} />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
          
          {/* Carousel dots */}
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: Math.ceil(reviews.length / itemsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * itemsPerPage)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / itemsPerPage) === index
                    ? 'bg-orange-500 w-8'
                    : 'bg-gray-300 hover:bg-gray-400 w-2'
                }`}
              />
            ))}
          </div>
        </div>

       

      </section>

      {/* Footer section */}
      <div className="bg-white mt-0">
          <div
        aria-hidden="true"
        className="h-[3px] w-full mt-30 mb-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #f97316 30%, #fb923c 60%, transparent 100%)',
        }}
      />
        <Footer />
      </div>

      {/* ── CONFIRM DELETE MODAL ──────────────────────────────────────── */}
      {confirmReview && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={cancelDelete}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          <motion.div 
            className="relative bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-100"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Delete Review</h3>
                <p className="text-sm text-gray-600">This action cannot be undone. Your review will be permanently removed.</p>
              </div>
            </div>

            {/* Review Preview */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-semibold text-xs text-white shrink-0">
                  {(confirmReview.name || '').slice(0,3)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">{(confirmReview.name || 'Anonymous').toUpperCase()}</p>
                    <div className="flex items-center gap-1 text-orange-500 font-semibold text-sm shrink-0">
                      {confirmReview.rating} <Star className="w-4 h-4 fill-orange-500" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">{confirmReview.text}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button 
                onClick={cancelDelete} 
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 font-semibold text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={performDelete}
                disabled={deletingIds.includes(confirmReview._id || confirmReview.id)}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold text-white transition-all ${
                  deletingIds.includes(confirmReview._id || confirmReview.id) 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-500 hover:bg-red-600 hover:shadow-lg'
                }`}
              >
                {deletingIds.includes(confirmReview._id || confirmReview.id) ? 'Deleting...' : 'Delete Review'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ── FULL REVIEW MODAL ──────────────────────────────────────── */}
      <AnimatePresence>
        {fullReview && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
              onClick={closeFullReview}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div 
              className="relative bg-white max-w-2xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4, damping: 25, stiffness: 300 }}
            >
            {/* Header */}
            <div className="flex items-start gap-4 pb-6 border-b border-gray-100 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-sm text-white shrink-0">
                {(fullReview.name || '').slice(0,3)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-lg font-bold text-gray-900">{(fullReview.name || 'Anonymous').toUpperCase()}</p>
                  <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-lg">
                    <span className="text-lg font-bold text-orange-500">{fullReview.rating}</span>
                    <Star className="w-5 h-5 text-orange-400 fill-orange-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">{new Date(fullReview.createdAt || fullReview.date || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            {/* Review Content */}
            <div className="prose prose-gray max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-wrap">
                {fullReview.text}
              </p>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button 
                onClick={closeFullReview} 
                className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
