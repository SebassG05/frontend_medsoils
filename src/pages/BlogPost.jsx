import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Tag, ArrowLeft, Trash2, AlertTriangle, X, Pencil, Sparkles, ExternalLink, Copy, CheckCheck } from 'lucide-react'
import Footer from '../components/layout/Footer'
import BlogEditor from '../components/blog/BlogEditor'
import BlogCarousel from '../components/blog/BlogCarousel'
import { fetchBlogById, deleteBlog, updateBlog } from '../services/blogService'

/* ─── parse HTML and replace <div class="carousel"> blocks with React carousel ─── */
function renderContent(html) {
  if (!html) return null
  const CAROUSEL_RE = /<div[^>]*class=["']carousel["'][^>]*>([\s\S]*?)<\/div>/gi
  const IMG_RE      = /<img[^>]+src=["']([^"']+)["'][^>]*?(?:alt=["']([^"']*)["'][^>]*)?\/?>/gi

  const parts = []
  let last = 0, match
  CAROUSEL_RE.lastIndex = 0

  while ((match = CAROUSEL_RE.exec(html)) !== null) {
    // HTML before this carousel
    if (match.index > last) {
      parts.push(
        <div key={`html-${last}`}
          dangerouslySetInnerHTML={{ __html: html.slice(last, match.index).replace(/<img\b/gi, '<img referrerpolicy="no-referrer"') }}
        />
      )
    }
    // Extract images from the carousel innerHTML
    const images = []
    let imgMatch
    IMG_RE.lastIndex = 0
    while ((imgMatch = IMG_RE.exec(match[1])) !== null) {
      images.push({ src: imgMatch[1], alt: imgMatch[2] || '' })
    }
    parts.push(<BlogCarousel key={`carousel-${match.index}`} images={images} />)
    last = match.index + match[0].length
  }

  // remaining HTML after last carousel
  if (last < html.length) {
    parts.push(
      <div key={`html-${last}`}
        dangerouslySetInnerHTML={{ __html: html.slice(last).replace(/<img\b/gi, '<img referrerpolicy="no-referrer"') }}
      />
    )
  }

  return parts.length ? parts : (
    <div dangerouslySetInnerHTML={{ __html: html.replace(/<img\b/gi, '<img referrerpolicy="no-referrer"') }} />
  )
}

export default function BlogPost() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [post,    setPost]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [deleting,setDeleting]= useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [editing,   setEditing]   = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [showAiTips, setShowAiTips] = useState(false)
  const [aiPasteText, setAiPasteText] = useState('')
  const [aiInsertContent, setAiInsertContent] = useState(null)
  const [copied, setCopied] = useState(false)
  const editorKey = useRef(0)

  /* ─── current user ─── */
  let currentUser = null
  try { currentUser = JSON.parse(localStorage.getItem('user')) } catch { /* ignore */ }

  /* ─── load post ─── */
  useEffect(() => {
    if (!currentUser) { navigate('/blog'); return }
    setLoading(true)
    fetchBlogById(id)
      .then(data  => setPost(data))
      .catch(err  => setError(err.message))
      .finally(()=> setLoading(false))
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── save edits ─── */
  async function handleUpdate(payload) {
    setSaving(true)
    try {
      const updated = await updateBlog(id, payload)
      setPost(updated)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  /* ─── delete ─── */
  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteBlog(id)
      navigate('/blog')
    } catch (err) {
      alert(err.message)
      setDeleting(false)
      setShowConfirm(false)
    }
  }

  const AI_PROMPT = `Write a professional blog post about [YOUR TOPIC HERE].\nReturn ONLY the HTML body content - no <html>, <head> or <body> tags.\nUse these tags so the styles apply correctly:\n  • <h2> for section headings\n  • <h3> for sub-headings\n  • <p> for paragraphs\n  • <strong> bold, <em> italic, <u> underline\n  • <ul><li> bullet lists, <ol><li> numbered lists\n  • <blockquote> for quotes or callouts\n  • <img src="URL" alt="description"> for images (use real image URLs)\n  • <a href="URL">text</a> for links\nDo NOT include any CSS, <style> blocks, or class attributes.`

  function handleCopyPrompt() {
    navigator.clipboard.writeText(AI_PROMPT).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleInsertAi() {
    if (!aiPasteText.trim()) return
    editorKey.current += 1
    setAiInsertContent(aiPasteText.trim())
    setAiPasteText('')
    setShowAiTips(false)
  }

  const isOwner = currentUser && post && (
    currentUser._id === post.author || currentUser.id === post.author
  )

  /* ─── states ─── */
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-24 text-center text-gray-500">
        <p className="text-red-500 mb-4">{error || 'Post not found'}</p>
        <button onClick={() => navigate('/blog')} className="underline text-orange-500">Back to blog</button>
      </div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="max-w-5xl mx-auto">
          {/* back */}
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 mb-8 transition"
          >
            <ArrowLeft size={16} /> Back to blog
          </button>

          {/* ── article ── */}
          <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* banner image */}
            {post.bannerImage && (
              <div className="w-full h-72 md:h-96 overflow-hidden">
                <img
                  src={post.bannerImage}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* header */}
            <div className="p-8 pb-6 border-b border-gray-100">
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 text-xs bg-orange-50 text-orange-600 rounded-full px-3 py-0.5 font-medium">
                      <Tag size={10} />{t}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-4">
                {post.title}
              </h1>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                  <span className="font-medium text-gray-600">{post.authorName}</span>
                </div>
                {isOwner && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditing(e => !e)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                        editing
                          ? 'text-gray-600 bg-gray-100 border-gray-200 hover:bg-gray-200'
                          : 'text-orange-500 bg-orange-50 border-orange-200 hover:bg-orange-100'
                      }`}
                    >
                      <Pencil size={14} /> {editing ? 'Cancel edit' : 'Edit post'}
                    </button>
                    {editing && (
                      <button
                        onClick={() => setShowAiTips(true)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 transition"
                      >
                        <Sparkles size={14} /> Import from AI 
                      </button>
                    )}
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 transition"
                    >
                      <Trash2 size={14} /> Delete post
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── inline edit panel ── */}
            <AnimatePresence>
              {editing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t border-gray-100"
                >
                  <div className="p-6">
                    {/* AI guidance moved to editor banner (see BlogEditor) */}

                    <BlogEditor
                      key={editorKey.current}
                      onPublish={handleUpdate}
                      loading={saving}
                      isEditing
                      initialTitle={post.title}
                      initialContent={aiInsertContent ?? post.content}
                      initialTags={post.tags || []}
                      initialBanner={post.bannerImage || ''}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* content */}
            <div className="px-8 pb-10 pt-6 blog-post-content">
              <style>{`
                .blog-post-content p { margin: 0.75rem 0; line-height: 1.85; color: #374151; font-size: 1.06rem; }
                .blog-post-content h1 { font-size: 2rem; font-weight: 800; margin: 2rem 0 0.6rem; color: #111827; line-height:1.2; }
                .blog-post-content h2 { font-size: 1.5rem; font-weight: 700; margin: 1.75rem 0 0.5rem; color: #1f2937; border-bottom: 2px solid #fed7aa; padding-bottom: 0.25rem; }
                .blog-post-content h3 { font-size: 1.18rem; font-weight: 700; margin: 1.25rem 0 0.4rem; color: #374151; }
                .blog-post-content strong { font-weight: 700; color: #111827; }
                .blog-post-content em { font-style: italic; }
                .blog-post-content u { text-decoration: underline; }
                .blog-post-content s { text-decoration: line-through; color: #9ca3af; }
                .blog-post-content a { color: #f97316; text-decoration: underline; font-weight: 500; }
                .blog-post-content a:hover { color: #ea580c; }
                .blog-post-content blockquote { border-left: 4px solid #fb923c; padding: 0.75rem 1.25rem; margin: 1.5rem 0; background: #fff7ed; border-radius: 0 14px 14px 0; color: #6b7280; font-style: italic; font-size: 1.05rem; }
                .blog-post-content ul { list-style: disc; padding-left: 1.75rem; margin: 0.75rem 0; }
                .blog-post-content ol { list-style: decimal; padding-left: 1.75rem; margin: 0.75rem 0; }
                .blog-post-content li { margin: 0.4rem 0; line-height: 1.7; color: #374151; }
                .blog-post-content code { background: #fff7ed; color: #c2410c; padding: 0.15rem 0.45rem; border-radius: 6px; font-size: 0.875em; font-family: monospace; border: 1px solid #fed7aa; }
                .blog-post-content pre { background: #1e1e2e; color: #cdd6f4; padding: 1.5rem; border-radius: 14px; margin: 1.25rem 0; overflow-x: auto; }
                .blog-post-content pre code { background: transparent; color: inherit; padding: 0; border: none; }
                .blog-post-content hr { border: none; border-top: 2px solid #e5e7eb; margin: 2.5rem 0; }
                .blog-post-content img {
                  border-radius: 14px;
                  max-width: 100%;
                  width: auto;
                  height: auto;
                  margin: 1.75rem auto;
                  display: block;
                  box-shadow: 0 8px 32px rgba(0,0,0,.12);
                  object-fit: contain;
                }
                .blog-post-content video { border-radius: 14px; max-width: 100%; width: 100%; margin: 1.5rem auto; display: block; box-shadow: 0 4px 20px rgba(0,0,0,.1); }
                .blog-post-content iframe { border-radius: 14px; width: 100%; aspect-ratio: 16/9; margin: 1.5rem auto; display: block; border: none; box-shadow: 0 4px 20px rgba(0,0,0,.12); }
                .blog-post-content table { width: 100%; border-collapse: collapse; margin: 1.25rem 0; }
                .blog-post-content th, .blog-post-content td { border: 1px solid #e5e7eb; padding: 0.6rem 1rem; text-align: left; font-size: 0.95rem; }
                .blog-post-content th { background: #fff7ed; font-weight: 700; color: #374151; }
              `}</style>
              {renderContent(post.content)}
            </div>
          </article>

          {/* Guidance moved to the editor banner in BlogEditor.jsx */}
        </div>
      </motion.div>

      <div aria-hidden="true" className="h-[3px] w-full"
        style={{ background: 'linear-gradient(90deg,transparent 0%,#f97316 30%,#fb923c 60%,transparent 100%)' }} />
      <Footer />

      {/* ─── AI tips modal ─── */}
      <AnimatePresence>
        {showAiTips && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowAiTips(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              {/* header */}
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-white" />
                  <p className="text-sm font-bold text-white">Import from AI</p>
                </div>
                <button onClick={() => setShowAiTips(false)} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition">
                  <X size={14} />
                </button>
              </div>

              <div className="px-6 py-5 space-y-5">
                {/* Step 1 */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Copy this prompt and paste it into ChatGPT, Gemini or any AI</p>
                  </div>
                  <div className="relative rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <pre className="text-xs text-gray-700 font-mono leading-relaxed whitespace-pre-wrap pr-28">{AI_PROMPT}</pre>
                    <button
                      onClick={handleCopyPrompt}
                      className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 rounded-lg text-xs font-semibold text-gray-600 hover:text-orange-600 transition shadow-sm"
                    >
                      {copied ? <><CheckCheck size={11} className="text-green-500" /> Copied!</> : <><Copy size={11} /> Copy prompt</>}
                    </button>
                    {/* AI links */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 rounded-lg text-[11px] font-semibold text-gray-600 hover:text-orange-600 transition">
                        <ExternalLink size={9} /> ChatGPT
                      </a>
                      <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 rounded-lg text-[11px] font-semibold text-gray-600 hover:text-orange-600 transition">
                        <ExternalLink size={9} /> Gemini
                      </a>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Paste the HTML result here</p>
                  </div>
                  <textarea
                    value={aiPasteText}
                    onChange={e => setAiPasteText(e.target.value)}
                    placeholder="<h2>Introduction</h2><p>Your AI-generated HTML goes here…</p>"
                    rows={5}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs font-mono text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                  />
                </div>
              </div>

              {/* footer */}
              <div className="flex items-center justify-end gap-3 px-6 pb-5">
                <button
                  onClick={() => setShowAiTips(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInsertAi}
                  disabled={!aiPasteText.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 disabled:opacity-40 text-white font-semibold rounded-xl transition shadow-md text-sm"
                >
                  <Sparkles size={14} /> Insert into post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── delete confirmation modal ─── */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* top accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-red-400 to-rose-500" />

              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                    <AlertTriangle size={22} className="text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">Delete post?</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      <span className="font-semibold text-gray-700">“{post?.title}”</span> will be permanently removed.
                      This action <span className="text-red-500 font-semibold">cannot be undone</span>.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="text-gray-400 hover:text-gray-600 transition shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={deleting}
                    className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 disabled:opacity-60 text-white font-semibold rounded-xl transition shadow-md shadow-red-200 text-sm"
                  >
                    {deleting
                      ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Deleting…</>
                      : <><Trash2 size={15} /> Yes, delete</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
