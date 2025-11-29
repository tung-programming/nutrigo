"use client"


import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"


export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)


  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setScrolled(window.scrollY > 20)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])


  const menuItems = [
    { name: "Features", href: "/#features" },
    { name: "About Us", href: "/#about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/#contact" },
  ]


  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-xl border-b border-emerald-500/20 shadow-lg shadow-emerald-500/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 md:h-28">
          {/* Logo Section - Shifted Left */}
          <Link href="/" className="flex items-center gap-3 group -ml-28 sm:-ml-32 md:-ml-36">
            <div className="relative w-[220px] h-[70px] sm:w-[260px] sm:h-[80px] md:w-[350px] md:h-[120px]">
              <Image
                src="/logo.png"
                alt="NutriGo Logo"
                fill
                className="object-contain transform group-hover:scale-110 transition-transform duration-300"
                priority
              />
            </div>
          </Link>


          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-slate-300 hover:text-emerald-400 transition-colors duration-300 font-medium group text-lg"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>


          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 transition-all duration-300 text-base"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 border-0 text-base px-6 py-3">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </Link>
          </div>


          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>


        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-5"
          }`}
        >
          <div className="pb-6 pt-4 border-t border-emerald-500/20 space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-slate-300 hover:text-emerald-400 transition-colors duration-300 py-2 text-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}


            <div className="flex flex-col gap-3 pt-4">
              <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full border border-emerald-500/30 hover:bg-emerald-500/10 text-slate-200 text-base"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white text-base py-3">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
