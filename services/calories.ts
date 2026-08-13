import { ActivityLevel, Profile, WeightGoal } from "@/types/fitness";

const multipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
  athlete: 1.9
};

export function calculateBmr(profile: Pick<Profile, "gender" | "weightKg" | "heightCm" | "age">): number {
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age;
  return Math.round(profile.gender === "male" ? base + 5 : base - 161);
}

export function calculateTdee(profile: Profile): number {
  return Math.round(calculateBmr(profile) * multipliers[profile.activityLevel]);
}

export function calculateSuggestedCalories(profile: Profile): number {
  const tdee = calculateTdee(profile);
  const delta: Record<WeightGoal, number> = { lose: -400, maintain: 0, gain: 300 };
  return Math.max(1200, tdee + delta[profile.weightGoal]);
}

export function estimateWalkingDistanceKm(steps: number, heightCm: number): number {
  const strideMeters = Math.max(0.55, Math.min(0.85, heightCm * 0.415 / 100));
  return (steps * strideMeters) / 1000;
}

export function estimateWalkingCalories(steps: number, weightKg: number, heightCm: number): number {
  const distanceKm = estimateWalkingDistanceKm(steps, heightCm);
  const met = 3.5;
  const minutes = Math.max(1, (distanceKm / 4.8) * 60);
  return Math.round((met * 3.5 * weightKg / 200) * minutes);
}
