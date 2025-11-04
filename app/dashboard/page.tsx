"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Zap, Target, Calendar, Sparkles, Award, Activity } from "lucide-react"
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
  }>
  recentScans: ScanHistory[]
}

function calculateStreak(scans: ScanHistory[]): number {
  if (!scans.length) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const scanDates = scans
    .map(scan => {
      const date = new Date(scan.scannedAt);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
    .sort((a, b) => b - a); // Sort in descending order
  
  let streak = 1;
  let currentDate = today.getTime();
  let hasToday = scanDates[0] === currentDate;
  
  if (!hasToday) {
    currentDate = new Date(currentDate - 86400000).getTime(); // Check from yesterday if no scans today
  }
  
  for (let i = hasToday ? 1 : 0; i < scanDates.length; i++) {
    const expectedDate = new Date(currentDate - 86400000).getTime();
    if (scanDates[i] === expectedDate) {
      streak++;
      currentDate = expectedDate;
    } else {
      break;
    }
  }
  
  return streak;
}

function processWeeklyData(scans: ScanHistory[]) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const weekData = new Array(7).fill(null).map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const dayScans = scans.filter(scan => {
      const scanDate = new Date(scan.scannedAt);
      scanDate.setHours(0, 0, 0, 0);
      return scanDate.getTime() === date.getTime();
    });
    
    return {
      day: days[date.getDay()],
      scans: dayScans.length,
      healthy: dayScans.filter(scan => scan.healthScore >= 70).length
    };
  }).reverse();
  
  return weekData;
}

export default function DashboardPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [userName, setUserName] = useState<string>("User")
  const [userEmail, setUserEmail] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState<string>("")
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalScans: 0,
    healthyChoices: 0,
    averageScore: 0,
    streak: 0,
    weeklyData: [],
    recentScans: []
  })

  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/scans");
        if (!response.ok) throw new Error("Failed to fetch scan data");
        
        const data = await response.json();
        if (!data.success) throw new Error("Invalid scan data response");
        
        const scans: ScanHistory[] = data.data;
        const totalScans = scans.length;
        const healthyChoices = scans.filter(scan => scan.healthScore >= 70).length;
        const averageScore = totalScans > 0 
          ? Math.round(scans.reduce((sum, scan) => sum + scan.healthScore, 0) / totalScans)
          : 0;
        
        setDashboardStats({
          totalScans,
          healthyChoices,
          averageScore,
          streak: calculateStreak(scans),
          weeklyData: processWeeklyData(scans),
          recentScans: scans.sort((a, b) => 
            new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()
          ).slice(0, 4)
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    // ✅ CRITICAL FIX: Fetch user data with proper error handling
    const fetchUser = async () => {
      try {
        // ✅ First check if we have a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('Session error:', sessionError)
          setAuthError("Session expired. Please log in again.")
          setIsLoading(false)
          router.push('/auth/login')
          return
        }

        if (!session) {
          console.log('No session found, redirecting to login')
          setIsLoading(false)
          router.push('/auth/login')
          return
        }

        // ✅ Now safely fetch user data
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError) {
          console.error('User fetch error:', userError)
          
          // ✅ CRITICAL FIX: Handle the specific "User from sub claim in JWT does not exist" error
          if (userError.message.includes('sub claim') || 
              userError.message.includes('does not exist') ||
              userError.status === 401) {
            setAuthError("Your account is not fully set up. Please verify your email or try logging in again.")
            
            // Sign out and redirect to login
            await supabase.auth.signOut()
            setTimeout(() => {
              router.push('/auth/login')
            }, 2000)
            return
          }
          
          setAuthError("Failed to load user data. Please try again.")
          setIsLoading(false)
          return
        }

        if (user) {
          // ✅ CRITICAL FIX: Additional check to ensure email is confirmed
          if (!user.email_confirmed_at) {
            console.log('Email not confirmed')
            setAuthError("Please verify your email address before accessing the dashboard.")
            await supabase.auth.signOut()
            setTimeout(() => {
              router.push('/auth/login')
            }, 2000)
            return
          }

          // ✅ Set user data
          const fullName = user.user_metadata?.full_name || user.user_metadata?.display_name
          
          if (fullName) {
            setUserName(fullName)
          } else if (user.email) {
            const emailUsername = user.email.split('@')[0]
            setUserName(emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1))
          }

          setUserEmail(user.email || "")
          // After successful auth, fetch dashboard data
          await fetchDashboardData()
        } else {
          // No user data available
          setAuthError("Unable to load user information. Please log in again.")
          router.push('/auth/login')
        }

        setIsLoading(false)
      } catch (err: any) {
        console.error('Unexpected error fetching user:', err)
        setAuthError("An unexpected error occurred. Please try logging in again.")
        setIsLoading(false)
        
        // Redirect to login after error
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      }
    }

    fetchUser()
  }, [supabase, router])
  

  // ✅ Show error state if auth fails
  if (authError) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-slate-900 border border-red-500/30 rounded-2xl">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Authentication Error</h2>
            <p className="text-slate-400">{authError}</p>
            <p className="text-sm text-slate-500">Redirecting to login...</p>
          </div>
        </div>
      </div>
    )
  }

  // ✅ Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="p-4 md:p-8 lg:p-12 space-y-8 relative z-10">
        {/* Header with Greeting */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-xl shadow-emerald-500/25">
              <Sparkles size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                Welcome back, <span className="bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">{userName}
                  {userName}
                </span>!
              </h1>
              <p className="text-slate-400 text-lg">Here's your nutrition journey this week</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat Card 1 */}
          <Card className="group relative p-6 bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 shadow-xl hover:shadow-emerald-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">Total Scans</span>
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                  <Zap size={22} className="text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-black text-white">{dashboardStats.totalScans}</div>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <TrendingUp size={14} />
                  Total all time
                </p>
              </div>
            </div>
          </Card>

          {/* Stat Card 2 */}
          <Card className="group relative p-6 bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 shadow-xl hover:shadow-teal-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">Healthy Choices</span>
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/25 group-hover:scale-110 transition-transform">
                  <Target size={22} className="text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-black text-white">{dashboardStats.healthyChoices}</div>
                <p className="text-xs text-teal-400 flex items-center gap-1">
                  <Award size={14} />
                  {Math.round((dashboardStats.healthyChoices / dashboardStats.totalScans) * 100) || 0}% success rate
                </p>
              </div>
            </div>
          </Card>

          {/* Stat Card 3 */}
          <Card className="group relative p-6 bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 shadow-xl hover:shadow-cyan-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">Avg Health Score</span>
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-110 transition-transform">
                  <Activity size={22} className="text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-black text-white">{dashboardStats.averageScore}</div>
                <p className="text-xs text-cyan-400 flex items-center gap-1">
                  <TrendingUp size={14} />
                  Overall health score
                </p>
              </div>
            </div>
          </Card>

          {/* Stat Card 4 */}
          <Card className="group relative p-6 bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 shadow-xl hover:shadow-emerald-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">Streak</span>
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                  <Calendar size={22} className="text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-black text-white">{dashboardStats.streak}</div>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  {dashboardStats.streak > 0 ? "🔥 days in a row" : "Start your streak!"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Weekly Activity Chart */}
          <Card className="p-6 bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-emerald-500/20 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Weekly Activity</h3>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-xs font-semibold text-emerald-400">7 Days</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardStats.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #10b981",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(16, 185, 129, 0.2)",
                    }}
                    labelStyle={{ color: "#fff", fontWeight: "bold" }}
                  />
                  <Bar dataKey="scans" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="healthy" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-slate-400">Total Scans</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  <span className="text-xs text-slate-400">Healthy Items</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Health Score Trend Chart */}
          <Card className="p-6 bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-teal-500/20 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Health Score Trend</h3>
                <div className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30">
                  <span className="text-xs font-semibold text-teal-400">Trending ↗</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardStats.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #14b8a6",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(20, 184, 166, 0.2)",
                    }}
                    labelStyle={{ color: "#fff", fontWeight: "bold" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="healthy" 
                    stroke="#14b8a6" 
                    strokeWidth={3} 
                    dot={{ fill: "#14b8a6", r: 5 }}
                    activeDot={{ r: 7, fill: "#06b6d4" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Recent Scans */}
        <RecentScans scans={dashboardStats.recentScans} />

        {/* CTA Banner */}
        <div className="relative p-8 md:p-10 rounded-2xl border border-emerald-500/30 bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-white">Ready to scan more?</h3>
              <p className="text-slate-400 text-lg">Start scanning your food items to get instant health insights</p>
            </div>
            <Link href="/dashboard/scanner">
              <Button className="bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white gap-2 px-8 py-6 text-lg font-bold shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all">
                Open Scanner <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
