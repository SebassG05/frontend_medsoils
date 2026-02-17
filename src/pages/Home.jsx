import React from "react"
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Footer from '../components/layout/Footer'
const Home = () => {
  return (
    <><div className="container mx-auto px-4 py-16">
      {/* Contenido de Home */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        className="absolute bottom-160 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent origin-center transform translate-y-1 sm:translate-y-2" />
    </div><Footer /></>
  )
}

export default Home
