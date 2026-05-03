/**
 * Mifflin-St Jeor BMR (male)
 * 10W + 6.25H - 5A + 5
 */
export function calcBMR({ weight, height, age }) {
  return Math.round(10 * weight + 6.25 * height - 5 * age + 5)
}

/**
 * TDEE based on day type
 * Gym: 1.55 (hard training ~5x/week)
 * Pickleball: 1.45 (moderate, 2x/week)
 */
export function calcTDEE(bmr, planKey) {
  const mult = planKey.startsWith('gym') ? 1.55 : 1.45
  return Math.round(bmr * mult)
}

/**
 * Macro targets based on goal
 * recomp: TDEE × 0.90  (~slight deficit)
 * bulk:   TDEE × 1.12  (+surplus)
 * cut:    TDEE × 0.80  (-deficit)
 */
export function calcTargets(profile, planKey) {
  const bmr  = calcBMR(profile)
  const tdee = calcTDEE(bmr, planKey)

  const multMap = { recomp: 0.90, bulk: 1.12, cut: 0.80 }
  const mult = multMap[profile.goal] ?? 0.90

  const targetCal  = Math.round(tdee * mult)
  const targetProt = Math.round(profile.weight * 2.2)
  const targetFat  = Math.round(profile.weight * 0.85)
  const targetCarb = Math.max(
    Math.round((targetCal - targetProt * 4 - targetFat * 9) / 4),
    80
  )

  return { cal: targetCal, prot: targetProt, carb: targetCarb, fat: targetFat, bmr, tdee }
}

export const GOAL_LABELS = {
  recomp: '🎯 Tăng cơ giảm mỡ',
  bulk:   '📈 Tăng cơ (Bulk)',
  cut:    '📉 Giảm mỡ (Cut)',
}
