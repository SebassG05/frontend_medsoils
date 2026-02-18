import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

const imageVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
}

const FieldResearch = () => {
  return (
<section className="relative bg-gradient-to-b from-white to-gray-50 py-8 md:py-16 overflow-hidden">

      {/* Decoración fondo */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-50 rounded-full blur-3xl opacity-30 -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div
        className="container mx-auto px-4 max-w-6xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Texto izquierda */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            <motion.p
              variants={itemVariants}
              className="text-sm font-semibold text-orange-500 uppercase tracking-widest"
            >
              Field Work
            </motion.p>

            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
            >
              <span className="text-orange-500">Hands-on</span>
              <br />
              Research in the
              <br />
              Mediterranean
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 leading-relaxed"
            >
              Our students and researchers engage directly with the land — studying soil health,
              biodiversity, and ecosystem dynamics in real Mediterranean environments. Fieldwork
              is at the core of the MEDSOILS CHALLENGE methodology.
            </motion.p>

            <motion.div variants={itemVariants}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-3 border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-full font-semibold hover:bg-orange-50 transition-all group"
                >
                  Know more about us
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Imagen derecha */}
          <motion.div
            variants={imageVariants}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative group max-w-md w-full"
            >
              {/* Resplandor naranja */}
              <div className="absolute -inset-1 bg-gradient-to-br from-orange-400 via-orange-300 to-transparent rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300 pointer-events-none" />
              <img
                src="https://res.cloudinary.com/dktr2wcto/image/upload/v1771414397/PXL_20250116_100504904_h79t0q.jpg"
                alt="Field research — MEDSOILS CHALLENGE"
                className="relative w-full rounded-3xl shadow-2xl object-cover h-80 md:h-96"
                loading="lazy"
              />
            </motion.div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  )
}

export default FieldResearch
