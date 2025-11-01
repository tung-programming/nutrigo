"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export default function AlternativesPage() {
  const [alternatives, setAlternatives] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const lastScan = localStorage.getItem("lastScan")
    const scan = lastScan ? JSON.parse(lastScan) : null
    const minScore = scan?.healthScore || 50

    fetch(`http://localhost:4000/api/products/alternatives?minScore=${minScore}`)
      .then(res => res.json())
      .then(data => setAlternatives(data.alternatives || []))
      .catch(err => console.error("Failed to fetch alternatives:", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-center text-slate-400 mt-12">Loading healthier alternatives...</p>

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-4xl font-bold text-white mb-4">Healthier Alternatives</h1>

      {alternatives.length === 0 ? (
        <p className="text-slate-400 text-lg">No alternatives found. Try scanning another product.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {alternatives.map((alt, i) => (
            <Card key={i} className="p-6 bg-slate-900/80 border border-emerald-500/20">
              <h2 className="text-xl font-bold text-white">{alt.name}</h2>
              <p className="text-slate-400">{alt.brand}</p>
              <p className="mt-2 text-emerald-400 font-semibold">Health Score: {alt.health_score}</p>
              <p className="text-slate-300 mt-1">Calories: {alt.nutrition?.calories || "N/A"} kcal</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
