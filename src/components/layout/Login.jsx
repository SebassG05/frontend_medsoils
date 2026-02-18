import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { loginUser } from '../../services/authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5116/api/v1'

const Login = ({ onClose, onSignUpClick }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorRequired, setTwoFactorRequired] = useState(false)
  const [twoFactorToken, setTwoFactorToken] = useState('')
  const [accessToken, setAccessToken] = useState(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        setSuccessMessage('')
        try {
            const res = await loginUser({ email, password })
            
            setEmail('')
            setPassword('')
            onClose?.()
            window.dispatchEvent(new Event('storage'))
        } catch (error) {
            setError(error.message || 'Failed to sign in')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setIsLoading(true)
            setError('')
            const { credential } = credentialResponse
            
            // Enviar token al backend
            const response = await fetch(`${API_URL}/auth/google/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token: credential }),
            })
            
            const data = await response.json()
            
            if (!response.ok) {
              throw new Error(data.message || 'Login failed')
            }
            
            if (data.data.requiresTwoFactor) {
              // 2FA required
              setAccessToken(data.data.accessToken)
              setTwoFactorRequired(true)
              setIsLoading(false)
            } else {
              // Login successful
              localStorage.setItem('accessToken', data.data.accessToken)
              localStorage.setItem('refreshToken', data.data.refreshToken)
              localStorage.setItem('user', JSON.stringify(data.data.user))
              window.dispatchEvent(new Event('storage'))
              setIsLoading(false)
              onClose?.()
            }
        } catch (error) {
            setIsLoading(false)
            setError(error.message || 'Google sign-in failed')
        }
    }

    const handleGoogleError = () => {
        setError('Google sign-in failed. Please try again.')
    }

    const handleTwoFactorSubmit = async (e) => {
      e.preventDefault()
      setIsLoading(true)
      setError('')
      
      try {
        const response = await fetch(`${API_URL}/auth/2fa/verify-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ token: twoFactorToken }),
        })
        
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.message || '2FA verification failed')
        }
        
        // 2FA verification successful
        localStorage.setItem('accessToken', data.data.accessToken)
        localStorage.setItem('refreshToken', data.data.refreshToken)
        window.dispatchEvent(new Event('storage'))
        setIsLoading(false)
        onClose?.()
      } catch (error) {
        setIsLoading(false)
        setError(error.message || '2FA verification failed')
      }
    }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {twoFactorRequired ? (
        <>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Two-Factor Authentication</h2>
          <p className="text-gray-600 text-center mb-6">Enter your authenticator code</p>
          
          <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Authenticator Code
              </label>
              <motion.input
                type="text"
                value={twoFactorToken}
                onChange={(e) => setTwoFactorToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                required
                maxLength="6"
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 text-center text-2xl tracking-widest"
              />
            </motion.div>
            
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full px-4 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </motion.button>
          </form>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Welcome Back</h2>
          <p className="text-gray-600 text-center mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}
            
            {successMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm"
              >
                {successMessage}
              </motion.div>
            )}
            
            {/* Fallo de Email */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
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
              transition={{ delay: 0.2 }}
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

            {/* Remember Me & Forgot Password */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between text-sm"
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-orange-500 cursor-pointer"
                />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">
                Forgot password?
              </a>
            </motion.div>

            {/* Boton de enviar */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.2 }}
              className="w-full px-4 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </motion.button>

            {/* Divisor */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="relative flex items-center gap-4 my-6"
            >
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm font-medium">Or continue with</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </motion.div>

            {/* Google Login Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center"
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="signin"
              />
            </motion.div>
          </form>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onSignUpClick}
                className="text-orange-500 hover:text-orange-600 font-medium cursor-pointer bg-none border-none"
              >
                Sign up
              </button>
            </p>
          </motion.div>
        </>
      )}
    </motion.div>
  )
}

export default Login