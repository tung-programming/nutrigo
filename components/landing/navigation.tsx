"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-xl border-b border-emerald-500/20 shadow-lg shadow-emerald-500/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <span className="text-white font-black text-lg">N</span>
              </div>
            </div>
            <span className="font-black text-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              NutriGo
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Market", "Roadmap"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative text-slate-300 hover:text-emerald-400 transition-colors duration-300 font-medium group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 transition-all duration-300"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 border-0">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-emerald-400 hover:text-emerald-300 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-6 space-y-4 border-t border-emerald-500/20 pt-4 animate-in slide-in-from-top duration-300">
            {["Features", "Market", "Roadmap"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block text-slate-300 hover:text-emerald-400 transition-colors duration-300 py-2"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="flex gap-3 pt-4">
              <Link href="/auth/login" className="flex-1">
                <Button variant="ghost" className="w-full border border-emerald-500/30 hover:bg-emerald-500/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
