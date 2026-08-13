import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppState } from "react-native";

import {
  AppState as FitnessState,
  DailySteps,
  FoodLog,
  Profile,
  WaterLog,
  WeightEntry,
  NotificationSettings,
} from "@/types/fitness";

import {
  calculateBmr,
  calculateSuggestedCalories,
  calculateTdee,
  estimateWalkingCalories,
  estimateWalkingDistanceKm,
} from "@/services/calories";

import { loadState, saveState } from "@/services/storage";
import { rescheduleNotifications } from "@/services/notifications";
import { dateKey } from "@/utils/date";
import { uid } from "@/utils/format";

const defaultProfile: Profile = {
  name: "You",
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
  units: "metric",
};

const defaultNotifications: NotificationSettings = {
  enabled: false,
  water: false,
  meals: false,
  stepGoal: false,
  weight: false,
  inactivity: false,
  waterTime: "11:00",
  mealTime: "13:00",
  weightTime: "08:00",
};

const emptyState: FitnessState = {
  profile: defaultProfile,
  steps: {},
  foods: [],
  water: [],
  weights: [],
  notifications: defaultNotifications,
};

interface FitnessContextValue {
  state: FitnessState;
  hydrated: boolean;
  today: DailySteps;
  todayFoods: FoodLog[];
  todayWaterMl: number;
  latestWeightKg: number;
  bmr: number;
  tdee: number;

  updateProfile: (patch: Partial<Profile>) => void;

  addFood: (
    food: Omit<FoodLog, "id" | "createdAt">
  ) => void;

  deleteFood: (id: string) => void;

  addWater: (amountMl: number) => void;

  addWeight: (weightKg: number) => void;

  deleteWeight: (id: string) => void;

  addSensorSteps: (
    steps: number,
    absoluteToday?: boolean
  ) => void;

  setNotificationSettings: (
    patch: Partial<NotificationSettings>
  ) => void;
}

export const FitnessContext =
  createContext<FitnessContextValue | null>(null);

function makeToday(): DailySteps {
  return {
    date: dateKey(),
    steps: 0,
    walkingSeconds: 0,
    distanceKm: 0,
    caloriesBurned: 0,
  };
}

export function FitnessProvider({
  children,
}: PropsWithChildren) {
  const [state, setState] =
    useState<FitnessState>(emptyState);

  const [hydrated, setHydrated] =
    useState(false);

  /**
   * Load saved fitness data.
   */
  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        const saved = await loadState();

        if (!mounted) {
          return;
        }

        setState(saved ?? emptyState);
      } catch (error) {
        console.warn(
          "Failed to load FitPulse data:",
          error
        );
      } finally {
        if (mounted) {
          setHydrated(true);
        }
      }
    };

    void hydrate();

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Persist state whenever it changes.
   */
  useEffect(() => {
    if (!hydrated) {
      return;
    }

    void saveState(state);
  }, [state, hydrated]);

  /**
   * Make sure today's step record exists
   * when the application becomes active.
   */
  useEffect(() => {
    const subscription =
      AppState.addEventListener("change", nextState => {
        if (nextState !== "active") {
          return;
        }

        setState(current => {
          const today = dateKey();

          if (current.steps[today]) {
            return current;
          }

          return {
            ...current,
            steps: {
              ...current.steps,
              [today]: makeToday(),
            },
          };
        });
      });

    return () => {
      subscription.remove();
    };
  }, []);

  /**
   * Update user profile.
   */
  const updateProfile = useCallback(
    (patch: Partial<Profile>) => {
      setState(current => {
        const profile = {
          ...current.profile,
          ...patch,
        };

        const shouldRecalculate = [
          "age",
          "gender",
          "heightCm",
          "weightKg",
          "activityLevel",
          "weightGoal",
        ].some(key => key in patch);

        if (
          shouldRecalculate &&
          !("calorieGoal" in patch)
        ) {
          profile.calorieGoal =
            calculateSuggestedCalories(profile);
        }

        return {
          ...current,
          profile,
        };
      });
    },
    []
  );

  /**
   * Add food entry.
   */
  const addFood = useCallback(
    (
      food: Omit<FoodLog, "id" | "createdAt">
    ) => {
      setState(current => ({
        ...current,
        foods: [
          {
            ...food,
            id: uid("food"),
            createdAt: new Date().toISOString(),
          },
          ...current.foods,
        ],
      }));
    },
    []
  );

  /**
   * Delete food entry.
   */
  const deleteFood = useCallback((id: string) => {
    setState(current => ({
      ...current,
      foods: current.foods.filter(
        item => item.id !== id
      ),
    }));
  }, []);

  /**
   * Add water.
   */
  const addWater = useCallback(
    (amountMl: number) => {
      if (
        !Number.isFinite(amountMl) ||
        amountMl <= 0 ||
        amountMl > 5000
      ) {
        return;
      }

      const item: WaterLog = {
        id: uid("water"),
        amountMl: Math.round(amountMl),
        createdAt: new Date().toISOString(),
      };

      setState(current => ({
        ...current,
        water: [item, ...current.water],
      }));
    },
    []
  );

  /**
   * Add weight entry.
   */
  const addWeight = useCallback(
    (weightKg: number) => {
      if (
        !Number.isFinite(weightKg) ||
        weightKg < 20 ||
        weightKg > 400
      ) {
        return;
      }

      const item: WeightEntry = {
        id: uid("weight"),
        weightKg: Number(weightKg.toFixed(1)),
        createdAt: new Date().toISOString(),
      };

      setState(current => ({
        ...current,
        weights: [item, ...current.weights],
      }));
    },
    []
  );

  /**
   * Delete weight entry.
   */
  const deleteWeight = useCallback((id: string) => {
    setState(current => ({
      ...current,
      weights: current.weights.filter(
        item => item.id !== id
      ),
    }));
  }, []);

  /**
   * Update today's step count.
   *
   * absoluteToday = true:
   * Replace today's value with the sensor's
   * absolute daily count.
   *
   * absoluteToday = false:
   * Add steps to today's existing value.
   */
  const addSensorSteps = useCallback(
    (
      steps: number,
      absoluteToday = false
    ) => {
      if (
        !Number.isFinite(steps) ||
        steps < 0
      ) {
        return;
      }

      setState(current => {
        const todayKey = dateKey();

        const existing =
          current.steps[todayKey] ??
          makeToday();

        const normalizedSteps =
          Math.round(steps);

        const nextSteps = absoluteToday
          ? Math.max(
              existing.steps,
              normalizedSteps
            )
          : existing.steps + normalizedSteps;

        const distanceKm =
          estimateWalkingDistanceKm(
            nextSteps,
            current.profile.heightCm
          );

        const caloriesBurned =
          estimateWalkingCalories(
            nextSteps,
            current.profile.weightKg,
            current.profile.heightCm
          );

        return {
          ...current,
          steps: {
            ...current.steps,
            [todayKey]: {
              ...existing,
              date: todayKey,
              steps: nextSteps,
              distanceKm,
              caloriesBurned,
              walkingSeconds: Math.round(
                (distanceKm / 4.8) * 3600
              ),
            },
          },
        };
      });
    },
    []
  );

  /**
   * Update notification settings.
   *
   * Notification scheduling is intentionally
   * triggered only when the user changes settings.
   */
  const setNotificationSettings =
    useCallback(
      (
        patch: Partial<NotificationSettings>
      ) => {
        setState(current => {
          const nextNotifications = {
            ...current.notifications,
            ...patch,
          };

          void rescheduleNotifications(
            nextNotifications
          );

          return {
            ...current,
            notifications: nextNotifications,
          };
        });
      },
      []
    );

  const todayKey = dateKey();

  const today =
    state.steps[todayKey] ?? makeToday();

  const todayFoods = state.foods.filter(
    item =>
      item.createdAt.slice(0, 10) ===
      todayKey
  );

  const todayWaterMl = state.water
    .filter(
      item =>
        item.createdAt.slice(0, 10) ===
        todayKey
    )
    .reduce(
      (sum, item) => sum + item.amountMl,
      0
    );

  const latestWeightKg =
    state.weights[0]?.weightKg ??
    state.profile.weightKg;

  const bmr = useMemo(
    () =>
      calculateBmr({
        ...state.profile,
        weightKg: latestWeightKg,
      }),
    [state.profile, latestWeightKg]
  );

  const tdee = useMemo(
    () =>
      calculateTdee({
        ...state.profile,
        weightKg: latestWeightKg,
      }),
    [state.profile, latestWeightKg]
  );

  const value =
    useMemo<FitnessContextValue>(
      () => ({
        state,
        hydrated,
        today,
        todayFoods,
        todayWaterMl,
        latestWeightKg,
        bmr,
        tdee,

        updateProfile,
        addFood,
        deleteFood,
        addWater,
        addWeight,
        deleteWeight,
        addSensorSteps,
        setNotificationSettings,
      }),
      [
        state,
        hydrated,
        today,
        todayFoods,
        todayWaterMl,
        latestWeightKg,
        bmr,
        tdee,
        updateProfile,
        addFood,
        deleteFood,
        addWater,
        addWeight,
        deleteWeight,
        addSensorSteps,
        setNotificationSettings,
      ]
    );

  return (
    <FitnessContext.Provider value={value}>
      {children}
    </FitnessContext.Provider>
  );
}