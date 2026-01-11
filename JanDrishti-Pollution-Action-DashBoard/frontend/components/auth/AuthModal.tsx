'use client'

import { useState, useEffect } from 'react'
import LoginModal from '@/components/auth/LoginModal'
import SignupModal from '@/components/auth/SignupModal'
import './auth.css'
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [showLogin, setShowLogin] = useState(true)
  const [showSignup, setShowSignup] = useState(false)

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  const handleSignupClick = () => {
    setShowLogin(false)
    setShowSignup(true)
  }

  const handleLoginClick = () => {
    setShowSignup(false)
    setShowLogin(true)
  }

  const handleClose = () => {
    setShowLogin(true)
    setShowSignup(false)
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <>
      <VisuallyHidden>
        <div>Authentication Modal</div>
      </VisuallyHidden>
      
      {/* Full screen modal overlay */}
      <div 
        className="auth-modal-overlay"
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
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose()
          }
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
          className="auth-modal-close"
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
          className="auth-modal-content"
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
          {showLogin && (
            <LoginModal onSignupClick={handleSignupClick} onClose={handleClose} />
          )}
          {showSignup && (
            <SignupModal onLoginClick={handleLoginClick} onClose={handleClose} />
          )}
        </div>
      </div>
    </>
  )
}
