import React from "react"
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Footer from '../components/layout/Footer'
const Home = () => {
  return (
    <>
      <div className="container mx-auto px-4 py-16">
        {/* Contenido de Home */}
      </div>
      
      {/* Raya decorativa justo encima del footer */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        className="relative w-full h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent origin-center mb-0"
      />
      
      <Footer />
    </>
  )
}

export default Home
