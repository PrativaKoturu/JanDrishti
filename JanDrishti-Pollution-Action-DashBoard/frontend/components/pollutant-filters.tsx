"use client"

import { motion } from "framer-motion"
import { Info, SlidersHorizontal } from "lucide-react"

interface Pollutant {
  id: string
  label: string
  color: string
}

interface PollutantFiltersProps {
  pollutants: Pollutant[]
  selectedPollutant: string
  onSelectPollutant: (pollutant: string) => void
}

export default function PollutantFilters({ pollutants, selectedPollutant, onSelectPollutant }: PollutantFiltersProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between" suppressHydrationWarning>
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ 
              backgroundColor: '#deffbd',
              boxShadow: '0 2px 8px rgba(68, 128, 42, 0.15)'
            }}
          >
            <SlidersHorizontal size={22} style={{ color: '#44802a' }} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Parameter Focus</h3>
          </div>
        </div>
        <button className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
          <Info size={14} />
          What are these?
        </button>
      </div>
      
      <div className="flex flex-wrap gap-3" suppressHydrationWarning>
        {pollutants.map((pollutant) => (
          <button
            key={pollutant.id}
            onClick={() => onSelectPollutant(pollutant.id)}
            className={`relative px-6 py-3.5 rounded-2xl font-bold transition-all duration-300 overflow-hidden group ${
              selectedPollutant === pollutant.id
                ? "text-white"
                : "text-foreground hover:scale-105"
            }`}
            style={selectedPollutant === pollutant.id ? {
              backgroundColor: pollutant.color,
              boxShadow: `0 4px 16px ${pollutant.color}60, 0 2px 4px rgba(0,0,0,0.1)`
            } : {
              backgroundColor: '#f2ffbd',
              boxShadow: '0 2px 8px rgba(68, 128, 42, 0.1)'
            }}
          >
            {selectedPollutant === pollutant.id && (
              <motion.div
                layoutId="activePollutant"
                className="absolute inset-0 z-0"
                style={{ backgroundColor: pollutant.color }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-3">
              <span 
                className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                style={{ 
                  backgroundColor: selectedPollutant === pollutant.id ? 'white' : pollutant.color,
                  boxShadow: selectedPollutant === pollutant.id ? '0 0 4px rgba(255,255,255,0.8)' : `0 0 8px ${pollutant.color}`
                }} 
              />
              {pollutant.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
