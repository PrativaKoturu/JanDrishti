"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Building2, User, Eye, ChevronDown, Settings, FileText, LogOut, Search } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { aqiService, type WardData } from "@/lib/api"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  selectedWard: string
  setSelectedWard: (ward: string) => void
}

export default function Header({ selectedWard, setSelectedWard }: HeaderProps) {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const [wards, setWards] = useState<WardData[]>([])
  const [loadingWards, setLoadingWards] = useState(true)
  const [wardDropdownOpen, setWardDropdownOpen] = useState(false)
  const [wardSearchQuery, setWardSearchQuery] = useState("")

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch wards from API
  useEffect(() => {
    const fetchWards = async () => {
      try {
        const wardsData = await aqiService.getWards()
        setWards(wardsData)
        
        // Set default ward if not set
        if (!selectedWard && wardsData.length > 0) {
          setSelectedWard(`ward-${wardsData[0].ward_no}`)
        }
      } catch (error) {
        console.error("Error fetching wards:", error)
        // Fallback to default wards
        setWards([
          { ward_name: "MODEL TOWN", ward_no: "72", quadrant: "NE", latitude: 28.701933, longitude: 77.191341 },
          { ward_name: "BEGUMPUR", ward_no: "27", quadrant: "NW", latitude: 28.765128, longitude: 77.022542 },
          { ward_name: "HAUZ RANI", ward_no: "162", quadrant: "SE", latitude: 28.533246, longitude: 77.212759 },
          { ward_name: "NANGLI SAKRAVATI", ward_no: "134", quadrant: "SW", latitude: 28.580401, longitude: 76.994073 },
        ])
      } finally {
        setLoadingWards(false)
      }
    }
    
    fetchWards()
  }, [])

  // Map wards to dropdown format
  const wardOptions = wards.map((ward, index) => ({
    id: `ward-${ward.ward_no}`,
    name: `${ward.ward_name} (${ward.ward_no}) - ${ward.quadrant}`,
    ward_no: ward.ward_no,
    ward_name: ward.ward_name,
    quadrant: ward.quadrant
  }))

  // Filter wards based on search query
  const filteredWardOptions = wardOptions.filter(ward => 
    ward.name.toLowerCase().includes(wardSearchQuery.toLowerCase()) ||
    ward.ward_no.includes(wardSearchQuery)
  )

  // Get selected ward display name
  const selectedWardDisplay = wardOptions.find(w => w.id === selectedWard)?.name || "Select Ward"

  return (
    <header
      className={`sticky top-0 z-50 transition-all h-[73px] flex items-center ${
        isScrolled ? "shadow-lg" : ""
      }`}
      style={{ 
        background: 'linear-gradient(135deg, rgba(68, 128, 42, 0.95) 0%, rgba(90, 159, 58, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => router.push('/')}
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              <Eye size={24} style={{ color: '#ffffff' }} />
            </div>
            <div className="flex items-baseline gap-1">
              <span 
                className="text-2xl font-bold leading-none"
                style={{ 
                  color: '#ffffff',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}
              >
                जन
              </span>
              <span 
                className="text-2xl font-bold leading-none tracking-tight"
                style={{ 
                  color: '#ffffff',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}
              >
                Drishti
              </span>
            </div>
          </div>

        </div>

        <div className="flex items-center gap-3">
          {/* Ward Selector Dropdown */}
          <DropdownMenu open={wardDropdownOpen} onOpenChange={setWardDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:scale-105"
                style={{ 
                  backgroundColor: '#f2ffbd',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                }}
              >
                <Building2 size={18} style={{ color: '#44802a' }} />
                <span className="text-sm font-semibold text-foreground max-w-[200px] truncate" style={{ color: '#000' }}>
                  {selectedWardDisplay}
                </span>
                <ChevronDown 
                  size={16} 
                  style={{ color: '#44802a' }}
                  className={`transition-transform ${wardDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="w-80 p-0"
              style={{
                backgroundColor: '#f2ffbd',
                border: '2px solid #44802a',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            >
              {/* Search Input */}
              <div className="p-3 border-b" style={{ borderColor: '#44802a', borderWidth: '0 0 1px 0' }}>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#44802a' }} />
                  <input
                    type="text"
                    placeholder="Search wards..."
                    value={wardSearchQuery}
                    onChange={(e) => setWardSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #44802a',
                      color: '#000'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              
              {/* Ward List */}
              <div className="max-h-[300px] overflow-y-auto">
                {filteredWardOptions.length > 0 ? (
                  filteredWardOptions.map((ward) => (
                    <DropdownMenuItem
                      key={ward.id}
                      onClick={() => {
                        setSelectedWard(ward.id)
                        setWardDropdownOpen(false)
                        setWardSearchQuery("")
                      }}
                      className="cursor-pointer px-4 py-3 hover:bg-green-500/20 transition-colors"
                      style={{
                        backgroundColor: selectedWard === ward.id ? 'rgba(68, 128, 42, 0.15)' : 'transparent'
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold" style={{ color: '#000' }}>
                            {ward.ward_name}
                          </span>
                          <span className="text-xs" style={{ color: '#44802a' }}>
                            Ward {ward.ward_no} • {ward.quadrant}
                          </span>
                        </div>
                        {selectedWard === ward.id && (
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: '#44802a' }}
                          />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm" style={{ color: '#6b7280' }}>No wards found</p>
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* User Authentication */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:scale-105"
                    style={{ 
                      backgroundColor: '#f2ffbd',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ 
                        backgroundColor: '#44802a',
                        color: '#ffffff',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
                      }}
                    >
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                    {/* <span className="text-sm font-bold text-foreground hidden sm:inline">
                      {user.full_name || user.email?.split("@")[0]}
                    </span> */}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-64 p-2"
                  style={{
                    backgroundColor: '#f2ffbd',
                    border: '2px solid #44802a',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    borderRadius: '12px'
                  }}
                >
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ 
                          backgroundColor: '#44802a',
                          color: '#ffffff',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
                        }}
                      >
                        {user.email?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm" style={{ color: '#000' }}>
                          {user.full_name || "User"}
                        </span>
                        <span className="text-xs" style={{ color: '#44802a' }}>
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" style={{ backgroundColor: '#44802a', opacity: 0.2 }} />
                  <DropdownMenuItem 
                    className="cursor-pointer px-3 py-2.5 rounded-lg transition-colors"
                    style={{ color: '#000' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(68, 128, 42, 0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <Settings size={16} className="mr-3" style={{ color: '#44802a' }} />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer px-3 py-2.5 rounded-lg transition-colors"
                    style={{ color: '#000' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(68, 128, 42, 0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <FileText size={16} className="mr-3" style={{ color: '#44802a' }} />
                    <span>My Reports</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2" style={{ backgroundColor: '#44802a', opacity: 0.2 }} />
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer px-3 py-2.5 rounded-lg transition-colors"
                    style={{ color: '#dc2626' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <LogOut size={16} className="mr-3" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                {/* Desktop Login Button */}
                <button
                  onClick={() => router.push('/login')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: '#f2ffbd',
                    color: '#000',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                  }}
                >
                  <User size={18} style={{ color: '#44802a' }} />
                  <span className="hidden sm:inline">Login</span>
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </header>
  )
}
