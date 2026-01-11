'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/context/auth-context'
import './auth.css'

interface SignupModalProps {
  onLoginClick: () => void
  onClose?: () => void
}

export default function SignupModal({ onLoginClick, onClose }: SignupModalProps) {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const { signup } = useAuth()

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    const phoneRegex = /^\d{10}$/
    return phoneRegex.test(phoneNumber)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Client-side validation
    if (!fullname || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields')
      toast.error('Please fill in all required fields')
      setLoading(false)
      return
    }

    // Phone number validation (optional but if provided, must be valid)
    if (phone && !validatePhoneNumber(phone)) {
      setError('Phone number must be exactly 10 digits')
      toast.error('Phone number must be exactly 10 digits')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      toast.error('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      // Call the FastAPI signup endpoint through auth context
      const response = await signup(email, password, fullname, phone || undefined)

      // Check if email confirmation is required
      if (response?.message || !response?.access_token) {
        const message = response?.message || 'Please check your email to confirm your account'
        setSuccess(message)
        toast.success('Account created!', {
          description: message,
          duration: 6000
        })
        
        // Switch to login after a delay
        setTimeout(() => {
          setFullname('')
          setEmail('')
          setPhone('')
          setPassword('')
          setConfirmPassword('')
          setSuccess('')
          onLoginClick()
        }, 3000)
      } else {
        // Email confirmed, user is logged in
        toast.success('Account created successfully!', {
          description: `Welcome to जन Drishti, ${fullname}!`
        })
        
        setFullname('')
        setEmail('')
        setPhone('')
        setPassword('')
        setConfirmPassword('')
        
        // Close modal or redirect
        if (onClose) {
          setTimeout(() => {
            onClose()
            router.refresh()
          }, 500)
        }
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || 'Signup failed. Please try again.'
      setError(errorMessage)
      toast.error('Signup failed', {
        description: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-box signup-box">
      <h1>Create Account</h1>
      <p className="subtitle">Join जन Drishti Community</p>

      <form className="login-form" onSubmit={handleSubmit}>
        {error && (
          <div className="error-message" style={{
            padding: '12px',
            marginBottom: '18px',
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            color: '#dc2626',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div className="success-message" style={{
            padding: '12px',
            marginBottom: '18px',
            backgroundColor: '#dcfce7',
            border: '1px solid #86efac',
            borderRadius: '8px',
            color: '#16a34a',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="fullname">Full Name</label>
          <input
            type="text"
            id="fullname"
            placeholder="Enter your full name"
            value={fullname}
            onChange={(e) => {
              setFullname(e.target.value)
              setError('')
            }}
            required
            disabled={loading || !!success}
          />
        </div>

        <div className="form-group">
          <label htmlFor="signup-email">Email</label>
          <input
            type="email"
            id="signup-email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            required
            disabled={loading || !!success}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number (Optional)</label>
          <input
            type="tel"
            id="phone"
            placeholder="Enter your 10-digit phone number"
            value={phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '')
              setPhone(value.slice(0, 10))
              setError('')
            }}
            maxLength={10}
            disabled={loading || !!success}
          />
        </div>

        <div className="form-group">
          <label htmlFor="signup-password">Password</label>
          <input
            type="password"
            id="signup-password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            required
            disabled={loading || !!success}
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              setError('')
            }}
            required
            disabled={loading || !!success}
          />
        </div>

        <button type="submit" className="login-btn" disabled={loading || !!success}>
          {loading ? 'Creating account...' : success ? 'Please check your email' : 'Sign Up'}
        </button>
      </form>

      <div className="signup-link">
        Already have an account?{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick() }}>
          Login
        </a>
      </div>
    </div>
  )
}
