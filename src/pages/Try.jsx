import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const Try = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-orange-100 border border-orange-300 text-orange-500 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Knowledge Check
            </span>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Soil Science{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                Quiz
              </span>
            </h1>
            
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Test your knowledge about Mediterranean soils, climate impact, and sustainable land management.
            </p>
          </div>
        </motion.div>

        {/* Quiz Content - Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Quiz Coming Soon!
              </h2>
              <p className="text-gray-600 mb-8">
                We're preparing an interactive quiz experience for you. Stay tuned!
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-shadow"
              >
                Return Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Try
