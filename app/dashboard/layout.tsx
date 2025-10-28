"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, Settings, User, Home, Zap, BarChart3 } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
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

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">NG</span>
          </div>
          <span className="font-bold text-sm">NutriGo</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-card/80 backdrop-blur-md border-b border-border p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-foreground transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-card/50 backdrop-blur-md border-r border-border transition-all duration-300 z-20 ${
          sidebarOpen ? "w-64" : "w-20"
        } hidden md:flex flex-col`}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">NG</span>
              </div>
              <span className="font-bold">NutriGo</span>
            </Link>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-muted rounded-lg transition">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-foreground transition group"
              >
                <Icon size={20} className="group-hover:text-primary transition" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link href="/dashboard/profile">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <User size={20} />
              {sidebarOpen && <span>Profile</span>}
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 md:ml-64 pt-16 md:pt-0 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
        {children}
      </main>
    </div>
  )
}
