import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const stats = [
  { value: '10',  label: 'Questions',  accent: 'bg-orange-500' },
  { value: '5',   label: 'Topics',     accent: 'bg-cyan-500'   },
  { value: '~3',  label: 'Minutes',    accent: 'bg-green-500'  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const SoilQuizBanner = () => {
  return (
    <section className="relative py-12 md:py-32 overflow-hidden bg-white">

      {/* Onda horizontal superior */}
      <svg
        className="absolute top-0 left-0 w-full pointer-events-none h-20 md:h-40"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,0 L0,0 Z" fill="#fff7ed" opacity="0.5"/>
        <path d="M0,55 C360,10 720,80 1080,30 C1260,10 1380,50 1440,55 L1440,0 L0,0 Z" fill="#ffedd5" opacity="0.3"/>
      </svg>

      {/* Onda horizontal inferior */}
      <svg
        className="absolute bottom-0 left-0 w-full pointer-events-none h-20 md:h-40"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,40 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,80 L0,80 Z" fill="#fff7ed" opacity="0.5"/>
        <path d="M0,25 C360,70 720,10 1080,50 C1260,70 1380,30 1440,25 L1440,80 L0,80 Z" fill="#ffedd5" opacity="0.3"/>
      </svg>

      {/* Mancha central difusa muy suave */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-orange-100 rounded-full blur-[100px] opacity-50 pointer-events-none" />

      {/* Contenido */}
      <motion.div
        className="container mx-auto px-4 max-w-5xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="flex flex-col items-center text-center gap-8">

          {/* Etiqueta */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 bg-orange-100 border border-orange-300 text-orange-500 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Knowledge Check
            </span>
          </motion.div>

          {/* Título */}
          <motion.div variants={itemVariants} className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              How much do you know{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                about soils?
              </span>
            </h2>
          </motion.div>

          {/* Descripción */}
          <motion.p
            variants={itemVariants}
            className="text-gray-500 text-lg leading-relaxed max-w-xl"
          >
            Put your knowledge to the test with our interactive quiz on Mediterranean soils,
            climate impact, and sustainable land management.
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-6"
          >
            {stats.map(({ value, label, accent }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-6 py-3 shadow-sm"
              >
                <span className={`w-2 h-2 rounded-full ${accent}`} />
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                <span className="text-gray-500 text-sm">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/try"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-full font-semibold text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-shadow group"
              >
                Try it now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  )
}

export default SoilQuizBanner
