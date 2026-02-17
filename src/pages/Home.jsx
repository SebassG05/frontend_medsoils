import React from "react"
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
const Home = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Contenido de Home */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        className="absolute bottom-160 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent origin-center transform translate-y-1 sm:translate-y-2"
      />
      <footer>
        <div className=" max-w-7xl mx-auto  ">
            <div className="flex flex-row gap-4 footer-wrapper fade-in-up">
            <div className="flex-1 p-4">
              <img src="https://res.cloudinary.com/dktr2wcto/image/upload/v1771245191/cropped-LOGO_PRUEBA_urasd9.webp" alt="medsoils Challenge" />
                <p className="text-justify mt-2 text-[#2f3c4c] font-[Nunito Sans]">Join <span className="text-[#FF6600] text-bold">International Specialization Course</span> designed to enhance the skills of future <span className="text-[#FF6600]">soil scientists</span>, preparing them to address the challenges of climate change in the Mediterranean.</p>
               <div className="flex flex-row gap-4 mt-6 align-items-center justify-center">
                <img src="https://cdn-icons-png.flaticon.com/512/20/20673.png" alt="" className="w-6 h-6" />
                <img src="https://iconape.com/wp-content/files/od/367794/svg/logo-twitter-logo-icon-png-svg.png" alt="" className="w-6 h-6" />
                
                <img src="https://cdn-icons-png.flaticon.com/512/87/87390.png" alt="" className="w-6 h-6" />

                <img src="https://pngimg.com/d/youtube_button_PNG27.png" alt="" className="w-7 h-7" />
               </div>
            </div>
            <div className="flex-1 pl-6"><h5 className="font-bold text-[25px] mt-3 text-[#2f3c4c] font-[Nunito Sans]">Quick link</h5>
              <ul className="mt-4 text-[19px]">
                <li className="mb-2 "><a href="#" className="text-gray-600 hover:text-gray-800">Home</a></li>
                <li className="mb-2"><a href="#" className="text-gray-600 hover:text-gray-800">About</a></li>
                <li className="mb-2"><a href="#" className="text-gray-600 hover:text-gray-800">Admission</a></li>
                <li className="mb-2"><a href="#" className="text-gray-600 hover:text-gray-800">Contact</a></li>
                <li className="mb-2"><a href="#" className="text-gray-600 hover:text-gray-800">About the programm</a></li>
                <li className="mb-2"><a href="#" className="text-gray-600 hover:text-gray-800">Login</a></li>
              </ul>
            </div>
            <div className="flex-1 pl-6"><h5 className="font-bold text-[25px] mt-3 text-[#2f3c4c]">Day Care</h5>
              <ul className="mt-4 text-[19px]">
                <li className="mb-2 "><a href="#" className="text-gray-600 hover:text-gray-800">Mision</a></li>
                <li className="mb-2"><a href="#" className="text-gray-600 hover:text-gray-800">Program</a></li>
                <li className="mb-2"><a href="#" className="text-gray-600 hover:text-gray-800">Our Approach</a></li>
                <li className="mb-2"><a href="#" className="text-gray-600 hover:text-gray-800">Activities</a></li>
              </ul>
            </div>
            <div className="flex-1 p-4">
              <img src="https://res.cloudinary.com/dktr2wcto/image/upload/v1771248302/Co-funded2_h7nig6.webp" alt="" />
              <p className="mt-5"> <span className="text-[#ED7D31] text-[12px] text-justify font-[Nunito Sans]" >KA220-HED-89E13D7A KA220-HED - Cooperation partnerships in higher education IT02 - Agenzia Nazionale Erasmus+ - INDIRE</span> </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
