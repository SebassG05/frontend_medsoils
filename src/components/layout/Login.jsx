import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Leaf } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { loginUser } from '../../services/authService'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5116/api/v1'

/* ─── shared input wrapper ─── */
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
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

const inputCls = 'w-full bg-transparent pl-10 pr-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none rounded-xl'
const inputClsNoIcon = 'w-full bg-transparent px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none rounded-xl'

const Login = ({ onClose, onSignUpClick }) => {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading]     = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorRequired, setTwoFactorRequired] = useState(false)
  const [twoFactorToken, setTwoFactorToken]       = useState('')
  const [accessToken, setAccessToken] = useState(null)
  const [error, setError]             = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      await loginUser({ email, password })
      setEmail('')
      setPassword('')
      window.dispatchEvent(new Event('storage'))
      onClose?.()
    } catch (err) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true)
      setError('')
      const response = await fetch(`${API_URL}/auth/google/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Login failed')
      if (data.data.requiresTwoFactor) {
        setAccessToken(data.data.accessToken)
        setTwoFactorRequired(true)
      } else {
        localStorage.setItem('accessToken', data.data.accessToken)
        localStorage.setItem('refreshToken', data.data.refreshToken)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        window.dispatchEvent(new Event('storage'))
        onClose?.()
      }
    } catch (err) {
      setError(err.message || 'Google sign-in failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleError = () => setError('Google sign-in failed. Please try again.')

  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/auth/2fa/verify-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ token: twoFactorToken }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || '2FA verification failed')
      localStorage.setItem('accessToken', data.data.accessToken)
      localStorage.setItem('refreshToken', data.data.refreshToken)
      window.dispatchEvent(new Event('storage'))
      onClose?.()
    } catch (err) {
      setError(err.message || '2FA verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  /* ── 2FA view ── */
  if (twoFactorRequired) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* heading */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ShieldCheck size={22} className="text-orange-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Two-factor auth</h2>
          <p className="text-sm text-gray-500">Enter the 6-digit code from your authenticator app</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
            {error}
          </motion.div>
        )}

        <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
          <input
            type="text"
            value={twoFactorToken}
            onChange={e => setTwoFactorToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            required maxLength="6"
            className="w-full px-4 py-3.5 border border-gray-200 bg-gray-50 rounded-xl text-center text-2xl font-bold tracking-[0.5em] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
          />
          <button
            type="submit" disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition shadow-md shadow-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying…' : 'Verify code'}
          </button>
        </form>
      </motion.div>
    )
  }

  /* ── main login view ── */
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
        <h2 className="text-2xl font-extrabold text-gray-900">Welcome back</h2>
        <p className="text-sm text-gray-500">Sign in to your account to continue</p>
      </div>

      {/* error */}
      {error && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className={`${inputCls} pr-10`}
          />
          <button
            type="button" onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 text-gray-400 hover:text-gray-600 transition"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </Field>

        {/* remember + forgot */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-500 accent-orange-500" />
            <span className="text-gray-500">Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => {
              onClose?.()
              navigate('/settings', { state: { openPassword: true } })
            }}
            className="text-orange-500 hover:text-orange-600 font-medium transition"
          >
            Forgot password?
          </button>
        </div>

        {/* submit */}
        <button
          type="submit" disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition shadow-md shadow-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>

        {/* divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">or continue with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} theme="outline" size="large" text="signin" />
        </div>
      </form>

      {/* sign up link */}
      <p className="text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <button onClick={onSignUpClick} className="text-orange-500 hover:text-orange-600 font-semibold transition">
          Create one
        </button>
      </p>
    </motion.div>
  )
}

export default Login