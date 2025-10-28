// Application constants

export const APP_NAME = "NutriGo"
export const APP_DESCRIPTION = "Decode Your Food, Redefine Your Health"

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  SCANNER: "/dashboard/scanner",
  HISTORY: "/dashboard/history",
  ALTERNATIVES: "/dashboard/alternatives",
  PROFILE: "/dashboard/profile",
  SETTINGS: "/dashboard/settings",
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
}

export const HEALTH_SCORE_RANGES = {
  EXCELLENT: { min: 80, max: 100, label: "Excellent" },
  GOOD: { min: 60, max: 79, label: "Good" },
  MODERATE: { min: 40, max: 59, label: "Moderate" },
  POOR: { min: 0, max: 39, label: "Poor" },
}

export const PRODUCT_CATEGORIES = ["Beverage", "Snack", "Dairy", "Bakery", "Frozen", "Canned", "Condiments", "Other"]

export const NUTRITION_GUIDELINES = {
  DAILY_CALORIES: 2000,
  MAX_SUGAR_PER_DAY: 50,
  MAX_SODIUM_PER_DAY: 2300,
  MIN_PROTEIN_PER_DAY: 50,
  MIN_FIBER_PER_DAY: 25,
}
