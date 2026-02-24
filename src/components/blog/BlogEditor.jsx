import { useState, useRef, useCallback, useReducer } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExt from '@tiptap/extension-image'
import LinkExt from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { Node, mergeAttributes } from '@tiptap/core'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading2, Heading3, Link as LinkIcon, Code, List, ListOrdered,
  Quote, AlignLeft, AlignCenter, AlignRight, Undo, Redo,
  Minus, ImagePlus, Film, X, Tag, FileText, FileCode, Copy, Check, ArrowRight,
  CheckCircle2, AlertCircle, Loader2, Upload, Eye, EyeOff,
} from 'lucide-react'

/* ═══════════════  custom Video node  ═══════════════ */
const VideoNode = Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  addAttributes() {
    return { src: { default: null } }
  },
  parseHTML() { return [{ tag: 'video[src]' }] },
  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(HTMLAttributes, {
      controls: true,
      style: 'width:100%;max-width:100%;border-radius:12px;margin:0.75rem 0;display:block',
    })]
  },
})

/* ═══════════════  media helpers  ═══════════════ */

/** Convert an image File to a base64 data-URL — no server needed */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}

function humanBytes(n) {
  if (n < 1048576) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / 1048576).toFixed(1)} MB`
}

/* ═══════════════  TagInput  ═══════════════ */
function TagInput({ tags, onChange }) {
  const [input, setInput] = useState('')
  function addTag(raw) {
    const t = raw.trim().toLowerCase().replace(/,/g, '')
    if (t && !tags.includes(t)) onChange([...tags, t])
    setInput('')
  }
  function onKey(e) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(input) }
    if (e.key === 'Backspace' && !input && tags.length) onChange(tags.slice(0, -1))
  }
  return (
    <div
      className="flex flex-wrap items-center gap-1.5 min-h-[42px] w-full border border-gray-200 hover:border-orange-300 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 rounded-xl px-3 py-2 transition bg-white cursor-text"
      onClick={() => document.getElementById('be-tag-input')?.focus()}
    >
      <Tag size={13} className="text-orange-400 shrink-0" />
      {tags.map(t => (
        <span key={t} className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-2.5 py-0.5 text-xs font-medium">
          {t}
          <button type="button" onClick={() => onChange(tags.filter(x => x !== t))} className="hover:text-red-500 transition">
            <X size={9} />
          </button>
        </span>
      ))}
      <input
        id="be-tag-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={onKey}
        onBlur={() => input && addTag(input)}
        placeholder={tags.length === 0 ? 'Add tags…  Enter or comma to confirm' : ''}
        className="flex-1 min-w-[140px] outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
      />
    </div>
  )
}

/* ═══════════════  ToolbarButton  ═══════════════ */
function TBtn({ icon: Icon, label, active, onClick, disabled }) {
  return (
    <button
      type="button"
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`p-2 rounded-lg transition text-sm
        ${active
          ? 'bg-orange-500 text-white shadow-sm'
          : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
        }
        ${disabled ? 'opacity-30 cursor-not-allowed' : ''}
      `}
    >
      <Icon size={15} />
    </button>
  )
}

/* ═══════════════  MediaTray  ═══════════════ */
function MediaTray({ items, onInsert, onRemove }) {
  if (!items.length) return null
  return (
    <div className="mx-6 mb-3 rounded-xl border border-orange-100 bg-orange-50/50 p-3 space-y-2">
      <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
        <Upload size={11} className="text-orange-500" />
        Click <strong className="text-orange-600">Insert</strong> to place media in your post
      </p>
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2.5 shadow-sm">
          {/* thumb */}
          <div className="w-12 h-12 rounded-lg shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center">
            {item.uploading ? <Loader2 size={18} className="text-orange-400 animate-spin" />
              : item.error ? <AlertCircle size={18} className="text-red-400" />
              : item.isVideo ? <Film size={18} className="text-orange-400" />
              : <img src={item.url} alt={item.name} className="w-full h-full object-cover" />}
          </div>
          {/* info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-700 truncate">{item.name}</p>
            {item.uploading && (
              <div className="mt-1 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 rounded-full animate-[pulse_1s_ease-in-out_infinite] w-2/3" />
              </div>
            )}
            {item.error && <p className="text-xs text-red-500 mt-0.5 leading-snug">{item.error}</p>}
            {!item.uploading && !item.error && <p className="text-xs text-gray-400">{humanBytes(item.size)}</p>}
          </div>
          {/* actions */}
          <div className="flex items-center gap-1 shrink-0">
            {!item.uploading && !item.error && (
              <button type="button" onClick={() => onInsert(item)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition">
                <CheckCircle2 size={11} /> Insert
              </button>
            )}
            <button type="button" onClick={() => onRemove(item.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition rounded-lg">
              <X size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════  BlogEditor  ═══════════════════════════ */
export default function BlogEditor({ onPublish, loading, initialTitle = '', initialContent = '', initialTags = [], initialBanner = '', isEditing = false }) {
  const [title,       setTitle]       = useState(initialTitle)
  const [tags,        setTags]        = useState(initialTags)
  const [bannerImage, setBannerImage] = useState(initialBanner)
  const [uploads,     setUploads]     = useState([])
  const [dragging,    setDragging]    = useState(false)
  const [error,       setError]       = useState('')
  const [videoUrl,    setVideoUrl]    = useState('')
  const [showVideoInput, setShowVideoInput] = useState(false)
  const [showHtmlModal, setShowHtmlModal]   = useState(false)
  const [htmlPaste,     setHtmlPaste]       = useState('')
  const [promptCopied,  setPromptCopied]    = useState(false)
  const [preview,       setPreview]         = useState(false)
  const [showConfirm,   setShowConfirm]     = useState(false)
  const fileRef   = useRef(null)
  const bannerRef = useRef(null)

  /* force re-render when editor state changes (active marks, selection, etc.) */
  const [, forceUpdate] = useReducer(x => x + 1, 0)

  /* ─── Tiptap editor ─── */
  const editor = useEditor({
    onUpdate:          forceUpdate,
    onSelectionUpdate: forceUpdate,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      ImageExt.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: { referrerpolicy: 'no-referrer' },
      }),
      VideoNode,
      LinkExt.configure({ openOnClick: false }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start writing your post here…  Use the toolbar above to format, or drag & drop a photo.' }),
      CharacterCount,
    ],
    content: initialContent || '',
    editorProps: {
      attributes: {
        class: 'be-editor outline-none min-h-[320px] px-6 py-5 text-gray-800',
      },
      handleDrop(view, event) {
        const files = event.dataTransfer?.files
        if (files?.length) { event.preventDefault(); handleFiles(files) }
        return false
      },
    },
  })

  const words = editor ? editor.storage.characterCount.words() : 0
  const chars = editor ? editor.storage.characterCount.characters() : 0

  /* ─── media upload — images auto-insert into editor, videos use URL ─── */
  const handleFiles = useCallback(async (fileList) => {
    const images = [...fileList].filter(f => f.type.startsWith('image/'))
    const videos = [...fileList].filter(f => f.type.startsWith('video/'))

    // ── images: convert to base64 and insert directly into editor ──
    for (const img of images) {
      try {
        const dataUrl = await fileToBase64(img)
        // Insert immediately — shows in editor AND preview without extra click
        editor?.chain().focus().setImage({ src: dataUrl, alt: img.name }).run()
      } catch (err) {
        console.error('Image read failed:', err.message)
      }
    }

    // ── videos: show URL input panel ──
    if (videos.length > 0) setShowVideoInput(true)
  }, [editor])

  /* ─── insert media into Tiptap ─── */
  function insertMedia(item) {
    if (!editor) return
    if (item.isVideo) {
      editor.chain().focus().insertContent({
        type: 'video', attrs: { src: item.url },
      }).run()
    } else {
      editor.chain().focus().setImage({ src: item.url, alt: item.name }).run()
    }
    setUploads(prev => prev.filter(u => u.id !== item.id))
  }

  /* ─── AI-HTML prompt text ─── */
  const AI_PROMPT = `Write a professional blog post about [YOUR TOPIC HERE].
Return ONLY the HTML body content — no <html>, <head> or <body> tags.
Use these tags so the styles apply correctly:
  • <h2> for section headings
  • <h3> for sub-headings
  • <p> for paragraphs
  • <strong> bold, <em> italic, <u> underline
  • <ul><li> bullet lists, <ol><li> numbered lists
  • <blockquote> for quotes or callouts
  • <img src="URL" alt="description"> for images (use real image URLs)
  • <a href="URL">text</a> for links
Do NOT include any CSS, <style> blocks, or class attributes.`

  function copyAiPrompt() {
    navigator.clipboard.writeText(AI_PROMPT).then(() => {
      setPromptCopied(true)
      setTimeout(() => setPromptCopied(false), 2500)
    })
  }

  function insertHtml() {
    if (!htmlPaste.trim() || !editor) return
    editor.chain().focus().setContent(htmlPaste.trim(), true).run()
    setHtmlPaste('')
    setShowHtmlModal(false)
  }

  /* ─── insert video URL ─── */
  function insertVideoUrl() {
    if (!videoUrl.trim() || !editor) return
    editor.chain().focus().insertContent({
      type: 'video', attrs: { src: videoUrl.trim() },
    }).run()
    setVideoUrl('')
    setShowVideoInput(false)
  }

  /* ─── link prompt ─── */
  function setLink() {
    const prev = editor.getAttributes('link').href
    const url  = window.prompt('URL', prev || 'https://')
    if (url === null) return
    if (url === '') { editor.chain().focus().unsetLink().run(); return }
    editor.chain().focus().setLink({ href: url }).run()
  }

  /* ─── drag / drop zone ─── */
  function onDragOver(e) { e.preventDefault(); setDragging(true) }
  function onDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false)
  }
  function onDrop(e) { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }

  /* ─── submit ─── */
  function openConfirm(e) {
    e.preventDefault()
    setError('')
    if (!title.trim()) { setError('Please add a title.'); return }
    const html = editor?.getHTML() || ''
    if (!html || html === '<p></p>') { setError('Please write some content.'); return }
    if (isEditing) { handleSubmit(e); return }  // edit mode → save directly
    setShowConfirm(true)
  }

  async function handleSubmit(e) {
    if (e?.preventDefault) e.preventDefault()
    setError('')
    const html = editor?.getHTML() || ''
    try {
      await onPublish({ title, content: html, tags, bannerImage })
      setTitle(''); setTags([]); setBannerImage(''); setUploads([]); editor?.commands.clearContent()
      setShowConfirm(false)
    } catch (err) {
      setError(err.message)
      setShowConfirm(false)
    }
  }

  if (!editor) return null

  const previewHtml = editor.getHTML()

  /* ═══════════════  render  ═══════════════ */
  return (
    <>
    {/* ══════ PUBLISH CONFIRM MODAL ══════ */}
    <AnimatePresence>
      {showConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* modal header */}
            <div className="flex items-center justify-between px-7 py-5 bg-gradient-to-r from-orange-500 to-amber-500">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <Eye size={17} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-none">Preview &amp; Confirm</p>
                  <p className="text-orange-100 text-xs mt-0.5">Review your post before publishing</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowConfirm(false)}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition">
                <X size={15} />
              </button>
            </div>

            {/* post preview */}
            <div className="blog-preview-content overflow-y-auto max-h-[70vh]">
              {/* banner */}
              {bannerImage && (
                <div className="w-full h-64 overflow-hidden">
                  <img src={bannerImage} alt="Banner" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="px-8 py-6">
                {/* tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tags.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 text-xs bg-orange-50 text-orange-600 border border-orange-100 rounded-full px-3 py-0.5 font-medium">
                        <Tag size={9} />{t}
                      </span>
                    ))}
                  </div>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-6">{title}</h1>
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
            </div>

            {/* actions */}
            <div className="flex items-center justify-between px-7 py-5 border-t border-gray-100 bg-gray-50/60">
              <button type="button" onClick={() => setShowConfirm(false)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition">
                <X size={14} /> Back to edit
              </button>
              <button type="button" disabled={loading} onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-60 text-white font-semibold rounded-xl transition shadow-md shadow-orange-200 text-sm">
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Publishing…</>
                  : <><CheckCircle2 size={16} /> Confirm &amp; Publish</>
                }
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    <div className="rounded-2xl shadow-2xl shadow-orange-100/60 border border-gray-200 bg-white overflow-hidden">
      {/* ── branded top bar ── */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <FileText size={17} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">{isEditing ? 'Edit post' : 'New post'}</p>
            <p className="text-orange-100 text-xs mt-0.5">{words} words · {chars} chars</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreview(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              !preview ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <EyeOff size={13} /> Edit
          </button>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              preview ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <Eye size={13} /> Preview
          </button>
        </div>
      </div>

      {/* ── title ── */}
      <div className="px-6 pt-5 pb-1 border-b border-gray-100">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Post title…"
          className="w-full text-3xl font-bold text-gray-800 placeholder-gray-300 outline-none bg-transparent pb-3"
        />
      </div>

      {/* ── tags ── */}
      <div className="px-6 py-3 border-b border-gray-100">
        <TagInput tags={tags} onChange={setTags} />
      </div>

      {/* ── banner image ── */}
      <div className="px-6 py-3 border-b border-gray-100">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Banner image</p>
        {bannerImage ? (
          <div className="relative group rounded-xl overflow-hidden border border-gray-100">
            <img src={bannerImage} alt="Banner" referrerPolicy="no-referrer"
              className="w-full h-52 object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button type="button" onClick={() => bannerRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 rounded-lg text-xs font-semibold shadow hover:bg-orange-50 transition">
                <ImagePlus size={13} /> Change
              </button>
              <button type="button" onClick={() => setBannerImage('')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-red-500 rounded-lg text-xs font-semibold shadow hover:bg-red-50 transition">
                <X size={13} /> Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => bannerRef.current?.click()}
            className="w-full h-28 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-orange-300 hover:text-orange-400 transition group"
          >
            <ImagePlus size={22} className="transition-transform group-hover:scale-110" />
            <span className="text-xs font-medium">Click to add a banner image</span>
            <span className="text-[10px] text-gray-300">Shown at the top of the post · JPG, PNG, WEBP</span>
          </button>
        )}
        <input
          ref={bannerRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={async e => {
            const file = e.target.files?.[0]
            if (file) { const b64 = await fileToBase64(file); setBannerImage(b64) }
            e.target.value = ''
          }}
        />
      </div>

      {/* ── toolbar (hidden in preview) ── */}
      {!preview && (
      <div className="px-4 py-2 border-b border-gray-100 flex flex-wrap items-center gap-0.5 bg-gray-50/80">
        {/* history */}
        <TBtn icon={Undo} label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} />
        <TBtn icon={Redo} label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} />
        <span className="w-px h-5 bg-gray-200 mx-1 self-center" />

        {/* text style */}
        <TBtn icon={Bold}          label="Bold"       active={editor.isActive('bold')}      onClick={() => editor.chain().focus().toggleBold().run()} />
        <TBtn icon={Italic}        label="Italic"     active={editor.isActive('italic')}    onClick={() => editor.chain().focus().toggleItalic().run()} />
        <TBtn icon={UnderlineIcon} label="Underline"  active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} />
        <TBtn icon={Strikethrough} label="Strike"     active={editor.isActive('strike')}    onClick={() => editor.chain().focus().toggleStrike().run()} />
        <span className="w-px h-5 bg-gray-200 mx-1 self-center" />

        {/* headings */}
        <TBtn icon={Heading2} label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
        <TBtn icon={Heading3} label="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
        <span className="w-px h-5 bg-gray-200 mx-1 self-center" />

        {/* align */}
        <TBtn icon={AlignLeft}   label="Align left"   active={editor.isActive({ textAlign: 'left' })}   onClick={() => editor.chain().focus().setTextAlign('left').run()} />
        <TBtn icon={AlignCenter} label="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} />
        <TBtn icon={AlignRight}  label="Align right"  active={editor.isActive({ textAlign: 'right' })}  onClick={() => editor.chain().focus().setTextAlign('right').run()} />
        <span className="w-px h-5 bg-gray-200 mx-1 self-center" />

        {/* lists + block */}
        <TBtn icon={List}         label="Bullet list"   active={editor.isActive('bulletList')}  onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <TBtn icon={ListOrdered}  label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        <TBtn icon={Quote}        label="Blockquote"    active={editor.isActive('blockquote')}  onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <TBtn icon={Code}         label="Code block"    active={editor.isActive('codeBlock')}   onClick={() => editor.chain().focus().toggleCodeBlock().run()} />
        <TBtn icon={Minus}        label="Divider"       onClick={() => editor.chain().focus().setHorizontalRule().run()} />
        <span className="w-px h-5 bg-gray-200 mx-1 self-center" />

        {/* link */}
        <TBtn icon={LinkIcon} label="Link" active={editor.isActive('link')} onClick={setLink} />
        <span className="w-px h-5 bg-gray-200 mx-1 self-center" />

        {/* media upload */}
        <button
          type="button"
          onClick={() => { fileRef.current.accept = 'image/*'; fileRef.current?.click() }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition"
        >
          <ImagePlus size={14} /> Photo
        </button>
        <button
          type="button"
          onClick={() => setShowVideoInput(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition"
        >
          <Film size={14} /> Video URL
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={e => { handleFiles(e.target.files); e.target.value = '' }}
        />
      </div>
      )} {/* end toolbar */}

      {/* ══ AI HTML IMPORT — primary CTA ══ */}
      {!preview && (
        <button
          type="button"
          onClick={() => setShowHtmlModal(true)}
          className="group mx-4 my-3 w-[calc(100%-2rem)] flex items-center gap-4 px-5 py-4 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 shadow-lg shadow-violet-200 transition-all hover:shadow-xl hover:shadow-violet-300 hover:-translate-y-0.5"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <FileCode size={20} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-white font-bold text-sm leading-none mb-1">Import from AI  <span className="ml-1.5 text-[10px] font-semibold bg-white/20 text-white/90 rounded-full px-2 py-0.5">RECOMMENDED</span></p>
            <p className="text-violet-100 text-xs leading-snug">Copy the AI prompt → paste result → publish. The fastest way to write a great post.</p>
          </div>
          <div className="flex items-center gap-1 text-white/70 group-hover:text-white group-hover:gap-2 transition-all text-xs font-semibold shrink-0">
            Open <ArrowRight size={13} />
          </div>
        </button>
      )}

      {/* ── preview (hidden in preview) ── */}
      {preview && (
        <div className="px-8 py-6 min-h-[320px] blog-preview-content">
          {!title && !editor?.getText()?.trim()
            ? <p className="text-gray-400 text-sm">Nothing to preview yet — start writing in Edit mode.</p>
            : (
              <>
                {bannerImage && (
                  <div className="w-full h-56 md:h-72 overflow-hidden rounded-xl mb-6 -mx-8 px-0" style={{ width: 'calc(100% + 4rem)' }}>
                    <img src={bannerImage} alt="Banner" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                )}
                {title && (
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-5">{title}</h1>
                )}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {tags.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 text-xs bg-orange-50 text-orange-600 border border-orange-200 rounded-full px-3 py-0.5 font-medium">
                        <Tag size={10} />{t}
                      </span>
                    ))}
                  </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }} />
              </>
            )
          }
          <style>{`
            .blog-preview-content p { margin:0.6rem 0;line-height:1.8;color:#374151;font-size:1.05rem; }
            .blog-preview-content h1 { font-size:1.9rem;font-weight:800;margin:1.5rem 0 0.6rem;color:#111827; }
            .blog-preview-content h2 { font-size:1.4rem;font-weight:700;margin:1.25rem 0 0.5rem;color:#1f2937; }
            .blog-preview-content h3 { font-size:1.15rem;font-weight:700;margin:1rem 0 0.4rem;color:#374151; }
            .blog-preview-content strong { font-weight:700; }
            .blog-preview-content em { font-style:italic; }
            .blog-preview-content u  { text-decoration:underline; }
            .blog-preview-content s  { text-decoration:line-through; }
            .blog-preview-content a  { color:#f97316;text-decoration:underline; }
            .blog-preview-content blockquote { border-left:4px solid #fb923c;padding:0.6rem 1.2rem;margin:1.25rem 0;background:#fff7ed;border-radius:0 12px 12px 0;color:#6b7280;font-style:italic; }
            .blog-preview-content ul { list-style:disc;padding-left:1.5rem;margin:0.75rem 0; }
            .blog-preview-content ol { list-style:decimal;padding-left:1.5rem;margin:0.75rem 0; }
            .blog-preview-content li { margin:0.3rem 0; }
            .blog-preview-content code { background:#fff7ed;color:#c2410c;padding:0.1rem 0.4rem;border-radius:6px;font-size:0.875em;font-family:monospace; }
            .blog-preview-content pre { background:#1e1e2e;color:#cdd6f4;padding:1.25rem;border-radius:12px;margin:1rem 0;overflow-x:auto; }
            .blog-preview-content pre code { background:transparent;color:inherit;padding:0; }
            .blog-preview-content hr { border:none;border-top:2px solid #e5e7eb;margin:2rem 0; }
            .blog-preview-content img { border-radius:12px;max-width:100%;margin:1.25rem auto;display:block;box-shadow:0 4px 24px rgba(0,0,0,.1); }
            .blog-preview-content video { border-radius:12px;max-width:100%;margin:1rem auto;display:block; }
          `}</style>
        </div>
      )}

      {/* ── editing surface (hidden in preview) ── */}
      <div className={preview ? 'hidden' : ''}>

      {/* ── media tray ── */}
      {uploads.length > 0 && (
        <div className="pt-3">
          <MediaTray
            items={uploads}
            onInsert={insertMedia}
            onRemove={id => setUploads(prev => prev.filter(u => u.id !== id))}
          />
        </div>
      )}

      {/* ── video URL input panel ── */}
      {showVideoInput && (
        <div className="mx-6 mb-3 flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
          <Film size={15} className="text-orange-500 shrink-0" />
          <input
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), insertVideoUrl())}
            placeholder="Paste a video URL (YouTube embed, mp4 link…)"
            className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
          />
          <button type="button" onClick={insertVideoUrl}
            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition">
            Insert
          </button>
          <button type="button" onClick={() => { setShowVideoInput(false); setVideoUrl('') }}
            className="p-1 text-gray-400 hover:text-gray-600 transition">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── HTML import modal ── */}
      {showHtmlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500">
              <div className="flex items-center gap-3">
                <FileCode size={18} className="text-white" />
                <p className="text-white font-bold text-sm">Import from AI</p>
              </div>
              <button type="button" onClick={() => { setShowHtmlModal(false); setHtmlPaste('') }}
                className="text-white/70 hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* step 1 */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-5 h-5 bg-orange-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">1</span>
                  Copy this prompt and paste it into ChatGPT, Gemini or any AI
                </p>
                <div className="relative">
                  <pre className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-xl p-4 whitespace-pre-wrap leading-relaxed font-mono">{AI_PROMPT}</pre>
                  <button
                    type="button"
                    onClick={copyAiPrompt}
                    className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 hover:border-orange-300 text-xs font-semibold text-gray-600 hover:text-orange-600 rounded-lg shadow-sm transition"
                  >
                    {promptCopied ? <><Check size={12} className="text-green-500" /> Copied!</> : <><Copy size={12} /> Copy prompt</>}
                  </button>
                </div>
              </div>

              {/* step 2 */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-5 h-5 bg-orange-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">2</span>
                  Paste the HTML result here
                </p>
                <textarea
                  value={htmlPaste}
                  onChange={e => setHtmlPaste(e.target.value)}
                  placeholder="<h2>Introduction</h2><p>Your AI-generated HTML goes here…</p>"
                  rows={8}
                  className="w-full text-xs font-mono text-gray-700 bg-gray-50 border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 rounded-xl p-4 outline-none resize-none placeholder-gray-400 leading-relaxed transition"
                />
              </div>

              {/* actions */}
              <div className="flex items-center justify-end gap-3">
                <button type="button"
                  onClick={() => { setShowHtmlModal(false); setHtmlPaste('') }}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition">
                  Cancel
                </button>
                <button type="button"
                  onClick={insertHtml}
                  disabled={!htmlPaste.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-40 text-white font-semibold rounded-xl transition text-sm shadow-md shadow-orange-200">
                  <CheckCircle2 size={15} /> Insert into post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── editor content area with drag & drop ── */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative transition-all ${dragging ? 'ring-2 ring-inset ring-orange-400 bg-orange-50/30' : ''}`}
      >
        {dragging && (
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2">
            <Upload size={28} className="text-orange-500" />
            <p className="text-sm font-semibold text-orange-600">Drop your photo or video here</p>
          </div>
        )}
        <EditorContent editor={editor} />
      </div>

      </div> {/* end editing surface */}

      {/* ── global editor styles injected inline ── */}
      <style>{`
        .be-editor p { margin: 0.5rem 0; line-height: 1.75; }
        .be-editor h1 { font-size: 1.875rem; font-weight: 800; margin: 1.25rem 0 0.5rem; color: #1f2937; }
        .be-editor h2 { font-size: 1.375rem; font-weight: 700; margin: 1rem 0 0.5rem; color: #1f2937; }
        .be-editor h3 { font-size: 1.125rem; font-weight: 700; margin: 0.875rem 0 0.375rem; color: #374151; }
        .be-editor strong { font-weight: 700; }
        .be-editor em { font-style: italic; }
        .be-editor u  { text-decoration: underline; }
        .be-editor s  { text-decoration: line-through; }
        .be-editor a  { color: #f97316; text-decoration: underline; }
        .be-editor blockquote {
          border-left: 4px solid #fb923c;
          padding: 0.5rem 1rem;
          margin: 1rem 0;
          background: #fff7ed;
          border-radius: 0 12px 12px 0;
          color: #6b7280;
          font-style: italic;
        }
        .be-editor ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .be-editor ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .be-editor li { margin: 0.25rem 0; }
        .be-editor code {
          background: #fff7ed; color: #c2410c;
          padding: 0.1rem 0.35rem; border-radius: 6px;
          font-size: 0.85em; font-family: monospace;
        }
        .be-editor pre {
          background: #1e1e2e; color: #cdd6f4;
          padding: 1rem 1.25rem; border-radius: 12px;
          margin: 1rem 0; overflow-x: auto;
        }
        .be-editor pre code { background: transparent; color: inherit; padding: 0; }
        .be-editor hr { border: none; border-top: 2px solid #e5e7eb; margin: 1.5rem 0; }
        .be-editor img { border-radius: 12px; max-width: 100%; margin: 0.75rem auto; display: block; box-shadow: 0 4px 20px rgba(0,0,0,.08); }
        .be-editor .ProseMirror-focused { outline: none; }
        .be-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #d1d5db; pointer-events: none;
          height: 0; float: left;
        }
      `}</style>

      {/* ── footer ── */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap bg-gray-50/50">
        <div className="flex-1">
          {error ? (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          ) : (
            <p className="text-xs text-gray-400">
              Click <strong className="text-gray-500">Photo</strong> to embed images · <strong className="text-gray-500">Video URL</strong> to add a video · or use the <strong className="text-violet-600">Import from AI</strong> banner above
            </p>
          )}
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={openConfirm}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-60 text-white font-semibold rounded-xl transition shadow-md shadow-orange-200 text-sm"
        >
          {loading
            ? <><Loader2 size={16} className="animate-spin" /> {isEditing ? 'Saving…' : 'Publishing…'}</>
            : <><CheckCircle2 size={16} /> {isEditing ? 'Save changes' : 'Publish post'}</>
          }
        </button>
      </div>
    </div>
    </>
  )
}
