import React from "react"
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Footer from '../components/layout/Footer'

const Home = () => {
  const [activeCard, setActiveCard] = useState(0)

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
      title: "Global Education",
      description: "Learn from international experts",
      icon: "🎓",
      bgColor: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      iconBg: "bg-orange-500",
    },
    {
      title: "4 Countries",
      description: "Mediterranean collaboration",
      icon: "🌍",
      bgColor: "from-cyan-50 to-blue-100",
      borderColor: "border-cyan-200",
      iconBg: "bg-cyan-500",
    },
    {
      title: "Research",
      description: "Innovative soil solutions",
      icon: "🔬",
      bgColor: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      iconBg: "bg-orange-500",
    },
  ]

  const handleCardClick = () => {
    setActiveCard((prev) => (prev + 1) % stackCards.length)
  }

  return (
    <>
      {/* Sección Hero - MEDSOILS CHALLENGE */}
      <section className="relative overflow-hidden bg-white py-20 md:py-32">
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
              className="relative hidden lg:block h-[400px]"
            >
              <div className="relative w-full h-full flex items-center justify-center h-full">
                {/* Tarjetas apiladas */}
                {stackCards.map((card, index) => {
                  const position = (index - activeCard + stackCards.length) % stackCards.length
                  
                  // Posiciones y rotaciones para efecto fan/disperso
                  const positions = [
                    { x: 0, y: 0, rotate: 0 },      // Tarjeta activa - sin cambios
                    { x: 40, y: 30, rotate: 8 },    // Segunda tarjeta
                    { x: -60, y: 60, rotate: -12 }, // Tercera tarjeta
                  ]
                  
                  const currentPos = positions[position] || positions[2]
                  
                  return (
                    <motion.div
                      key={index}
                      animate={{
                        scale: 1 - position * 0.04,
                        x: currentPos.x,
                        y: currentPos.y,
                        rotate: currentPos.rotate,
                        opacity: position < 3 ? 1 : 0,
                        zIndex: stackCards.length - position,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      onClick={position === 0 ? handleCardClick : undefined}
                      className={`absolute w-96 h-80 p-8 rounded-2xl border cursor-pointer transition-all bg-gradient-to-br ${card.bgColor} ${card.borderColor} shadow-lg flex items-center justify-center`}
                    >
                      <div className="flex items-center justify-between gap-4 text-center">
                        <div className="flex flex-col items-center gap-4 flex-1">
                          <div className={`w-14 h-14 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white text-2xl">{card.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-2xl">{card.title}</h3>
                            <p className="text-gray-600 text-base">{card.description}</p>
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
                  src="https://res.cloudinary.com/dktr2wcto/image/upload/v1771332194/IMG_20250508_155029_wmxk4l.webp"
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


      {/* Raya decorativa */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative w-full h-[3px] bg-gradient-to-r from-transparent via-orange-400 to-transparent origin-center my-8"
      />
      <Footer />
    </>
  )
}

export default Home
