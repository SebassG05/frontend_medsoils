import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Tag, ArrowLeft, Trash2, AlertTriangle, X, Pencil } from 'lucide-react'
import Footer from '../components/layout/Footer'
import BlogEditor from '../components/blog/BlogEditor'
import { fetchBlogById, deleteBlog, updateBlog } from '../services/blogService'

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
        <div className="max-w-3xl mx-auto">
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
                    <BlogEditor
                      onPublish={handleUpdate}
                      loading={saving}
                      isEditing
                      initialTitle={post.title}
                      initialContent={post.content}
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
                .blog-post-content table { width: 100%; border-collapse: collapse; margin: 1.25rem 0; }
                .blog-post-content th, .blog-post-content td { border: 1px solid #e5e7eb; padding: 0.6rem 1rem; text-align: left; font-size: 0.95rem; }
                .blog-post-content th { background: #fff7ed; font-weight: 700; color: #374151; }
              `}</style>
              <div dangerouslySetInnerHTML={{ __html: post.content.replace(/<img\b/gi, '<img referrerpolicy="no-referrer"') }} />
            </div>
          </article>
        </div>
      </motion.div>

      <div aria-hidden="true" className="h-[3px] w-full"
        style={{ background: 'linear-gradient(90deg,transparent 0%,#f97316 30%,#fb923c 60%,transparent 100%)' }} />
      <Footer />

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
