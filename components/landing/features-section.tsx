"use client"

import { Scan, Target, Leaf, TrendingUp, Zap, Shield, ArrowRight } from "lucide-react"
import { useState } from "react"

const features = [
  {
    icon: Scan,
    title: "AI-Powered Scanner",
    description:
      "Instantly scan any packaged food with advanced AI to decode sugar levels, calories, and hidden ingredients. Crystal-clear visual insights at your fingertips.",
    color: "from-emerald-400 to-teal-500",
    emoji: "🔍",
  },
  {
    icon: Target,
    title: "Smart Health Score",
    description:
      "Every product gets an intelligent Health Score based on comprehensive analysis of sugar, calories, additives, and nutritional value. Know what's truly healthy.",
    color: "from-teal-400 to-cyan-500",
    emoji: "🎯",
  },
  {
    icon: Leaf,
    title: "Better Alternatives",
    description:
      "Discover healthier substitutes instantly. Compare products side-by-side and make smarter swaps for your everyday nutrition goals.",
    color: "from-cyan-400 to-emerald-500",
    emoji: "🌱",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Monitor your nutrition journey with detailed analytics, personalized recommendations, and AI-driven insights based on your dietary preferences.",
    color: "from-emerald-500 to-teal-400",
    emoji: "📈",
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description:
      "Get real-time nutrition breakdown in milliseconds. Our AI processes complex data instantly, giving you immediate actionable insights.",
    color: "from-teal-500 to-cyan-400",
    emoji: "⚡",
  },
  {
    icon: Shield,
    title: "Allergen Detection",
    description:
      "Automatically identify potential allergens and dietary restrictions. Stay safe with personalized warnings tailored to your health profile.",
    color: "from-cyan-500 to-emerald-400",
    emoji: "🛡️",
  },
]

export default function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-6 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <Zap size={16} className="text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">Powered by AI</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black">
            <span className="text-white">Powerful Features </span>
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              for Better Health
            </span>
          </h2>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            From intelligent scanning to smarter nutrition choices — NutriGo transforms how you understand food
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Glow Effect */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500`}
                ></div>

                {/* Card */}
                <div className="relative h-full p-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20">
                  {/* Emoji Background */}
                  <div className="absolute top-4 right-4 text-6xl opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                    {feature.emoji}
                  </div>

                  <div className="relative space-y-5">
                    {/* Icon */}
                    <div className="relative w-16 h-16">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity`}
                      ></div>
                      <div
                        className={`relative w-full h-full bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                      >
                        <Icon size={28} className="text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>

                    {/* Hover Indicator */}
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Learn more</span>
                      <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Animated Corner Accent */}
                  <div
                    className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl ${feature.color} opacity-0 group-hover:opacity-20 rounded-tl-full transition-opacity duration-500`}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-slate-400 mb-6">Ready to experience the future of nutrition?</p>
          <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 rounded-2xl font-bold text-white shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105">
            Start Free Trial
          </button>
        </div>
      </div>
    </section>
  )
}
