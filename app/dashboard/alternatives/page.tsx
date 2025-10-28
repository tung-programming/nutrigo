"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, ShoppingCart } from "lucide-react"
import { useState } from "react"

interface Alternative {
  id: number
  name: string
  brand: string
  score: number
  price: string
  calories: number
  sugar: number
  improvement: number
  category: string
  available: boolean
}

const mockAlternatives: Alternative[] = [
  {
    id: 1,
    name: "Almond Milk",
    brand: "Silk",
    score: 85,
    price: "₹120",
    calories: 30,
    sugar: 0,
    improvement: 60,
    category: "Beverage",
    available: true,
  },
  {
    id: 2,
    name: "Unsweetened Coconut Water",
    brand: "Coco Zen",
    score: 82,
    price: "₹80",
    calories: 45,
    sugar: 9,
    improvement: 57,
    category: "Beverage",
    available: true,
  },
  {
    id: 3,
    name: "Fresh Orange Juice",
    brand: "Local Farm",
    score: 78,
    price: "₹60",
    calories: 85,
    sugar: 21,
    improvement: 53,
    category: "Beverage",
    available: true,
  },
  {
    id: 4,
    name: "Green Tea",
    brand: "Organic Wellness",
    score: 88,
    price: "₹150",
    calories: 2,
    sugar: 0,
    improvement: 63,
    category: "Beverage",
    available: true,
  },
  {
    id: 5,
    name: "Protein Smoothie",
    brand: "NutriBlend",
    score: 84,
    price: "₹180",
    calories: 200,
    sugar: 8,
    improvement: 59,
    category: "Beverage",
    available: true,
  },
  {
    id: 6,
    name: "Sparkling Water",
    brand: "AquaFresh",
    score: 92,
    price: "₹40",
    calories: 0,
    sugar: 0,
    improvement: 67,
    category: "Beverage",
    available: true,
  },
]

export default function AlternativesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"score" | "improvement" | "price">("score")
  const [selectedProduct, setSelectedProduct] = useState<Alternative | null>(null)

  const filteredAlternatives = mockAlternatives
    .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "score") return b.score - a.score
      if (sortBy === "improvement") return b.improvement - a.improvement
      return 0
    })

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent"
    if (score >= 60) return "text-primary"
    return "text-destructive"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-accent/20"
    if (score >= 60) return "bg-primary/20"
    return "bg-destructive/20"
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Healthier Alternatives</h1>
        <p className="text-muted-foreground">Discover better options for your favorite products</p>
      </div>

      {/* Search and Sort */}
      <Card className="p-6 border-border bg-card/50 backdrop-blur-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
            <Input
              placeholder="Search alternatives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 border-border"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "score" | "improvement" | "price")}
            className="px-4 py-2 rounded-lg bg-background/50 border border-border text-foreground"
          >
            <option value="score">Sort by Health Score</option>
            <option value="improvement">Sort by Improvement</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>
      </Card>

      {/* Alternatives Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlternatives.map((alt) => (
          <Card
            key={alt.id}
            className="p-6 border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition cursor-pointer group"
            onClick={() => setSelectedProduct(alt)}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition">{alt.name}</h3>
                  <p className="text-sm text-muted-foreground">{alt.brand}</p>
                </div>
                <div
                  className={`px-3 py-1 rounded-lg font-bold text-lg ${getScoreBg(alt.score)} ${getScoreColor(alt.score)}`}
                >
                  {alt.score}
                </div>
              </div>

              {/* Improvement Badge */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/30">
                <TrendingUp size={16} className="text-accent" />
                <span className="text-sm font-semibold text-accent">+{alt.improvement}% Better</span>
              </div>

              {/* Nutrition Info */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 rounded bg-background/50">
                  <p className="text-muted-foreground text-xs">Calories</p>
                  <p className="font-semibold text-foreground">{alt.calories}</p>
                </div>
                <div className="p-2 rounded bg-background/50">
                  <p className="text-muted-foreground text-xs">Sugar</p>
                  <p className="font-semibold text-foreground">{alt.sugar}g</p>
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="font-semibold text-foreground">{alt.price}</span>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground gap-1"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <ShoppingCart size={16} /> Buy
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Comparison Section */}
      {selectedProduct && (
        <Card className="p-8 border-border bg-card/50 backdrop-blur-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-foreground">Detailed Comparison</h3>
            <Button
              variant="ghost"
              onClick={() => setSelectedProduct(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Original Product */}
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Original Product</p>
                <h4 className="text-xl font-bold text-foreground">Coca Cola</h4>
                <p className="text-sm text-muted-foreground">The Coca-Cola Company</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-muted-foreground">Health Score</span>
                  <span className="font-bold text-destructive">25</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-muted-foreground">Calories</span>
                  <span className="font-bold text-foreground">140</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-muted-foreground">Sugar</span>
                  <span className="font-bold text-destructive">39g</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-bold text-foreground">₹50</span>
                </div>
              </div>
            </div>

            {/* Alternative Product */}
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Recommended Alternative</p>
                <h4 className="text-xl font-bold text-foreground">{selectedProduct.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedProduct.brand}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-muted-foreground">Health Score</span>
                  <span className={`font-bold ${getScoreColor(selectedProduct.score)}`}>{selectedProduct.score}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-muted-foreground">Calories</span>
                  <span className="font-bold text-accent">{selectedProduct.calories}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-muted-foreground">Sugar</span>
                  <span className="font-bold text-accent">{selectedProduct.sugar}g</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-bold text-foreground">{selectedProduct.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="p-6 rounded-lg bg-accent/10 border border-accent/30 space-y-3">
            <h4 className="font-semibold text-foreground">Why This Alternative?</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-accent font-bold">✓</span>
                <span>{selectedProduct.improvement}% healthier based on nutritional analysis</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">✓</span>
                <span>Significantly lower sugar content ({selectedProduct.sugar}g vs 39g)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">✓</span>
                <span>Fewer calories ({selectedProduct.calories} vs 140)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">✓</span>
                <span>No artificial sweeteners or harmful additives</span>
              </li>
            </ul>
          </div>

          <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground gap-2">
            <ShoppingCart size={18} /> Buy {selectedProduct.name} Now
          </Button>
        </Card>
      )}

      {/* Tips Section */}
      <Card className="p-6 border-border bg-card/50 backdrop-blur-sm space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Tips for Choosing Healthier Alternatives</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-background/50 space-y-2">
            <p className="font-semibold text-foreground">Read Labels Carefully</p>
            <p className="text-sm text-muted-foreground">
              Check the nutrition facts panel for sugar, sodium, and calories
            </p>
          </div>
          <div className="p-4 rounded-lg bg-background/50 space-y-2">
            <p className="font-semibold text-foreground">Compare Serving Sizes</p>
            <p className="text-sm text-muted-foreground">Make sure you're comparing the same serving sizes</p>
          </div>
          <div className="p-4 rounded-lg bg-background/50 space-y-2">
            <p className="font-semibold text-foreground">Check Ingredients</p>
            <p className="text-sm text-muted-foreground">Fewer ingredients usually means a healthier product</p>
          </div>
          <div className="p-4 rounded-lg bg-background/50 space-y-2">
            <p className="font-semibold text-foreground">Look for Certifications</p>
            <p className="text-sm text-muted-foreground">Organic, non-GMO, and other certifications matter</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
