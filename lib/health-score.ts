// Health score calculation logic

export interface NutritionData {
  calories: number
  sugar: number
  protein: number
  fat: number
  carbs: number
  sodium?: number
  fiber?: number
}

export interface HealthScoreResult {
  score: number
  rating: "excellent" | "good" | "moderate" | "poor"
  warnings: string[]
  recommendations: string[]
}

/**
 * Calculate health score based on nutrition data
 * Score ranges from 0-100
 */
export function calculateHealthScore(nutrition: NutritionData): HealthScoreResult {
  let score = 100
  const warnings: string[] = []
  const recommendations: string[] = []

  // Sugar penalty (max -30 points)
  if (nutrition.sugar > 25) {
    score -= Math.min(30, (nutrition.sugar - 25) * 1.5)
    warnings.push("High Sugar Content")
    recommendations.push("Consider products with less than 10g sugar per serving")
  }

  // Calorie penalty (max -20 points)
  if (nutrition.calories > 300) {
    score -= Math.min(20, (nutrition.calories - 300) * 0.05)
    warnings.push("High Calorie Density")
  }

  // Sodium penalty (max -15 points)
  if (nutrition.sodium && nutrition.sodium > 500) {
    score -= Math.min(15, (nutrition.sodium - 500) * 0.02)
    warnings.push("High Sodium Content")
  }

  // Protein bonus (max +15 points)
  if (nutrition.protein > 5) {
    score += Math.min(15, (nutrition.protein - 5) * 2)
    recommendations.push("Good protein content for muscle maintenance")
  }

  // Fiber bonus (max +10 points)
  if (nutrition.fiber && nutrition.fiber > 3) {
    score += Math.min(10, (nutrition.fiber - 3) * 3)
    recommendations.push("Excellent fiber content for digestive health")
  }

  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, Math.round(score)))

  // Determine rating
  let rating: "excellent" | "good" | "moderate" | "poor"
  if (score >= 80) rating = "excellent"
  else if (score >= 60) rating = "good"
  else if (score >= 40) rating = "moderate"
  else rating = "poor"

  return {
    score,
    rating,
    warnings,
    recommendations,
  }
}

/**
 * Get color for health score
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return "text-accent"
  if (score >= 60) return "text-primary"
  if (score >= 40) return "text-yellow-500"
  return "text-destructive"
}

/**
 * Get background color for health score
 */
export function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-accent/20"
  if (score >= 60) return "bg-primary/20"
  if (score >= 40) return "bg-yellow-500/20"
  return "bg-destructive/20"
}
