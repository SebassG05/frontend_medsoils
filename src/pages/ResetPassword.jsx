import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, KeyRound, CheckCircle2, Check, X } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5116/api/v1'

const requirements = [
  { id: 'length',    label: 'At least 6 characters',              test: (p) => p.length >= 6 },
  { id: 'uppercase', label: 'At least one uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'At least one lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
  { id: 'number',    label: 'At least one number (0-9)',           test: (p) => /[0-9]/.test(p) },
  { id: 'match',     label: 'Passwords match',                     test: (p, c) => p.length > 0 && p === c },
]

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const allMet = requirements.every(r => r.test(newPassword, confirmPassword))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!allMet) {
      setError('Please meet all password requirements.')
      return
    }

    if (!token) {
      setError('Invalid or missing reset token. Please request a new reset link.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to reset password')
      setSuccess(true)
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 max-w-md w-full text-center">
          <p className="text-red-500 font-medium">Invalid reset link. Please request a new one from Settings.</p>
          <button
            onClick={() => navigate('/settings')}
            className="mt-4 text-orange-500 hover:text-orange-600 text-sm font-medium"
          >
            Go to Settings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full"
      >
        {/* Icon — only shown before success */}
        {!success && (
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
              <KeyRound className="w-7 h-7 text-orange-400" />
            </div>
          </div>
        )}

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Password updated!</h2>
            <p className="text-gray-500 text-sm">You can now sign in with your new password.</p>
            <p className="text-gray-400 text-xs mt-2">Redirecting...</p>
          </motion.div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Set new password</h2>
            <p className="text-gray-500 text-sm text-center mb-6">Enter and confirm your new password below.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* New password */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">New password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password requirements */}
              <AnimatePresence>
                {newPassword.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-orange-50/60 border border-orange-100 rounded-xl px-4 py-3 space-y-1.5">
                      {requirements.map((req) => {
                        const met = req.test(newPassword, confirmPassword)
                        return (
                          <motion.div
                            key={req.id}
                            className="flex items-center gap-2"
                            animate={{ opacity: 1 }}
                          >
                            <motion.div
                              animate={met
                                ? { scale: [1, 1.2, 1], backgroundColor: '#f97316' }
                                : { scale: 1, backgroundColor: '#e5e7eb' }
                              }
                              transition={{ duration: 0.25 }}
                              className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                            >
                              {met
                                ? <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                : <X className="w-2.5 h-2.5 text-gray-400" strokeWidth={3} />
                              }
                            </motion.div>
                            <span className={`text-xs transition-colors duration-200 ${met ? 'text-orange-500 line-through' : 'text-gray-400'}`}>
                              {req.label}
                            </span>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Confirm password */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Confirm new password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || !allMet}
                whileHover={allMet ? { scale: 1.02 } : {}}
                whileTap={allMet ? { scale: 0.98 } : {}}
                className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-orange-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-opacity duration-200"
              >
                {isLoading ? 'Updating...' : 'Update password'}
              </motion.button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default ResetPassword
