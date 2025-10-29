export function calculateHealthScore(nutrition: any): number {
  // Simple rule-based score (0-100). Improve later.
  // Prefer lower sugar, lower saturated fat, lower sodium.
  if (!nutrition) return 50;

  const energy = Number(nutrition["energy-kcal_100g"] ?? nutrition["energy-kcal"] ?? 0);
  const sugar = Number(nutrition["sugars_100g"] ?? 0);
  const satFat = Number(nutrition["saturated-fat_100g"] ?? 0);
  const salt = Number(nutrition["salt_100g"] ?? nutrition["sodium_100g"] ?? 0);

  // base 70, subtract penalties
  let score = 70;
  score -= Math.min(30, sugar * 1.2);      // sugar heavy penalty
  score -= Math.min(20, satFat * 2);       // sat fat
  score -= Math.min(20, salt * 5);         // salt scaled

  // energy penalty
  if (energy > 400) score -= 10;
  if (energy > 600) score -= 10;

  score = Math.round(Math.max(0, Math.min(100, score)));
  return score;
}
