/**
 * Get the backend API URL
 * Priority: 1. Environment variable, 2. Local development detection, 3. Production URL
 */
export const getBackendUrl = (): string => {
  // Check if explicitly set in environment
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL
  }
  
  // In development or localhost, use local backend
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    if (isLocalhost || process.env.NODE_ENV === 'development') {
      return 'http://localhost:8000'
    }
  }
  
  // Server-side: check NODE_ENV
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000'
  }
  
  // Default to production
  return 'https://jandrishti.onrender.com'
}

// Export the backend URL
export const BACKEND_URL = getBackendUrl()

// Log in development
if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  console.log('🔧 Using Backend URL:', BACKEND_URL)
}
