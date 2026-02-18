import React from "react"
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, GraduationCap, Globe, Microscope, Sprout, Lightbulb } from 'lucide-react'
import Footer from '../components/layout/Footer'
import ScrollToTop from '../components/ui/ScrollToTop'
import BlogCarousel from '../components/home/BlogCarousel'
import SoilQuizBanner from '../components/home/SoilQuizBanner'

const Home = () => {
  const [activeCard, setActiveCard] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const stackCards = [
    {
      title: "Impact",
      description: "The project contributes to increased soil resilience, improved resource efficiency, and enhanced sustainability of agricultural production systems at regional scale.",
      icon: GraduationCap,
      bgColor: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      iconBg: "bg-orange-500",
    },
    {
      title: "Methodology",
      description: "The methodology combines controlled field trials, long-term soil monitoring, indicator-based assessment, and comparative evaluation of innovative soil management practices.",
      icon: Globe,
      bgColor: "from-cyan-50 to-blue-100",
      borderColor: "border-cyan-200",
      iconBg: "bg-cyan-500",
    },
    {
      title: "Research",
      description: "The project advances applied and interdisciplinary research focused on sustainable soil management across Mediterranean environments, integrating field evidence, laboratory analysis, and modelling approaches.",
      icon: Microscope,
      bgColor: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      iconBg: "bg-orange-500",
    },
    {
      title: "Objetives",
      description: "The main objective is to improve soil health, adaptive capacity, and ecosystem performance by promoting science-based management strategies under changing climatic and land-use conditions.",
      icon: Sprout,
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      iconBg: "bg-green-500",
    },
    {
      title: "Innovation",
      description: "Promoting innovative practices and technologies that contribute to the future of sustainable soil science and agriculture.",
      icon: Lightbulb,
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-500",
    }
  ]

  const handleCardClick = () => {
    setActiveCard((prev) => (prev + 1) % stackCards.length)
  }

  const handleDragEnd = (event, info) => {
    const swipeThreshold = isMobile ? 30 : 50
    if (Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.offset.y) > swipeThreshold) {
      setActiveCard((prev) => (prev + 1) % stackCards.length)
    }
  }

  return (
    <>
      {/* Sección Hero - MEDSOILS CHALLENGE */}
      <section className="relative overflow-hidden bg-white py-12 md:py-16">
        {/* Fondo decorativo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-30 -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-50 rounded-full blur-3xl opacity-20 -ml-36 -mb-36"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="container mx-auto px-4 relative z-10 max-w-6xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenido Izquierdo */}
            <motion.div variants={itemVariants} className="max-w-lg mx-auto lg:mx-0">
              <motion.p
                variants={itemVariants}
                className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-4"
              >
                ABOUT
              </motion.p>
              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
              >
                <span className="text-orange-500">MEDSOILS</span>
                <br />
                CHALLENGE
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl"
              >
                Aims to develop a new generation of soil experts through a Joint International Master's programme to tackle soil challenges in the Mediterranean region exacerbated by climate change.
              </motion.p>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/about"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-shadow group"
                >
                  More Info
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Decoración Derecha - Stacked Cards */}
            <motion.div
              variants={imageVariants}
              className="relative h-[300px] sm:h-[320px] lg:h-[350px] mt-4 lg:mt-0"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Tarjetas apiladas */}
                {stackCards.map((card, index) => {
                  const position = (index - activeCard + stackCards.length) % stackCards.length
                  
                  // Posiciones y rotaciones para efecto fan/disperso
                  // Versión móvil con desplazamientos más pequeños
                  const mobilePositions = [
                    { x: 0, y: 0, rotate: 0 },       // Tarjeta activa
                    { x: 20, y: 12, rotate: 4 },     // Segunda tarjeta
                    { x: -25, y: 20, rotate: -5 },   // Tercera tarjeta
                    { x: 35, y: 28, rotate: 7 },     // Cuarta tarjeta
                    { x: -40, y: 35, rotate: -8 },   // Quinta tarjeta
                  ]
                  
                  // Versión desktop con más amplitud
                  const desktopPositions = [
                    { x: 0, y: 0, rotate: 0 },       // Tarjeta activa - sin cambios
                    { x: 35, y: 20, rotate: 6 },     // Segunda tarjeta
                    { x: -45, y: 35, rotate: -8 },   // Tercera tarjeta
                    { x: 60, y: 50, rotate: 12 },    // Cuarta tarjeta
                    { x: -70, y: 65, rotate: -14 },  // Quinta tarjeta
                  ]
                  
                  const positions = isMobile ? mobilePositions : desktopPositions
                  const currentPos = positions[position] || positions[4]
                  const scaleDecrement = isMobile ? 0.04 : 0.03
                  
                  return (
                    <motion.div
                      key={index}
                      drag
                      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      dragElastic={0.7}
                      onDragEnd={position === 0 ? handleDragEnd : undefined}
                      animate={{
                        scale: 1 - position * scaleDecrement,
                        x: currentPos.x,
                        y: currentPos.y,
                        rotate: currentPos.rotate,
                        opacity: position < 5 ? 1 : 0,
                        zIndex: stackCards.length - position,
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 200, 
                        damping: 25,
                        mass: 0.8,
                      }}
                      onClick={position === 0 ? handleCardClick : undefined}
                      className={`absolute w-72 h-56 sm:w-80 sm:h-64 lg:w-96 lg:h-72 p-5 sm:p-6 lg:p-7 rounded-2xl border cursor-grab active:cursor-grabbing transition-all bg-gradient-to-br ${card.bgColor} ${card.borderColor} shadow-lg flex items-center justify-center`}
                      style={{ touchAction: 'none' }}
                    >
                      <div className="flex items-center justify-between gap-3 text-center">
                        <div className="flex flex-col items-center gap-2 sm:gap-3 flex-1">
                          <div className={`w-11 h-11 sm:w-12 sm:h-12 lg:w-13 lg:h-13 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                            <card.icon className="text-white w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg sm:text-xl lg:text-2xl">{card.title}</h3>
                            <p className="text-gray-600 text-xs sm:text-sm lg:text-base">{card.description}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Sección About us - Multinational Educational Collaboration */}
      <section className="relative bg-gradient-to-b from-white to-gray-50 py-20 md:py-32 overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20 -translate-y-1/2 -ml-48"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="container mx-auto px-4 relative z-10 max-w-6xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Imagen Izquierda */}
            <motion.div
              variants={imageVariants}
              className="order-2 lg:order-1 max-w-md mx-auto lg:mx-0"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-orange-400 via-orange-300 to-transparent rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <img
                  src="https://res.cloudinary.com/dktr2wcto/image/upload/v1771403759/44dc4e5d-ba4d-4c75-b7d0-f1d8dd4ea673_gkt1fv.jpg"
                  alt="MEDSOILS Team"
                  className="relative w-full rounded-3xl shadow-2xl object-cover h-96"
                />
              </motion.div>
            </motion.div>

            {/* Contenido Derecha */}
            <motion.div variants={itemVariants} className="order-1 lg:order-2">
              <motion.p
                variants={itemVariants}
                className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-4"
              >
                About us
              </motion.p>
              <motion.h2
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              >
                <span className="text-orange-500">A Multinational</span>
                <br />
                Educational
                <br />
                Collaboration
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-600 leading-relaxed mb-8"
              >
                The International Master 'MEDSOILS CHALLENGE' is a joint initiative organized by a consortium of prestigious higher education institutions and technical partners from four Mediterranean countries.
              </motion.p>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/about"
                  className="inline-flex items-center gap-3 border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-full font-semibold hover:bg-orange-50 transition-all"
                >
                  Know more about us
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Sección Blog Carousel */}
      <section className="relative bg-white py-20 md:py-32 overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-20 -mr-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20 -ml-48"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="container mx-auto px-4 relative z-10 max-w-7xl"
        >
          <BlogCarousel />
        </motion.div>
      </section>

      {/* Sección Quiz de suelos */}
      <SoilQuizBanner />

      {/* Raya decorativa */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative w-full h-[3px] bg-gradient-to-r from-transparent via-orange-400 to-transparent origin-center my-8"
      />
      <Footer />
      <ScrollToTop />
    </>
  )
}

export default Home
