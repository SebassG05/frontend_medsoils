import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, ArrowRight, BookOpen } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchBlogs } from '../../services/blogService'

/* ── helpers ── */
function tagColor(tag = '') {
  const palette = {
    research: 'bg-orange-500', sustainability: 'bg-green-500',
    education: 'bg-cyan-500', climate: 'bg-blue-500',
    science: 'bg-violet-500', conservation: 'bg-teal-500',
  }
  return palette[tag.toLowerCase()] || 'bg-gray-500'
}

const BlogCarousel = () => {
  const navigate = useNavigate()
  const [blogs,        setBlogs]        = useState([])
  const [loading,      setLoading]      = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging,   setIsDragging]   = useState(false)
  const [dragStartX,   setDragStartX]   = useState(0)
  const [dragCurrentX, setDragCurrentX] = useState(0)
  const containerRef = useRef(null)

  /* ── fetch latest 6 posts ── */
  useEffect(() => {
    fetchBlogs(1, 6)
      .then(data => setBlogs(data.posts || []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false))
  }, [])

  // Responsive items per view
  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 1
      if (window.innerWidth < 1024) return 2
      return 3
    }
    return 3
  }

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView)
  const maxIndex = Math.max(0, blogs.length - itemsPerView)

  // Update items per view on window resize
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerView = getItemsPerView()
      setItemsPerView(newItemsPerView)
      const newMaxIndex = Math.max(0, blogs.length - newItemsPerView)
      if (currentIndex > newMaxIndex) setCurrentIndex(newMaxIndex)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentIndex, blogs.length])

  const getTranslateX = (dragging = false, dragOffset = 0) => {
    if (!containerRef.current) return dragging ? dragOffset : 0

    const gap = 24 // gap-6 = 24px
    const containerWidth = containerRef.current.offsetWidth
    const cardWidth = (containerWidth - gap * (itemsPerView - 1)) / itemsPerView
    const step = cardWidth + gap

    // For the last position, snap so the last card's right edge aligns with the container
    const totalWidth = blogs.length * step - gap
    const maxTranslate = totalWidth - containerWidth

    const base = Math.min(currentIndex * step, maxTranslate)
    return dragging ? -base + dragOffset : -base
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  // Drag functionality
  const handleDragStart = (e) => {
    setIsDragging(true)
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX
    setDragStartX(clientX)
    setDragCurrentX(clientX)
  }

  const handleDragMove = (e) => {
    if (!isDragging) return
    
    e.preventDefault()
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX
    setDragCurrentX(clientX)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    
    const dragDistance = dragStartX - dragCurrentX
    const threshold = 50 // Minimum drag distance to trigger slide change
    
    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0) {
        // Dragged left, go to next slide
        nextSlide()
      } else {
        // Dragged right, go to previous slide
        prevSlide()
      }
    }
    
    setIsDragging(false)
    setDragStartX(0)
    setDragCurrentX(0)
  }

  // Global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e) => handleDragMove(e)
      const handleGlobalMouseUp = () => handleDragEnd()
      
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove)
        document.removeEventListener('mouseup', handleGlobalMouseUp)
      }
    }
  }, [isDragging, dragStartX])

  const getCategoryColor = (category) => {
    return tagColor(category || '')
  }

  /* ── loading skeletons ── */
  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">LATEST INSIGHTS</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured <span className="text-orange-500">Blog Posts</span></h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
              <div className="h-56 bg-gray-200" />
              <div className="p-6 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ── empty / not logged in ── */
  if (!blogs.length) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">LATEST INSIGHTS</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured <span className="text-orange-500">Blog Posts</span></h2>
          </div>
        </div>
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen size={30} className="text-orange-400" />
          </div>
          <p className="text-gray-500 mb-4">Sign in to read the latest community articles.</p>
          <button onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition text-sm shadow-md">
            Sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">
            LATEST INSIGHTS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Featured <span className="text-orange-500">Blog Posts</span>
          </h2>
        </div>
        
        {/* Navigation Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/blog"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-orange-500 border border-orange-200 bg-orange-50 hover:bg-orange-100 rounded-xl transition mr-2">
            View all <ArrowRight size={13} />
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevSlide}
            className="cursor-pointer w-12 h-12 rounded-full bg-white border-2 border-gray-200 hover:border-orange-500 flex items-center justify-center transition-colors group"
            aria-label="Previous blogs"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-orange-500" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextSlide}
            className="cursor-pointer w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Next blogs"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Carousel Container */}
      <div ref={containerRef} className="relative overflow-hidden pt-2 pb-4">
        <motion.div
          className={`flex gap-6 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          animate={{ x: getTranslateX(isDragging, dragCurrentX - dragStartX) }}
          transition={isDragging ? { type: "tween", duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          style={{ userSelect: 'none' }}
        >
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              className="min-w-0 flex-shrink-0"
              style={{
                width: containerRef.current
                  ? `${(containerRef.current.offsetWidth - 24 * (itemsPerView - 1)) / itemsPerView}px`
                  : itemsPerView === 1 ? '100%' : itemsPerView === 2 ? 'calc(50% - 12px)' : 'calc(33.333% - 16px)'
              }}
              whileHover={isDragging ? {} : { y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group h-full flex flex-col">
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gray-100 shrink-0">
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
                      <BookOpen size={40} className="text-orange-200" />
                    </div>
                  )}
                  {blog.tags?.[0] && (
                    <div className="absolute top-4 left-4">
                      <span className={`${getCategoryColor(blog.tags[0])} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                        {blog.tags[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                    {blog.excerpt}
                  </p>

                  {/* Author & Read More */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <span className="text-sm text-gray-600 truncate max-w-[55%]">By {blog.authorName}</span>
                    <Link
                      to={`/blog/${blog._id}`}
                      className="inline-flex items-center gap-1 text-orange-500 font-semibold text-sm hover:gap-2 transition-all shrink-0"
                      onClick={(e) => { if (isDragging) e.preventDefault() }}
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Mobile Navigation */}
      <div className="flex md:hidden justify-center gap-2 mt-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={prevSlide}
          className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center"
          aria-label="Previous blogs"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center"
          aria-label="Next blogs"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-orange-500'
                : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default BlogCarousel
