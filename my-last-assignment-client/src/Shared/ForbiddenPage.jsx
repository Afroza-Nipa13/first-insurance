
import { ArrowLeftIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { Link } from 'react-router'

const ForbiddenPage = () => {
  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-900 p-4"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center bg-white shadow-xl p-10 rounded-2xl max-w-md w-full">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 150 }}
          className="flex justify-center"
        >
          <LockClosedIcon className="w-20 h-20 text-red-500" />
        </motion.div>
        <h1 className="text-6xl font-bold text-red-600 mt-6">403 Forbidden</h1>
        <p className="text-gray-600 mt-4">
          Sorry, you don’t have permission to access this page.
        </p>
        <Link to="/" className="mt-6 inline-block">
          <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-5 rounded-full transition duration-300 shadow-md">
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Home
          </button>
        </Link>
      </div>
    </motion.div>
  )
}

export default ForbiddenPage;
