import { motion } from 'framer-motion'
import Footer from '../components/layout/Footer'

const Blog = () => {
  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-16"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Blog
        </h1>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <p className="text-lg text-gray-600 leading-relaxed">
            Read our latest articles about soil science and environmental sustainability.
          </p>
        </div>
      </div>
    </motion.div>
    <Footer />
    </>
  )
}

export default Blog
