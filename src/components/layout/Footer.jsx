import React from "react"
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-gray-50/50 border-t border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Grid responsive: 1 columna en móvil, 2 en tablet, 4 en desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Columna 1: Logo y descripción */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4 sm:space-y-5 flex flex-col items-center text-center"
          >
            <motion.img 
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              src="https://res.cloudinary.com/dktr2wcto/image/upload/v1771245191/cropped-LOGO_PRUEBA_urasd9.webp" 
              alt="medsoils Challenge"
              className="h-14 sm:h-16 w-auto"
            />
            <p className="text-center text-sm sm:text-base leading-relaxed text-gray-600 font-[Nunito Sans]">
              Join <span className="text-orange-500 font-semibold">International Specialization Course</span> designed to enhance the skills of future <span className="text-orange-500 font-semibold">soil scientists</span>, preparing them to address the challenges of climate change in the Mediterranean.
            </p>
            <motion.div
              className="flex flex-row gap-3 sm:gap-4 pt-2 justify-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.img
                src="https://cdn-icons-png.flaticon.com/512/20/20673.png"
                alt="Facebook"
                className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer hover:opacity-80"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.3 }}
              />
              <motion.img
                src="https://iconape.com/wp-content/files/od/367794/svg/logo-twitter-logo-icon-png-svg.png"
                alt="Twitter"
                className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer hover:opacity-80"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.3 }}
              />
              <motion.img
                src="https://cdn-icons-png.flaticon.com/512/87/87390.png"
                alt="Instagram"
                className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer hover:opacity-80"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.3 }}
              />
              <motion.img
                src="https://pngimg.com/d/youtube_button_PNG27.png"
                alt="YouTube"
                className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer hover:opacity-80"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.div>

          {/* Columna 2: Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 flex flex-col items-center text-center"
          >
            <h5 className="font-bold text-xl sm:text-2xl text-gray-800 font-[Nunito Sans] relative inline-block">
              Quick link
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 sm:w-12 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600"></span>
            </h5>
            <ul className="space-y-2 sm:space-y-3 pt-2 flex flex-col items-center">
              <li>
                <Link to="/" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  About
                </Link>
              </li>
              <li>
                <Link to="/admission" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Admission
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  About the programm
                </a>
              </li>
              <li>
                <a href="#" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Login
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Columna 3: Day Care */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 flex flex-col items-center text-center"
          >
            <h5 className="font-bold text-xl sm:text-2xl text-gray-800 font-[Nunito Sans] relative inline-block">
              Day Care
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 sm:w-12 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600"></span>
            </h5>
            <ul className="space-y-2 sm:space-y-3 pt-2 flex flex-col items-center">
              <li>
                <a href="#" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Mision
                </a>
              </li>
              <li>
                <a href="#" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Program
                </a>
              </li>
              <li>
                <a href="#" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Our Approach
                </a>
              </li>
              <li>
                <a href="#" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Activities
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Columna 4: Erasmus Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4 sm:col-span-2 lg:col-span-1 flex flex-col items-center text-center"
          >
            <motion.img 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              src="https://res.cloudinary.com/dktr2wcto/image/upload/v1771248302/Co-funded2_h7nig6.webp" 
              alt="Erasmus+ Co-funded by the European Union"
              className="w-full max-w-[280px] sm:max-w-xs mx-auto"
            />
            <p className="text-xs sm:text-sm text-orange-500 leading-relaxed font-[Nunito Sans] max-w-[280px] sm:max-w-xs">
              KA220-HED-89E13D7A KA220-HED - Cooperation partnerships in higher education IT02 - Agenzia Nazionale Erasmus+ - INDIRE
            </p>
          </motion.div>
        </div>

        {/* Copyright Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200/60"
        >
          <p className="text-center text-xs sm:text-sm text-gray-500 font-[Nunito Sans]">
            © {new Date().getFullYear()} MedSoils Challenge. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
