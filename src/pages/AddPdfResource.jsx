import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, FileText, Link2, Tag, BookOpen, UploadCloud,
  AlignLeft, Type, Eye, CheckCircle, ChevronRight, Loader2, AlertCircle, X,
} from 'lucide-react'
import { createResource } from '../services/resourceService'

/* ─── helpers ─── */
const ease = [0.16, 1, 0.3, 1]
const EMPTY = { title: '', description: '', url: '', tag: '', pages: '' }

/* ─── Stepper ─── */
function Stepper({ step }) {
  const steps = ['Fill details', 'Preview', 'Published']
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, i) => {
        const idx  = i + 1
        const done    = step > idx
        const current = step === idx
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  backgroundColor: done ? '#10b981' : current ? '#f59e0b' : '#e5e7eb',
                  scale: current ? 1.1 : 1,
                }}
                transition={{ duration: 0.35 }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-sm"
                style={{ color: (done || current) ? '#ffffff' : '#9ca3af' }}
              >
                {done ? <CheckCircle size={16} /> : idx}
              </motion.div>
              <span className={`text-xs font-semibold whitespace-nowrap ${current ? 'text-amber-500' : done ? 'text-emerald-500' : 'text-gray-400'}`}>
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
        {required && <span className="text-amber-400 text-base leading-none">*</span>}
      </label>
      {children}
    </div>
  )
}

const inp = 'w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400 transition bg-white shadow-sm'

/* ─── Preview Card ─── */
function formatPages(val) {
  if (!val) return ''
  return /^\d+$/.test(val.trim()) ? `${val.trim()} pages` : val
}

function PreviewCard({ form }) {
  const isLocal = url => url.startsWith('blob:') || url.startsWith('data:') || /^https?:\/\/(localhost|127\.0\.0\.1)/.test(url)
  const pdfEmbedUrl = form.url
    ? (isLocal(form.url) ? form.url : `https://docs.google.com/gview?url=${encodeURIComponent(form.url)}&embedded=true`)
    : null

  return (
    <div className="rounded-3xl border border-amber-100 bg-white shadow-xl overflow-hidden max-w-sm mx-auto">
      {/* PDF preview area */}
      <div className="relative h-44 overflow-hidden bg-amber-50">
        {pdfEmbedUrl ? (
          <>
            <iframe
              src={pdfEmbedUrl}
              title="PDF preview"
              className="absolute inset-0 w-full h-full border-0 scale-[1.02]"
              style={{ pointerEvents: 'none' }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-50/80 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText size={48} className="text-amber-300" strokeWidth={1.2} />
          </div>
        )}
        {form.tag && (
          <span className="absolute top-3 right-3 text-xs font-semibold bg-white/90 text-amber-600 rounded-full px-2.5 py-0.5 shadow">
            {form.tag}
          </span>
        )}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-amber-50/90 text-amber-500 rounded-full text-xs font-medium px-2.5 py-0.5 border border-amber-100">
          <FileText size={11} /> PDF
        </span>
      </div>
      {/* body */}
      <div className="p-5">
        <h3 className="font-extrabold text-gray-900 text-lg leading-tight mb-2 tracking-tight">
          {form.title || <span className="text-gray-300 italic">Untitled document</span>}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {form.description || <span className="text-gray-300 italic">No description yet…</span>}
        </p>
        {form.pages && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <BookOpen size={11} /> {formatPages(form.pages)}
          </span>
        )}
      </div>
    </div>
  )
}

/* ─── Page ─── */
export default function AddPdfResource() {
  const navigate = useNavigate()
  const [step, setStep]         = useState(1)
  const [form, setForm]         = useState(EMPTY)
  const [fileName, setFileName] = useState('')
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const fileRef = useRef(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleFile = e => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    // Use blob URL — can also be swapped for a real upload endpoint later
    set('url', URL.createObjectURL(file))
    if (!form.title) set('title', file.name.replace(/\.pdf$/i, ''))
  }

  const clearFile = () => {
    setFileName('')
    set('url', '')
    if (fileRef.current) fileRef.current.value = ''
  }

  const handlePreview = e => {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.description.trim() || !form.url.trim()) {
      setError('Title, description and a PDF URL or file are required.')
      return
    }
    setStep(2)
  }

  const handlePublish = async () => {
    setSaving(true)
    setError('')
    try {
      await createResource({ ...form, type: 'pdf' })
      setStep(3)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
      setStep(2)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/60 via-white to-orange-50/30">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* back + page title */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => (step === 2 ? setStep(1) : navigate('/resources'))}
            className="p-2 rounded-full hover:bg-amber-100 transition text-amber-400 shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 flex items-center justify-center shadow-sm shrink-0">
              <FileText size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg leading-tight">Add PDF resource</p>
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

                {/* file picker */}
                <Field icon={UploadCloud} label="Upload PDF">
                  {fileName ? (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-amber-300 bg-amber-50 text-sm text-amber-700 font-medium">
                      <FileText size={16} className="text-amber-500 shrink-0" />
                      <span className="flex-1 truncate">{fileName}</span>
                      <button type="button" onClick={clearFile} className="text-amber-400 hover:text-amber-600 transition">
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileRef.current?.click()}
                      className="flex flex-col items-center gap-2 px-6 py-8 rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50 cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition group"
                    >
                      <UploadCloud size={28} className="text-amber-300 group-hover:text-amber-500 transition" />
                      <span className="text-sm text-gray-400 group-hover:text-gray-500 transition">
                        Click to select a <strong>.pdf</strong> file
                      </span>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFile} />
                </Field>

                {/* divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">or paste a URL</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <Field icon={Link2} label="PDF URL" required>
                  <div className="relative">
                    <Link2 size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      className={`${inp} pl-10`}
                      placeholder="https://drive.google.com/… or direct .pdf link"
                      value={fileName ? '' : form.url}
                      onChange={e => { clearFile(); set('url', e.target.value) }}
                    />
                  </div>
                </Field>

                <Field icon={Type} label="Title" required>
                  <input
                    className={inp}
                    placeholder="e.g. MEDSOILS Programme Brochure 2025"
                    value={form.title}
                    onChange={e => set('title', e.target.value)}
                  />
                </Field>

                <Field icon={AlignLeft} label="Description" required>
                  <textarea
                    className={`${inp} resize-none`}
                    rows={4}
                    placeholder="Brief description of the document…"
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field icon={Tag} label="Tag">
                    <input className={inp} placeholder="e.g. Programme" value={form.tag} onChange={e => set('tag', e.target.value)} />
                  </Field>
                  <Field icon={BookOpen} label="Pages">
                    <input className={inp} placeholder="e.g. 24 pages" value={form.pages} onChange={e => set('pages', e.target.value)} />
                  </Field>
                </div>
              </div>

              {error && (
                <p className="flex items-center gap-2 text-sm text-red-500 bg-red-50 px-4 py-3 rounded-2xl border border-red-100">
                  <AlertCircle size={15} /> {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-amber-200 hover:shadow-amber-300 transition-all text-sm"
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
              <div className="text-center">
                <p className="text-sm text-gray-400 font-medium">
                  This is how your resource will appear on the Resources page
                </p>
              </div>

              <PreviewCard form={form} />

              {/* metadata summary */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Details</h4>
                {[
                  { label: 'Source',      value: fileName || form.url },
                  { label: 'Title',       value: form.title },
                  { label: 'Description', value: form.description },
                  { label: 'Tag',         value: form.tag   || '—' },
                  { label: 'Pages',       value: formatPages(form.pages) || '—' },
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
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-amber-200 hover:shadow-amber-300 transition-all text-sm disabled:opacity-60"
                >
                  {saving ? <><Loader2 size={15} className="animate-spin" /> Publishing…</> : <><FileText size={15} /> Publish PDF</>}
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">PDF published!</h2>
                <p className="text-gray-400 text-sm">It will now appear in the Resources page for all users.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <button
                  onClick={() => { setForm(EMPTY); setFileName(''); setStep(1) }}
                  className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
                >
                  Add another
                </button>
                <button
                  onClick={() => navigate('/resources')}
                  className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-md shadow-amber-200 transition"
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
