"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Scan } from "lucide-react"
import { useEffect, useRef } from "react"

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
    }> = []

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        ctx.fillStyle = `rgba(52, 211, 153, ${particle.opacity})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-slate-950">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-teal-500/25 to-cyan-500/25 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left Content */}
          <div className="space-y-10 flex flex-col justify-center">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-black leading-tight">
                <span className="text-white">Smart Food</span>{" "}
                <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                  Scanning
                </span>{" "}
                <span className="text-white">Made Simple</span>
              </h1>

              <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
                Stop guessing what's in your food. Scan any packaged item with AI-powered precision to reveal hidden
                sugars, calories, and ingredients. Make informed choices instantly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold px-8 py-7 text-lg shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 border-0"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Start Scanning
                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-7 text-lg border-2 border-emerald-500/50 hover:border-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-400 font-bold backdrop-blur-xl transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            

          </div>

          {/* Right Visual - 3D Card (Aligned with heading and buttons) */}
          <div className="relative flex items-start justify-center pt-0">
            <div className="sticky top-24">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-teal-500/30 to-cyan-500/30 rounded-[3rem] blur-3xl animate-pulse-slow"></div>
                
                <div className="relative perspective-1000">
                  <div className="relative w-80 h-[500px] transform-gpu hover:rotate-y-6 transition-transform duration-700 ease-out">
                    {/* Phone Frame */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[3rem] border-4 border-emerald-500/30 shadow-2xl shadow-emerald-500/20 backdrop-blur-xl overflow-hidden">
                      {/* Screen Content */}
                      <div className="p-6 h-full flex flex-col items-center justify-center space-y-6">
                        <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/50 animate-float">
                          <Scan size={48} className="text-white" />
                        </div>
                        
                        <div className="space-y-3 text-center">
                          <p className="text-xl font-bold text-white">Scan & Analyze</p>
                          <p className="text-sm text-slate-400">Real-time AI nutrition insights</p>
                        </div>

                        {/* Animated Scanning Lines */}
                        <div className="w-full h-32 relative bg-slate-800/50 rounded-2xl overflow-hidden border border-emerald-500/30">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent h-8 animate-scan"></div>
                          <div className="flex items-center justify-center h-full">
                            <span className="text-4xl">🥗</span>
                          </div>
                        </div>

                        {/* Health Score Display */}
                        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 rounded-2xl px-6 py-4 backdrop-blur-xl">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl font-black text-emerald-400">A+</div>
                            <div className="text-left">
                              <p className="text-xs text-slate-400">Health Score</p>
                              <p className="text-sm font-semibold text-white">Excellent Choice</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Glowing Border Effect */}
                      <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-0 hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                    </div>

                    {/* Floating Icons */}
                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/40 animate-float" style={{ animationDelay: "0.5s" }}>
                      <span className="text-2xl">📊</span>
                    </div>
                    <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-cyan-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-500/40 animate-float" style={{ animationDelay: "1s" }}>
                      <span className="text-2xl">✨</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
