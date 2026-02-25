import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  PlayCircle, FileText, Image, Download,
  ExternalLink, Search, X, Trash2, Loader2,
  CheckCircle, AlertCircle, ChevronRight, Tag,
} from 'lucide-react'
import Footer from '../components/layout/Footer'
import { fetchResources, deleteResource } from '../services/resourceService'

/* ─── animation helpers ─── */
const ease = [0.16, 1, 0.3, 1]
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
}
const stagger = { show: { transition: { staggerChildren: 0.09 } } }

/* ─── constants ─── */
const CATEGORIES = ['All', 'Videos', 'PDFs', 'Images']

const TYPE_META = {
  video: { icon: PlayCircle, bg: 'bg-orange-50',  text: 'text-orange-500',  border: 'border-orange-100', label: 'Video' },
  pdf:   { icon: FileText,   bg: 'bg-amber-50',   text: 'text-amber-500',   border: 'border-amber-100',  label: 'PDF'   },
  image: { icon: Image,      bg: 'bg-teal-50',    text: 'text-teal-500',    border: 'border-teal-100',   label: 'Image' },
}

const CAT_TO_TYPE = { Videos: 'video', PDFs: 'pdf', Images: 'image' }

/* ─── auth hook ─── */
function useCurrentUser() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const sync = () => {
      try { setUser(JSON.parse(localStorage.getItem('user'))) } catch { setUser(null) }
    }
    sync()
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])
  return user
}

/* ─── Toast ─── */
function Toast({ msg, ok, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t) }, [onClose])
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-medium ${ok ? 'bg-emerald-500' : 'bg-red-500'}`}
    >
      {ok ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      {msg}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={16} /></button>
    </motion.div>
  )
}

/* ─── TypeBadge ─── */
function TypeBadge({ type }) {
  const { icon: Icon, bg, text, label } = TYPE_META[type] || {}
  if (!Icon) return null
  return (
    <span className={`inline-flex items-center gap-1 ${bg} ${text} rounded-full text-xs font-medium px-2 py-0.5`}>
      <Icon size={11} />{label}
    </span>
  )
}

/* ─── ResourceCard ─── */
/** Format meta label based on resource type */
function formatMeta(type, raw) {
  if (!raw) return ''
  const v = raw.trim()
  if (type === 'video') return /^\d+$/.test(v) ? `${v} min` : v
  if (type === 'pdf')   return /^\d+$/.test(v) ? `${v} pages` : v
  return v
}

function ResourceCard({ resource, isSuperadmin, onDelete }) {
  const { icon: Icon, bg, text, border } = TYPE_META[resource.type] || TYPE_META.pdf
  const hasThumb = Boolean(resource.thumbnail)
  const rawMeta  = resource.duration || resource.pages || resource.count || ''
  const meta     = formatMeta(resource.type, rawMeta)

  // For blob: or localhost URLs use direct iframe; for external public URLs use Google Docs Viewer
  const isLocal = url => url.startsWith('blob:') || url.startsWith('data:') || /^https?:\/\/(localhost|127\.0\.0\.1)/.test(url)
  const pdfEmbedUrl = resource.type === 'pdf' && resource.url
    ? (isLocal(resource.url) ? resource.url : `https://docs.google.com/gview?url=${encodeURIComponent(resource.url)}&embedded=true`)
    : null

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.25 }}
      className={`flex flex-col bg-white rounded-2xl border ${border} overflow-hidden group relative`}
    >
      {/* delete btn (superadmin only) */}
      {isSuperadmin && (
        <button
          onClick={() => onDelete(resource._id)}
          className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
          title="Delete resource"
        >
          <Trash2 size={13} />
        </button>
      )}

      {/* media area — always h-44 */}
      <div className="relative h-44 overflow-hidden shrink-0">
        {hasThumb ? (
          <>
            <img
              src={resource.thumbnail} alt={resource.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </>
        ) : pdfEmbedUrl ? (
          <>
            {/* live PDF preview — pointer-events off so it's purely visual */}
            <iframe
              src={pdfEmbedUrl}
              title={resource.title}
              className="absolute inset-0 w-full h-full border-0 scale-[1.02]"
              style={{ pointerEvents: 'none' }}
              loading="lazy"
            />
            {/* subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-50/80 via-transparent to-transparent" />
          </>
        ) : (
          <div className={`w-full h-full ${bg} flex items-center justify-center`}>
            <Icon size={48} className={`${text} opacity-60`} strokeWidth={1.2} />
          </div>
        )}

        {/* video play button */}
        {resource.type === 'video' && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="absolute inset-0 flex items-center justify-center"
            aria-label={`Watch ${resource.title}`}
          >
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform hover:bg-white">
              <PlayCircle size={24} className="text-orange-500" />
            </div>
          </a>
        )}

        <div className="absolute top-3 left-3"><TypeBadge type={resource.type} /></div>
      </div>

      {/* content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          {resource.tag
            ? <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${bg} ${text} border ${border}`}>
                <Tag size={10} />{resource.tag}
              </span>
            : <span />}
          {meta && <span className="text-xs font-medium text-gray-400 shrink-0 tabular-nums">{meta}</span>}
        </div>
        <h3 className="font-extrabold text-gray-900 text-lg leading-snug mb-2 group-hover:text-orange-500 transition-colors line-clamp-2 tracking-tight">
          {resource.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
          {resource.description}
        </p>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold ${text} hover:underline`}
          onClick={e => e.stopPropagation()}
        >
          {resource.type === 'video' ? <><PlayCircle size={14} /> Watch</>
           : resource.type === 'image' ? <><ExternalLink size={14} /> View gallery</>
           : <><Download size={14} /> Download</>}
        </a>
      </div>
    </motion.article>
  )
}

/* ─────────────────────────────────────
   Admin navigation card
───────────────────────────────────────*/
function AdminNavCard({ icon: Icon, accent, title, subtitle, to }) {
  const navigate = useNavigate()
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(to)}
      className={`w-full text-left flex items-center gap-5 px-6 py-5 rounded-3xl border-2 ${accent.border} ${accent.bg} hover:shadow-lg transition-all group`}
    >
      <div className={`w-13 h-13 w-12 h-12 rounded-2xl ${accent.iconBg} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-gray-800 text-base mb-0.5`}>{title}</p>
        <p className="text-xs text-gray-400 truncate">{subtitle}</p>
      </div>
      <ChevronRight size={18} className={`${accent.text} opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
    </motion.button>
  )
}

/* ─────────────────────────────────────
   [legacy - kept for reference, not rendered]
───────────────────────────────────────*/
function VideoAdminCard({ onCreated, onToast }) {
  const EMPTY = { title: '', description: '', url: '', thumbnail: '', tag: '', duration: '' }
  const [form, setForm]       = useState(EMPTY)
  const [open, setOpen]       = useState(false)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.description.trim() || !form.url.trim()) {
      setError('Title, description and URL are required.')
      return
    }
    setSaving(true)
    try {
      const resource = await createResource({ ...form, type: 'video' })
      onCreated(resource)
      onToast('Video added!')
      setForm(EMPTY)
      setOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      layout
      className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/60 overflow-hidden"
    >
      {/* header */}
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setError('') }}
        className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-orange-50 transition"
      >
        <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shrink-0 shadow">
          <PlayCircle size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-800 text-base">Add Video</p>
          <p className="text-xs text-gray-400 mt-0.5">Paste a YouTube, Vimeo or any video URL</p>
        </div>
        {open ? <ChevronUp size={18} className="text-orange-400" /> : <ChevronDown size={18} className="text-orange-400" />}
      </button>

      {/* form */}
      <AnimatePresence>
        {open && (
          <motion.form
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}
            onSubmit={handleSubmit}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4 border-t border-orange-100">
              <div className="pt-4">
                <label className={lCls}>Video URL *</label>
                <div className="relative">
                  <Link2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input className={`${iCls} pl-9`} placeholder="https://youtube.com/watch?v=… or https://vimeo.com/…" value={form.url} onChange={e => set('url', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={lCls}>Title *</label>
                <input className={iCls} placeholder="e.g. Introduction to Mediterranean Soil Science" value={form.title} onChange={e => set('title', e.target.value)} />
              </div>
              <div>
                <label className={lCls}>Description *</label>
                <textarea className={`${iCls} resize-none`} rows={2} placeholder="Brief description…" value={form.description} onChange={e => set('description', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lCls}>Tag</label>
                  <input className={iCls} placeholder="e.g. Case Study" value={form.tag} onChange={e => set('tag', e.target.value)} />
                </div>
                <div>
                  <label className={lCls}>Duration</label>
                  <input className={iCls} placeholder="e.g. 18 min" value={form.duration} onChange={e => set('duration', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={lCls}>Thumbnail URL <span className="normal-case text-gray-400 font-normal">(optional)</span></label>
                <input className={iCls} placeholder="https://… (cover image)" value={form.thumbnail} onChange={e => set('thumbnail', e.target.value)} />
              </div>
              {error && <p className="text-sm text-red-500 flex items-center gap-1.5"><AlertCircle size={13} />{error}</p>}
              <button
                type="submit" disabled={saving}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><PlayCircle size={14} /> Publish video</>}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─────────────────────────────────────
   PDF upload card
───────────────────────────────────────*/
function PdfAdminCard({ onCreated, onToast }) {
  const EMPTY = { title: '', description: '', url: '', tag: '', pages: '' }
  const [form, setForm]     = useState(EMPTY)
  const [open, setOpen]     = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')
  const [fileName, setFileName] = useState('')
  const fileRef = useRef(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // If user picks a local file, show its name and use a blob URL as the URL
  const handleFile = e => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    set('url', URL.createObjectURL(file))
    if (!form.title) set('title', file.name.replace(/\.pdf$/i, ''))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.description.trim() || !form.url.trim()) {
      setError('Title, description and PDF URL / file are required.')
      return
    }
    setSaving(true)
    try {
      const resource = await createResource({ ...form, type: 'pdf' })
      onCreated(resource)
      onToast('PDF added!')
      setForm(EMPTY)
      setFileName('')
      setOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      layout
      className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/60 overflow-hidden"
    >
      {/* header */}
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setError('') }}
        className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-amber-50 transition"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shrink-0 shadow">
          <FileText size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-800 text-base">Add PDF</p>
          <p className="text-xs text-gray-400 mt-0.5">Upload a local PDF or paste a document URL</p>
        </div>
        {open ? <ChevronUp size={18} className="text-amber-400" /> : <ChevronDown size={18} className="text-amber-400" />}
      </button>

      {/* form */}
      <AnimatePresence>
        {open && (
          <motion.form
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}
            onSubmit={handleSubmit}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4 border-t border-amber-100">
              {/* file picker */}
              <div className="pt-4">
                <label className={lCls}>PDF File <span className="normal-case text-gray-400 font-normal">(or paste URL below)</span></label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-amber-200 bg-white cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition"
                >
                  <UploadCloud size={20} className="text-amber-400 shrink-0" />
                  <span className="text-sm text-gray-500 truncate">
                    {fileName || 'Click to select a PDF…'}
                  </span>
                </div>
                <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFile} />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or paste URL</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div>
                <label className={lCls}>PDF URL *</label>
                <div className="relative">
                  <Link2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input className={`${iCls} pl-9`} placeholder="https://drive.google.com/… or direct .pdf link" value={form.url} onChange={e => { set('url', e.target.value); setFileName('') }} />
                </div>
              </div>
              <div>
                <label className={lCls}>Title *</label>
                <input className={iCls} placeholder="e.g. MEDSOILS Programme Brochure" value={form.title} onChange={e => set('title', e.target.value)} />
              </div>
              <div>
                <label className={lCls}>Description *</label>
                <textarea className={`${iCls} resize-none`} rows={2} placeholder="Brief description…" value={form.description} onChange={e => set('description', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lCls}>Tag</label>
                  <input className={iCls} placeholder="e.g. Programme" value={form.tag} onChange={e => set('tag', e.target.value)} />
                </div>
                <div>
                  <label className={lCls}>Pages</label>
                  <input className={iCls} placeholder="e.g. 24 pages" value={form.pages} onChange={e => set('pages', e.target.value)} />
                </div>
              </div>
              {error && <p className="text-sm text-red-500 flex items-center gap-1.5"><AlertCircle size={13} />{error}</p>}
              <button
                type="submit" disabled={saving}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><FileText size={14} /> Publish PDF</>}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─────────────────────────────────────
   Page
───────────────────────────────────────*/
export default function Resources() {
  const user = useCurrentUser()
  const isSuperadmin = user?.role === 'superadmin'

  const [resources,      setResources]      = useState([])
  const [loading,        setLoading]        = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery,    setSearchQuery]    = useState('')
  const [toast,          setToast]          = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchResources()
      setResources(data)
    } catch (err) {
      setToast({ msg: err.message, ok: false })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = resources.filter(r => {
    const typeFilter = activeCategory === 'All' || r.type === CAT_TO_TYPE[activeCategory]
    const textFilter = !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.tag || '').toLowerCase().includes(searchQuery.toLowerCase())
    return typeFilter && textFilter
  })

  const stats = [
    { label: 'Videos', count: resources.filter(r => r.type === 'video').length, icon: PlayCircle, color: 'text-orange-500' },
    { label: 'PDFs',   count: resources.filter(r => r.type === 'pdf').length,   icon: FileText,   color: 'text-amber-500'  },
    { label: 'Images', count: resources.filter(r => r.type === 'image').length, icon: Image,      color: 'text-teal-500'   },
  ]

  const handleCreated = resource => {
    setResources(prev => [resource, ...prev])
    setToast({ msg: 'Resource created!', ok: true })
  }

  const handleDelete = async id => {
    if (!confirm('Delete this resource?')) return
    try {
      await deleteResource(id)
      setResources(prev => prev.filter(r => r._id !== id))
      setToast({ msg: 'Resource deleted.', ok: true })
    } catch (err) {
      setToast({ msg: err.message, ok: false })
    }
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden pt-16 pb-20"
        style={{ background: 'linear-gradient(135deg, #dcf6f8 0%, #edfcfd 50%, #dcf6f8 100%)', overflow: 'clip' }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-[0.07]" style={{ clipPath: 'inset(0)' }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="resources-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#f97316" strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#resources-grid)" />
        </svg>
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-20 -left-20 w-[340px] h-[340px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
            className="text-sm font-semibold tracking-widest uppercase text-orange-500 mb-4"
          >
            Knowledge Hub
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-5"
          >
            <span className="text-orange-500">Resources</span> &amp; Materials
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease }}
            className="max-w-2xl mx-auto text-lg text-gray-500 mb-10"
          >
            Videos, documents and image galleries curated by the MEDSOILS Challenge team
            to support students, researchers, and soil-science enthusiasts.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease }}
            className="max-w-xl mx-auto relative"
          >
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text" placeholder="Search resources…"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-gray-200 bg-white shadow-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-gray-400 hover:text-gray-600 transition">
                <X size={16} />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-center gap-12 sm:gap-20">
          {stats.map(({ label, count, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                <Icon size={20} className={color} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{count}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Toolbar ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500'
              }`}
            >
              {cat}
            </button>
          ))}
          {searchQuery && (
            <span className="ml-2 text-sm text-gray-400">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;<span className="text-gray-700 font-medium">{searchQuery}</span>&rdquo;
            </span>
          )}
        </div>


      </section>

      {/* ── Superadmin panel ── */}
      {isSuperadmin && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
              Admin panel — add content
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminNavCard
                icon={PlayCircle}
                title="Add Video"
                subtitle="Paste a YouTube, Vimeo or any video URL"
                to="/resources/add/video"
                accent={{ bg: 'bg-orange-50/70', border: 'border-orange-200', iconBg: 'bg-orange-500', text: 'text-orange-500' }}
              />
              <AdminNavCard
                icon={FileText}
                title="Add PDF"
                subtitle="Upload a local PDF or paste a document URL"
                to="/resources/add/pdf"
                accent={{ bg: 'bg-amber-50/70', border: 'border-amber-200', iconBg: 'bg-amber-500', text: 'text-amber-500' }}
              />
            </div>
          </motion.div>
        </section>
      )}

      {/* ── Grid ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[40vh]">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 gap-3">
            <Loader2 size={28} className="animate-spin text-orange-400" />
            <span>Loading resources…</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4"
              >
                <Search size={40} strokeWidth={1.3} />
                <p className="text-lg font-medium">No resources found</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All') }}
                  className="text-sm text-orange-500 hover:underline"
                >
                  Clear filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={activeCategory + searchQuery}
                variants={stagger} initial="hidden" animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map(r => (
                  <ResourceCard
                    key={r._id} resource={r}
                    isSuperadmin={isSuperadmin}
                    onDelete={handleDelete}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </section>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} ok={toast.ok} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
