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
    }
    ingredients: string[]
    warnings: string[]
    timestamp?: string
  }
  onReset: () => void
}


export default function ScanResult({ data, onReset }: ScanResultProps) {
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
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="p-4 md:p-8 lg:p-12 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Button 
            onClick={onReset} 
            variant="ghost" 
            className="gap-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-all px-4 py-2 rounded-xl"
          >
            <ArrowLeft size={20} /> Back to Scanner
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-700 hover:border-emerald-500/50 bg-slate-800/50 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 gap-2 transition-all px-4 py-2 rounded-xl">
              <Heart size={18} /> Save
            </Button>
            <Button variant="outline" className="border-slate-700 hover:border-teal-500/50 bg-slate-800/50 hover:bg-teal-500/10 text-slate-300 hover:text-teal-400 gap-2 transition-all px-4 py-2 rounded-xl">
              <Share2 size={18} /> Share
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <Card className="p-8 md:p-10 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-emerald-500/20 shadow-xl">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-sm text-slate-500 font-semibold">{data.brand}</p>
              <h1 className="text-4xl md:text-5xl font-black text-white">{data.name}</h1>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-400" />
                Scanned {data.timestamp}
              </p>
            </div>

            {/* Health Score */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div
                className={`relative w-40 h-40 rounded-2xl ${getScoreBg(data.healthScore)} border-2 flex items-center justify-center shadow-xl`}
              >
                <div className="text-center">
                  <div className={`text-6xl font-black bg-gradient-to-r ${getScoreGradient(data.healthScore)} bg-clip-text text-transparent`}>
                    {data.healthScore}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-semibold">Health Score</p>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500 font-semibold">Overall Rating</p>
                  <p className={`text-2xl font-black ${getScoreColor(data.healthScore)}`}>
                    {data.healthScore >= 70
                      ? "Excellent Choice ⭐"
                      : data.healthScore >= 50
                        ? "Moderate ⚠️"
                        : "Not Recommended ❌"}
                  </p>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {data.healthScore >= 70
                    ? "This product is a great choice for your health! It meets high nutritional standards."
                    : data.healthScore >= 50
                      ? "This product has some nutritional concerns. Consider limiting consumption."
                      : "Consider healthier alternatives for this product. High in unhealthy ingredients."}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Nutrition Facts & Warnings */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Nutrition Facts */}
          <Card className="p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-teal-500/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-white">Nutrition Facts</h3>
            </div>
            <div className="space-y-3">
            {[
              { label: "Calories", value: `${data.nutrition?.calories ?? "N/A"} kcal`, color: "text-white" },
              { label: "Sugar", value: `${data.nutrition?.sugar ?? "N/A"}g`, color: "text-red-400" },
              { label: "Protein", value: `${data.nutrition?.protein ?? "N/A"}g`, color: "text-emerald-400" },
              { label: "Fat", value: `${data.nutrition?.fat ?? "N/A"}g`, color: "text-white" },
              { label: "Carbs", value: `${data.nutrition?.carbs ?? "N/A"}g`, color: "text-white" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-teal-500/40 transition-all"
              >
                <span className="text-slate-400">{item.label}</span>
                <span className={`font-black text-lg ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>

          </Card>

          {/* Warnings */}
          <Card className="p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-red-500/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <AlertCircle size={20} className="text-red-400" />
              </div>
              <h3 className="text-xl font-black text-white">Health Warnings</h3>
            </div>
            <div className="space-y-3">
            {Array.isArray(data.warnings)
              ? data.warnings.map((warning: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                  >
                    <span className="text-red-400 font-semibold">{warning}</span>
                  </div>
                ))
              : typeof data.warnings === "string"
              ? (data.warnings as string)
                  .split(",")
                  .map((warning: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                    >
                      <span className="text-red-400 font-semibold">
                        {warning.trim()}
                      </span>
                    </div>
                  ))
              : null}
          </div>

          </Card>
        </div>

        {/* Ingredients */}
        <Card className="p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/20 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <CheckCircle size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-black text-white">Ingredients</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {(data.ingredients ?? []).length > 0 ? (
              data.ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-sm"
                >
                  {ingredient}
                </span>
              ))
            ) : (
              <span className="text-slate-400 italic">No ingredients info available</span>
            )}
          </div>
        </Card>

        {/* CTA */}
        <div className="relative p-8 md:p-10 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 overflow-hidden shadow-xl">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>
          </div>
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <h3 className="text-3xl font-black text-white">Looking for healthier alternatives?</h3>
              <p className="text-slate-400 text-lg">Discover similar products with better nutritional value</p>
            </div>
            <Link href="/dashboard/alternatives">
              <Button className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold px-8 py-6 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 border-0 text-lg">
                Find Alternatives
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
