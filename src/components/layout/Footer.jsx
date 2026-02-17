import React from "react"
import { motion } from 'framer-motion'

const Footer = () => {
  return (
    
    <footer>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-row gap-4 footer-wrapper fade-in-up">
          <div className="flex-1 p-4">
            <img src="https://res.cloudinary.com/dktr2wcto/image/upload/v1771245191/cropped-LOGO_PRUEBA_urasd9.webp" alt="medsoils Challenge" />
            <p className="text-justify mt-2 text-[#2f3c4c] font-[Nunito Sans]">Join <span className="text-[#FF6600] text-bold">International Specialization Course</span> designed to enhance the skills of future <span className="text-[#FF6600]">soil scientists</span>, preparing them to address the challenges of climate change in the Mediterranean.</p>
            <motion.div
              className="flex flex-row gap-4 mt-6 align-items-center justify-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.img
                src="https://cdn-icons-png.flaticon.com/512/20/20673.png"
                alt=""
                className="w-6 h-6 cursor-pointer"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.3 }}
              />
              <motion.img
                src="https://iconape.com/wp-content/files/od/367794/svg/logo-twitter-logo-icon-png-svg.png"
                alt=""
                className="w-6 h-6 cursor-pointer"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.3 }}
              />
              <motion.img
                src="https://cdn-icons-png.flaticon.com/512/87/87390.png"
                alt=""
                className="w-6 h-6 cursor-pointer"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.3 }}
              />
              <motion.img
                src="https://pngimg.com/d/youtube_button_PNG27.png"
                alt=""
                className="w-7 h-7 cursor-pointer"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>
          <div className="flex-1 pl-6">
            <h5 className="font-bold text-[25px] mt-3 text-[#2f3c4c] font-[Nunito Sans]">Quick link</h5>
            <ul className="mt-4 text-[19px]">
              <li className="mb-2">
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  About
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Admission
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Contact
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  About the programm
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Login
                </a>
              </li>
            </ul>
          </div>
          <div className="flex-1 pl-6">
            <h5 className="font-bold text-[25px] mt-3 text-[#2f3c4c]">Day Care</h5>
            <ul className="mt-4 text-[19px]">
              <li className="mb-2">
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Mision
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Program
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Our Approach
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors duration-300 group inline-flex items-center">
                  <span className="w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Activities
                </a>
              </li>
            </ul>
          </div>
          <div className="flex-1 p-4">
            <img src="https://res.cloudinary.com/dktr2wcto/image/upload/v1771248302/Co-funded2_h7nig6.webp" alt="" />
            <p className="mt-5"><span className="text-[#ED7D31] text-[12px] text-justify font-[Nunito Sans]">KA220-HED-89E13D7A KA220-HED - Cooperation partnerships in higher education IT02 - Agenzia Nazionale Erasmus+ - INDIRE</span></p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
