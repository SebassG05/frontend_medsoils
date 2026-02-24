import { useNavigate } from 'react-router-dom'
import Login from '../components/layout/Login'
import SignUp from '../components/layout/SignUp'
import { useState } from 'react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [showSignUp, setShowSignUp] = useState(false)

  function handleClose() {
    navigate(-1) // go back to previous page (e.g. /blog)
  }

  if (showSignUp) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <SignUp
          onClose={handleClose}
          onLoginClick={() => setShowSignUp(false)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Login
        onClose={handleClose}
        onSignUpClick={() => setShowSignUp(true)}
      />
    </div>
  )
}
