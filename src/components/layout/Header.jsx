import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, LogOut, Settings } from 'lucide-react'
import Login from './Login'
import SignUp from './SignUp'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5116/api/v1'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)
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
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Leer usuario de localStorage al montar y al cambiar storage
  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem('user')
      if (stored) {
        try { setUser(JSON.parse(stored)) } catch { setUser(null) }
      } else {
        setUser(null)
      }
    }
    loadUser()
    window.addEventListener('storage', loadUser)
    return () => window.removeEventListener('storage', loadUser)
  }, [])

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
      }
    } catch (e) {
      // Si falla el backend igual limpiamos localmente
    } finally {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      setIsUserMenuOpen(false)
    }
  }

  return (
    <>
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

          {/* CTA Button / User Menu */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="hidden lg:block"
          >
            <AnimatePresence mode="wait">
              {user ? (
                <motion.div
                  key="user-menu"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                  ref={userMenuRef}
                >
                  <motion.button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-semibold rounded-full shadow-lg shadow-orange-500/30"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span>{user.name?.split(' ')[0] || 'Usuario'}</span>
                    <motion.div
                      animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.97 }}
                        transition={{ duration: 0.06, ease: 'easeOut' }}
                        className="absolute right-0 mt-4 w-60 bg-white rounded-2xl shadow-2xl border-2 border-orange-400 overflow-hidden z-50"
                      >
                        <div className="px-4 py-4 bg-gradient-to-br from-orange-50 to-white border-b border-gray-100 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-base shadow">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ backgroundColor: '#fff7ed' }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-orange-400" />
                          Ajustes
                        </motion.button>
                        <div className="h-px bg-gray-100 mx-4" />
                        <motion.button
                          whileHover={{ backgroundColor: '#fff1f2' }}
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Cerrar sesión
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.button
                  key="login-btn"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsLoginOpen(true)}
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(251, 146, 60, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
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
              )}
            </AnimatePresence>
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
                transition={{ delay: navItems.length * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mb-8"
              >
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-5 py-3 bg-orange-50 rounded-2xl border border-orange-100">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false) }}
                      className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-red-50 text-red-500 text-base font-semibold rounded-2xl border border-red-100 cursor-pointer"
                    >
                      <LogOut className="w-5 h-5" />
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <motion.button
                    onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false) }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer w-full px-5 py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-base font-semibold rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300"
                  >
                    LOGIN
                  </motion.button>
                )}
              </motion.div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>

    {/* Login Modal - Outside Header */}
    <AnimatePresence>
      {isLoginOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
          >
            {/* Close Button */}
            <motion.button
              onClick={() => setIsLoginOpen(false)}
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close login modal"
            >
              <X className="w-5 h-5 text-gray-600" />
            </motion.button>

            {/* Login Component */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Login 
                onClose={() => setIsLoginOpen(false)}
                onSignUpClick={() => {
                  setIsLoginOpen(false)
                  setIsSignUpOpen(true)
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* SignUp Modal - Outside Header */}
    <AnimatePresence>
      {isSignUpOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full relative"
          >
            {/* Close Button */}
            <motion.button
              onClick={() => setIsSignUpOpen(false)}
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
              aria-label="Close signup modal"
            >
              <X className="w-5 h-5 text-gray-600" />
            </motion.button>

            {/* SignUp Component */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <SignUp 
                onClose={() => setIsSignUpOpen(false)}
                onLoginClick={() => {
                  setIsSignUpOpen(false)
                  setIsLoginOpen(true)
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

  </>
  )
}

export default Header

