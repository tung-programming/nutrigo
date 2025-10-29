import { config } from '../config';

interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

interface Ingredients {
  [key: string]: number; // ingredient name to percentage
}

export function calculateHealthScore(
  nutritionInfo: NutritionInfo,
  ingredients: Ingredients,
  additives: string[]
): number {
  // Base score out of 100
  let score = 100;

  // Nutrition scoring (50% of total)
  const nutritionScore = calculateNutritionScore(nutritionInfo);
  
  // Ingredients scoring (30% of total)
  const ingredientsScore = calculateIngredientsScore(ingredients);
  
  // Additives scoring (20% of total)
  const additivesScore = calculateAdditivesScore(additives);

  // Weighted average
  score = (nutritionScore * 0.5) + (ingredientsScore * 0.3) + (additivesScore * 0.2);

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateNutritionScore(nutrition: NutritionInfo): number {
  let score = 100;

  // Penalize high calories
  if (nutrition.calories > 400) {
    score -= 10;
  }

  // Penalize high sugar
  if (nutrition.sugar > 10) {
    score -= 15;
  }

  // Penalize high sodium
  if (nutrition.sodium > 500) {
    score -= 10;
  }

  // Reward high protein
  if (nutrition.protein > 15) {
    score += 10;
  }

  // Reward high fiber
  if (nutrition.fiber > 5) {
    score += 10;
  }

  return score;
}

function calculateIngredientsScore(ingredients: Ingredients): number {
  let score = 100;
  const processedIngredients = [
    'corn syrup',
    'high fructose corn syrup',
    'modified starch',
    'hydrogenated',
    'artificial'
  ];

  // Penalize processed ingredients
  for (const [ingredient, percentage] of Object.entries(ingredients)) {
    if (processedIngredients.some(proc => ingredient.toLowerCase().includes(proc))) {
      score -= (percentage / 100) * 20; // Higher percentage = bigger penalty
    }
  }

  return score;
}

function calculateAdditivesScore(additives: string[]): number {
  let score = 100;
  
  // Each additive reduces score
  score -= additives.length * 5;
  
  return Math.max(0, score);
}