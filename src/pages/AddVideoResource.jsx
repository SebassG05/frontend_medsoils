import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, PlayCircle, Link2, Tag, Clock, Image as ImageIcon,
  AlignLeft, Type, Eye, Upload, CheckCircle, ChevronRight, Loader2, AlertCircle,
} from 'lucide-react'
import { createResource } from '../services/resourceService'

/* ─── helpers ─── */
const ease = [0.16, 1, 0.3, 1]

const EMPTY = { title: '', description: '', url: '', thumbnail: '', tag: '', duration: '' }

/** Derive a thumbnail from a video URL when no custom one is provided.
 *  Supports YouTube (watch, youtu.be, embed) and Vimeo. */
function getVideoThumbnail(url, customThumb) {
  if (customThumb?.trim()) return customThumb.trim()
  if (!url) return null
  // YouTube: youtube.com/watch?v=ID | youtu.be/ID | youtube.com/embed/ID
  const yt = url.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`
  // Vimeo: player.vimeo.com/video/ID or vimeo.com/ID
  const vm = url.match(/(?:vimeo\.com\/(?:video\/)?)([0-9]+)/)
  if (vm) return `https://vumbnail.com/${vm[1]}.jpg`
  return null
}

/* ─── Stepper ─── */
function Stepper({ step }) {
  const steps = ['Fill details', 'Preview', 'Published']
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, i) => {
        const idx = i + 1
        const done    = step > idx
        const current = step === idx
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  backgroundColor: done ? '#10b981' : current ? '#f97316' : '#e5e7eb',
                  scale: current ? 1.1 : 1,
                }}
                transition={{ duration: 0.35 }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-sm"
                style={{ color: (done || current) ? '#ffffff' : '#9ca3af' }}
              >
                {done ? <CheckCircle size={16} /> : idx}
              </motion.div>
              <span className={`text-xs font-semibold whitespace-nowrap ${current ? 'text-orange-500' : done ? 'text-emerald-500' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <motion.div
                animate={{ backgroundColor: step > idx ? '#10b981' : '#e5e7eb' }}
                transition={{ duration: 0.4 }}
                className="h-0.5 w-16 sm:w-24 mx-2 mt-[-14px] rounded-full"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Field ─── */
function Field({ icon: Icon, label, required, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        <Icon size={12} className="text-gray-400" />
        {label}
        {required && <span className="text-orange-400 text-base leading-none">*</span>}
      </label>
      {children}
    </div>
  )
}

const inp = 'w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/60 focus:border-orange-400 transition bg-white shadow-sm'

/** If purely numeric (e.g. "23") append " min". Otherwise keep as-is. */
function formatDuration(val) {
  if (!val) return ''
  return /^\d+$/.test(val.trim()) ? `${val.trim()} min` : val
}

/* ─── Preview Card ─── */
function PreviewCard({ form }) {
  const thumb = getVideoThumbnail(form.url, form.thumbnail)
  return (
    <div className="rounded-3xl border border-orange-100 bg-white shadow-xl overflow-hidden max-w-sm mx-auto">
      {/* thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center overflow-hidden">
        {thumb && (
          <img src={thumb} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className={`${thumb ? 'bg-black/30' : ''} absolute inset-0 flex items-center justify-center`}>
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40 shadow-lg">
            <PlayCircle size={28} className="text-white" />
          </div>
        </div>
        {/* tag */}
        {form.tag && (
          <span className="absolute top-3 right-3 text-xs font-semibold bg-white/90 text-orange-600 rounded-full px-2.5 py-0.5 shadow">
            {form.tag}
          </span>
        )}
      </div>
      {/* body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-bold text-gray-900 text-base leading-tight">
            {form.title || <span className="text-gray-300 italic">Untitled video</span>}
          </h3>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {form.description || <span className="text-gray-300 italic">No description yet…</span>}
        </p>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-500 rounded-full text-xs font-medium px-2.5 py-0.5">
            <PlayCircle size={11} /> Video
          </span>
          {form.duration && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock size={11} /> {formatDuration(form.duration)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Page ─── */
export default function AddVideoResource() {
  const navigate = useNavigate()
  const [step, setStep]       = useState(1)
  const [form, setForm]       = useState(EMPTY)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handlePreview = e => {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.description.trim() || !form.url.trim()) {
      setError('Title, description and video URL are required.')
      return
    }
    setStep(2)
  }

  const handlePublish = async () => {
    setSaving(true)
    setError('')
    try {
      const autoThumb = getVideoThumbnail(form.url, form.thumbnail)
      await createResource({ ...form, type: 'video', thumbnail: autoThumb || form.thumbnail })
      setStep(3)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
      setStep(2)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/60 via-white to-amber-50/40">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* back + page title */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => (step === 2 ? setStep(1) : navigate('/resources'))}
            className="p-2 rounded-full hover:bg-orange-100 transition text-orange-400 shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div>
              <p className="font-bold text-gray-900 text-lg leading-tight">Add video resource</p>
              <p className="text-xs text-gray-400">Fill in the details, preview and publish</p>
            </div>
          </div>
        </div>

        <Stepper step={step} />

        <AnimatePresence mode="wait">

          {/* ── STEP 1: Form ── */}
          {step === 1 && (
            <motion.form
              key="form"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease }}
              onSubmit={handlePreview}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
                <Field icon={Link2} label="Video URL" required>
                  <div className="relative">
                    <Link2 size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      className={`${inp} pl-10`}
                      placeholder="https://youtube.com/watch?v=… or Vimeo link"
                      value={form.url}
                      onChange={e => set('url', e.target.value)}
                    />
                  </div>
                </Field>

                <Field icon={Type} label="Title" required>
                  <input
                    className={inp}
                    placeholder="e.g. Introduction to Mediterranean Soil Science"
                    value={form.title}
                    onChange={e => set('title', e.target.value)}
                  />
                </Field>

                <Field icon={AlignLeft} label="Description" required>
                  <textarea
                    className={`${inp} resize-none`}
                    rows={4}
                    placeholder="Brief description of what the video covers…"
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field icon={Tag} label="Tag">
                    <input className={inp} placeholder="e.g. Case Study" value={form.tag} onChange={e => set('tag', e.target.value)} />
                  </Field>
                  <Field icon={Clock} label="Duration">
                    <input className={inp} placeholder="e.g. 18  (minutes)" value={form.duration} onChange={e => set('duration', e.target.value)} />
                  </Field>
                </div>

                <Field icon={ImageIcon} label="Thumbnail URL">
                  <div className="relative">
                    <ImageIcon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      className={`${inp} pl-10`}
                      placeholder="https://… (optional cover image)"
                      value={form.thumbnail}
                      onChange={e => set('thumbnail', e.target.value)}
                    />
                  </div>
                </Field>
              </div>

              {error && (
                <p className="flex items-center gap-2 text-sm text-red-500 bg-red-50 px-4 py-3 rounded-2xl border border-red-100">
                  <AlertCircle size={15} /> {error}
                </p>
              )}

              <button
                type="submit"
                className="cursor-pointer w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all text-sm"
              >
                Preview <Eye size={16} /> <ChevronRight size={16} />
              </button>
            </motion.form>
          )}

          {/* ── STEP 2: Preview / Review ── */}
          {step === 2 && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease }}
              className="space-y-8"
            >
              {/* preview label */}
              <div className="text-center">
                <p className="text-sm text-gray-400 font-medium">
                  This is how your resource will appear on the Resources page
                </p>
              </div>

              {/* card preview */}
              <PreviewCard form={form} />

              {/* metadata summary */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Details</h4>
                {[
                  { label: 'URL',         value: form.url },
                  { label: 'Title',       value: form.title },
                  { label: 'Description', value: form.description },
                  { label: 'Tag',         value: form.tag         || '—' },
                  { label: 'Duration',    value: form.duration    || '—' },
                  { label: 'Thumbnail',   value: form.thumbnail   || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-3 text-sm">
                    <span className="w-28 shrink-0 font-semibold text-gray-400">{label}</span>
                    <span className="text-gray-700 break-all">{value}</span>
                  </div>
                ))}
              </div>

              {error && (
                <p className="flex items-center gap-2 text-sm text-red-500 bg-red-50 px-4 py-3 rounded-2xl border border-red-100">
                  <AlertCircle size={15} /> {error}
                </p>
              )}

              {/* actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-gray-300 hover:bg-gray-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={handlePublish}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all text-sm disabled:opacity-60"
                >
                  {saving ? <><Loader2 size={15} className="animate-spin" /> Publishing…</> : <><PlayCircle size={15} /> Publish video</>}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Success ── */}
          {step === 3 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              className="text-center py-8 space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 240, damping: 18 }}
                className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto shadow-lg"
              >
                <CheckCircle size={44} className="text-emerald-500" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Video published!</h2>
                <p className="text-gray-400 text-sm">It will now appear in the Resources page for all users.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <button
                  onClick={() => { setForm(EMPTY); setStep(1) }}
                  className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
                >
                  Add another
                </button>
                <button
                  onClick={() => navigate('/resources')}
                  className="flex-1 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md shadow-orange-200 transition"
                >
                  Go to Resources
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
