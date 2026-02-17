import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { scrollY } = useScroll()
  
  const logoUrl = "https://res.cloudinary.com/dktr2wcto/image/upload/v1771245130/Medsoil_Challenge_lrkqnt.webp"

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Admission', path: '/admission' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ]

  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.98)']
  )

  const headerShadow = useTransform(
    scrollY,
    [0, 100],
    ['0px 0px 0px rgba(0,0,0,0)', '0px 4px 20px rgba(0,0,0,0.08)']
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  const itemVariants = {
    closed: { x: 30, opacity: 0 },
    open: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: 0.1 + (i * 0.08),
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  }

  const isActive = (path) => location.pathname === path

  return (
    <motion.header
      style={{
        backgroundColor: headerBackground,
        boxShadow: headerShadow,
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.6, 0.05, 0.01, 0.9],
        opacity: { duration: 0.6 }
      }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-gray-100/50"
    >
      {/* Animated gradient line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent origin-center transform translate-y-1 sm:translate-y-2"
      />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 sm:h-28 lg:h-24">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/" className="block">
              <motion.img 
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                src={logoUrl} 
                alt="MedSoils Challenge" 
                className="h-20 sm:h-24 lg:h-20 w-auto object-contain mt-1 sm:mt-2 lg:mt-0"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden lg:flex items-center space-x-12"
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.5 + (index * 0.1),
                  ease: "easeOut"
                }}
              >
                <Link
                  to={item.path}
                  className="relative group"
                >
                  <span className={`text-base font-medium tracking-wide transition-colors duration-300 ${
                    isActive(item.path)
                      ? 'text-orange-500'
                      : 'text-gray-700 hover:text-orange-400'
                  }`}>
                    {item.name}
                  </span>
                  
                  {/* Underline animation */}
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-full" />
                  
                  {isActive(item.path) && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="hidden lg:block"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(251, 146, 60, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="cursor-pointer relative overflow-hidden px-8 py-3.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-semibold rounded-full shadow-lg shadow-orange-500/30 group"
            >
              <span className="relative z-10">LOGIN</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative p-2 rounded-xl hover:bg-gray-100/80 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <motion.div
              animate={isMobileMenuOpen ? "open" : "closed"}
              className="w-6 h-6"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'calc(100vh - 6rem)', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.22, 1, 0.36, 1],
                height: { duration: 0.4 },
                opacity: { duration: 0.3 }
              }}
              className="lg:hidden overflow-hidden border-t border-gray-100/60 backdrop-blur-sm bg-white"
            >
            <div className="flex flex-col h-full justify-between py-6 px-2">
              {/* Navigation Items */}
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -30, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -30, scale: 0.95 }}
                    transition={{ 
                      delay: index * 0.08,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-5 py-4 rounded-2xl text-base font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-orange-50 to-orange-50/50 text-orange-500 shadow-lg shadow-orange-100/50 border border-orange-100'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-50/50 hover:shadow-md hover:shadow-gray-100/30'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* Login Button at Bottom */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ 
                  delay: navItems.length * 0.08,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className="mb-8"
              >
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="cursor-pointer w-full px-5 py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-base font-semibold rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300"
                >
                  LOGIN
                </motion.button>
              </motion.div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}

export default Header

