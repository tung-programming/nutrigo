"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-950">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Main Card */}
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-[3rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

          {/* Content Card */}
          <div className="relative p-16 rounded-[3rem] border border-emerald-500/30 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl overflow-hidden">
            {/* Floating Elements */}
            <div className="absolute top-10 right-10 text-6xl animate-float opacity-20">🥗</div>
            <div className="absolute bottom-10 left-10 text-6xl animate-float opacity-20" style={{ animationDelay: "1s" }}>
              📱
            </div>

            <div className="relative text-center space-y-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 rounded-full">
                <Sparkles size={18} className="text-emerald-400 animate-pulse" />
                <span className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Join 72,000+ Health-Conscious Users
                </span>
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-black leading-tight">
                  <span className="text-white">Ready to </span>
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    Decode
                  </span>
                  <br />
                  <span className="text-white">Your Food?</span>
                </h2>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Transform your nutrition journey with AI-powered scanning. Start making smarter, healthier choices
                  today.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold px-10 py-7 text-lg shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all duration-300 border-0 transform hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Start Your Journey
                      <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-10 py-7 text-lg border-2 border-emerald-500/50 hover:border-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-400 font-bold backdrop-blur-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Explore Features
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 flex flex-wrap justify-center items-center gap-8 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-emerald-400" />
                  <span>Instant Results</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Cancel Anytime</span>
                </div>
              </div>
            </div>

            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-tl-[3rem]"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-cyan-500/20 to-transparent rounded-br-[3rem]"></div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: "🔒", title: "Secure & Private", desc: "Your data is protected" },
            { icon: "⚡", title: "Lightning Fast", desc: "Instant scan results" },
            { icon: "🎯", title: "Accurate AI", desc: "99.9% precision rate" },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/50 border border-emerald-500/20 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-300 text-center group"
            >
              <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">
                {feature.icon}
              </div>
              <div className="text-white font-bold mb-1">{feature.title}</div>
              <div className="text-sm text-slate-400">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
