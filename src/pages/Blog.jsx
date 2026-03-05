import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PenLine, Calendar, Tag, ArrowRight, X, Search,
  BookOpen, Users, TrendingUp, ChevronLeft, ChevronRight, Sparkles, ExternalLink,
} from 'lucide-react'
import Footer from '../components/layout/Footer'
import BlogEditor from '../components/blog/BlogEditor'
import { fetchBlogs, createBlog } from '../services/blogService'

/* ─── auth guard ─── */
function useCurrentUser() {
  const [user, setUser] = useState(null)

  function sync() {
    try { setUser(JSON.parse(localStorage.getItem('user'))) } catch { setUser(null) }
  }

  useEffect(() => {
    sync()
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  return user
}

/* ─── helpers ─── */
function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim()
}
function firstImage(html) {
  const m = (html || '').match(/<img[^>]+src=["']([^"']+)["']/i)
  return m ? m[1] : null
}
function readTime(html) {
  const words = stripHtml(html).split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}
function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'
}
function avatarColor(name = '') {
  const colors = ['bg-orange-400','bg-amber-400','bg-rose-400','bg-violet-400','bg-teal-400','bg-sky-400']
  return colors[name.charCodeAt(0) % colors.length]
}

/* ─── skeleton card ─── */
function SkeletonCard({ big }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse ${big ? 'col-span-2 row-span-2' : ''}`}>
      <div className={`bg-gray-200 ${big ? 'h-72' : 'h-44'} w-full`} />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 rounded-full w-1/4" />
        <div className="h-5 bg-gray-200 rounded-full w-3/4" />
        <div className="h-3 bg-gray-200 rounded-full w-full" />
        <div className="h-3 bg-gray-200 rounded-full w-2/3" />
      </div>
    </div>
  )
}

/* ─── post card ─── */
function PostCard({ post, onClick, wide }) {
  const coverSrc = post.bannerImage || post.coverImage || firstImage(post.content)
  const excerpt  = stripHtml(post.excerpt || post.content).slice(0, wide ? 220 : 120)
  const mins     = readTime(post.content || post.excerpt || '')

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`cursor-pointer group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex ${
        wide ? 'flex-col sm:flex-row sm:h-80' : 'flex-col h-full'
      }`}
    >
      {/* cover */}
      {coverSrc && (
        <div className={`overflow-hidden bg-gray-100 shrink-0 ${
          wide ? 'w-full h-72 sm:w-96 sm:h-full' : 'h-64 w-full'
        }`}>
          <img src={coverSrc} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={e => { e.currentTarget.parentElement.style.display = 'none' }} />
        </div>
      )}

      {/* body */}
      <div className={`flex flex-col flex-1 ${wide ? 'p-7' : 'p-5'}`}>
        {/* tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map(t => (
              <span key={t} className="inline-flex items-center gap-1 text-xs bg-orange-50 text-orange-600 border border-orange-100 rounded-full px-2.5 py-0.5 font-medium">
                <Tag size={9} />{t}
              </span>
            ))}
          </div>
        )}

        <h3 className={`font-bold text-gray-800 leading-snug group-hover:text-orange-600 transition-colors ${
          wide ? 'text-xl sm:text-2xl mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-none' : 'text-base mb-2 line-clamp-2'
        }`}>
          {post.title}
        </h3>

        {excerpt && (
          <p className={`text-gray-500 leading-relaxed ${
            wide ? 'text-sm mb-4 line-clamp-3' : 'text-xs line-clamp-2 mb-3'
          }`}>
            {excerpt}{excerpt.length >= (wide ? 220 : 120) ? '…' : ''}
          </p>
        )}

        {/* meta */}
        <div className="mt-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${avatarColor(post.authorName)}`}>
              {initials(post.authorName)}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 leading-none">{post.authorName}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                <Calendar size={9} />
                {new Date(post.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                <span className="mx-1">·</span>
                <BookOpen size={9} /> {mins} min read
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-orange-500 group-hover:gap-2 transition-all">
            Read <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </motion.article>
  )
}

/* ════════════════════════════ Blog page ════════════════════════════ */
export default function Blog() {
  const user     = useCurrentUser()
  const navigate = useNavigate()

  const [posts,        setPosts]        = useState([])
  const [page,         setPage]         = useState(1)
  const [pages,        setPages]        = useState(1)
  const [total,        setTotal]        = useState(0)
  const [loadingList,  setLoadingList]  = useState(false)
  const [loadingCreate,setLoadingCreate]= useState(false)
  const [listError,    setListError]    = useState('')
  const [showEditor,   setShowEditor]   = useState(false)
  const [successMsg,   setSuccessMsg]   = useState('')
  const [search,       setSearch]       = useState('')
  const [activeTag,    setActiveTag]    = useState('')
  const [sortBy,       setSortBy]       = useState('newest')

  /* ─── load posts ─── */
  const loadPosts = useCallback(async () => {
    setLoadingList(true)
    setListError('')
    try {
      const data = await fetchBlogs(page, 9)
      setPosts(data.posts)
      setPages(data.pagination.pages)
      setTotal(data.pagination.total)
    } catch (err) {
      setListError(err.message)
    } finally {
      setLoadingList(false)
    }
  }, [page])

  useEffect(() => { loadPosts() }, [loadPosts])

  /* ─── all tags across loaded posts ─── */
  const allTags = useMemo(() => {
    const set = new Set()
    posts.forEach(p => p.tags?.forEach(t => set.add(t)))
    return [...set]
  }, [posts])

  /* ─── filtered posts ─── */
  const visible = useMemo(() => {
    let arr = posts
    if (activeTag) arr = arr.filter(p => p.tags?.includes(activeTag))
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      arr = arr.filter(p =>
        p.title.toLowerCase().includes(q) ||
        stripHtml(p.excerpt).toLowerCase().includes(q) ||
        p.authorName?.toLowerCase().includes(q)
      )
    }
    // date filter
    if (sortBy === 'week') {
      const cut = new Date(); cut.setDate(cut.getDate() - 7)
      arr = arr.filter(p => new Date(p.createdAt) >= cut)
    } else if (sortBy === 'month') {
      const cut = new Date(); cut.setMonth(cut.getMonth() - 1)
      arr = arr.filter(p => new Date(p.createdAt) >= cut)
    } else if (sortBy === 'year') {
      const cut = new Date(); cut.setFullYear(cut.getFullYear() - 1)
      arr = arr.filter(p => new Date(p.createdAt) >= cut)
    }
    // sort direction
    if (sortBy === 'oldest') {
      arr = [...arr].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else {
      arr = [...arr].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    return arr
  }, [posts, activeTag, search, sortBy])

  /* ─── publish ─── */
  async function handlePublish(payload) {
    setLoadingCreate(true)
    try {
      await createBlog(payload)
      setSuccessMsg('Post published! 🎉')
      setShowEditor(false)
      setPage(1)
      await loadPosts()
      setTimeout(() => setSuccessMsg(''), 4000)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoadingCreate(false)
    }
  }

  return (
    <>
      {/* single continuous background for the whole page */}
      <div className="bg-white" style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f8fafc 55%, #fdf6ee 100%)' }}>

      {/* ══════════ HERO ══════════ */}
      <div className="relative overflow-hidden">
        {/* orange orb — top right */}
        <div className="pointer-events-none absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%)' }} />

        {/* cyan orb — bottom left */}
        <div className="pointer-events-none absolute -bottom-32 -left-32 w-[550px] h-[550px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 65%)' }} />

        {/* dot pattern — top left */}
        <motion.svg className="absolute top-10 left-10 pointer-events-none" width="130" height="130" viewBox="0 0 130 130"
          initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ duration: 1, delay: 0.4 }}>
          {Array.from({ length: 5 }).map((_, row) => Array.from({ length: 5 }).map((_, col) => (
            <circle key={`dot-tl-${row}-${col}`} cx={col * 26 + 13} cy={row * 26 + 13} r="2" fill="#f97316" />
          )))}
        </motion.svg>

        {/* dot pattern — bottom right */}
        <motion.svg className="absolute bottom-10 right-10 pointer-events-none" width="130" height="130" viewBox="0 0 130 130"
          initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} transition={{ duration: 1, delay: 0.6 }}>
          {Array.from({ length: 5 }).map((_, row) => Array.from({ length: 5 }).map((_, col) => (
            <circle key={`dot-br-${row}-${col}`} cx={col * 26 + 13} cy={row * 26 + 13} r="2" fill="#0ea5e9" />
          )))}
        </motion.svg>

        {/* abstract intersecting gray lines background - hero */}
        <motion.svg 
          className="absolute inset-0 w-full h-full pointer-events-none select-none" 
          xmlns="http://www.w3.org/2000/svg" 
          preserveAspectRatio="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          <defs>
            <linearGradient id="hero-line-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e5e5e5" stopOpacity="0" />
              <stop offset="50%" stopColor="#d4d4d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#e5e5e5" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="hero-line-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a3a3a3" stopOpacity="0" />
              <stop offset="50%" stopColor="#737373" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#a3a3a3" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          <motion.line 
            x1="0%" y1="15%" x2="100%" y2="35%" 
            stroke="url(#hero-line-grad-1)" 
            strokeWidth="1.5" 
            opacity="0.6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          />
          <motion.line 
            x1="0%" y1="45%" x2="100%" y2="25%" 
            stroke="#e5e5e5" 
            strokeWidth="1" 
            opacity="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.3, delay: 0.7, ease: "easeInOut" }}
          />
          <motion.line 
            x1="0%" y1="70%" x2="100%" y2="85%" 
            stroke="url(#hero-line-grad-1)" 
            strokeWidth="2" 
            opacity="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: 0.9, ease: "easeInOut" }}
          />
          
          <motion.line 
            x1="100%" y1="10%" x2="0%" y2="40%" 
            stroke="#737373" 
            strokeWidth="1.5" 
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, delay: 0.6, ease: "easeInOut" }}
          />
          <motion.line 
            x1="100%" y1="55%" x2="0%" y2="75%" 
            stroke="url(#hero-line-grad-2)" 
            strokeWidth="1" 
            opacity="0.35"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
          />
          <motion.line 
            x1="100%" y1="90%" x2="0%" y2="60%" 
            stroke="#a3a3a3" 
            strokeWidth="1.5" 
            opacity="0.25"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: 1, ease: "easeInOut" }}
          />
          
          <motion.line 
            x1="0%" y1="20%" x2="100%" y2="20%" 
            stroke="#d4d4d4" 
            strokeWidth="1" 
            opacity="0.35"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 1.1, ease: "easeInOut" }}
          />
          <motion.line 
            x1="0%" y1="48%" x2="100%" y2="48%" 
            stroke="url(#hero-line-grad-1)" 
            strokeWidth="2" 
            opacity="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.3, delay: 1.2, ease: "easeInOut" }}
          />
          <motion.line 
            x1="0%" y1="78%" x2="100%" y2="78%" 
            stroke="#a3a3a3" 
            strokeWidth="1" 
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: 1.3, ease: "easeInOut" }}
          />
          
          <motion.line 
            x1="18%" y1="0%" x2="18%" y2="100%" 
            stroke="#e5e5e5" 
            strokeWidth="1" 
            opacity="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, delay: 0.4, ease: "easeInOut" }}
          />
          <motion.line 
            x1="38%" y1="0%" x2="38%" y2="100%" 
            stroke="url(#hero-line-grad-2)" 
            strokeWidth="1.5" 
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.7, delay: 0.6, ease: "easeInOut" }}
          />
          <motion.line 
            x1="62%" y1="0%" x2="62%" y2="100%" 
            stroke="#d4d4d4" 
            strokeWidth="1" 
            opacity="0.35"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.9, delay: 0.8, ease: "easeInOut" }}
          />
          <motion.line 
            x1="85%" y1="0%" x2="85%" y2="100%" 
            stroke="#737373" 
            strokeWidth="1.5" 
            opacity="0.25"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, delay: 1, ease: "easeInOut" }}
          />
          
          <motion.line 
            x1="10%" y1="0%" x2="90%" y2="100%" 
            stroke="#e5e5e5" 
            strokeWidth="1" 
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
          />
          <motion.line 
            x1="90%" y1="0%" x2="10%" y2="100%" 
            stroke="#a3a3a3" 
            strokeWidth="1" 
            opacity="0.25"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.7, ease: "easeInOut" }}
          />
        </motion.svg>

        <div className="relative container mx-auto px-4 py-14 md:py-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-500 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-orange-200/60">
              <Sparkles size={14} /> MedSoils Community
            </span>
            <h1 className="text-6xl md:text-8xl font-extrabold text-gray-800 leading-tight mb-6">
              The <span className="text-orange-500">Soil Science</span> Blog
            </h1>
            <p className="text-gray-500 text-xl md:text-2xl mb-10 leading-relaxed">
              Insights, research, and stories from the Mediterranean soil community.
            </p>

            {/* stats */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 mb-8 text-gray-400 text-xs sm:text-sm flex-wrap">
              <span className="flex items-center gap-1.5"><BookOpen size={14} />{total} article{total !== 1 ? 's' : ''}</span>
              <span className="hidden sm:block w-px h-4 bg-gray-200" />
              <span className="hidden sm:flex items-center gap-1.5"><Users size={14} />Community writers</span>
              <span className="hidden sm:block w-px h-4 bg-gray-200" />
              <span className="hidden sm:flex items-center gap-1.5"><TrendingUp size={14} />Trending topics</span>
            </div>

            {/* search */}
            <div className="relative max-w-md mx-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search posts, topics, authors…"
                className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl text-sm text-gray-700 placeholder-gray-400 outline-none shadow-lg shadow-orange-100/50 border border-orange-100 focus:ring-2 focus:ring-orange-200"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* sort / date filter pills */}
            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              {[
                { key: 'newest', label: 'Newest' },
                { key: 'oldest', label: 'Oldest' },
                { key: 'week',   label: 'This week' },
                { key: 'month',  label: 'This month' },
                { key: 'year',   label: 'This year' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(opt.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                    sortBy === opt.key
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-white/80 text-gray-500 border border-orange-100 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── page body ── */}
      <div className="relative min-h-screen overflow-hidden">

        {/* abstract intersecting gray lines background */}
        <motion.svg 
          className="absolute inset-0 w-full h-full pointer-events-none select-none" 
          xmlns="http://www.w3.org/2000/svg" 
          preserveAspectRatio="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          <defs>
            <linearGradient id="line-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e5e5e5" stopOpacity="0" />
              <stop offset="50%" stopColor="#d4d4d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#e5e5e5" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="line-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a3a3a3" stopOpacity="0" />
              <stop offset="50%" stopColor="#737373" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#a3a3a3" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* diagonal lines - light */}
          <motion.line 
            x1="0%" y1="15%" x2="100%" y2="35%" 
            stroke="url(#line-grad-1)" 
            strokeWidth="1.5" 
            opacity="0.6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          />
          <motion.line 
            x1="0%" y1="45%" x2="100%" y2="25%" 
            stroke="#e5e5e5" 
            strokeWidth="1" 
            opacity="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.3, delay: 0.7, ease: "easeInOut" }}
          />
          <motion.line 
            x1="0%" y1="70%" x2="100%" y2="85%" 
            stroke="url(#line-grad-1)" 
            strokeWidth="2" 
            opacity="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: 0.9, ease: "easeInOut" }}
          />
          
          {/* diagonal lines - dark */}
          <motion.line 
            x1="100%" y1="10%" x2="0%" y2="40%" 
            stroke="#737373" 
            strokeWidth="1.5" 
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, delay: 0.6, ease: "easeInOut" }}
          />
          <motion.line 
            x1="100%" y1="55%" x2="0%" y2="75%" 
            stroke="url(#line-grad-2)" 
            strokeWidth="1" 
            opacity="0.35"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
          />
          <motion.line 
            x1="100%" y1="90%" x2="0%" y2="60%" 
            stroke="#a3a3a3" 
            strokeWidth="1.5" 
            opacity="0.25"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: 1, ease: "easeInOut" }}
          />
          
          {/* horizontal lines */}
          <motion.line 
            x1="0%" y1="20%" x2="100%" y2="20%" 
            stroke="#d4d4d4" 
            strokeWidth="1" 
            opacity="0.35"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 1.1, ease: "easeInOut" }}
          />
          <motion.line 
            x1="0%" y1="48%" x2="100%" y2="48%" 
            stroke="url(#line-grad-1)" 
            strokeWidth="2" 
            opacity="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.3, delay: 1.2, ease: "easeInOut" }}
          />
          <motion.line 
            x1="0%" y1="78%" x2="100%" y2="78%" 
            stroke="#a3a3a3" 
            strokeWidth="1" 
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: 1.3, ease: "easeInOut" }}
          />
          
          {/* vertical lines */}
          <motion.line 
            x1="18%" y1="0%" x2="18%" y2="100%" 
            stroke="#e5e5e5" 
            strokeWidth="1" 
            opacity="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, delay: 0.4, ease: "easeInOut" }}
          />
          <motion.line 
            x1="38%" y1="0%" x2="38%" y2="100%" 
            stroke="url(#line-grad-2)" 
            strokeWidth="1.5" 
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.7, delay: 0.6, ease: "easeInOut" }}
          />
          <motion.line 
            x1="62%" y1="0%" x2="62%" y2="100%" 
            stroke="#d4d4d4" 
            strokeWidth="1" 
            opacity="0.35"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.9, delay: 0.8, ease: "easeInOut" }}
          />
          <motion.line 
            x1="85%" y1="0%" x2="85%" y2="100%" 
            stroke="#737373" 
            strokeWidth="1.5" 
            opacity="0.25"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, delay: 1, ease: "easeInOut" }}
          />
          
          {/* additional diagonal intersections */}
          <motion.line 
            x1="10%" y1="0%" x2="90%" y2="100%" 
            stroke="#e5e5e5" 
            strokeWidth="1" 
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
          />
          <motion.line 
            x1="90%" y1="0%" x2="10%" y2="100%" 
            stroke="#a3a3a3" 
            strokeWidth="1" 
            opacity="0.25"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.7, ease: "easeInOut" }}
          />
        </motion.svg>

        {/* subtle dot grid */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="blog-dots" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="#f97316" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blog-dots)" />
        </svg>

        {/* ambient glow — right */}
        <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)' }} />
        {/* ambient glow — left */}
        <div className="absolute bottom-0 left-0 w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.04) 0%, transparent 70%)' }} />

        <div className="relative z-10 container mx-auto px-4 py-10 max-w-6xl">

        {/* ── success toast ── */}
        <AnimatePresence>
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-6 flex items-center justify-between bg-green-50 text-green-700 border border-green-200 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-sm"
            >
              {successMsg}
              <button onClick={() => setSuccessMsg('')}><X size={14} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── toolbar + editor: only for logged-in users ── */}
        {user && (<>
        {/* ── toolbar: tags + write button ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          {/* tag pills */}
          <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTag('')}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                !activeTag ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600'
              }`}
            >All</button>
            {allTags.map(t => (
              <button key={t}
                onClick={() => setActiveTag(a => a === t ? '' : t)}
                className={`shrink-0 flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                  activeTag === t ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600'
                }`}
              >
                <Tag size={9} />{t}
              </button>
            ))}
          </div>

          {/* write button */}
          <button
            onClick={() => setShowEditor(e => !e)}
            className={`w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 font-semibold rounded-xl transition shadow-md text-sm ${
              showEditor
                ? 'bg-gray-100 text-gray-700 shadow-none'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-200 hover:from-orange-600 hover:to-amber-600'
            }`}
          >
            <PenLine size={15} />
            {showEditor ? 'Close editor' : 'Write a post'}
          </button>
        </div>

        {/* ── editor panel ── */}
        <AnimatePresence>
          {showEditor && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-10"
            >
              {/* AI tip banner removed; guidance is available in the editor banner */}

              <BlogEditor onPublish={handlePublish} loading={loadingCreate} />
            </motion.div>
          )}
        </AnimatePresence>

        </>)} {/* end user-only toolbar */}

        {/* ── content ── */}
        {loadingList ? (
          <div className="space-y-6">
            <SkeletonCard big />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        ) : listError ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4 text-sm">{listError}</p>
            <button onClick={loadPosts} className="px-5 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition">Retry</button>
          </div>
        ) : visible.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 text-gray-400">
            <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <Search size={30} className="text-gray-300" />
            </div>
            <p className="text-lg font-semibold text-gray-500 mb-1">No posts found</p>
            <p className="text-sm">{search || activeTag ? 'Try a different search or tag.' : 'Be the first to write one!'}</p>
            {(search || activeTag) && (
              <button onClick={() => { setSearch(''); setActiveTag(''); setSortBy('newest') }}
                className="mt-4 text-orange-500 text-sm font-semibold hover:underline">Clear filters</button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {/* first post — full-width horizontal */}
            {visible[0] && (
              <motion.div key={visible[0]._id} layout className="mb-6">
                <PostCard post={visible[0]} wide onClick={() => navigate(`/blog/${visible[0]._id}`)} />
              </motion.div>
            )}

            {/* rest — uniform grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.slice(1).map((post, i) => (
                <motion.div key={post._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <PostCard post={post} onClick={() => navigate(`/blog/${post._id}`)} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* ── pagination ── */}
        {pages > 1 && !search && !activeTag && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-30 transition flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition ${
                  p === page ? 'bg-orange-500 text-white shadow-md shadow-orange-200' : 'bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >{p}</button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-30 transition flex items-center justify-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
      </div>

      </div>{/* end single-background wrapper */}

      <div aria-hidden="true" className="h-[3px] w-full"
        style={{ background: 'linear-gradient(90deg,transparent 0%,#f97316 30%,#fb923c 60%,transparent 100%)' }} />
      <Footer />
    </>
  )
}
