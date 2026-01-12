"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Building2, User, Eye } from "lucide-react"
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
    ward_no: ward.ward_no
  }))

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
          {/* Ward Selector */}
          <div 
            className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:scale-105"
            style={{ 
              backgroundColor: '#f2ffbd',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
            }}
          >
            <Building2 size={18} style={{ color: '#44802a' }} />
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="bg-transparent text-sm font-semibold text-foreground outline-none cursor-pointer border-none appearance-none pr-6"
              style={{ 
                color: '#000',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2344802a' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right center',
                paddingRight: '24px'
              }}
            >
              {wardOptions.map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.name}
                </option>
              ))}
            </select>
          </div>

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
                <DropdownMenuContent align="end" className="w-56 glass-morphism border">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-bold">{user.full_name || "User"}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer hover:bg-muted/50">
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-muted/50">
                    My Reports
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-400 cursor-pointer hover:text-red-300 hover:bg-red-500/10"
                  >
                    Logout
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
