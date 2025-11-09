"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, Heart, AlertCircle, CheckCircle, Sparkles, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

interface ScanResultProps {
  data: {
    name: string
    brand: string
    healthScore: number
    nutrition?: {
      calories?: number
      sugar?: number
      protein?: number
      fat?: number
      carbs?: number
    } | null
    calories?: number
    sugar?: number
    protein?: number
    fat?: number
    carbs?: number
    ingredients?: string[] | string
    warnings?: string[] | string
    timestamp?: string
  }
  onReset: () => void
}

export default function ScanResult({ data, onReset }: ScanResultProps) {
  // 🧠 Normalize nutrition data (support flat responses too)
  const nutrition = data.nutrition ?? {
    calories: data.calories ?? 0,
    sugar: data.sugar ?? 0,
    protein: data.protein ?? 0,
    fat: data.fat ?? 0,
    carbs: data.carbs ?? 0,
  }

  // 🧪 Normalize ingredients (handle string or array)
  const ingredients =
    typeof data.ingredients === "string"
      ? data.ingredients
          .split(/[.,;•\n]/)
          .map((i) => i.trim())
          .filter(Boolean)
      : data.ingredients ?? []

  // 🚨 Generate meaningful warnings if API doesn’t provide
  let warnings: string[] = []
  const providedWarnings =
    typeof data.warnings === "string"
      ? data.warnings.split(/[.,\n]/).map((w) => w.trim()).filter(Boolean)
      : Array.isArray(data.warnings)
      ? data.warnings
      : []

  if (providedWarnings.length > 0) {
    warnings = providedWarnings
  } else {
    if (nutrition.sugar > 25) warnings.push("High sugar content — may contribute to weight gain.")
    if (nutrition.fat > 17) warnings.push("High fat content — limit consumption if watching calories.")
    if (nutrition.protein < 5) warnings.push("Low protein content — may not be filling or nutritious.")
    if (nutrition.calories > 400) warnings.push("High calorie product — consider moderation.")
    if (ingredients.length === 0) warnings.push("Ingredients list not found — scan label more clearly.")
    if (warnings.length === 0) warnings.push("No significant health warnings detected ✅")
  }

  // 🌈 Health score gradient helpers
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-400"
    if (score >= 50) return "text-cyan-400"
    return "text-red-400"
  }

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/40"
    if (score >= 50) return "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/40"
    return "bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/40"
  }

  const getScoreGradient = (score: number) => {
    if (score >= 70) return "from-emerald-400 via-teal-400 to-cyan-400"
    if (score >= 50) return "from-cyan-400 via-blue-400 to-purple-400"
    return "from-red-400 via-orange-400 to-yellow-400"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Button onClick={onReset} variant="ghost" className="gap-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <ArrowLeft size={20} /> Back
          </Button>
          <div className="flex gap-2 sm:gap-3">
            <Button variant="outline" className="border border-slate-700 hover:border-emerald-500/50 bg-slate-800/50 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400">
              <Heart size={16} /> Save
            </Button>
            <Button variant="outline" className="border border-slate-700 hover:border-teal-500/50 bg-slate-800/50 hover:bg-teal-500/10 text-slate-300 hover:text-teal-400">
              <Share2 size={16} /> Share
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-emerald-500/20">
          <div className="space-y-4">
            <p className="text-xs text-slate-500 uppercase">{data.brand}</p>
            <h1 className="text-4xl font-black text-white">{data.name}</h1>
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-400" /> Scanned {data.timestamp ?? "just now"}
            </p>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className={`relative w-36 h-36 rounded-2xl ${getScoreBg(data.healthScore)} border flex items-center justify-center`}>
                <div className={`text-6xl font-black bg-gradient-to-r ${getScoreGradient(data.healthScore)} bg-clip-text text-transparent`}>
                  {data.healthScore}
                </div>
              </div>
              <div className="space-y-2 text-slate-300">
                <p className={`text-xl font-bold ${getScoreColor(data.healthScore)}`}>
                  {data.healthScore >= 70
                    ? "Excellent Choice ⭐"
                    : data.healthScore >= 50
                    ? "Moderate ⚠️"
                    : "Not Recommended ❌"}
                </p>
                <p className="text-sm">
                  {data.healthScore >= 70
                    ? "This product meets high nutritional standards."
                    : data.healthScore >= 50
                    ? "Some nutritional concerns. Limit consumption."
                    : "Consider healthier alternatives."}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Nutrition Facts + Warnings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nutrition */}
          <Card className="p-6 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-teal-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-white">Nutrition Facts</h3>
            </div>

            <div className="space-y-3">
              {[
                { label: "Calories", value: `${nutrition.calories ?? 0} kcal`, color: "text-slate-200", icon: "⚡" },
                { label: "Sugar", value: `${nutrition.sugar ?? 0}g`, color: "text-red-400", icon: "🍬" },
                { label: "Protein", value: `${nutrition.protein ?? 0}g`, color: "text-emerald-400", icon: "💪" },
                { label: "Fat", value: `${nutrition.fat ?? 0}g`, color: "text-amber-400", icon: "🧈" },
                { label: "Carbs", value: `${nutrition.carbs ?? 0}g`, color: "text-blue-400", icon: "🌾" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm text-slate-400">{item.label}</span>
                  </div>
                  <span className={`font-black text-lg ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Warnings */}
          <Card className="p-6 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-red-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <AlertCircle size={20} className="text-red-400" />
              </div>
              <h3 className="text-xl font-black text-white">Health Warnings</h3>
            </div>

            <div className="space-y-3">
              {warnings.map((warning, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <span className="text-red-400 font-bold text-lg">⚠</span>
                  <span className="text-sm text-red-200">{warning}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Ingredients */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-cyan-500/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <CheckCircle size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-black text-white">Ingredients</h3>
          </div>

          {ingredients.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {ingredients.map((ing, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-sm font-medium">
                  {ing}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic">No ingredients info available</p>
          )}
        </Card>

        {/* CTA */}
        <div className="p-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Want healthier alternatives?</h3>
              <p className="text-slate-400">Discover products with better nutritional value.</p>
            </div>
            <Link href="/dashboard/alternatives">
              <Button className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold px-6 py-4">
                Find Alternatives <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
