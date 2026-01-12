"use client"

import { useState, useEffect } from "react"
import { X, MessageCircle, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { whatsappService } from "@/lib/api"
import { toast } from "sonner"

interface WhatsAppSubscriptionModalProps {
  open: boolean
  onClose: () => void
  selectedWard?: string
}

export default function WhatsAppSubscriptionModal({
  open,
  onClose,
  selectedWard
}: WhatsAppSubscriptionModalProps) {
  const { user } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [wardNo, setWardNo] = useState(selectedWard || "")
  const [frequency, setFrequency] = useState("daily")
  const [loading, setLoading] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [userPhone, setUserPhone] = useState<string | null>(null)

  useEffect(() => {
    if (open && user) {
      // Get phone from user profile
      if (user.phone_number) {
        setUserPhone(user.phone_number)
        setPhoneNumber(user.phone_number)
      }
      checkSubscriptionStatus()
    }
  }, [open, user])

  useEffect(() => {
    if (selectedWard) {
      setWardNo(selectedWard)
    }
  }, [selectedWard])

  const checkSubscriptionStatus = async () => {
    if (!user) return
    
    setCheckingStatus(true)
    try {
      const response = await whatsappService.getSubscription()
      setSubscriptionStatus(response)
      if (response.subscriptions && response.subscriptions.length > 0) {
        const activeSub = response.subscriptions.find((s: any) => s.is_active)
        if (activeSub) {
          setPhoneNumber(activeSub.phone_number)
          setWardNo(activeSub.ward_no || "")
          setFrequency(activeSub.frequency || "daily")
        }
      }
    } catch (error: any) {
      // Silently handle 404 - subscription endpoint may not be available yet
      if (error?.response?.status === 404) {
        console.log("WhatsApp subscription service not available")
        setSubscriptionStatus(null)
      } else {
        console.error("Error checking subscription:", error)
      }
    } finally {
      setCheckingStatus(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error("Please login to subscribe", {
        description: "You need to be logged in to subscribe to WhatsApp notifications"
      })
      return
    }

    if (!phoneNumber) {
      toast.error("Phone number required", {
        description: "Please enter your phone number with country code (e.g., +919876543210)"
      })
      return
    }

    // Validate phone number format
    if (!phoneNumber.startsWith('+')) {
      toast.error("Invalid phone number", {
        description: "Phone number must include country code (e.g., +919876543210)"
      })
      return
    }

    setLoading(true)
    try {
      const response = await whatsappService.subscribe({
        phone_number: phoneNumber,
        ward_no: wardNo || undefined,
        subscription_type: "aqi_updates",
        frequency: frequency
      })

      toast.success("✅ Subscribed successfully!", {
        description: "You'll receive AQI updates via WhatsApp. If you're not in the sandbox, check for join instructions.",
        duration: 6000
      })
      
      await checkSubscriptionStatus()
      onClose()
    } catch (error: any) {
      console.error("WhatsApp subscription error:", error)
      
      let errorMessage = "Failed to subscribe. Please try again."
      
      if (error?.response?.status === 503) {
        errorMessage = "WhatsApp service is not configured yet. Please contact administrator or try email notifications."
      } else if (error?.response?.status === 401) {
        errorMessage = "Authentication required. Please login again."
      } else if (error?.response?.status === 400) {
        errorMessage = error?.response?.data?.detail || "Invalid phone number or data. Please check and try again."
      } else if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      toast.error("❌ Subscription failed", {
        description: errorMessage,
        duration: 6000
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUnsubscribe = async () => {
    if (!subscriptionStatus?.subscriptions || subscriptionStatus.subscriptions.length === 0) return

    const activeSub = subscriptionStatus.subscriptions.find((s: any) => s.is_active)
    if (!activeSub) return

    setLoading(true)
    try {
      await whatsappService.unsubscribe(activeSub.id)
      toast.success("✅ Unsubscribed successfully", {
        description: "You will no longer receive WhatsApp notifications"
      })
      setSubscriptionStatus(null)
      setPhoneNumber("")
      setWardNo("")
      setFrequency("daily")
    } catch (error: any) {
      console.error("Unsubscribe error:", error)
      
      let errorMessage = "Failed to unsubscribe. Please try again."
      
      if (error?.response?.status === 404) {
        errorMessage = "Subscription not found. It may have already been removed."
      } else if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail
      }
      
      toast.error("❌ Unsubscribe failed", {
        description: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  const hasActiveSubscription = subscriptionStatus?.has_active_subscription

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
          <div className="w-14 h-14 rounded-2xl bg-[#25D366]/20 flex items-center justify-center border border-[#25D366]/30">
            <MessageCircle className="w-7 h-7 text-[#25D366]" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">
              {hasActiveSubscription ? "WhatsApp Subscription Active" : "WhatsApp Updates"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {hasActiveSubscription ? "Manage your WhatsApp subscription" : "Get AQI data and precautions on WhatsApp"}
            </p>
          </div>
          {hasActiveSubscription && (
            <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          )}
        </div>

        {checkingStatus ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : hasActiveSubscription ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-semibold text-green-400">Active Subscription</span>
              </div>
              <div className="space-y-2 text-sm text-foreground">
                <p><strong>Phone:</strong> {phoneNumber}</p>
                <p><strong>Ward:</strong> {wardNo || "All Wards"}</p>
                <p><strong>Frequency:</strong> {frequency === "daily" ? "Daily Updates" : frequency === "hourly" ? "Hourly Updates" : "Alerts Only"}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3 rounded-xl glass-effect border border-border/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  required
                />
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
                  <option value="daily">Daily Updates</option>
                  <option value="hourly">Hourly Updates</option>
                  <option value="alerts_only">Critical Alerts Only</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    "Update Subscription"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleUnsubscribe}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Unsubscribe
                </button>
              </div>
            </form>
          </div>
        ) : (
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
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div className="text-sm text-foreground">
                  <p className="font-semibold mb-1 text-yellow-400">⚠️ WhatsApp Sandbox Notice</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    You're using WhatsApp Sandbox. You'll receive an email with instructions to join the sandbox if needed.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    After joining the sandbox (one-time setup), you'll receive all WhatsApp notifications automatically.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Phone Number {!userPhone && <span className="text-red-400">*</span>}
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={userPhone ? userPhone : "+91 9876543210"}
                className="w-full px-4 py-3 rounded-xl glass-effect border border-border/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                required={!userPhone}
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Include country code (e.g., +91 for India)
              </p>
              {userPhone ? (
                <p className="text-xs text-green-400 mt-1">
                  ✓ Using phone number from your profile
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  Include country code (e.g., +91 for India). If you have a phone in your profile, it will be used automatically.
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

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#25D366]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4" />
                  Subscribe to WhatsApp Updates
                </>
              )}
            </button>
          </form>
        )}

        {!user && (
          <div className="mt-4 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
            <p className="text-sm text-yellow-400 text-center">
              Please login to subscribe to WhatsApp updates
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
