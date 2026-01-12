"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Header from "@/components/header"
import MainMetrics from "@/components/main-metrics"
import PollutantFilters from "@/components/pollutant-filters"
import DelhiAQIMap from "@/components/delhiaqimap"
import PollutionChart from "@/components/pollution-chart"
import PollutantHealth from "@/components/pollutant-health"
import AQIReference from "@/components/aqi-reference"
import NewsSection from "@/components/news-section"
import CitizenReporting from "@/components/citizen-reporting"
import AIForecast from "@/components/ai-forecast"
import PolicyRecommendations from "@/components/policy-recommendations"
import HistoricalAnalysis from "@/components/historical-analysis"
import AlertsPanel from "@/components/alerts-panel"
import ChatbotAssistant from "@/components/chatbot-assistant"
import { LayoutDashboard, Activity, Zap, Users, ShieldAlert, History, ArrowRight } from "lucide-react"

export default function Dashboard() {
  const [selectedPollutant, setSelectedPollutant] = useState<string>("aqi")
  const [selectedWard, setSelectedWard] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const pollutants = [
    { id: "aqi", label: "AQI (US)", color: "#44802a" },
    { id: "pm25", label: "PM2.5", color: "#5a9f3a" },
    { id: "pm10", label: "PM10", color: "#34d399" },
    { id: "co", label: "CO", color: "#fbbf24" },
    { id: "so2", label: "SO2", color: "#f87171" },
    { id: "no2", label: "NO2", color: "#a78bfa" },
  ]

  // Removed hardcoded aqiData - now fetched dynamically in MainMetrics component

  const tabs = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { id: "monitoring", label: "Live Monitoring", icon: <Activity size={18} /> },
    { id: "forecast", label: "AI Forecast", icon: <Zap size={18} /> },
    { id: "reports", label: "Citizen Reports", icon: <Users size={18} /> },
    { id: "policy", label: "Policy Hub", icon: <ShieldAlert size={18} /> },
    { id: "history", label: "Historical Data", icon: <History size={18} /> },
  ]


  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8 w-full">
            <MainMetrics selectedWard={selectedWard} />

            <PollutantFilters
              pollutants={pollutants}
              selectedPollutant={selectedPollutant}
              onSelectPollutant={setSelectedPollutant}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="rounded-[2rem] glass-morphism border border-white/5 overflow-hidden h-[550px]">
                  <DelhiAQIMap />
                </div>
              </div>
              <div className="lg:col-span-1">
                <AlertsPanel />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PollutantHealth selectedWard={selectedWard} />
              <AQIReference selectedWard={selectedWard} />
            </div>
          </div>
        )
      case "monitoring":
        return (
          <div className="space-y-8 w-full">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <div className="xl:col-span-3">
                <PollutionChart selectedPollutant={selectedPollutant} selectedWard={selectedWard} />
              </div>
              <div className="xl:col-span-1">
                <NewsSection />
              </div>
            </div>
          </div>
        )
      case "forecast":
        return (
          <div className="space-y-8 w-full">
            <AIForecast selectedWard={selectedWard} />
          </div>
        )
      case "reports":
        return (
          <div className="space-y-8 w-full">
            <CitizenReporting selectedWard={selectedWard} />
          </div>
        )
      case "policy":
        return (
          <div className="space-y-8 w-full">
            <PolicyRecommendations aqiData={{ value: 0, status: "Loading", statusColor: "text-primary", statusBg: "bg-primary/10", pm25: 0, pm10: 0, temperature: 0, humidity: 0, windSpeed: 0, uvIndex: 0 }} />
          </div>
        )
      case "history":
        return (
          <div className="space-y-8 w-full">
            <HistoricalAnalysis selectedPollutant={selectedPollutant} />
          </div>
        )
      default:
        return (
          <div className="space-y-8 w-full">
            <div className="text-center py-12 text-muted-foreground">
              Select a tab to view content
            </div>
          </div>
        )
    }
  }

  return (
    <main className="min-h-screen relative">

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header 
          selectedWard={selectedWard}
          setSelectedWard={setSelectedWard}
        />

        <div className="flex-1 relative">
          {/* Fixed Header Section */}
          <div className="relative z-10">
            <div className="container-px">
              {/* Hero Header - Fixed position */}
              <div className="pt-12 pb-6 space-y-3" style={{ height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                  Air Quality Dashboard
                </h1>
                <p className="text-muted-foreground text-base max-w-2xl">
                  Real-time air quality monitoring for Delhi wards
                </p>
              </div>
            </div>

            {/* Navigation Tabs - Completely fixed position with no movement */}
            <div 
              className="w-full"
              style={{ 
                position: 'sticky',
                top: '73px',
                zIndex: 30,
                height: '64px',
                paddingTop: '8px',
                paddingBottom: '8px',
                marginBottom: '32px',
                backgroundColor: 'transparent',
                transform: 'translateZ(0)',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                isolation: 'isolate',
                contain: 'layout style paint'
              }}
            >
              <div 
                className="container-px" 
                style={{ 
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  width: '100%',
                  maxWidth: '1280px',
                  margin: '0 auto',
                  paddingLeft: '1rem',
                  paddingRight: '1rem'
                }}
              >
                <div 
                  className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide items-center"
                  style={{ 
                    height: '48px',
                    width: '100%',
                    position: 'relative',
                    contain: 'layout style paint'
                  }}
                >
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (activeTab !== tab.id && !isTransitioning) {
                          setIsTransitioning(true)
                          setActiveTab(tab.id)
                          setTimeout(() => {
                            setIsTransitioning(false)
                          }, 200)
                        }
                      }}
                      className={`px-4 py-3 text-sm font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap rounded-lg relative flex-shrink-0 ${
                        activeTab === tab.id
                          ? "text-foreground"
                          : "text-foreground hover:opacity-90"
                      } ${isTransitioning && activeTab === tab.id ? "opacity-70" : ""}`}
                      style={{ 
                        backgroundColor: activeTab === tab.id ? '#deffbd' : '#f2ffbd',
                        color: '#000',
                        borderBottom: activeTab === tab.id ? '3px solid #44802a' : 'none',
                        boxShadow: activeTab === tab.id ? '0 0 12px rgba(68,128,42,0.4), 0 4px 8px rgba(68,128,42,0.2)' : 'none',
                        transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        height: '48px',
                        minHeight: '48px',
                        maxHeight: '48px',
                        width: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        boxSizing: 'border-box',
                        position: 'relative',
                        transform: 'none',
                        fontWeight: activeTab === tab.id ? '600' : '500'
                      }}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content with smooth transitions - Fixed spacing */}
          <div className="container-px relative z-0">
            <div 
              id="tab-content-area" 
              className="pb-12" 
              style={{ 
                minHeight: '400px',
                position: 'relative',
                isolation: 'isolate'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 0.2,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  className="w-full"
                  style={{ 
                    position: 'relative',
                    width: '100%',
                    contain: 'layout style'
                  }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chatbot */}
      <ChatbotAssistant />

      {/* Footer */}
      <footer 
        className="mt-16"
        style={{
          borderTop: '1px solid rgba(68, 128, 42, 0.1)',
          backgroundColor: 'rgba(222, 255, 189, 0.6)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="container-px py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left Section - Logo & Brand */}
            <div className="flex items-center gap-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                style={{
                  backgroundColor: '#44802a',
                  boxShadow: '0 2px 8px rgba(68, 128, 42, 0.3)'
                }}
              >
                जन
              </div>
              <div className="hidden sm:block h-6 w-px bg-border/30"></div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)'
                  }}
                ></div>
                <span className="text-sm font-medium" style={{ color: '#44802a' }}>
                  System Operational
                </span>
              </div>
            </div>

            {/* Center Section - Copyright */}
            <div className="text-xs sm:text-sm text-center sm:text-left" style={{ color: '#6b7280' }}>
              © {new Date().getFullYear()} <span className="font-semibold" style={{ color: '#44802a' }}>JanDrishti</span>. All rights reserved.
            </div>

            {/* Right Section - Additional Info */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                <span>Made with</span>
                <span className="text-red-500">❤️</span>
                <span>for clean air</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
