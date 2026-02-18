import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { registerUser } from '../../services/authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5116/api/v1'

const SignUp = ({ onClose, onLoginClick }) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [apiError, setApiError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true)
      setApiError('')
      const { credential } = credentialResponse
      const response = await fetch(`${API_URL}/auth/google/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credential }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Google sign-up failed')
      localStorage.setItem('accessToken', data.data.accessToken)
      localStorage.setItem('refreshToken', data.data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.data.user))
      window.dispatchEvent(new Event('storage'))
      onClose?.()
    } catch (error) {
      setApiError(error.message || 'Google sign-up failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleError = () => {
    setApiError('Google sign-up failed. Please try again.')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setApiError('');
    setSuccessMessage('');
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await registerUser({
        name: fullName,
        email,
        password,
        confirmPassword,
      });
      
      if (res.data?.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user))
        window.dispatchEvent(new Event('storage'))
      }
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      onClose?.();
    } catch (error) {
      setApiError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Create Account</h2>
      <p className="text-gray-600 text-center mb-6">Join us today and get started</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm text-center">
            {apiError}
          </motion.p>
        )}
        {successMessage && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600 text-sm text-center">
            {successMessage}
          </motion.p>
        )}
        {/* Full Name Field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <motion.input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400"
          />
        </motion.div>

        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <motion.input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400"
          />
        </motion.div>

        {/* Password Field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <motion.input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400"
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Confirm Password Field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <motion.input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              setPasswordError('')
            }}
            placeholder="••••••••"
            required
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 ${
              passwordError ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-orange-400'
            }`}
          />
          {passwordError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mt-2"
            >
              {passwordError}
            </motion.p>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.2 }}
          className="w-full px-4 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </motion.button>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="relative flex items-center gap-4 my-2"
        >
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm font-medium">Or sign up with</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </motion.div>

        {/* Google Sign Up Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            text="signup_with"
          />
        </motion.div>
      </form>

      {/* Login Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 text-center"
      >
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onLoginClick}
            className="text-orange-500 hover:text-orange-600 font-medium cursor-pointer bg-none border-none"
          >
            Sign in
          </button>
        </p>
      </motion.div>
    </motion.div>
  )
}

export default SignUp