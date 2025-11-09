"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Target,
  Sparkles,
  Activity,
  Flame,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { RecentScans } from "./RecentScans"

interface ScanHistory {
  id: string
  productName: string
  brand: string
  healthScore: number
  category: string
  scannedAt: string
  calories: number
  sugar: number
}

interface DashboardStats {
  totalScans: number
  healthyChoices: number
  averageScore: number
  streak: number
  weeklyData: Array<{
    day: string
    scans: number
    healthy: number
    avgScore: number
  }>
  recentScans: ScanHistory[]
}

// --- FIXED: streak calculation that properly checks continuous days ---
function calculateStreak(scans: ScanHistory[]): number {
  if (!scans.length) return 0

  // normalize and sort unique scan days
  const uniqueDays = Array.from(
    new Set(
      scans.map((scan) => {
        const d = new Date(scan.scannedAt)
        d.setHours(0, 0, 0, 0)
        return d.getTime()
      })
    )
  ).sort((a, b) => b - a)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let streak = 0
  let currentDate = today.getTime()

  for (let i = 0; i < uniqueDays.length; i++) {
    if (uniqueDays[i] === currentDate) {
      streak++
      currentDate -= 86400000 // move to previous day
    } else if (uniqueDays[i] === currentDate - 86400000) {
      streak++
      currentDate -= 86400000
    } else if (uniqueDays[i] < currentDate - 86400000) {
      break // gap found
    }
  }

  return streak
}

// --- Weekly chart helper ---
function processWeeklyData(scans: ScanHistory[]) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const today = new Date()
  const weekData = new Array(7).fill(null).map((_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const dayScans = scans.filter((scan) => {
      const scanDate = new Date(scan.scannedAt)
      scanDate.setHours(0, 0, 0, 0)
      return scanDate.getTime() === date.getTime()
    })

    const totalHealth = dayScans.reduce((sum, s) => sum + (s.healthScore || 0), 0)
    const avgScore = dayScans.length > 0 ? Math.round(totalHealth / dayScans.length) : 0

    return {
      day: days[date.getDay()],
      scans: dayScans.length,
      healthy: dayScans.filter((s) => s.healthScore >= 70).length,
      avgScore,
    }
  })
  return weekData.reverse()
}

export default function DashboardPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [userName, setUserName] = useState("User")
  const [authError, setAuthError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalScans: 0,
    healthyChoices: 0,
    averageScore: 0,
    streak: 0,
    weeklyData: [],
    recentScans: [],
  })

  useEffect(() => {
    const fetchDashboardData = async (userId: string) => {
      try {
        const response = await fetch(`/api/scans?userId=${encodeURIComponent(userId)}`)
        if (!response.ok) throw new Error("Failed to fetch scan data")
        const data = await response.json()
        if (!data.success) throw new Error("Invalid scan data response")

        // ✅ Normalize Supabase data and fix timestamps
        const scans: ScanHistory[] = data.data.map((s: any) => {
          const rawDate =
            s.scanned_at ||
            s.scannedAt ||
            s.created_at ||
            s.createdAt ||
            s.timestamp ||
            s.updated_at ||
            s.updatedAt ||
            null
          const parsedDate = rawDate ? new Date(rawDate) : new Date()
          const scannedAt =
            parsedDate && !isNaN(parsedDate.getTime())
              ? parsedDate.toISOString()
              : new Date().toISOString()

          return {
            id: s.id,
            productName:
              s.product_name ||
              s.detected_name ||
              s.name ||
              s.brand ||
              "Unnamed Product",
            brand: s.brand || "—",
            healthScore: s.health_score || s.healthScore || 0,
            category: s.category || "General",
            scannedAt,
            calories: s.calories || 0,
            sugar: s.sugar || 0,
          }
        })

        const totalScans = scans.length
        const healthyChoices = scans.filter((s) => s.healthScore >= 70).length
        const averageScore =
          totalScans > 0
            ? Math.round(scans.reduce((sum, s) => sum + s.healthScore, 0) / totalScans)
            : 0

        setDashboardStats({
          totalScans,
          healthyChoices,
          averageScore,
          streak: calculateStreak(scans), // ✅ fixed streak logic
          weeklyData: processWeeklyData(scans),
          recentScans: scans
            .sort(
              (a, b) =>
                new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()
            )
            .slice(0, 4),
        })
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setDashboardStats({
          totalScans: 0,
          healthyChoices: 0,
          averageScore: 0,
          streak: 0,
          weeklyData: [],
          recentScans: [],
        })
      }
    }

    const fetchUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session) {
          router.push("/auth/login")
          return
        }

        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          setAuthError("User not found. Please log in again.")
          router.push("/auth/login")
          return
        }

        const fullName =
          user.user_metadata?.full_name || user.user_metadata?.display_name
        if (fullName) {
          setUserName(fullName)
        } else if (user.email) {
          const namePart = user.email.split("@")[0]
          setUserName(namePart.charAt(0).toUpperCase() + namePart.slice(1))
        }

        await fetchDashboardData(user.id)
      } catch (err) {
        console.error("Auth error:", err)
        setAuthError("Authentication failed. Please log in again.")
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [supabase, router])

  if (authError) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="p-8 border border-red-500/40 bg-slate-900 rounded-xl">
          <p>{authError}</p>
          <p className="text-slate-500 text-sm">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        Loading your dashboard...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
            <Sparkles className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                {userName}
              </span>
              !
            </h1>
            <p className="text-slate-400 mt-1">Here’s your health journey overview</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Scans" value={dashboardStats.totalScans} icon={<Zap />} color="emerald" />
          <StatCard title="Healthy Choices" value={dashboardStats.healthyChoices} icon={<Target />} color="teal" />
          <StatCard title="Avg Health Score" value={dashboardStats.averageScore} icon={<Activity />} color="cyan" />
          <StatCard title="Current Streak" value={dashboardStats.streak} icon={<Flame />} color="emerald" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Weekly Activity" subtitle="Your scan frequency this week">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dashboardStats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#0f172a", borderRadius: 12 }} />
                <Bar dataKey="scans" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="healthy" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Health Score Trend" subtitle="Average health scores">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={dashboardStats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#0f172a", borderRadius: 12 }} />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  dot={{ fill: "#14b8a6", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ✅ Recent Scans with fixed date */}
        <RecentScans scans={dashboardStats.recentScans} />

        <div className="p-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
          <div>
            <h3 className="text-2xl font-bold text-white">Ready to scan more?</h3>
            <p className="text-slate-400">Start scanning your food items for instant insights.</p>
          </div>
          <Link href="/dashboard/scanner">
            <Button className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold px-6 py-4">
              Open Scanner <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// --- Reusable Components ---
function StatCard({ title, value, icon, color }: any) {
  const colorMap: any = {
    emerald: { gradient: "from-emerald-500 to-teal-600" },
    teal: { gradient: "from-teal-500 to-cyan-600" },
    cyan: { gradient: "from-cyan-500 to-blue-600" },
  }

  return (
    <Card className="p-6 bg-slate-900/70 backdrop-blur-md border border-slate-700/50 hover:border-emerald-500/30 shadow-lg transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-400">{title}</span>
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorMap[color].gradient} flex items-center justify-center text-white`}
        >
          {icon}
        </div>
      </div>
      <p className="text-4xl font-black text-white">{value}</p>
    </Card>
  )
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <Card className="p-6 bg-slate-900/70 backdrop-blur-md border border-slate-700/50 hover:border-emerald-500/20 transition-all">
      <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-slate-400 mb-3">{subtitle}</p>}
      {children}
    </Card>
  )
}
