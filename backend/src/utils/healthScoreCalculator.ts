// ============================================
// NutriGo Health Score Calculator v3
// ============================================
// Author: NutriGo AI Core
// Purpose: Advanced, category-based nutrition health scoring logic.
// Works seamlessly with productDataHandler.ts and scan.controller.ts
// ============================================

export type FoodCategory =
  | 'beverage'
  | 'snack'
  | 'dairy'
  | 'packaged_food'
  | 'breakfast_cereal'
  | 'frozen_food'
  | 'condiment'
  | 'dessert'

export interface NutritionData {
  name?: string
  brand?: string
  barcode?: string
  calories: number
  sugar: number
  protein: number
  fat: number
  saturatedFat?: number
  transFat?: number
  sodium: number
  fiber?: number
  carbs: number
  servingSize: number
  category: FoodCategory
  addedSugar?: number
  ingredients?: string[]
  warnings?: string[]
}

// ============================================
// MAIN ENTRY: calculateHealthScore()
// ============================================

export function calculateHealthScore(data: NutritionData): number {
  const category = data.category

  // Normalize numeric fields
  const normalized = normalizeData(data)

  // Select scoring logic by category
  switch (category) {
    case 'beverage':
      return calculateBeverageScore(normalized)
    case 'snack':
      return calculateSnackScore(normalized)
    case 'dairy':
      return calculateDairyScore(normalized)
    case 'packaged_food':
      return calculatePackagedFoodScore(normalized)
    case 'breakfast_cereal':
      return calculateCerealScore(normalized)
    case 'frozen_food':
      return calculateFrozenFoodScore(normalized)
    case 'condiment':
      return calculateCondimentScore(normalized)
    case 'dessert':
      return calculateDessertScore(normalized)
    default:
      return calculateGeneralScore(normalized)
  }
}

// ============================================
// NORMALIZATION
// Ensures consistent units (mg, g, kcal)
// ============================================

function normalizeData(data: NutritionData): NutritionData {
  return {
    ...data,
    calories: data.calories || 0,
    sugar: data.sugar || 0,
    protein: data.protein || 0,
    fat: data.fat || 0,
    saturatedFat: data.saturatedFat || 0,
    transFat: data.transFat || 0,
    sodium: data.sodium || 0, // should already be mg
    fiber: data.fiber || 0,
    carbs: data.carbs || 0,
    servingSize: data.servingSize || 100,
  }
}

// ============================================
// SCORING HELPERS
// ============================================

function clampScore(s: number): number {
  return Math.max(0, Math.min(100, Math.round(s)))
}

function applyBonus(s: number, amount: number): number {
  return clampScore(s + amount)
}

function applyPenalty(s: number, amount: number): number {
  return clampScore(s - amount)
}

// ============================================
// BEVERAGE SCORING
// ============================================

function calculateBeverageScore(d: NutritionData): number {
  let s = 100

  const sugarPer100ml = (d.sugar / d.servingSize) * 100
  const caloriesPer100ml = (d.calories / d.servingSize) * 100

  // Sugar penalties
  if (sugarPer100ml > 15) s -= 50
  else if (sugarPer100ml > 10) s -= 35
  else if (sugarPer100ml > 5) s -= 20
  else if (sugarPer100ml > 2) s -= 10

  // Calories
  if (caloriesPer100ml > 60) s -= 20
  else if (caloriesPer100ml > 40) s -= 10

  // Sodium (per 100ml)
  if (d.sodium > 100) s -= 10

  // Protein bonus (milk drinks)
  if (d.protein > 5) s += 10
  else if (d.protein > 3) s += 5

  // Artificial sweetener suspicion
  if (d.addedSugar === 0 && d.calories > 5) s -= 5

  return clampScore(s)
}

// ============================================
// SNACK SCORING
// ============================================

function calculateSnackScore(d: NutritionData): number {
  let s = 100

  // Calories per serving
  if (d.calories > 300) s -= 25
  else if (d.calories > 200) s -= 15
  else if (d.calories > 150) s -= 8

  // Fat penalty
  if (d.fat > 20) s -= 20
  else if (d.fat > 15) s -= 12
  else if (d.fat > 10) s -= 6

  // Saturated + Trans fats
  if (d.saturatedFat && d.saturatedFat > 5) s -= 10
  if (d.transFat && d.transFat > 0) s -= 20

  // Sugar
  if (d.sugar > 15) s -= 20
  else if (d.sugar > 10) s -= 12
  else if (d.sugar > 5) s -= 6

  // Sodium (mg)
  if (d.sodium > 600) s -= 15
  else if (d.sodium > 400) s -= 10
  else if (d.sodium > 200) s -= 6

  // Protein & Fiber bonuses
  if (d.protein > 8) s += 10
  else if (d.protein > 5) s += 5

  if (d.fiber && d.fiber > 4) s += 10

  return clampScore(s)
}

// ============================================
// DAIRY SCORING
// ============================================

function calculateDairyScore(d: NutritionData): number {
  let s = 100

  // Sugar (per 100g)
  if (d.sugar > 20) s -= 30
  else if (d.sugar > 12) s -= 18
  else if (d.sugar > 8) s -= 10

  // Fat
  if (d.fat > 10) s -= 12
  else if (d.fat < 1) s -= 5

  // Saturated fat
  if (d.saturatedFat && d.saturatedFat > 8) s -= 15

  // Protein bonus
  if (d.protein > 15) s += 20
  else if (d.protein > 10) s += 15
  else if (d.protein > 6) s += 10
  else if (d.protein < 3) s -= 10

  // Sodium
  if (d.sodium > 200) s -= 10

  return clampScore(s)
}

// ============================================
// PACKAGED FOOD SCORING
// ============================================

function calculatePackagedFoodScore(d: NutritionData): number {
  let s = 100

  if (d.calories > 400) s -= 25
  else if (d.calories > 300) s -= 15

  if (d.sodium > 800) s -= 25
  else if (d.sodium > 500) s -= 15

  if (d.fat > 25) s -= 20
  if (d.saturatedFat && d.saturatedFat > 8) s -= 10
  if (d.transFat && d.transFat > 0) s -= 25

  if (d.sugar > 12) s -= 18
  else if (d.sugar > 8) s -= 10

  if (d.protein > 15) s += 10
  if (d.fiber && d.fiber > 6) s += 10

  return clampScore(s)
}

// ============================================
// BREAKFAST CEREAL SCORING
// ============================================

function calculateCerealScore(d: NutritionData): number {
  let s = 100

  // Sugar
  if (d.sugar > 15) s -= 40
  else if (d.sugar > 10) s -= 25
  else if (d.sugar > 6) s -= 15
  else if (d.sugar > 3) s -= 8

  // Fiber
  if (d.fiber && d.fiber > 8) s += 20
  else if (d.fiber && d.fiber > 5) s += 15
  else if (d.fiber && d.fiber > 3) s += 10
  else if (d.fiber && d.fiber < 2) s -= 10

  // Protein
  if (d.protein > 8) s += 15
  else if (d.protein > 5) s += 10

  // Sodium
  if (d.sodium > 300) s -= 15
  else if (d.sodium > 200) s -= 8

  return clampScore(s)
}

// ============================================
// FROZEN FOOD SCORING
// ============================================

function calculateFrozenFoodScore(d: NutritionData): number {
  let s = 100

  if (d.sodium > 1000) s -= 35
  else if (d.sodium > 700) s -= 25
  else if (d.sodium > 500) s -= 15

  if (d.calories > 500) s -= 20
  else if (d.calories > 350) s -= 12

  if (d.fat > 25) s -= 18
  if (d.saturatedFat && d.saturatedFat > 10) s -= 15
  if (d.sugar > 10) s -= 15

  if (d.protein > 20) s += 15
  else if (d.protein > 12) s += 10

  if (d.fiber && d.fiber > 5) s += 10

  return clampScore(s)
}

// ============================================
// CONDIMENT SCORING
// ============================================

function calculateCondimentScore(d: NutritionData): number {
  let s = 100

  if (d.sodium > 1000) s -= 35
  else if (d.sodium > 600) s -= 25
  else if (d.sodium > 400) s -= 15

  if (d.sugar > 10) s -= 25
  else if (d.sugar > 5) s -= 15
  else if (d.sugar > 2) s -= 8

  if (d.calories > 100) s -= 10
  if (d.fat > 15) s -= 10

  return clampScore(s)
}

// ============================================
// DESSERT SCORING
// ============================================

function calculateDessertScore(d: NutritionData): number {
  let s = 70

  if (d.sugar > 30) s -= 30
  else if (d.sugar > 20) s -= 20
  else if (d.sugar > 15) s -= 12

  if (d.calories > 400) s -= 20
  else if (d.calories > 300) s -= 12

  if (d.fat > 20) s -= 15
  if (d.saturatedFat && d.saturatedFat > 12) s -= 15
  if (d.transFat && d.transFat > 0) s -= 20

  if (d.protein > 5) s += 10

  return clampScore(s)
}

// ============================================
// GENERAL / FALLBACK SCORING
// ============================================

function calculateGeneralScore(d: NutritionData): number {
  let s = 100

  if (d.calories > 300) s -= 15
  if (d.sugar > 15) s -= 20
  if (d.sodium > 500) s -= 20
  if (d.fat > 15) s -= 15
  if (d.protein > 10) s += 10
  if (d.fiber && d.fiber > 5) s += 10

  return clampScore(s)
}

// ============================================
// INTERPRETATION: Text + Color
// ============================================

export function getScoreInterpretation(score: number): {
  rating: string
  message: string
  color: string
} {
  if (score >= 85)
    return {
      rating: 'Excellent',
      message: 'This product meets excellent nutritional standards.',
      color: 'emerald',
    }
  if (score >= 70)
    return {
      rating: 'Good',
      message: 'A good nutritional choice overall.',
      color: 'teal',
    }
  if (score >= 50)
    return {
      rating: 'Moderate',
      message: 'Has moderate nutrition balance; consume occasionally.',
      color: 'cyan',
    }
  if (score >= 30)
    return {
      rating: 'Poor',
      message: 'High sugar, fat, or sodium. Consider limiting intake.',
      color: 'orange',
    }
  return {
    rating: 'Very Poor',
    message: 'Unhealthy. Contains excessive fats, sugar, or sodium.',
    color: 'red',
  }
}

// ============================================
// CONFIDENCE BOOST (Optional Integration)
// If product data completeness < 70%, reduce score reliability
// ============================================

export function adjustScoreByConfidence(score: number, confidence?: number): number {
  if (!confidence) return score
  const penalty = confidence < 80 ? (80 - confidence) * 0.3 : 0
  return clampScore(score - penalty)
}
