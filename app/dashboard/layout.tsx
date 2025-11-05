"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, Settings, User, Home, Zap, BarChart3, Crown, Sparkles } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    router.push("/")
  }

  const navItems = [
    { icon: Home, label: "Overview", href: "/dashboard" },
    { icon: Zap, label: "Scanner", href: "/dashboard/scanner" },
    { icon: BarChart3, label: "History", href: "/dashboard/history" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ]

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname?.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-emerald-500/20 flex items-center justify-between px-4 h-16 shadow-xl">
        <Link href="/" className="flex items-center gap-3" aria-label="NutriGo home">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/logo.png"
              alt="NutriGo Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          {mobileMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-emerald-500/20 p-4 space-y-2 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={20} />
                <span className="font-semibold">{item.label}</span>
              </Link>
            )
          })}
          
          {/* Upgrade Card - Mobile */}
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Crown size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Upgrade to Pro</p>
                <p className="text-xs text-slate-400">Unlock all features</p>
              </div>
            </div>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 text-white font-bold shadow-lg shadow-amber-500/30 transition-all duration-300 border-0 text-sm">
                <Sparkles size={16} className="mr-2" />
                Upgrade Now
              </Button>
            </Link>
          </div>
          
          <div className="pt-4 border-t border-slate-700 space-y-2">
            <Link href="/dashboard/profile">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={20} />
                <span>Profile</span>
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      )}

      {/* Sidebar - Desktop */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-slate-900/90 backdrop-blur-xl border-r border-emerald-500/20 transition-all duration-300 z-30 shadow-2xl ${
          sidebarOpen ? "w-64" : "w-20"
        } hidden md:flex flex-col`}
      >
        {/* Sidebar Header - Reduced padding */}
        <div className="p-4 border-b border-emerald-500/20 flex items-center justify-between">
          {sidebarOpen ? (
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-45 h-45">
                <Image
                  src="/logo.png"
                  alt="NutriGo Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          ) : (
            <div className="relative w-45 h-45 mx-auto">
              <Image
                src="/logo.png"
                alt="NutriGo Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
          {sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={20} className="text-slate-400 hover:text-white" />
            </button>
          )}
        </div>

        {/* Navigation - Removed overflow-y-auto and adjusted spacing */}
        <nav className="flex-1 p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon size={20} className={active ? "text-emerald-400" : "group-hover:text-emerald-400 transition-colors"} />
                {sidebarOpen && <span className="font-semibold">{item.label}</span>}
                {active && sidebarOpen && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                )}
              </Link>
            )
          })}
          
          {!sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="w-full p-3 hover:bg-slate-800 rounded-xl transition-colors mt-4"
              title="Expand sidebar"
            >
              <Menu size={20} className="text-slate-400 hover:text-white mx-auto" />
            </button>
          )}

          {/* Upgrade Card - Desktop (Expanded) - Reduced padding and margin */}
          {sidebarOpen && (
            <div className="mt-4 p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Crown size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Upgrade to Pro</p>
                  <p className="text-[10px] text-slate-400">Unlock all features</p>
                </div>
              </div>
              <ul className="space-y-1 mb-2.5 text-[11px] text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-amber-400"></div>
                  <span>Unlimited scans</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-orange-400"></div>
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-red-400"></div>
                  <span>Priority support</span>
                </li>
              </ul>
              <Link href="/pricing">
                <Button className="w-full h-8 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 text-white font-bold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 border-0 text-xs">
                  <Sparkles size={14} className="mr-1.5" />
                  Upgrade Now
                </Button>
              </Link>
            </div>
          )}

          {/* Upgrade Icon - Desktop (Collapsed) */}
          {!sidebarOpen && (
            <Link href="/pricing" title="Upgrade to Pro">
              <button className="w-full p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 mt-4">
                <Crown size={20} className="text-amber-400 mx-auto" />
              </button>
            </Link>
          )}
        </nav>

        {/* Sidebar Footer - Reduced padding */}
        <div className="p-3 border-t border-emerald-500/20 space-y-1.5">
          <Link href="/dashboard/profile">
            <Button
              variant="ghost"
              className={`w-full gap-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-all h-10 ${
                sidebarOpen ? "justify-start" : "justify-center p-3"
              }`}
              title={!sidebarOpen ? "Profile" : undefined}
            >
              <User size={20} />
              {sidebarOpen && <span>Profile</span>}
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className={`w-full gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all h-10 ${
              sidebarOpen ? "justify-start" : "justify-center p-3"
            }`}
            title={!sidebarOpen ? "Logout" : undefined}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 pt-16 md:pt-0 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
        {children}
      </main>
    </div>
  )
}
