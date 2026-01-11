"use client"

import { useState } from "react"
import { Bot, FileText, AlertTriangle, Phone, Building2, Car, Globe, Heart, Factory, Droplets, Shield, Users, Home, Activity, Wind, Sun, CheckCircle, Info, Target } from "lucide-react"

interface PolicyRecommendationsProps {
  aqiData: {
    value: number
    status: string
    pm25: number
    pm10: number
  }
}

export default function PolicyRecommendations({ aqiData }: PolicyRecommendationsProps) {
  const [activeSection, setActiveSection] = useState<string>("recommendations")

  const sections = [
    { id: "recommendations", label: "Citizen Guide", icon: <Users className="w-4 h-4" /> },
    { id: "regulations", label: "Government Policies", icon: <FileText className="w-4 h-4" /> },
    { id: "emergency", label: "Emergency SOPs", icon: <AlertTriangle className="w-4 h-4" /> },
    { id: "resources", label: "Resources & Helplines", icon: <Phone className="w-4 h-4" /> },
  ]

  const citizenPrecautions = [
    {
      category: "Indoor Safety",
      icon: <Home className="w-6 h-6" />,
      color: "blue",
      items: [
        "Keep windows and doors closed during high pollution days (AQI > 150)",
        "Use air purifiers with HEPA filters in living spaces and bedrooms",
        "Avoid indoor activities that generate pollutants (smoking, burning candles, incense)",
        "Place indoor air-purifying plants like Aloe Vera, Spider Plant, and Peace Lily",
        "Maintain proper ventilation when AQI is below 100",
        "Use exhaust fans while cooking to reduce indoor air pollution"
      ]
    },
    {
      category: "Outdoor Safety",
      icon: <Activity className="w-6 h-6" />,
      color: "orange",
      items: [
        "Wear N95 or N99 masks when AQI exceeds 150",
        "Avoid outdoor exercise during peak pollution hours (6-10 AM, 6-10 PM)",
        "Limit time spent outdoors when AQI is in 'Unhealthy' or higher categories",
        "Choose walking routes away from heavy traffic and construction sites",
        "Avoid morning walks when AQI is above 200",
        "Use public transport or carpool instead of personal vehicles"
      ]
    },
    {
      category: "Health Protection",
      icon: <Heart className="w-6 h-6" />,
      color: "green",
      items: [
        "Stay hydrated - drink plenty of water to help flush toxins from your body",
        "Eat antioxidant-rich foods (berries, leafy greens, nuts, turmeric)",
        "Monitor symptoms - seek medical help if experiencing breathing difficulties",
        "Protect vulnerable groups - children, elderly, and those with respiratory conditions",
        "Use saline nasal sprays to clear pollutants from nasal passages",
        "Wash face and hands after returning indoors from outdoor activities"
      ]
    }
  ]

  const citizenRecommendations = [
    {
      title: "Transportation Choices",
      icon: <Car className="w-5 h-5" />,
      description: "Make eco-friendly transportation choices to reduce personal contribution to pollution",
      tips: [
        "Use public transport, metro, or buses whenever possible",
        "Carpool with colleagues or neighbors for daily commute",
        "Walk or cycle for short distances (when AQI is safe)",
        "Avoid unnecessary vehicle trips during high pollution days",
        "Maintain your vehicle regularly to ensure optimal emission control",
        "Consider electric or hybrid vehicles for future purchases"
      ]
    },
    {
      title: "Energy Conservation",
      icon: <Sun className="w-5 h-5" />,
      description: "Reduce energy consumption to minimize pollution from power generation",
      tips: [
        "Use energy-efficient appliances and LED lights",
        "Switch off lights and electronics when not in use",
        "Use solar-powered devices where possible",
        "Avoid using diesel generators during power cuts",
        "Support renewable energy initiatives in your area",
        "Plant trees around your home to create natural air filters"
      ]
    },
    {
      title: "Waste Management",
      icon: <Droplets className="w-5 h-5" />,
      description: "Proper waste disposal prevents air pollution from burning and decomposition",
      tips: [
        "Segregate waste into biodegradable and non-biodegradable",
        "Never burn waste, especially plastic and electronic waste",
        "Compost organic waste at home",
        "Report illegal waste burning to municipal authorities",
        "Reduce, reuse, and recycle to minimize waste generation",
        "Participate in community clean-up drives"
      ]
    },
    {
      title: "Community Participation",
      icon: <Users className="w-5 h-5" />,
      description: "Active community involvement helps create cleaner air for everyone",
      tips: [
        "Report pollution sources through citizen reporting apps",
        "Participate in tree plantation drives in your locality",
        "Educate neighbors about air pollution and its effects",
        "Support local initiatives for clean air",
        "Join or form resident welfare associations for collective action",
        "Stay informed about air quality in your area"
      ]
    }
  ]

  const governmentPolicies = [
    {
      title: "National Clean Air Programme (NCAP)",
      year: "2019",
      status: "Active",
      description: "Comprehensive national-level strategy to tackle air pollution problem across India",
      objectives: [
        "Reduce PM2.5 and PM10 concentrations by 20-30% by 2024",
        "Expand air quality monitoring network across the country",
        "Create city-specific action plans for 122 non-attainment cities",
        "Strengthen public awareness and capacity building activities"
      ],
      keyFeatures: [
        "Technology-driven solutions for pollution control",
        "Public participation and awareness programs",
        "Regular monitoring and assessment mechanisms",
        "Inter-sectoral coordination and cooperation"
      ]
    },
    {
      title: "Air (Prevention and Control of Pollution) Act, 1981",
      year: "1981 (Amended 2021)",
      status: "Active",
      description: "Primary legislation for air pollution control in India, providing framework for prevention and control of air pollution",
      objectives: [
        "Establishment of Central and State Pollution Control Boards",
        "Regulation of industrial and vehicular emissions",
        "Prevention and control of air pollution",
        "Protection of public health and environment"
      ],
      keyFeatures: [
        "Consent mechanism for industries before establishment",
        "Emission standards for industries and vehicles",
        "Monitoring and enforcement of pollution control measures",
        "Penalties and legal action for violations"
      ]
    },
    {
      title: "BS-VI Emission Standards",
      year: "2020",
      status: "Implemented",
      description: "Bharat Stage VI (BS-VI) emission standards equivalent to Euro-VI, implemented nationwide to reduce vehicular pollution",
      objectives: [
        "Reduce vehicular emissions significantly",
        "Improve fuel quality standards",
        "Mandate advanced emission control technologies",
        "Align with international emission standards"
      ],
      keyFeatures: [
        "Ultra-low sulfur content in fuel (10 ppm)",
        "Advanced emission control systems (SCR, DPF, GPF)",
        "Real Driving Emission (RDE) testing mandatory",
        "On-board diagnostics (OBD) system mandatory"
      ]
    },
    {
      title: "Graded Response Action Plan (GRAP)",
      year: "2017 (Updated 2023)",
      status: "Active",
      description: "Emergency action plan implemented in Delhi-NCR to combat air pollution based on AQI levels",
      objectives: [
        "Prevent deterioration of air quality",
        "Take emergency measures when air quality worsens",
        "Coordinate actions across multiple agencies",
        "Protect public health during severe pollution episodes"
      ],
      keyFeatures: [
        "Four-stage response system based on AQI levels",
        "Measures include traffic restrictions, construction bans, industrial controls",
        "Coordinated implementation by multiple agencies",
        "Public health advisories and emergency protocols"
      ]
    },
    {
      title: "Electric Vehicle (EV) Policy",
      year: "2020-2023",
      status: "Active",
      description: "National and state-level policies to promote electric vehicles and reduce vehicular emissions",
      objectives: [
        "Accelerate adoption of electric vehicles",
        "Reduce dependence on fossil fuels",
        "Create EV charging infrastructure",
        "Promote manufacturing of EVs and components"
      ],
      keyFeatures: [
        "Subsidies and incentives for EV purchases",
        "Development of charging infrastructure",
        "Faster Adoption and Manufacturing of Electric Vehicles (FAME) scheme",
        "Tax benefits and registration fee waivers"
      ]
    },
    {
      title: "Green India Mission",
      year: "2010",
      status: "Active",
      description: "Part of National Action Plan on Climate Change, focusing on afforestation and forest conservation",
      objectives: [
        "Increase forest and tree cover",
        "Enhance ecosystem services",
        "Improve air quality through natural filters",
        "Promote sustainable forest management"
      ],
      keyFeatures: [
        "Afforestation and reforestation programs",
        "Community participation in forest management",
        "Protection of existing forests",
        "Urban greening initiatives"
      ]
    }
  ]

  const regulations = [
    {
      title: "National Clean Air Programme (NCAP)",
      description: "Comprehensive plan to reduce PM2.5 and PM10 concentrations by 20-30% by 2024",
      status: "Active",
      lastUpdated: "2023",
      keyPoints: [
        "City-specific action plans",
        "Technology-driven solutions",
        "Public participation initiatives",
        "Regular monitoring and assessment"
      ]
    },
    {
      title: "Air (Prevention and Control of Pollution) Act, 1981",
      description: "Primary legislation for air pollution control in India",
      status: "Active",
      lastUpdated: "2021 Amendment",
      keyPoints: [
        "Establishment of Pollution Control Boards",
        "Consent mechanisms for industries",
        "Emission standards and monitoring",
        "Penalties for violations"
      ]
    },
    {
      title: "BS-VI Emission Standards",
      description: "Stringent vehicular emission norms equivalent to Euro-VI standards",
      status: "Implemented",
      lastUpdated: "2020",
      keyPoints: [
        "Reduced sulfur content in fuel",
        "Advanced emission control systems",
        "Real driving emission tests",
        "On-board diagnostics mandatory"
      ]
    }
  ]

  const emergencySOPs = [
    {
      level: "Severe+ (AQI 401-500)",
      color: "red",
      measures: [
        "Complete ban on construction and demolition",
        "Closure of schools and colleges",
        "Work from home advisory for offices",
        "Ban on diesel generators",
        "Entry restrictions for trucks",
        "Odd-even vehicle scheme mandatory"
      ]
    },
    {
      level: "Severe (AQI 301-400)",
      color: "purple",
      measures: [
        "Stop construction and demolition activities",
        "Increase bus and metro services",
        "Parking fee hike by 3-4 times",
        "Task force deployment for monitoring",
        "Public health advisory issued",
        "Industrial activity restrictions"
      ]
    },
    {
      level: "Very Poor (AQI 201-300)",
      color: "red",
      measures: [
        "Mechanized sweeping on roads",
        "Water sprinkling 2-3 times daily",
        "Strict vigilance on waste burning",
        "Enhanced public transport",
        "Health advisory for sensitive groups",
        "Industrial emission monitoring"
      ]
    }
  ]

  const resources = [
    {
      category: "Emergency Helplines",
      items: [
        { name: "Pollution Control Board", number: "1800-11-0031", available: "24/7" },
        { name: "Municipal Corporation", number: "1800-11-3344", available: "24/7" },
        { name: "Traffic Police", number: "1095", available: "24/7" },
        { name: "Health Emergency", number: "108", available: "24/7" }
      ]
    },
    {
      category: "Government Portals",
      items: [
        { name: "Central Pollution Control Board", url: "cpcb.nic.in", type: "Website" },
        { name: "Air Quality Index Portal", url: "app.cpcbccr.com", type: "Real-time Data" },
        { name: "SAMEER App", url: "Play Store/App Store", type: "Mobile App" },
        { name: "Prana Air App", url: "Play Store/App Store", type: "Mobile App" }
      ]
    },
    {
      category: "Health Resources",
      items: [
        { name: "AIIMS Pollution Clinic", contact: "011-26588500", type: "Specialized Care" },
        { name: "Chest Disease Hospital", contact: "011-25172000", type: "Respiratory Care" },
        { name: "Apollo Hospital", contact: "1860-500-1066", type: "Emergency Care" },
        { name: "Max Healthcare", contact: "1800-102-4647", type: "Multi-specialty" }
      ]
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "preventive": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Policy & Governance Hub</h2>
            <p className="text-muted-foreground font-medium">Citizen guide, precautions, and Government of India policies for air quality</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-glow-pulse"></div>
          <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">AQI {aqiData.value} - {aqiData.status}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 p-2 rounded-2xl glass-effect border border-border/30">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
              activeSection === section.id
                ? "bg-primary text-white shadow-lg hover-glow"
                : "text-foreground/70 hover:text-foreground hover:bg-border/30"
            }`}
          >
            {section.icon}
            <span>{section.label}</span>
          </button>
        ))}
      </div>

      {/* Citizen Guide - Precautions & Recommendations */}
      {activeSection === "recommendations" && (
        <div className="space-y-8">
          {/* Citizen Precautions */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/30 to-orange-500/30 flex items-center justify-center border border-red-500/30">
                <Shield className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Citizen Precautions</h3>
                <p className="text-sm text-muted-foreground">Essential safety measures to protect yourself and your family from air pollution</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {citizenPrecautions.map((precaution, index) => (
                <div
                  key={index}
                  className={`rounded-2xl border ${
                    precaution.color === "blue" ? "border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-500/5" :
                    precaution.color === "orange" ? "border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-orange-500/5" :
                    "border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-500/5"
                  } p-6 hover:scale-105 transition-all duration-300`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${
                      precaution.color === "blue" ? "bg-blue-500/20" :
                      precaution.color === "orange" ? "bg-orange-500/20" :
                      "bg-green-500/20"
                    } flex items-center justify-center`}>
                      {precaution.icon}
                    </div>
                    <h4 className="text-lg font-bold text-foreground">{precaution.category}</h4>
                  </div>
                  <ul className="space-y-3">
                    {precaution.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <CheckCircle className={`w-5 h-5 ${
                          precaution.color === "blue" ? "text-blue-400" :
                          precaution.color === "orange" ? "text-orange-400" :
                          "text-green-400"
                        } mt-0.5 flex-shrink-0`} />
                        <span className="text-sm text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Recommendations */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border border-primary/30">
                <Info className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Citizen Recommendations</h3>
                <p className="text-sm text-muted-foreground">Practical steps you can take to reduce air pollution and contribute to cleaner air</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {citizenRecommendations.map((rec, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border/40 glass-effect p-6 hover:border-primary/40 transition-all duration-300 hover-lift"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      {rec.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground">{rec.title}</h4>
                      <p className="text-xs text-muted-foreground">{rec.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {rec.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="text-primary mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Alert */}
          <div className="rounded-xl border border-red-500/40 bg-gradient-to-r from-red-500/20 to-orange-500/20 p-6 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-red-400 mb-2">Emergency Action Required</h5>
              <p className="text-sm text-foreground">
                If AQI exceeds 300 (Severe), avoid all outdoor activities. Keep vulnerable family members indoors. 
                Contact healthcare providers if experiencing severe respiratory symptoms. Call emergency helpline <strong>108</strong> for immediate medical assistance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Government Policies */}
      {activeSection === "regulations" && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center border border-blue-500/30">
              <Building2 className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Government of India Policies</h3>
              <p className="text-sm text-muted-foreground">National policies and regulations for air pollution control and environmental protection</p>
            </div>
          </div>

          {governmentPolicies.map((policy, index) => (
            <div
              key={index}
              className="rounded-3xl border border-border/40 glass-effect p-6 hover:border-primary/40 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-foreground">{policy.title}</h3>
                    <span className="text-xs text-muted-foreground">({policy.year})</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">{policy.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-semibold">
                    {policy.status}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Objectives
                  </h4>
                  <ul className="space-y-2">
                    {policy.objectives.map((objective, objIndex) => (
                      <li key={objIndex} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    Key Features
                  </h4>
                  <ul className="space-y-2">
                    {policy.keyFeatures.map((feature, featIndex) => (
                      <li key={featIndex} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Emergency SOPs */}
      {activeSection === "emergency" && (
        <div className="space-y-6">
          {emergencySOPs.map((sop, index) => (
            <div
              key={index}
              className="rounded-3xl border border-border/40 glass-effect p-6 hover:border-border/60 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-4 h-4 rounded-full bg-${sop.color}-500`}></div>
                <h3 className="text-xl font-bold text-foreground">{sop.level}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sop.measures.map((measure, measureIndex) => (
                  <div key={measureIndex} className="flex items-start gap-3 p-3 rounded-xl glass-effect border border-border/30">
                    <span className={`text-${sop.color}-400 text-sm mt-1`}>•</span>
                    <span className="text-sm text-foreground">{measure}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resources & Helplines */}
      {activeSection === "resources" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {resources.map((category, index) => (
            <div
              key={index}
              className="rounded-3xl border border-border/40 glass-effect p-6"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                {category.category === "Emergency Helplines" ? <Phone className="w-5 h-5 text-primary" /> : 
                 category.category === "Government Portals" ? <Globe className="w-5 h-5 text-primary" /> : <Heart className="w-5 h-5 text-primary" />}
                {category.category}
              </h3>

              <div className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="p-3 rounded-xl glass-effect border border-border/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground text-sm">{item.name}</p>
                        <p className="text-xs text-primary font-mono">
                          {(item as any).number || (item as any).url || (item as any).contact}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {(item as any).available || (item as any).type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
