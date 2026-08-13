// Lightweight calculation examples for future unit-test tooling.
// Mifflin-St Jeor for male, 80kg, 180cm, 25y = 1780 kcal.
import { calculateBmr } from "@/services/calories";
import { Profile } from "@/types/fitness";

const sample: Profile = {
  name: "Test",
  age: 25,
  gender: "male",
  heightCm: 180,
  weightKg: 80,
  targetWeightKg: 75,
  activityLevel: "moderate",
  weightGoal: "lose",
  calorieGoal: 2200,
  stepGoal: 10000,
  waterGoalMl: 2500,
  units: "metric"
};

if (calculateBmr(sample) !== 1780) {
  throw new Error("Mifflin-St Jeor calculation regression.");
}
