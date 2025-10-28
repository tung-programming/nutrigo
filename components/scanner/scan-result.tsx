"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, Heart, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

interface ScanResultProps {
  data: {
    name: string
    brand: string
    healthScore: number
    calories: number
    sugar: number
    protein: number
    fat: number
    carbs: number
    ingredients: string[]
    warnings: string[]
    timestamp: string
  }
  onReset: () => void
}

export default function ScanResult({ data, onReset }: ScanResultProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-accent"
    if (score >= 50) return "text-primary"
    return "text-destructive"
  }

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-accent/20"
    if (score >= 50) return "bg-primary/20"
    return "bg-destructive/20"
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={onReset} variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft size={18} /> Back to Scanner
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border hover:bg-muted gap-2 bg-transparent">
            <Heart size={18} /> Save
          </Button>
          <Button variant="outline" className="border-border hover:bg-muted gap-2 bg-transparent">
            <Share2 size={18} /> Share
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <Card className="p-8 border-border bg-card/50 backdrop-blur-sm">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{data.brand}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{data.name}</h1>
            <p className="text-sm text-muted-foreground">Scanned {data.timestamp}</p>
          </div>

          {/* Health Score */}
          <div className="flex items-center gap-6">
            <div
              className={`relative w-32 h-32 rounded-full ${getScoreBg(data.healthScore)} flex items-center justify-center`}
            >
              <div className="text-center">
                <div className={`text-5xl font-bold ${getScoreColor(data.healthScore)}`}>{data.healthScore}</div>
                <p className="text-xs text-muted-foreground mt-1">Health Score</p>
              </div>
            </div>

            <div className="space-y-3 flex-1">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Overall Rating</p>
                <p className="text-lg font-semibold text-foreground">
                  {data.healthScore >= 70
                    ? "Excellent Choice"
                    : data.healthScore >= 50
                      ? "Moderate"
                      : "Not Recommended"}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {data.healthScore >= 70
                  ? "This product is a great choice for your health!"
                  : data.healthScore >= 50
                    ? "This product has some nutritional concerns."
                    : "Consider healthier alternatives for this product."}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Nutrition Facts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border-border bg-card/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Nutrition Facts</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <span className="text-muted-foreground">Calories</span>
              <span className="font-semibold text-foreground">{data.calories} kcal</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <span className="text-muted-foreground">Sugar</span>
              <span className="font-semibold text-destructive">{data.sugar}g</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <span className="text-muted-foreground">Protein</span>
              <span className="font-semibold text-accent">{data.protein}g</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <span className="text-muted-foreground">Fat</span>
              <span className="font-semibold text-foreground">{data.fat}g</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <span className="text-muted-foreground">Carbs</span>
              <span className="font-semibold text-foreground">{data.carbs}g</span>
            </div>
          </div>
        </Card>

        {/* Warnings */}
        <Card className="p-6 border-border bg-card/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-destructive" /> Health Warnings
          </h3>
          <div className="space-y-2">
            {data.warnings.map((warning, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
              >
                <CheckCircle size={18} className="text-destructive mt-0.5 flex-shrink-0" />
                <span className="text-sm text-destructive">{warning}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Ingredients */}
      <Card className="p-6 border-border bg-card/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Ingredients</h3>
        <div className="flex flex-wrap gap-2">
          {data.ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-sm text-primary"
            >
              {ingredient}
            </span>
          ))}
        </div>
      </Card>

      {/* CTA */}
      <div className="relative p-8 rounded-2xl border border-accent/30 bg-gradient-to-r from-accent/10 to-primary/10 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">Looking for healthier alternatives?</h3>
            <p className="text-muted-foreground">Discover similar products with better nutritional value</p>
          </div>
          <Link href="/dashboard/alternatives">
            <Button className="bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white">
              Find Alternatives
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
