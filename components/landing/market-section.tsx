"use client"

import { Heart, Dumbbell, Baby, Users, Sparkles, TrendingUp } from "lucide-react"

const audiences = [
  {
    icon: Heart,
    title: "Health Enthusiasts",
    description: "Track every bite with precision. Perfect for those who count macros, monitor sugar intake, and optimize nutrition for peak wellness.",
    stat: "53% Indians",
    statLabel: "proactively manage health",
    color: "from-rose-400 to-pink-500",
    gradient: "from-rose-500/20 to-pink-500/20",
    emoji: "💪",
  },
  {
    icon: Dumbbell,
    title: "Fitness Warriors",
    description: "Fuel your gains right. Whether bulking or cutting, scan meals to hit your protein targets and track calories with military precision.",
    stat: "88% users",
    statLabel: "are 19-40 years old",
    color: "from-emerald-400 to-teal-500",
    gradient: "from-emerald-500/20 to-teal-500/20",
    emoji: "🏋️",
  },
  {
    icon: Baby,
    title: "Parents & Families",
    description: "Make smarter choices for your loved ones. Decode ingredient lists, spot hidden allergens, and ensure every family meal is nutritious.",
    stat: "64% consumers",
    statLabel: "prioritize transparency",
    color: "from-amber-400 to-orange-500",
    gradient: "from-amber-500/20 to-orange-500/20",
    emoji: "👨‍👩‍👧",
  },
  {
    icon: Sparkles,
    title: "Lifestyle Transformers",
    description: "Managing PCOS, diabetes, or weight goals? Get personalized insights on how every food choice impacts your health journey.",
    stat: "101M+ Indians",
    statLabel: "living with diabetes",
    color: "from-purple-400 to-violet-500",
    gradient: "from-purple-500/20 to-violet-500/20",
    emoji: "✨",
  },
  {
    icon: Users,
    title: "Conscious Consumers",
    description: "Know what you're really eating. Scan products to uncover additives, preservatives, and artificial ingredients in seconds.",
    stat: "84% Indians",
    statLabel: "seek healthier options",
    color: "from-cyan-400 to-blue-500",
    gradient: "from-cyan-500/20 to-blue-500/20",
    emoji: "🌱",
  },
  {
    icon: TrendingUp,
    title: "Busy Professionals",
    description: "Quick nutrition checks on-the-go. Scan your office lunch or grocery haul in seconds and make informed choices without slowing down.",
    stat: "28% adults",
    statLabel: "use food apps weekly",
    color: "from-teal-400 to-emerald-500",
    gradient: "from-teal-500/20 to-emerald-500/20",
    emoji: "💼",
  },
]

export default function ForWhomSection() {
  return (
    <section id="for-whom" className="py-32 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Particle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(52,211,153,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center space-y-6 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full backdrop-blur-xl">
            <Sparkles size={16} className="text-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold text-emerald-400">Built for Everyone Who Cares</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black">
            <span className="text-white">Your </span>
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Journey
            </span>
            <span className="text-white">, Our Mission</span>
          </h2>

          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Whether you're crushing fitness goals, managing health conditions, or simply choosing better for your family — NutriGo adapts to your unique nutrition needs
          </p>
        </div>

        {/* Audience Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {audiences.map((audience, index) => {
            const Icon = audience.icon
            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Glow Effect */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${audience.color} rounded-3xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500`}
                ></div>

                {/* Card */}
                <div className="relative h-full p-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20">
                  {/* Emoji Background */}
                  <div className="absolute top-6 right-6 text-5xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 group-hover:scale-110 transform">
                    {audience.emoji}
                  </div>

                  {/* Icon */}
                  <div className="mb-6">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${audience.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                    >
                      <Icon size={24} className="text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4 relative">
                    <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                      {audience.title}
                    </h3>

                    <p className="text-slate-400 text-sm leading-relaxed">
                      {audience.description}
                    </p>

                    {/* Stat Badge */}
                    <div className={`inline-flex flex-col p-3 rounded-xl bg-gradient-to-br ${audience.gradient} border border-emerald-500/20 backdrop-blur-sm`}>
                      <div className={`text-xl font-black bg-gradient-to-r ${audience.color} bg-clip-text text-transparent`}>
                        {audience.stat}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {audience.statLabel}
                      </div>
                    </div>
                  </div>

                  {/* Corner Accent */}
                  <div
                    className={`absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl ${audience.gradient} opacity-0 group-hover:opacity-100 rounded-tl-full transition-opacity duration-500`}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center space-y-6">
          <div className="inline-flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-r from-slate-900/50 to-slate-800/50 border border-emerald-500/20 backdrop-blur-xl">
            <div className="flex -space-x-4">
              {["😊", "🏃", "👨‍💼", "👩‍🍳", "🧘"].map((emoji, idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-slate-900 flex items-center justify-center text-xl"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-white font-bold">Join 72,000+ users</p>
              <p className="text-sm text-slate-400">Making smarter food choices every day</p>
            </div>
          </div>

          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            No matter where you are in your health journey, NutriGo gives you the insights to make confident decisions about every bite.
          </p>
        </div>
      </div>
    </section>
  )
}
