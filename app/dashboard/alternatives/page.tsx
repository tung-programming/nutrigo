"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, Sparkles, Apple, Coffee, Cookie, Milk, Wheat, Fish } from "lucide-react"
import { healthyAlternatives } from "@/lib/mockAlternatives"

interface Alternative {
  name: string
  brand: string
  health_score: number
  nutrition: {
    calories: number
    [key: string]: any
  }
  benefits: string[]
  description: string
}

export default function AlternativesPage() {
  const [currentCategory, setCurrentCategory] = useState("snacks")
  const [alternatives, setAlternatives] = useState<Alternative[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Get alternatives for the current category
      const categoryAlternatives = healthyAlternatives[currentCategory as keyof typeof healthyAlternatives] || []
      setAlternatives(categoryAlternatives)
      setLoading(false)
    } catch (err) {
      console.error("Failed to get alternatives:", err)
      setError("Failed to load alternatives")
      setLoading(false)
    }
  }, [currentCategory])

  const CategoryIcon = {
    snacks: Apple,
    beverages: Coffee,
    sweets: Cookie,
    dairy: Milk,
    grains: Wheat,
    proteins: Fish,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin">
            <Sparkles className="w-8 h-8 mx-auto mt-3 text-emerald-400" />
          </div>
          <p className="text-slate-400 text-lg">Finding healthier alternatives...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 lg:p-12 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-linear-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-xl shadow-emerald-500/25">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white">Healthy Alternatives</h1>
            <p className="text-slate-400 text-lg">Discover nutritious options for your favorite foods</p>
          </div>
        </div>
      </div>

      {error ? (
        <div className="text-red-400 text-lg p-6 bg-red-500/10 rounded-xl border border-red-500/20">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">Please try again later or contact support if the issue persists.</p>
        </div>
      ) : (
        <Tabs defaultValue={currentCategory} onValueChange={setCurrentCategory} className="space-y-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 bg-slate-900/50 p-2 rounded-xl">
            {Object.keys(healthyAlternatives).map((category) => {
              const Icon = CategoryIcon[category as keyof typeof CategoryIcon]
              return (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {Object.keys(healthyAlternatives).map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {alternatives.map((alt, i) => (
                  <Card
                    key={i}
                    className="group relative p-6 bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 shadow-xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{alt.name}</h2>
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                          <span className="text-xl font-black text-emerald-400">{alt.health_score}</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-slate-400">{alt.brand}</p>
                        <p className="text-sm text-slate-500 mt-1">{alt.description}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="shrink-0 w-2 h-2 rounded-full bg-emerald-500"></div>
                          <p className="text-sm text-slate-300">
                            Calories: <span className="text-emerald-400 font-semibold">{alt.nutrition?.calories} kcal</span>
                          </p>
                        </div>
                        {Object.entries(alt.nutrition)
                          .filter(([key]) => key !== "calories")
                          .map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                              <div className="shrink-0 w-2 h-2 rounded-full bg-emerald-500"></div>
                              <p className="text-sm text-slate-300">
                                {key.charAt(0).toUpperCase() + key.slice(1)}: <span className="text-emerald-400 font-semibold">{value}</span>
                              </p>
                            </div>
                          ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {alt.benefits.map((benefit, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
