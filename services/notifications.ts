import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { NotificationSettings } from "@/types/fitness";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function configureNotifications(): Promise<boolean> {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("fitness-reminders", {
        name: "Fitness Reminders",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 150],
      });
    }

    const current = await Notifications.getPermissionsAsync();

    if (current.granted) {
      return true;
    }

    const requested = await Notifications.requestPermissionsAsync();

    return requested.granted;
  } catch (error) {
    console.warn("Notification configuration failed:", error);
    return false;
  }
}

/**
 * Converts a time string such as "08:30" into
 * a safe hour/minute object.
 */
function parseTime(value: string): {
  hour: number;
  minute: number;
} {
  const parts = value.split(":");

  const hourValue = Number(parts[0]);
  const minuteValue = Number(parts[1]);

  const hour =
    Number.isFinite(hourValue) &&
    hourValue >= 0 &&
    hourValue <= 23
      ? hourValue
      : 9;

  const minute =
    Number.isFinite(minuteValue) &&
    minuteValue >= 0 &&
    minuteValue <= 59
      ? minuteValue
      : 0;

  return {
    hour,
    minute,
  };
}

export async function rescheduleNotifications(
  settings: NotificationSettings
): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (!settings.enabled) {
      return;
    }

    const permission = await configureNotifications();

    if (!permission) {
      return;
    }

    if (settings.water) {
      const time = parseTime(settings.waterTime);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Hydration Check",
          body: "Time for a glass of water.",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: time.hour,
          minute: time.minute,
        },
      });
    }

    if (settings.meals) {
      const time = parseTime(settings.mealTime);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Meal Check-in",
          body: "Log your meal to keep today's calorie picture accurate.",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: time.hour,
          minute: time.minute,
        },
      });
    }

    if (settings.weight) {
      const time = parseTime(settings.weightTime);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Weight Check",
          body: "A quick weigh-in helps you follow your trend.",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: time.hour,
          minute: time.minute,
        },
      });
    }

    if (settings.stepGoal) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Keep Moving",
          body: "Check your step goal and finish the day strong.",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 19,
          minute: 30,
        },
      });
    }

    if (settings.inactivity) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Movement Check",
          body: "If you've been sitting for a while, a short walk can be a good reset.",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 16,
          minute: 0,
        },
      });
    }
  } catch (error) {
    console.warn("Failed to schedule notifications:", error);
  }
}