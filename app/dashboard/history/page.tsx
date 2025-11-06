"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Calendar,
  Trash2,
  Filter,
  TrendingUp,
  Award,
  BarChart3,
  Sparkles,
} from "lucide-react"

interface ScanHistory {
  id: string
  name: string
  brand: string
  score: number
  category: string
  date: string
  calories: number
  sugar: number
}

type SortKey = "date" | "score" | "calories" | "sugar"

export default function HistoryPage() {
  const supabase = createClientComponentClient()

  const [history, setHistory] = useState<ScanHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortKey>("date")

  // Get current user ID (Supabase first, fallback localStorage)
  const getCurrentUserId = async (): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.id) return user.id
    } catch {}
    if (typeof window !== "undefined") {
      const keys = ["nutrigo_current_user", "currentUser", "user"]
      for (const key of keys) {
        const raw = localStorage.getItem(key)
        if (!raw) continue
        try {
          const parsed = JSON.parse(raw)
          if (parsed?.id) return parsed.id
        } catch {
          if (raw.startsWith("user_") || raw.length > 6) return raw
        }
      }
    }
    return null
  }

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      try {
        const userId = await getCurrentUserId()
        if (!userId) {
          console.warn("No user ID found — not fetching history")
          setHistory([])
          return
        }

        const res = await fetch(`/api/scans?userId=${encodeURIComponent(userId)}`)
        if (!res.ok) throw new Error("Failed to fetch scan history")

        const data = await res.json()
        if (data.success) {
          const formatted: ScanHistory[] = data.data.map((item: any) => ({
            id: item.id,
            name: item.productName || item.detected_name || item.name || item.product_name || "Unnamed Product",
            brand: item.brand || "",
            score: item.healthScore || 0,
            category: item.category || "General",
            date: item.scannedAt || new Date().toISOString(),
            calories: item.calories || 0,
            sugar: item.sugar || 0,
          }))
          setHistory(formatted)
        }
      } catch (err) {
        console.error("Error fetching history:", err)
        setHistory([])
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const userId = await getCurrentUserId()
      if (!userId) {
        alert("Please log in to delete scans.")
        return
      }

      const res = await fetch("/api/scans", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, userId }),
      })
      if (!res.ok) throw new Error("Failed to delete scan")

      setHistory((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      console.error("Delete failed:", err)
      alert("Could not delete scan. Try again.")
    }
  }

  const filteredHistory = history
    .filter((item) => {
      const matchesSearch = (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !filterCategory || item.category === filterCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.score - a.score
        case "calories":
          return b.calories - a.calories
        case "sugar":
          return b.sugar - a.sugar
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })

  const categories = Array.from(new Set(history.map((h) => h.category)))
  const totalScans = history.length
  const avgScore = totalScans ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / totalScans) : 0
  const healthyChoices = history.filter((h) => h.score >= 70).length
  const successRate = totalScans ? Math.round((healthyChoices / totalScans) * 100) : 0

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-400"
    if (score >= 50) return "text-cyan-400"
    return "text-red-400"
  }

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-emerald-500/20 border border-emerald-500/40"
    if (score >= 50) return "bg-cyan-500/20 border border-cyan-500/40"
    return "bg-red-500/20 border border-red-500/40"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div 
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div 
          className="absolute bottom-0 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 relative z-10">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <BarChart3 className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              Your{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Scan History
              </span>
            </h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">Track your nutritional journey</p>
          </div>
        </div>

        {/* Stats Summary - Mobile First */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Award className="text-emerald-400" size={20} />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-300">Total Scans</h3>
            </div>
            <p className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
              {totalScans}
            </p>
          </Card>

          <Card className="p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-teal-500/10">
                <BarChart3 className="text-teal-400" size={20} />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-300">Avg Score</h3>
            </div>
            <p className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
              {avgScore}
            </p>
          </Card>

          <Card className="p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 sm:col-span-1 col-span-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <TrendingUp className="text-cyan-400" size={20} />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-300">Healthy Rate</h3>
            </div>
            <p className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
              {successRate}%
            </p>
          </Card>
        </div>

        {/* Enhanced Filters Section */}
        <Card className="p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md border border-slate-700/50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
              />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all w-full"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <Filter size={18} className="text-slate-400 flex-shrink-0" />
                <select
                  value={filterCategory || ""}
                  onChange={(e) => setFilterCategory(e.target.value || null)}
                  className="bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all w-full sm:w-auto cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <TrendingUp size={18} className="text-slate-400 flex-shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all w-full sm:w-auto cursor-pointer"
                >
                  <option value="date">Newest First</option>
                  <option value="score">Health Score</option>
                  <option value="calories">Calories</option>
                  <option value="sugar">Sugar Content</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* History List - Enhanced Mobile Layout */}
        <div className="space-y-4">
          {loading ? (
            <Card className="p-12 sm:p-16 flex justify-center items-center bg-slate-900/60 backdrop-blur-md border border-slate-700/50">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-slate-400 text-base sm:text-lg">Loading your history...</p>
              </div>
            </Card>
          ) : filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <Card
                key={item.id}
                className="p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md border border-slate-700/50 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 group"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-bold text-white text-base sm:text-lg truncate">
                          {item.name}
                        </h3>
                        <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/50 text-slate-400 text-xs font-semibold whitespace-nowrap">
                          {item.category}
                        </span>
                      </div>
                      {item.brand && (
                        <p className="text-sm text-slate-400 mb-3">{item.brand}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <div
                        className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-black text-xl sm:text-2xl ${getScoreBg(
                          item.score
                        )} ${getScoreColor(item.score)} shadow-md`}
                      >
                        {item.score}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all p-2 sm:p-2.5 rounded-lg"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-slate-400 pt-2 border-t border-slate-800/50">
                    <span className="flex items-center gap-2">
                      <Calendar size={14} className="text-emerald-400 flex-shrink-0" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                      {item.calories} cal
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0"></span>
                      {item.sugar}g sugar
                    </span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 sm:p-16 flex flex-col justify-center items-center bg-slate-900/60 backdrop-blur-md border border-slate-700/50 text-center space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Sparkles size={32} className="text-white" />
              </div>
              <div className="space-y-2">
                <p className="text-slate-300 text-lg sm:text-xl font-semibold">
                  No scans yet
                </p>
                <p className="text-slate-500 text-sm sm:text-base max-w-md">
                  Start scanning products to build your nutritional history and track your health journey!
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
