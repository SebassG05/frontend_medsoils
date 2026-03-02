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
    <span className={`inline-flex items-center gap-1.5 ${bg} ${text} rounded-xl text-sm font-bold px-3.5 py-2 shadow-lg backdrop-blur-sm bg-opacity-95 border ${TYPE_META[type]?.border}`}>
      <Icon size={14} strokeWidth={2.5} />{label}
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

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -8, boxShadow: '0 25px 50px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col bg-white rounded-3xl border ${border} overflow-hidden group relative shadow-lg hover:shadow-2xl`}
    >
      {/* delete btn (superadmin only) */}
      {isSuperadmin && (
        <button
          onClick={() => onDelete(resource._id)}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          title="Delete resource"
        >
          <Trash2 size={16} />
        </button>
      )}

      {/* media area — larger */}
      <div className="relative h-56 overflow-hidden shrink-0">
        {hasThumb ? (
          <>
            <img
              src={resource.thumbnail} alt={resource.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </>
        ) : resource.type === 'pdf' ? (
          /* ─ Static PDF document preview ─ */
          <div className="w-full h-full bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
            <div className="w-28 bg-white rounded-xl shadow-lg p-4 flex flex-col gap-2 transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded bg-amber-100 flex items-center justify-center shrink-0">
                  <FileText size={13} className="text-amber-500" />
                </div>
                <div className="h-2 bg-gray-200 rounded-full flex-1" />
              </div>
              {[100, 80, 90, 70, 85].map((w, i) => (
                <div key={i} className="h-1.5 rounded-full bg-gray-100" style={{ width: `${w}%` }} />
              ))}
              <div className="h-1.5 rounded-full bg-amber-100 mt-0.5" style={{ width: '60%' }} />
            </div>
          </div>
        ) : (
          <div className={`w-full h-full ${bg} flex items-center justify-center`}>
            <Icon size={56} className={`${text} opacity-60`} strokeWidth={1.5} />
          </div>
        )}

        {/* video play button */}
        {resource.type === 'video' && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/10 transition-colors"
            aria-label={`Watch ${resource.title}`}
          >
            <div className="w-16 h-16 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all hover:bg-white">
              <PlayCircle size={32} className="text-orange-500" strokeWidth={2} />
            </div>
          </a>
        )}

        <div className="absolute top-4 left-4"><TypeBadge type={resource.type} /></div>
      </div>

      {/* content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          {resource.tag
            ? <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${bg} ${text} border ${border}`}>
                <Tag size={11} />{resource.tag}
              </span>
            : <span />}
          {meta && <span className="text-sm font-semibold text-gray-400 shrink-0 tabular-nums">{meta}</span>}
        </div>
        <h3 className="font-bold text-gray-900 text-xl leading-tight mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
          {resource.title}
        </h3>
        <p className="text-base text-gray-600 leading-relaxed line-clamp-3 flex-1 mb-5">
          {resource.description}
        </p>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-2 text-sm font-bold ${text} hover:bg-opacity-10 ${bg} py-3 px-4 rounded-xl transition-all hover:gap-3`}
          onClick={e => e.stopPropagation()}
        >
          {resource.type === 'video' ? <><PlayCircle size={16} strokeWidth={2.5} /> Watch Video</>
           : resource.type === 'image' ? <><ExternalLink size={16} strokeWidth={2.5} /> View Gallery</>
           : <><Download size={16} strokeWidth={2.5} /> Download PDF</>}
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
  const navigate = useNavigate()

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
        className="relative overflow-hidden pt-24 pb-40"
        style={{ background: 'linear-gradient(135deg, #dcf6f8 0%, #edfcfd 50%, #dcf6f8 100%)', overflow: 'clip' }}
      >
        <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
            className="text-sm font-semibold tracking-widest uppercase text-orange-500 mb-6"
          >
            Knowledge Hub
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-7"
          >
            <span className="text-orange-500">Resources</span> &amp; Materials
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease }}
            className="max-w-2xl mx-auto text-xl text-gray-500 mb-12"
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

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mt-16 flex items-center justify-center gap-16 sm:gap-24"
          >
            {stats.map(({ label, count, icon: Icon, color }) => (
              <div 
                key={label} 
                className="flex flex-col items-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm shadow-md border border-gray-100 flex items-center justify-center shrink-0 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <Icon size={32} className={color} strokeWidth={1.5} />
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 mb-1">{count}</p>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Wave shape at bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none" style={{ transform: 'rotate(180deg)' }}>
          <svg className="relative block w-full h-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="#ffffff"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="#ffffff"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      {/* ── Toolbar ── */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 pt-10 pb-4 flex items-center justify-between gap-4 flex-wrap">
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
        <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 pb-6">
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
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8 min-h-[40vh]">
        {!user ? (
          /* ─── not logged in: lock box ─── */
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center py-20"
          >
            <div className="bg-white border border-orange-100 rounded-3xl shadow-xl shadow-orange-50 px-10 py-12 max-w-md w-full text-center">
              <div className="w-16 h-16 bg-orange-50 border-2 border-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Members only</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-7">
                Sign in or create an account to access videos, documents and other materials in the MedSoils knowledge hub.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition shadow-lg shadow-orange-100"
              >
                Sign in / Register
              </button>
            </div>
          </motion.div>
        ) : loading ? (
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
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
      
          <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                viewport={{ once: true }}
                className="relative w-full h-[3px] bg-gradient-to-r from-transparent via-orange-400 to-transparent origin-center my-8"
          />
      <Footer />
    </div>
  )
}
