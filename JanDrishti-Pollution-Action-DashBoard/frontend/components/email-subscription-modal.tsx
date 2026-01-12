"use client"

import { useState, useEffect } from "react"
import { X, Mail, CheckCircle, AlertCircle, Loader2, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { emailService } from "@/lib/api"
import { toast } from "sonner"

interface EmailSubscriptionModalProps {
  open: boolean
  onClose: () => void
  selectedWard?: string
}

export default function EmailSubscriptionModal({
  open,
  onClose,
  selectedWard
}: EmailSubscriptionModalProps) {
  const { user } = useAuth()
  const [email, setEmail] = useState("")
  const [wardNo, setWardNo] = useState(selectedWard || "")
  const [frequency, setFrequency] = useState("daily")
  const [loading, setLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null)
  const [checkingStatus, setCheckingStatus] = useState(false)

  useEffect(() => {
    if (open && user) {
      if (user.email) {
        setEmail(user.email)
      }
      checkSubscriptionStatus()
    } else if (open && !user) {
      setIsSubscribed(false)
      setSubscriptionId(null)
    }
  }, [open, user])

  const checkSubscriptionStatus = async () => {
    if (!user) return
    
    setCheckingStatus(true)
    try {
      const subscription = await emailService.getSubscription()
      if (subscription && subscription.is_active) {
        setIsSubscribed(true)
        setSubscriptionId(subscription.id || subscription.subscription_id || null)
        setEmail(subscription.email || user.email || "")
        setWardNo(subscription.ward_no || selectedWard || "")
        setFrequency(subscription.frequency || "daily")
      } else {
        setIsSubscribed(false)
        setSubscriptionId(null)
      }
    } catch (error: any) {
      if (error?.response?.status !== 404) {
        console.error("Error checking subscription status:", error)
      }
      setIsSubscribed(false)
      setSubscriptionId(null)
    } finally {
      setCheckingStatus(false)
    }
  }

  useEffect(() => {
    if (selectedWard) {
      setWardNo(selectedWard)
    }
  }, [selectedWard])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error("Please login to subscribe", {
        description: "You need to be logged in to subscribe to email notifications"
      })
      return
    }

    if (!email) {
      toast.error("Email address required", {
        description: "Please enter your email address"
      })
      return
    }

    setLoading(true)
    try {
      console.log("Attempting email subscription...", { email, wardNo, frequency })
      
      const response = await emailService.subscribe({
        email: email || undefined,
        ward_no: wardNo || undefined,
        subscription_type: "aqi_updates",
        frequency: frequency
      })

      console.log("Email subscription response:", response)

      toast.success("✅ Subscribed successfully!", {
        description: "You'll receive AQI updates and precautions via email"
      })
      
      setIsSubscribed(true)
      onClose()
    } catch (error: any) {
      console.error("Email subscription error:", error)
      console.error("Error details:", {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
        code: error?.code
      })
      
      let errorMessage = "Failed to subscribe. Please try again."
      
      // Check if it's actually a success (status 200-299) but being caught as error
      if (error?.response?.status >= 200 && error?.response?.status < 300) {
        console.log("Success response caught as error - treating as success")
        toast.success("✅ Subscribed successfully!", {
          description: "You'll receive AQI updates and precautions via email"
        })
        setIsSubscribed(true)
        onClose()
        return
      }
      
      if (error?.response?.status === 503) {
        errorMessage = "Email service is not configured yet. Please contact administrator."
      } else if (error?.response?.status === 401) {
        errorMessage = "Authentication required. Please login again."
      } else if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      toast.error("❌ Subscription failed", {
        description: errorMessage,
        duration: 5000
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUnsubscribe = async () => {
    if (!subscriptionId) {
      toast.error("Subscription ID not found")
      return
    }

    setLoading(true)
    try {
      await emailService.unsubscribe(subscriptionId)
      toast.success("✅ Unsubscribed successfully!", {
        description: "You will no longer receive email updates"
      })
      setIsSubscribed(false)
      setSubscriptionId(null)
      onClose()
    } catch (error: any) {
      console.error("Unsubscribe error:", error)
      toast.error("❌ Failed to unsubscribe", {
        description: error?.response?.data?.detail || "Please try again later"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-border/40 glass-effect p-8 bg-background shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
            <Mail className="w-7 h-7 text-green-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">
              {isSubscribed ? "Email Subscription Active" : "Email Updates"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isSubscribed ? "Manage your email subscription" : "Get AQI data and precautions via email"}
            </p>
          </div>
          {isSubscribed && (
            <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div className="text-sm text-foreground">
                <p className="font-semibold mb-1">What you'll receive:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Daily AQI updates for your selected ward</li>
                  <li>• Health precautions based on air quality</li>
                  <li>• Emergency alerts when AQI is critical</li>
                  <li>• Beautiful HTML email format</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={user?.email || "your-email@example.com"}
              className="w-full px-4 py-3 rounded-xl glass-effect border border-border/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              required
            />
            {user?.email && email === user.email && (
              <p className="text-xs text-green-400 mt-1">
                ✓ Using email from your profile
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Ward (Optional)
            </label>
            <input
              type="text"
              value={wardNo}
              onChange={(e) => setWardNo(e.target.value)}
              placeholder="Leave empty for all wards"
              className="w-full px-4 py-3 rounded-xl glass-effect border border-border/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Update Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-effect border border-border/40 text-foreground focus:outline-none focus:border-primary"
            >
              <option value="daily">Daily Updates (Recommended)</option>
              <option value="hourly">Hourly Updates</option>
              <option value="alerts_only">Critical Alerts Only</option>
            </select>
          </div>

          {isSubscribed ? (
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-sm font-semibold text-foreground">You are subscribed!</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  You're receiving {frequency === 'daily' ? 'daily' : frequency === 'hourly' ? 'hourly' : 'critical alerts only'} updates
                  {wardNo ? ` for ward ${wardNo}` : ' for all wards'}.
                </p>
              </div>
              <button
                type="button"
                onClick={handleUnsubscribe}
                disabled={loading}
                className="w-full px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Unsubscribing...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    Unsubscribe
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              type="submit"
              disabled={loading || checkingStatus}
              className="w-full px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading || checkingStatus ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {checkingStatus ? "Checking..." : "Subscribing..."}
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Subscribe to Email Updates
                </>
              )}
            </button>
          )}

          <p className="text-xs text-center text-muted-foreground">
            ✓ Works immediately - No setup required
          </p>
        </form>

        {!user && (
          <div className="mt-4 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
            <p className="text-sm text-yellow-400 text-center">
              Please login to subscribe to email updates
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
