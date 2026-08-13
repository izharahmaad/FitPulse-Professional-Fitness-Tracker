import { Platform } from "react-native";
import { Pedometer } from "expo-sensors";

export interface PedometerStatus {
  available: boolean;
  permissionGranted: boolean;
  message: string;
}

export async function getPedometerStatus(): Promise<PedometerStatus> {
  try {
    const available = await Pedometer.isAvailableAsync();
    const permission = await Pedometer.getPermissionsAsync();
    return {
      available,
      permissionGranted: permission.granted,
      message: !available
        ? "This device does not expose a compatible pedometer sensor."
        : permission.granted
          ? Platform.OS === "android"
            ? "Live sensor tracking is active while FitPulse is open. Background history requires Health Connect."
            : "Live sensor tracking is active."
          : "Activity permission is required to count steps."
    };
  } catch {
    return {
      available: false,
      permissionGranted: false,
      message: "Unable to access the device activity sensor."
    };
  }
}

export async function requestPedometerPermission(): Promise<boolean> {
  try {
    const result = await Pedometer.requestPermissionsAsync();
    return result.granted;
  } catch {
    return false;
  }
}

export function subscribeToPedometer(onSteps: (steps: number) => void): { remove: () => void } {
  const subscription = Pedometer.watchStepCount(result => onSteps(result.steps));
  return subscription;
}

export async function getHistoricalSteps(start: Date, end: Date): Promise<number | null> {
  if (Platform.OS !== "ios") return null;
  try {
    const result = await Pedometer.getStepCountAsync(start, end);
    return result.steps;
  } catch {
    return null;
  }
}
