'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import SignupModal from '@/components/auth/SignupModal'
import '@/components/auth/auth.css'

export default function SignupPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleLoginClick = () => {
    router.push('/login')
  }

  const handleClose = () => {
    router.push('/')
  }

  const handleSuccess = () => {
    router.push('/')
  }

  return (
    <div 
      className="auth-page-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/login.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        overflow: 'hidden'
      }}>
      
      {/* Dark overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 0
        }}
      />
      
      {/* Close button */}
      <button 
        onClick={handleClose}
        type="button"
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          zIndex: 50,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '0',
          fontSize: '3rem',
          color: 'white',
          lineHeight: '1',
          fontWeight: 'thin',
          transition: 'opacity 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        ×
      </button>

      {/* Content wrapper */}
      <div 
        className="auth-page-content"
        style={{
          position: 'relative',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          overflow: 'auto',
          padding: '20px'
        }}>
        <SignupModal onLoginClick={handleLoginClick} onClose={handleClose} />
      </div>
    </div>
  )
}
