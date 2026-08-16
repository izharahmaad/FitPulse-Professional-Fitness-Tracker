import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY =
  "fitpulse_onboarding_completed";

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const value =
      await AsyncStorage.getItem(
        ONBOARDING_KEY
      );

    return value === "true";
  } catch {
    return false;
  }
}

export async function completeOnboarding(): Promise<void> {
  await AsyncStorage.setItem(
    ONBOARDING_KEY,
    "true"
  );
}

export async function resetOnboarding(): Promise<void> {
  await AsyncStorage.removeItem(
    ONBOARDING_KEY
  );
}