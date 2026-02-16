import { motion } from 'framer-motion'

const Admission = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-16"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Admission
        </h1>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <p className="text-lg text-gray-600 leading-relaxed">
            Join our program and be part of the solution for sustainable soil management.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default Admission
