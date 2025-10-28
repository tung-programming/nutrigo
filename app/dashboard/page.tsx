"use client"

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Zap, Target, Calendar } from "lucide-react"
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
  { id: 1, name: "Coca Cola", score: 25, category: "Beverage", date: "Today" },
  { id: 2, name: "Almond Milk", score: 85, category: "Beverage", date: "Yesterday" },
  { id: 3, name: "Granola Bar", score: 45, category: "Snack", date: "2 days ago" },
  { id: 4, name: "Orange Juice", score: 65, category: "Beverage", date: "3 days ago" },
]

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Welcome back, User!</h1>
        <p className="text-muted-foreground">Here's your nutrition journey this week</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6 border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Total Scans</span>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-foreground">45</div>
              <p className="text-xs text-accent">+12% from last week</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border bg-card/50 backdrop-blur-sm hover:border-accent/50 transition">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Healthy Choices</span>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <Target size={20} className="text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-foreground">32</div>
              <p className="text-xs text-accent">71% success rate</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border bg-card/50 backdrop-blur-sm hover:border-secondary/50 transition">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Avg Health Score</span>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-foreground">68</div>
              <p className="text-xs text-accent">+5 points this week</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Streak</span>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Calendar size={20} className="text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-foreground">7</div>
              <p className="text-xs text-accent">days in a row</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card className="p-6 border-border bg-card/50 backdrop-blur-sm">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="scans" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="healthy" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Health Score Trend */}
        <Card className="p-6 border-border bg-card/50 backdrop-blur-sm">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Health Score Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="healthy" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Scans */}
      <Card className="p-6 border-border bg-card/50 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Recent Scans</h3>
            <Link href="/dashboard/history">
              <Button variant="ghost" className="text-primary hover:bg-primary/10 gap-2">
                View All <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentScans.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 bg-background/50 transition"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">{scan.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {scan.category} • {scan.date}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      scan.score >= 70
                        ? "bg-accent/20 text-accent"
                        : scan.score >= 50
                          ? "bg-primary/20 text-primary"
                          : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {scan.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* CTA */}
      <div className="relative p-8 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">Ready to scan more?</h3>
            <p className="text-muted-foreground">Start scanning your food items to get instant health insights</p>
          </div>
          <Link href="/dashboard/scanner">
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground gap-2">
              Open Scanner <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
