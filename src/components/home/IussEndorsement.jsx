import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Award } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const imageVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

const IussEndorsement = () => {
  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 md:py-28 overflow-hidden">

      {/* Decoración fondo */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-100 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div
        className="container mx-auto px-4 max-w-6xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Texto izquierda */}
          <div className="flex flex-col gap-6">
            <motion.div variants={itemVariants} className="flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-orange-500 uppercase tracking-widest">
                Recommended
              </span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
            >
              Endorsed by the{' '}
              <span className="text-orange-500">IUSS</span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-gray-600 text-base md:text-lg leading-relaxed"
            >
              The MEDSOILS CHALLENGE Master Programme is proud to be supported by the{' '}
              <strong className="text-gray-800 font-semibold">
                International Union of Soil Sciences (IUSS)
              </strong>
              , the global scientific union devoted to the advancement of soil science. This
              endorsement highlights the academic quality and international relevance of our
              programme in addressing soil health and climate challenges in Mediterranean regions.
            </motion.p>

            <motion.div variants={itemVariants}>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-3 border-2 border-orange-500 text-orange-500 px-8 py-3.5 rounded-full font-semibold hover:bg-orange-50 transition-all group"
                >
                  Know more about us
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Imagen derecha */}
          <motion.div
            variants={imageVariants}
            className="flex justify-center lg:justify-end"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative group"
            >
              {/* Resplandor naranja detrás */}
              <div className="absolute -inset-3 bg-gradient-to-br from-orange-200 via-orange-100 to-transparent rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />

              <div className="relative bg-white border border-gray-100 rounded-2xl shadow-lg shadow-gray-200/60 p-8 md:p-10 flex flex-col items-center gap-4">
                <img
                  src="https://res.cloudinary.com/dktr2wcto/image/upload/v1771413905/iuss_zhxioh.webp"
                  alt="International Union of Soil Sciences (IUSS)"
                  className="w-56 md:w-72 object-contain"
                  loading="lazy"
                />
                <p className="text-gray-500 text-sm font-medium text-center">
                  International Union of Soil Sciences®
                </p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  )
}

export default IussEndorsement
