"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, AlertTriangle, ShieldAlert, Info, MessageCircle, Mail, MoreVertical, Loader2 } from "lucide-react"
import WhatsAppSubscriptionModal from "./whatsapp-subscription-modal"
import EmailSubscriptionModal from "./email-subscription-modal"
import { useAuth } from "@/context/auth-context"
import { aqiService, type WardData } from "@/lib/api"

interface Alert {
  id: number
  type: "health" | "traffic" | "emergency" | "weather"
  priority: "low" | "medium" | "high" | "critical"
  title: string
  message: string
  timestamp: string
  location?: string
  action?: string
  isRead: boolean
}

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false)
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Generate alerts from real AQI data
  const generateAlertsFromAQIData = async () => {
    try {
      setLoading(true)
      const generatedAlerts: Alert[] = []
      
      // Fetch all wards
      const wards = await aqiService.getWards()
      
      // Fetch AQI for first 10 wards (to avoid too many API calls)
      const wardsToCheck = wards.slice(0, 10)
      const aqiDataPromises = wardsToCheck.map(async (ward) => {
        try {
          const data = await aqiService.getCurrentAQIForWard(ward.ward_no)
          return { ward, aqi: data.aqi, pm25: data.pm25, pm10: data.pm10, timestamp: data.timestamp }
        } catch (error) {
          console.error(`Error fetching AQI for ward ${ward.ward_no}:`, error)
          return null
        }
      })
      
      const aqiResults = await Promise.all(aqiDataPromises)
      const validResults = aqiResults.filter(r => r !== null && r.aqi > 0) as Array<{
        ward: WardData
        aqi: number
        pm25: number | null
        pm10: number | null
        timestamp: string
      }>
      
      // Sort by AQI (highest first)
      validResults.sort((a, b) => b.aqi - a.aqi)
      
      // Generate critical alerts for high AQI
      validResults.forEach((result, index) => {
        const { ward, aqi, pm25, pm10 } = result
        
        if (aqi >= 300) {
          // Critical - Hazardous
          generatedAlerts.push({
            id: generatedAlerts.length + 1,
            type: "emergency",
            priority: "critical",
            title: "Hazardous Air Quality Alert",
            message: `AQI has reached ${Math.round(aqi)} in ${ward.ward_name}. Immediate health advisory - avoid all outdoor activities.`,
            timestamp: getTimeAgo(result.timestamp),
            location: ward.ward_name,
            action: "Stay indoors",
            isRead: false
          })
        } else if (aqi >= 200) {
          // Very Poor
          generatedAlerts.push({
            id: generatedAlerts.length + 1,
            type: "emergency",
            priority: "critical",
            title: "Very Poor Air Quality",
            message: `AQI is ${Math.round(aqi)} in ${ward.ward_name}. Sensitive groups should avoid outdoor activities.`,
            timestamp: getTimeAgo(result.timestamp),
            location: ward.ward_name,
            action: "Use N95 masks",
            isRead: false
          })
        } else if (aqi >= 150 && index < 3) {
          // Unhealthy - show top 3
          generatedAlerts.push({
            id: generatedAlerts.length + 1,
            type: "health",
            priority: "high",
            title: "Unhealthy Air Quality",
            message: `AQI is ${Math.round(aqi)} in ${ward.ward_name}. Children and elderly should limit outdoor activities.`,
            timestamp: getTimeAgo(result.timestamp),
            location: ward.ward_name,
            action: "Limit exposure",
            isRead: false
          })
        }
      })
      
      // Add health advisory based on worst AQI
      if (validResults.length > 0) {
        const worstAQI = validResults[0]
        if (worstAQI.aqi >= 200) {
          generatedAlerts.push({
            id: generatedAlerts.length + 1,
            type: "health",
            priority: "high",
            title: "Health Advisory",
            message: `High pollution levels detected. Use N95 masks when outdoors. Children, elderly, and those with respiratory conditions should stay indoors.`,
            timestamp: "Just now",
            location: "All Delhi",
            action: "Follow guidelines",
            isRead: false
          })
        }
      }
      
      // Add PM2.5 specific alert if very high
      const highPM25 = validResults.find(r => r.pm25 && r.pm25 > 150)
      if (highPM25) {
        generatedAlerts.push({
          id: generatedAlerts.length + 1,
          type: "health",
          priority: "high",
          title: "High PM2.5 Levels",
          message: `PM2.5 levels are ${Math.round(highPM25.pm25!)} µg/m³ in ${highPM25.ward.ward_name}. These fine particles can penetrate deep into lungs.`,
          timestamp: getTimeAgo(highPM25.timestamp),
          location: highPM25.ward.ward_name,
          action: "Use air purifiers",
          isRead: false
        })
      }
      
      // If no critical alerts, show general status
      if (generatedAlerts.length === 0 && validResults.length > 0) {
        const avgAQI = validResults.reduce((sum, r) => sum + r.aqi, 0) / validResults.length
        if (avgAQI > 100) {
          generatedAlerts.push({
            id: 1,
            type: "health",
            priority: "medium",
            title: "Moderate Air Quality",
            message: `Average AQI across monitored areas is ${Math.round(avgAQI)}. Air quality is acceptable for most people.`,
            timestamp: "Just now",
            location: "Delhi",
            action: "Monitor updates",
            isRead: false
          })
        }
      }
      
      setAlerts(generatedAlerts.length > 0 ? generatedAlerts : [])
    } catch (error) {
      console.error("Error generating alerts:", error)
      // Fallback to empty alerts
      setAlerts([])
    } finally {
      setLoading(false)
    }
  }
  
  // Helper to calculate time ago
  const getTimeAgo = (timestamp: string): string => {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      
      if (diffMins < 1) return "Just now"
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
      return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? 's' : ''} ago`
    } catch {
      return "Recently"
    }
  }

  useEffect(() => {
    generateAlertsFromAQIData()
    
    // Refresh alerts every 5 minutes
    const interval = setInterval(() => {
      generateAlertsFromAQIData()
    }, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "critical": return "text-red-500 bg-red-500/10 border-red-500/20"
      case "high": return "text-orange-500 bg-orange-500/10 border-orange-500/20"
      case "medium": return "text-amber-500 bg-amber-500/10 border-amber-500/20"
      default: return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "emergency": return <ShieldAlert size={16} />
      case "health": return <AlertTriangle size={16} />
      case "traffic": return <Info size={16} />
      default: return <Bell size={16} />
    }
  }

  const filteredAlerts = filter === "all" ? alerts : alerts.filter(alert => alert.type === filter)

  return (
    <div className="flex flex-col h-[550px] relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl grad-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Critical Alerts</h3>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Real-time Safety Feed</p>
          </div>
        </div>
        <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
          <MoreVertical size={18} className="text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">Loading real-time alerts...</p>
            </div>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto" />
              <p className="text-sm text-muted-foreground">No critical alerts at this time</p>
              <p className="text-xs text-muted-foreground/70">Air quality is being monitored</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredAlerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-5 rounded-[1.5rem] border transition-all duration-300 group cursor-pointer ${
                  alert.isRead 
                    ? "bg-white/5 border-white/5 hover:border-white/10" 
                    : "bg-primary/5 border-primary/20 shadow-[0_0_20px_rgba(56,189,248,0.05)]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${getPriorityStyles(alert.priority)}`}>
                    {getTypeIcon(alert.type)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">
                        {alert.title}
                      </h4>
                      {!alert.isRead && (
                        <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(56,189,248,0.5)] animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {alert.message}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Info size={10} className="text-primary" />
                          {alert.location}
                        </span>
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {/* Email Subscription Button */}
        <button
          onClick={() => {
            if (!user) {
              alert("Please login to subscribe to email updates")
              return
            }
            setEmailModalOpen(true)
          }}
          className="w-full p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center gap-3 group hover:bg-blue-500/20 transition-all duration-300"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Mail size={18} />
          </div>
          <div className="text-left flex-1">
            <div className="text-xs font-bold text-foreground">Subscribe to Email</div>
            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Instant Delivery</div>
          </div>
          <span className="text-[10px] text-green-400 font-bold">✓ Ready</span>
        </button>

        {/* WhatsApp Subscription Button */}
        <button
          onClick={() => {
            if (!user) {
              alert("Please login to subscribe to WhatsApp updates")
              return
            }
            setWhatsappModalOpen(true)
          }}
          className="w-full p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center gap-3 group hover:bg-[#25D366]/20 transition-all duration-300"
        >
          <div className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center text-white shadow-lg shadow-[#25D366]/20 group-hover:scale-110 transition-transform">
            <MessageCircle size={18} />
          </div>
          <div className="text-left flex-1">
            <div className="text-xs font-bold text-foreground">Subscribe to WhatsApp</div>
            <div className="text-[10px] font-bold text-[#25D366] uppercase tracking-widest">Instant Safety Protocol</div>
          </div>
          <span className="text-[10px] text-yellow-400 font-bold">⚠ Sandbox</span>
        </button>
      </div>

      <EmailSubscriptionModal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
      />
      <WhatsAppSubscriptionModal
        open={whatsappModalOpen}
        onClose={() => setWhatsappModalOpen(false)}
      />
    </div>
  )
}
