'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/context/auth-context'
import './auth.css'

interface LoginModalProps {
  onSignupClick: () => void
  onClose?: () => void
  redirectOnLogin?: boolean
}

export default function LoginModal({ onSignupClick, onClose, redirectOnLogin = false }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email || !password) {
        setError('Please fill in all fields')
        toast.error('Please fill in all fields')
        setLoading(false)
        return
      }

      await login(email, password)
      
      setLoading(false)
      
      toast.success('Login successful!', {
        description: 'Welcome back to जन Drishti!'
      })

      setEmail('')
      setPassword('')
      
      if (redirectOnLogin) {
        // If on auth page, redirect to dashboard
        setTimeout(() => {
          router.push('/')
        }, 500)
      } else {
        // If in modal on dashboard, just close the modal
        if (onClose) {
          setTimeout(() => {
            onClose()
            // Refresh to update auth state
            router.refresh()
          }, 500)
        }
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || 'Login failed. Please try again.'
      setError(errorMessage)
      toast.error('Login failed', {
        description: errorMessage
      })
      setLoading(false)
    }
  }

  return (
    <div className="login-box">
      <h1>Welcome to जन Drishti</h1>
      <p className="subtitle">Seeing cities through people's lenses</p>

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

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="signup-link">
        Don't have an account?{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); onSignupClick() }}>
          Sign up
        </a>
      </div>
    </div>
  )
}
