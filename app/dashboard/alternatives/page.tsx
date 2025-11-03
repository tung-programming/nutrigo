"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export default function AlternativesPage() {
  const [alternatives, setAlternatives] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const lastScan = localStorage.getItem("lastScan")
    const scan = lastScan ? JSON.parse(lastScan) : null
    const minScore = scan?.healthScore || 50

    fetch(`/api/alternatives?minScore=${minScore}`)
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) {
          console.error(`API Error (${res.status}):`, text);
          throw new Error(`API returned ${res.status}: ${text}`);
        }
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error("Invalid JSON response:", text);
          throw new Error("Invalid JSON response from API");
        }
      })
      .then(data => {
        console.log("✅ Received alternatives:", data);
        setAlternatives(data.alternatives || []);
      })
      .catch(err => {
        console.error("Failed to fetch alternatives:", err);
        setAlternatives([]);
        setError(err.message || "Failed to fetch alternatives");
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-center text-slate-400 mt-12">Loading healthier alternatives...</p>

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-4xl font-bold text-white mb-4">Healthier Alternatives</h1>

      {error ? (
        <div className="text-red-400 text-lg p-4 bg-red-500/10 rounded-lg border border-red-500/20">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">Please try again later or contact support if the issue persists.</p>
        </div>
      ) : alternatives.length === 0 ? (
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
