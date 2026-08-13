export type Gender = "male" | "female";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "high" | "athlete";
export type WeightGoal = "lose" | "maintain" | "gain";
export type Units = "metric" | "imperial";
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface Profile {
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activityLevel: ActivityLevel;
  weightGoal: WeightGoal;
  calorieGoal: number;
  stepGoal: number;
  waterGoalMl: number;
  units: Units;
}

export interface FoodLog {
  id: string;
  name: string;
  meal: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings: number;
  createdAt: string;
}

export interface WaterLog {
  id: string;
  amountMl: number;
  createdAt: string;
}

export interface WeightEntry {
  id: string;
  weightKg: number;
  createdAt: string;
}

export interface DailySteps {
  date: string;
  steps: number;
  walkingSeconds: number;
  distanceKm: number;
  caloriesBurned: number;
}

export interface NotificationSettings {
  enabled: boolean;
  water: boolean;
  meals: boolean;
  stepGoal: boolean;
  weight: boolean;
  inactivity: boolean;
  waterTime: string;
  mealTime: string;
  weightTime: string;
}

export interface AppState {
  profile: Profile;
  steps: Record<string, DailySteps>;
  foods: FoodLog[];
  water: WaterLog[];
  weights: WeightEntry[];
  notifications: NotificationSettings;
}
