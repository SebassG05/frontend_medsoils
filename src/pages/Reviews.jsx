import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import Footer from '../components/layout/Footer'

function ReviewCard({ r, user, onDelete, deleting }) {
  // Prioritize the custom name entered in the form over the registered user name
  const displayName = (r.name || r.createdBy?.name || 'Anonymous').toUpperCase()
  const isRegisteredUser = !!r.createdBy
  const createdById = r.createdBy ? (r.createdBy._id || r.createdBy) : null
  const userId = user ? (user._id || user.id) : null

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm h-full flex flex-col"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm shrink-0 ${isRegisteredUser ? 'bg-green-500' : 'bg-orange-400'}`}>
          {displayName.split(' ').map(n => n[0]).join('').slice(0,3)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
              <p className="text-xs text-gray-400">{new Date(r.createdAt || r.date).toLocaleDateString()}</p>
              {isRegisteredUser && (
                <span className="inline-block text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full mt-1">Verified User</span>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-sm font-semibold text-orange-500">{Number(r.rating || 0).toFixed(1)}</span>
              <Star className="w-4 h-4 text-orange-400" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">{r.text}</p>
          {user && createdById && userId && String(createdById) === String(userId) && (
            <div className="mt-4">
              <button
                onClick={() => onDelete(r)}
                disabled={deleting}
                className={`text-sm font-medium ${deleting ? 'text-gray-400' : 'text-red-500 hover:underline'}`}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
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

  return (
    <div className="bg-gradient-to-br from-white via-orange-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3"><strong className="text-orange-500">User</strong> Reviews</h1>
          <p className="text-gray-500">What people say about MedSoils — community feedback and learner experiences.</p>
        </div>

        {/* Large Review Form at Top */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-lg">
            {/* Average Rating and Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 sm:mb-8">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Leave a Review</h2>
                  <p className="text-sm sm:text-base text-gray-600">Share your experience with our community</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 sm:px-6 py-3 sm:py-4 shadow-sm">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                <div>
                  <div className="text-xs sm:text-sm text-gray-500">Average rating</div>
                  <div className="text-xl sm:text-2xl font-bold text-orange-500">{avg.toFixed(1)} <span className="text-gray-400 text-sm sm:text-base">/ 5</span></div>
                </div>
              </div>
            </div>
            {user ? (
              <>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">Your name (max 3 characters)</label>
                      <input 
                        value={name} 
                        onChange={e => setName(e.target.value.slice(0, 3).toUpperCase())} 
                        placeholder="Max 3 chars" 
                        maxLength={3}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-200 rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">Rating</label>
                      <div className="flex items-center gap-1 sm:gap-2">
                        {[1,2,3,4,5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`p-1.5 sm:p-2 rounded-xl transition-colors duration-200 ${
                              star <= rating 
                                ? 'text-orange-400 hover:text-orange-500' 
                                : 'text-gray-300 hover:text-gray-400'
                            }`}
                          >
                            <Star 
                              className="w-6 h-6 sm:w-8 sm:h-8" 
                              fill={star <= rating ? 'currentColor' : 'none'}
                            />
                          </button>
                        ))}
                        <span className="ml-2 sm:ml-3 text-sm sm:text-base font-medium text-gray-600">
                          {rating} star{rating !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">Your review</label>
                      <textarea 
                        value={text} 
                        onChange={e => setText(e.target.value)} 
                        rows={6} 
                        placeholder="Share your experience with MedSoils..." 
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-200 rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                      />
                      <div className="mt-2 text-xs sm:text-sm text-gray-500">
                        {text.length}/500 characters
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={!text.trim()}
                      className="w-full py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-amber-500 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] disabled:hover:scale-100 disabled:hover:shadow-none disabled:cursor-not-allowed"
                    >
                      {text.trim() ? 'Submit Review' : 'Write your review first'}
                    </button>
                  </div>
                  
                  {success && (
                    <div className="md:col-span-2 flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div className="text-sm sm:text-base text-green-700 font-medium">{success}</div>
                    </div>
                  )}
                </form>
              </>
            ) : (
              <>
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 px-4">Sign in required</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-md mx-auto px-4">
                    Join our community to share your experience and help others make informed decisions.
                  </p>
                  <button 
                    onClick={() => navigate('/login')} 
                    className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In to Review
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Reviews Carousel */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800"> <strong className="text-orange-500">Community</strong> Reviews</h2>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-orange-500 hidden sm:inline">
                {currentIndex + 1} - {Math.min(currentIndex + itemsPerPage, reviews.length)} of {reviews.length}
              </span>
              <div className="flex gap-1 sm:gap-2">
                <button
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-orange-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={currentIndex >= reviews.length - itemsPerPage}
                  className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-orange-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden">
            <motion.div 
              className="flex gap-3 sm:gap-4 md:gap-6"
              animate={{ x: `${-currentIndex * (100 / itemsPerPage)}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {reviews.map(r => (
                <div key={r._id || r.id} className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0">
                  <ReviewCard r={r} user={user} onDelete={requestDelete} deleting={deletingIds.includes(r._id || r.id)} />
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Carousel dots */}
          <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
            {Array.from({ length: Math.ceil(reviews.length / itemsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * itemsPerPage)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                  Math.floor(currentIndex / itemsPerPage) === index
                    ? 'bg-orange-500 scale-110'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
          <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                viewport={{ once: true }}
                className="relative w-full h-[3px] bg-gradient-to-r from-transparent via-orange-400 to-transparent origin-center my-8"
          />
      <Footer />
      {/* Confirm Delete Modal */}
      {confirmReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={cancelDelete} />
          <div className="relative bg-white max-w-lg w-full rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-xl">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Delete review</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Are you sure you want to delete this review? This action cannot be undone.</p>
            <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-200 flex items-center justify-center font-semibold text-xs sm:text-sm text-orange-700 shrink-0">{(confirmReview.name || '').slice(0,3)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{(confirmReview.name || 'Anonymous').toUpperCase()}</p>
                    <div className="flex items-center gap-1 text-orange-500 font-semibold text-xs sm:text-sm shrink-0">{confirmReview.rating} <Star className="w-3 h-3 sm:w-4 sm:h-4" /></div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">{confirmReview.text}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 sm:gap-3">
              <button onClick={cancelDelete} className="px-3 sm:px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm sm:text-base">Cancel</button>
              <button
                onClick={performDelete}
                disabled={deletingIds.includes(confirmReview._id || confirmReview.id)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-white text-sm sm:text-base ${deletingIds.includes(confirmReview._id || confirmReview.id) ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'}`}
              >
                {deletingIds.includes(confirmReview._id || confirmReview.id) ? 'Deleting...' : 'Delete review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
