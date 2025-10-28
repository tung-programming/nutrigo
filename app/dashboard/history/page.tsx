"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Trash2 } from "lucide-react"
import { useState } from "react"

interface ScanHistory {
  id: number
  name: string
  brand: string
  score: number
  category: string
  date: string
  calories: number
  sugar: number
}

const mockHistory: ScanHistory[] = [
  {
    id: 1,
    name: "Coca Cola",
    brand: "The Coca-Cola Company",
    score: 25,
    category: "Beverage",
    date: "Today",
    calories: 140,
    sugar: 39,
  },
  {
    id: 2,
    name: "Almond Milk",
    brand: "Silk",
    score: 85,
    category: "Beverage",
    date: "Yesterday",
    calories: 30,
    sugar: 0,
  },
  {
    id: 3,
    name: "Granola Bar",
    brand: "Nature Valley",
    score: 45,
    category: "Snack",
    date: "2 days ago",
    calories: 190,
    sugar: 12,
  },
  {
    id: 4,
    name: "Orange Juice",
    brand: "Tropicana",
    score: 65,
    category: "Beverage",
    date: "3 days ago",
    calories: 110,
    sugar: 26,
  },
  {
    id: 5,
    name: "Greek Yogurt",
    brand: "Fage",
    score: 88,
    category: "Dairy",
    date: "4 days ago",
    calories: 100,
    sugar: 7,
  },
  {
    id: 6,
    name: "Potato Chips",
    brand: "Lay's",
    score: 35,
    category: "Snack",
    date: "5 days ago",
    calories: 160,
    sugar: 1,
  },
]

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"date" | "score">("date")

  const filteredHistory = mockHistory
    .filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !filterCategory || item.category === filterCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "score") return b.score - a.score
      return 0
    })

  const categories = Array.from(new Set(mockHistory.map((item) => item.category)))

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
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Scan History</h1>
        <p className="text-muted-foreground">View all your previous food scans and nutrition analysis</p>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 border-border bg-card/50 backdrop-blur-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
            <Input
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 border-border"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "score")}
              className="px-4 py-2 rounded-lg bg-background/50 border border-border text-foreground"
            >
              <option value="date">Sort by Date</option>
              <option value="score">Sort by Score</option>
            </select>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filterCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-background/50 border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filterCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/50 border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </Card>

      {/* History List */}
      <div className="space-y-3">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <Card
              key={item.id}
              className="p-4 border-border bg-card/50 backdrop-blur-sm hover:border-primary/30 transition"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.brand}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {item.date}
                    </span>
                    <span>{item.calories} cal</span>
                    <span>{item.sugar}g sugar</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`px-4 py-2 rounded-lg font-bold text-lg ${getScoreBg(item.score)} ${getScoreColor(item.score)}`}
                  >
                    {item.score}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 border-border bg-card/50 backdrop-blur-sm text-center">
            <p className="text-muted-foreground">No scans found. Start scanning to build your history!</p>
          </Card>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6 border-border bg-card/50 backdrop-blur-sm">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Scans</p>
            <p className="text-3xl font-bold text-foreground">{mockHistory.length}</p>
          </div>
        </Card>

        <Card className="p-6 border-border bg-card/50 backdrop-blur-sm">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Average Score</p>
            <p className="text-3xl font-bold text-accent">
              {Math.round(mockHistory.reduce((sum, item) => sum + item.score, 0) / mockHistory.length)}
            </p>
          </div>
        </Card>

        <Card className="p-6 border-border bg-card/50 backdrop-blur-sm">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Healthy Choices</p>
            <p className="text-3xl font-bold text-accent">{mockHistory.filter((item) => item.score >= 70).length}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
