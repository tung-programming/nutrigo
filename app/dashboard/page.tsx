"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Zap, Target, Calendar, Sparkles, Award, Activity } from "lucide-react"
import Link from "next/link"

const weeklyData = [
  { day: "Mon", scans: 4, healthy: 3 },
  { day: "Tue", scans: 6, healthy: 4 },
  { day: "Wed", scans: 5, healthy: 4 },
  { day: "Thu", scans: 8, healthy: 6 },
  { day: "Fri", scans: 7, healthy: 5 },
  { day: "Sat", scans: 9, healthy: 7 },
  { day: "Sun", scans: 6, healthy: 5 },
]

const recentScans = [
  { id: 1, name: "Coca Cola", score: 25, category: "Beverage", date: "Today", time: "2:30 PM" },
  { id: 2, name: "Almond Milk", score: 85, category: "Beverage", date: "Yesterday", time: "10:15 AM" },
  { id: 3, name: "Granola Bar", score: 45, category: "Snack", date: "2 days ago", time: "3:45 PM" },
  { id: 4, name: "Orange Juice", score: 65, category: "Beverage", date: "3 days ago", time: "8:20 AM" },
]

export default function DashboardPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [userName, setUserName] = useState<string>("User")
  const [userEmail, setUserEmail] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState<string>("")

  
  useEffect(() => {
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-xl shadow-emerald-500/25">
              <Sparkles size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                Welcome back, <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
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
          <Card className="group relative p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 shadow-xl hover:shadow-emerald-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">Total Scans</span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                  <Zap size={22} className="text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-black text-white">45</div>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <TrendingUp size={14} />
                  +12% from last week
                </p>
              </div>
            </div>
          </Card>

          {/* Stat Card 2 */}
          <Card className="group relative p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 shadow-xl hover:shadow-teal-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">Healthy Choices</span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/25 group-hover:scale-110 transition-transform">
                  <Target size={22} className="text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-black text-white">32</div>
                <p className="text-xs text-teal-400 flex items-center gap-1">
                  <Award size={14} />
                  71% success rate
                </p>
              </div>
            </div>
          </Card>

          {/* Stat Card 3 */}
          <Card className="group relative p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 shadow-xl hover:shadow-cyan-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">Avg Health Score</span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-110 transition-transform">
                  <Activity size={22} className="text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-black text-white">68</div>
                <p className="text-xs text-cyan-400 flex items-center gap-1">
                  <TrendingUp size={14} />
                  +5 points this week
                </p>
              </div>
            </div>
          </Card>

          {/* Stat Card 4 */}
          <Card className="group relative p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 shadow-xl hover:shadow-emerald-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">Streak</span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                  <Calendar size={22} className="text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-black text-white">7</div>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  🔥 days in a row
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Weekly Activity Chart */}
          <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-emerald-500/20 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Weekly Activity</h3>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-xs font-semibold text-emerald-400">7 Days</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
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
          <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-teal-500/20 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Health Score Trend</h3>
                <div className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30">
                  <span className="text-xs font-semibold text-teal-400">Trending ↗</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
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
        <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/20 shadow-xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Recent Scans</h3>
              <Link href="/dashboard/history">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white gap-2 shadow-lg shadow-emerald-500/25">
                  View All <ArrowRight size={16} />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {recentScans.map((scan) => (
                <div
                  key={scan.id}
                  className="group flex items-center justify-between p-4 rounded-xl border border-slate-700 hover:border-emerald-500/40 bg-slate-800/50 hover:bg-slate-800/80 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${
                      scan.score >= 70
                        ? "bg-emerald-500/20 text-emerald-400"
                        : scan.score >= 50
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "bg-red-500/20 text-red-400"
                    }`}>
                      {scan.score}
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">{scan.name}</p>
                      <p className="text-sm text-slate-400">
                        {scan.category} • {scan.date} • {scan.time}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" size={20} />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* CTA Banner */}
        <div className="relative p-8 md:p-10 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 overflow-hidden shadow-2xl">
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
              <Button className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white gap-2 px-8 py-6 text-lg font-bold shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all">
                Open Scanner <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
