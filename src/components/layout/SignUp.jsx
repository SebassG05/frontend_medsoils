import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Leaf } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { registerUser } from '../../services/authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5116/api/v1'

/* ─── shared field wrapper ─── */
function Field({ label, icon: Icon, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      <div className={`relative flex items-center rounded-xl border bg-gray-50 transition-all focus-within:bg-white focus-within:shadow-sm ${
        error ? 'border-red-400 focus-within:ring-2 focus-within:ring-red-200' : 'border-gray-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100'
      }`}>
        {Icon && <Icon size={16} className="absolute left-3.5 text-gray-400 pointer-events-none shrink-0" />}
        {children}
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  )
}

const inputCls     = 'w-full bg-transparent pl-10 pr-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none rounded-xl'
const inputCls2    = 'w-full bg-transparent pl-10 pr-10 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none rounded-xl'

const SignUp = ({ onClose, onLoginClick }) => {
  const [fullName,         setFullName]         = useState('')
  const [email,            setEmail]            = useState('')
  const [password,         setPassword]         = useState('')
  const [confirmPassword,  setConfirmPassword]  = useState('')
  const [isLoading,        setIsLoading]        = useState(false)
  const [showPassword,     setShowPassword]     = useState(false)
  const [showConfirm,      setShowConfirm]      = useState(false)
  const [passwordError,    setPasswordError]    = useState('')
  const [apiError,         setApiError]         = useState('')

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true)
      setApiError('')
      const response = await fetch(`${API_URL}/auth/google/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Google sign-up failed')
      localStorage.setItem('accessToken', data.data.accessToken)
      localStorage.setItem('refreshToken', data.data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.data.user))
      window.dispatchEvent(new Event('storage'))
      onClose?.()
    } catch (err) {
      setApiError(err.message || 'Google sign-up failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleError = () => setApiError('Google sign-up failed. Please try again.')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setApiError('')
    if (password !== confirmPassword) { setPasswordError('Passwords do not match'); return }
    setIsLoading(true)
    try {
      const res = await registerUser({ name: fullName, email, password, confirmPassword })
      if (res.data?.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user))
        window.dispatchEvent(new Event('storage'))
      }
      setFullName(''); setEmail(''); setPassword(''); setConfirmPassword('')
      onClose?.()
    } catch (err) {
      setApiError(err.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

      {/* heading */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
            <Leaf size={15} className="text-orange-500" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-500">MedSoils</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">Create your account</h2>
        <p className="text-sm text-gray-500">Join the MedSoils community — it's free</p>
      </div>

      {/* errors */}
      {apiError && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          {apiError}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* full name */}
        <Field label="Full name" icon={User}>
          <input
            type="text" value={fullName} onChange={e => setFullName(e.target.value)}
            placeholder="Jane Doe" required
            className={inputCls}
          />
        </Field>

        {/* email */}
        <Field label="Email address" icon={Mail}>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" required
            className={inputCls}
          />
        </Field>

        {/* password */}
        <Field label="Password" icon={Lock}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" required
            className={inputCls2}
          />
          <button type="button" onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 text-gray-400 hover:text-gray-600 transition"
            aria-label="Toggle password visibility">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </Field>

        {/* confirm password */}
        <Field label="Confirm password" icon={Lock} error={passwordError}>
          <input
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={e => { setConfirmPassword(e.target.value); setPasswordError('') }}
            placeholder="••••••••" required
            className={inputCls2}
          />
          <button type="button" onClick={() => setShowConfirm(v => !v)}
            className="absolute right-3 text-gray-400 hover:text-gray-600 transition"
            aria-label="Toggle confirm password visibility">
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </Field>

        {/* submit */}
        <button
          type="submit" disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition shadow-md shadow-orange-100 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? 'Creating account…' : 'Create account'}
        </button>

        {/* divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">or sign up with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} theme="outline" size="large" text="signup_with" />
        </div>
      </form>

      {/* login link */}
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <button onClick={onLoginClick} className="text-orange-500 hover:text-orange-600 font-semibold transition">
          Sign in
        </button>
      </p>
    </motion.div>
  )
}
  export default SignUp