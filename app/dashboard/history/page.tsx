"use client"

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
import { useState, useEffect } from "react"

// Interface to match the data structure from your API
interface ScanHistory {
  id: string
  name: string
  brand: string
  score: number
  category: string
  date: string // This will be the ISO string 'scannedAt' from your API
  calories: number
  sugar: number
}

type SortKey = "date" | "score" | "calories" | "sugar"

export default function HistoryPage() {
  // States to manage data, loading, and filters
  const [history, setHistory] = useState<ScanHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortKey>("date")

  // Fetch data from the API when the component loads
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/scans")
        if (!response.ok) {
          throw new Error("Failed to fetch scan history")
        }
        const apiResponse = await response.json()

        if (apiResponse.success) {
          // Map the API data to the structure used by this component
          // Prefer the actual product name from multiple possible fields
          const mappedData: ScanHistory[] = apiResponse.data.map((item: any) => ({
            id: item.id,
            // Prefer productName, then detected_name (backend), then name, then product_name
            name: item.productName || item.detected_name || item.name || item.product_name || "",
            brand: item.brand || "",
            score: item.healthScore || item.health_score || 0,
            category: item.category || item.nutrition?.category || "General", // Use a fallback category
            date: item.scannedAt || item.created_at || item.date || new Date().toISOString(),
            calories: item.calories || item.nutrition?.calories || 0,
            sugar: item.sugar || item.nutrition?.sugar || 0,
          }));
          setHistory(mappedData)
        }
      } catch (error) {
        console.error("Error fetching history:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, []) // The empty array ensures this runs only once on mount

  // Filter and sort the fetched history data
  const filteredHistory = history
    .filter((item) => {
      // ✅ FIX: Provide a fallback empty string for item.name to prevent crash
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
        case "date":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })

  // Derive categories and stats from the real data
  const categories = Array.from(new Set(history.map((item) => item.category)))
  const totalScans = history.length
  const averageScore = totalScans > 0 ? Math.round(history.reduce((sum, item) => sum + item.score, 0) / totalScans) : 0
  const healthyChoices = history.filter((item) => item.score >= 70).length
  const successRate = totalScans > 0 ? Math.round((healthyChoices / totalScans) * 100) : 0

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
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="p-4 md:p-8 lg:p-12 space-y-8 relative z-10">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-xl shadow-emerald-500/25">
              <BarChart3 size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white">Scan History</h1>
              <p className="text-slate-400 text-lg">View all your previous food scans and nutrition analysis</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-emerald-500/20 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-4 text-slate-500" size={20} />
              <Input
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 bg-slate-800/50 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-xl text-base"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-4 text-slate-500" size={18} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="pl-10 pr-4 py-3.5 h-14 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="date">Sort by Date</option>
                  <option value="score">Sort by Score</option>
                  <option value="calories">Sort by Calories</option>
                  <option value="sugar">Sort by Sugar</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterCategory(null)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                filterCategory === null
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  filterCategory === category
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </Card>

        {/* History List */}
        <div className="space-y-4">
          {loading ? (
            <Card className="p-16 flex justify-center items-center bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700">
              <p className="text-slate-400 text-lg">Loading History...</p>
            </Card>
          ) : filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <Card
                key={item.id}
                className="group p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700 hover:border-emerald-500/40 shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-white text-lg">{item.name || 'Unnamed Product'}</h3>
                        <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-xs font-semibold">
                          {item.category}
                        </span>
                    </div>
                    {/* Show brand on its own line, but do not use it as the displayed product name */}
                    {item.brand && <p className="text-sm text-slate-400">{item.brand}</p>}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 pt-2">
                      <span className="flex items-center gap-2">
                        <Calendar size={16} className="text-emerald-400" />
                        <span className="text-slate-300">{new Date(item.date).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span className="text-slate-300">{item.calories} cal</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                        <span className="text-slate-300">{item.sugar}g sugar</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className={`px-6 py-3 rounded-xl font-black text-2xl ${getScoreBg(item.score)} ${getScoreColor(item.score)} shadow-lg`}
                    >
                      {item.score}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all p-3 rounded-xl"
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/scans', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: item.id }),
                          })
                          if (!res.ok) throw new Error('Failed to delete')
                          // Optimistically remove from UI
                          setHistory((prev) => prev.filter((h) => h.id !== item.id))
                        } catch (err) {
                          console.error('Delete failed', err)
                          alert('Could not delete the scan. Please try again.')
                        }
                      }}
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-16 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700 text-center">
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <Sparkles size={40} className="text-emerald-400" />
                </div>
                <p className="text-slate-400 text-lg">No scans found. Start scanning to build your history!</p>
              </div>
            </Card>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="group p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 shadow-xl transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">Total Scans</span>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 size={20} className="text-emerald-400" />
                </div>
              </div>
              <p className="text-4xl font-black text-white">{totalScans}</p>
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <TrendingUp size={16} />
                <span>All time</span>
              </div>
            </div>
          </Card>
          <Card className="group p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-teal-500/20 hover:border-teal-500/40 shadow-xl transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">Average Score</span>
                <div className="w-10 h-10 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp size={20} className="text-teal-400" />
                </div>
              </div>
              <p className="text-4xl font-black text-white">{averageScore}</p>
              <div className="flex items-center gap-2 text-teal-400 text-sm">
                <Award size={16} />
                <span>Great progress!</span>
              </div>
            </div>
          </Card>
          <Card className="group p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 shadow-xl transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">Healthy Choices</span>
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award size={20} className="text-cyan-400" />
                </div>
              </div>
              <p className="text-4xl font-black text-white">{healthyChoices}</p>
              <div className="flex items-center gap-2 text-cyan-400 text-sm">
                <Sparkles size={16} />
                <span>{successRate}% success rate</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
