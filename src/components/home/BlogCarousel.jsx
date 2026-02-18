import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, MessageCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const BlogCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragCurrentX, setDragCurrentX] = useState(0)
  const containerRef = useRef(null)

  // Datos mockeados de blogs
  const blogs = [
    {
      id: 1,
      title: "What if the future of the Mediterranean started beneath your feet?",
      excerpt: "The Medsoil-Challenge Master's Degree offers a unique opportunity to specialise in Mediterranean soil management...",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop",
      date: "June 12, 2025",
      comments: 0,
      category: "Research",
      author: "Dr. Maria García"
    },
    {
      id: 2,
      title: "Healthy Soils, Secure Future: Why Learning About Soils Matters More Than Ever",
      excerpt: "Published by MedSoil-Challenge • June 2025. In today's world, shaken by the effects of climate...",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
      date: "June 11, 2025",
      comments: 0,
      category: "Sustainability",
      author: "Prof. Antonio Rossi"
    },
    {
      id: 3,
      title: "Advancing the Future of the MEDSOILS-CHALLENGE Master: A Landmark Meeting in Viterbo",
      excerpt: "Unlock your future with the MEDSOILS-CHALLENGE One-Year Specialisation Programme/Course! This unique international master brings together...",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop",
      date: "May 16, 2025",
      comments: 0,
      category: "Education",
      author: "Elena Martínez"
    },
    {
      id: 4,
      title: "Climate Change and Mediterranean Soils: New Challenges",
      excerpt: "Exploring how climate change affects soil health and what innovative solutions can help preserve Mediterranean ecosystems...",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=600&fit=crop",
      date: "April 28, 2025",
      comments: 5,
      category: "Climate",
      author: "Dr. Jean Dupont"
    },
    {
      id: 5,
      title: "International Collaboration: Building Bridges Across Mediterranean Countries",
      excerpt: "How four Mediterranean nations are working together to create the next generation of soil experts...",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
      date: "April 15, 2025",
      comments: 3,
      category: "Collaboration",
      author: "Ibrahim Al-Rashid"
    }
  ]

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
  }, [currentIndex])

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
    const colors = {
      Research: 'bg-orange-500',
      Sustainability: 'bg-green-500',
      Education: 'bg-cyan-500',
      Climate: 'bg-blue-500',
      Collaboration: 'bg-purple-500'
    }
    return colors[category] || 'bg-gray-500'
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
        <div className="hidden md:flex gap-2">
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
              key={blog.id}
              className="min-w-0 flex-shrink-0"
              style={{
                width: containerRef.current
                  ? `${(containerRef.current.offsetWidth - 24 * (itemsPerView - 1)) / itemsPerView}px`
                  : itemsPerView === 1 ? '100%' : itemsPerView === 2 ? 'calc(50% - 12px)' : 'calc(33.333% - 16px)'
              }}
              whileHover={isDragging ? {} : { y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`${getCategoryColor(blog.category)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{blog.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{blog.comments} Comments</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {blog.excerpt}
                  </p>

                  {/* Author & Read More */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-600">By {blog.author}</span>
                    <Link
                      to={`/blog/${blog.id}`}
                      className="inline-flex items-center gap-1 text-orange-500 font-semibold text-sm hover:gap-2 transition-all"
                      onClick={(e) => {
                        if (isDragging) {
                          e.preventDefault()
                        }
                      }}
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
