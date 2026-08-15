import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  Card,
  Screen,
  Subtitle,
  Title,
  useAppColors,
} from "@/components/ui";

import { useFitness } from "@/hooks/useFitness";
import {
  ActivityLevel,
  Gender,
  WeightGoal,
} from "@/types/fitness";

const ACCENT = "#B7FF1A";

type IconName = keyof typeof Ionicons.glyphMap;

export default function SettingsScreen() {
  const c = useAppColors();

  const {
    state,
    updateProfile,
    setNotificationSettings,
  } = useFitness();

  const profile = state.profile;
  const notifications = state.notifications;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Subtitle>Preferences</Subtitle>

            <Title>Settings</Title>

            <Text
              style={[
                styles.headerDescription,
                { color: c.muted },
              ]}
            >
              Personalize your fitness experience, goals,
              reminders, and measurement preferences.
            </Text>
          </View>

          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor: `${ACCENT}14`,
                borderColor: `${ACCENT}2A`,
              },
            ]}
          >
            <Ionicons
              name="settings-outline"
              size={21}
              color={ACCENT}
            />
          </View>
        </View>

        {/* =====================================================
            PROFILE SNAPSHOT
        ===================================================== */}

        <View
          style={[
            styles.snapshot,
            {
              backgroundColor: c.surface,
              borderColor: c.border,
            },
          ]}
        >
          <View
            style={[
              styles.snapshotIcon,
              {
                backgroundColor: `${ACCENT}14`,
                borderColor: `${ACCENT}25`,
              },
            ]}
          >
            <Ionicons
              name="person-circle-outline"
              size={20}
              color={ACCENT}
            />
          </View>

          <View style={styles.snapshotText}>
            <Text
              style={[
                styles.snapshotTitle,
                { color: c.text },
              ]}
              numberOfLines={1}
            >
              {profile.name || "Your profile"}
            </Text>

            <Text
              style={[
                styles.snapshotSubtitle,
                { color: c.muted },
              ]}
              numberOfLines={1}
            >
              {formatOption(profile.activityLevel)} ·{" "}
              {formatOption(profile.weightGoal)} ·{" "}
              {profile.units === "metric"
                ? "Metric"
                : "Imperial"}
            </Text>
          </View>

          <View
            style={[
              styles.snapshotStatus,
              {
                backgroundColor: c.primarySoft,
                borderColor: `${c.primary}35`,
              },
            ]}
          >
            <View
              style={[
                styles.snapshotDot,
                { backgroundColor: c.primary },
              ]}
            />

            <Text
              style={[
                styles.snapshotStatusText,
                { color: c.primary },
              ]}
            >
              ACTIVE
            </Text>
          </View>
        </View>

        {/* =====================================================
            BODY & ACTIVITY
        ===================================================== */}

        <SectionHeader
          icon="fitness-outline"
          title="Body & activity"
          subtitle="Used by FitPulse for calorie and progress calculations"
        />

        <Card
          style={[
            styles.preferenceCard,
            {
              backgroundColor: c.surface,
              borderColor: c.border,
            },
          ]}
        >
          <ChoiceRow
            label="Gender"
            value={profile.gender}
            options={["male", "female"]}
            icon="male-female-outline"
            onChange={(value) =>
              updateProfile({
                gender: value as Gender,
              })
            }
            c={c}
          />

          <ChoiceRow
            label="Activity level"
            value={profile.activityLevel}
            options={[
              "sedentary",
              "light",
              "moderate",
              "high",
              "athlete",
            ]}
            icon="speedometer-outline"
            onChange={(value) =>
              updateProfile({
                activityLevel: value as ActivityLevel,
              })
            }
            c={c}
          />

          <ChoiceRow
            label="Weight goal"
            value={profile.weightGoal}
            options={["lose", "maintain", "gain"]}
            icon="flag-outline"
            onChange={(value) =>
              updateProfile({
                weightGoal: value as WeightGoal,
              })
            }
            c={c}
          />

          <ChoiceRow
            label="Units"
            value={profile.units}
            options={["metric", "imperial"]}
            icon="swap-horizontal-outline"
            onChange={(value) =>
              updateProfile({
                units: value as "metric" | "imperial",
              })
            }
            c={c}
            last
          />
        </Card>

        {/* =====================================================
            NOTIFICATIONS
        ===================================================== */}

        <SectionHeader
          icon="notifications-outline"
          title="Notifications"
          subtitle="Choose which reminders FitPulse should use"
        />

        <Card
          style={[
            styles.preferenceCard,
            {
              backgroundColor: c.surface,
              borderColor: c.border,
            },
          ]}
        >
          <ToggleRow
            icon="notifications-outline"
            title="All reminders"
            description="Master control for every reminder"
            value={notifications.enabled}
            onPress={() =>
              setNotificationSettings({
                enabled: !notifications.enabled,
              })
            }
            c={c}
          />

          <ToggleRow
            icon="water-outline"
            title="Water reminders"
            description="Stay consistent with hydration"
            value={notifications.water}
            onPress={() =>
              setNotificationSettings({
                water: !notifications.water,
              })
            }
            c={c}
          />

          <ToggleRow
            icon="restaurant-outline"
            title="Meal reminders"
            description="Remember to log your meals"
            value={notifications.meals}
            onPress={() =>
              setNotificationSettings({
                meals: !notifications.meals,
              })
            }
            c={c}
          />

          <ToggleRow
            icon="footsteps-outline"
            title="Step goal reminders"
            description="Keep your daily movement on track"
            value={notifications.stepGoal}
            onPress={() =>
              setNotificationSettings({
                stepGoal: !notifications.stepGoal,
              })
            }
            c={c}
          />

          <ToggleRow
            icon="scale-outline"
            title="Weight reminders"
            description="Keep your weigh-ins consistent"
            value={notifications.weight}
            onPress={() =>
              setNotificationSettings({
                weight: !notifications.weight,
              })
            }
            c={c}
          />

          <ToggleRow
            icon="walk-outline"
            title="Inactivity reminders"
            description="Get a nudge after long inactive periods"
            value={notifications.inactivity}
            onPress={() =>
              setNotificationSettings({
                inactivity: !notifications.inactivity,
              })
            }
            c={c}
            last
          />
        </Card>

        {/* =====================================================
            CALORIE ENGINE
        ===================================================== */}

        <SectionHeader
          icon="flame-outline"
          title="Calorie engine"
          subtitle="How your daily energy target is determined"
        />

        <Card
          style={[
            styles.engineCard,
            {
              backgroundColor: c.surface,
              borderColor: c.border,
            },
          ]}
        >
          <View style={styles.engineHeader}>
            <View
              style={[
                styles.engineIcon,
                {
                  backgroundColor: `${ACCENT}14`,
                  borderColor: `${ACCENT}25`,
                },
              ]}
            >
              <Ionicons
                name="flash-outline"
                size={18}
                color={ACCENT}
              />
            </View>

            <View style={styles.engineText}>
              <Text
                style={[
                  styles.engineTitle,
                  { color: c.text },
                ]}
              >
                Automatic calculation
              </Text>

              <Text
                style={[
                  styles.engineSubtitle,
                  { color: c.muted },
                ]}
              >
                Based on your profile and activity level
              </Text>
            </View>

            <View
              style={[
                styles.engineBadge,
                {
                  backgroundColor: c.primarySoft,
                  borderColor: `${c.primary}35`,
                },
              ]}
            >
              <Text
                style={[
                  styles.engineBadgeText,
                  { color: c.primary },
                ]}
              >
                AUTO
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.engineBody,
              { color: c.muted },
            ]}
          >
            FitPulse uses your saved body metrics,
            Mifflin–St Jeor, and activity level to
            estimate your daily calorie requirements.
          </Text>

          <View
            style={[
              styles.engineNotice,
              {
                backgroundColor: c.surfaceAlt,
                borderColor: c.border,
              },
            ]}
          >
            <View
              style={[
                styles.engineNoticeIcon,
                {
                  backgroundColor: `${ACCENT}12`,
                },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={15}
                color={ACCENT}
              />
            </View>

            <Text
              style={[
                styles.engineNoticeText,
                { color: c.muted },
              ]}
            >
              Change your personal targets from Profile.
            </Text>
          </View>
        </Card>

        {/* =====================================================
            CURRENT STATUS
        ===================================================== */}

        <View
          style={[
            styles.statusBar,
            {
              backgroundColor: c.surface,
              borderColor: c.border,
            },
          ]}
        >
          <View
            style={[
              styles.statusIcon,
              {
                backgroundColor: `${ACCENT}12`,
              },
            ]}
          >
            <Ionicons
              name="checkmark"
              size={14}
              color={ACCENT}
            />
          </View>

          <View style={styles.statusTextWrap}>
            <Text
              style={[
                styles.statusTitle,
                { color: c.text },
              ]}
            >
              Preferences saved
            </Text>

            <Text
              style={[
                styles.statusSubtitle,
                { color: c.muted },
              ]}
            >
              Your changes are applied immediately.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </Screen>
  );
}

/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
}) {
  const c = useAppColors();

  return (
    <View style={styles.sectionHeader}>
      <View
        style={[
          styles.sectionIcon,
          {
            backgroundColor: `${ACCENT}14`,
            borderColor: `${ACCENT}25`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={17}
          color={ACCENT}
        />
      </View>

      <View style={styles.sectionCopy}>
        <Text
          style={[
            styles.sectionTitle,
            { color: c.text },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.sectionSubtitle,
            { color: c.muted },
          ]}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

/* ============================================================
   CHOICE ROW
============================================================ */

function ChoiceRow({
  label,
  value,
  options,
  icon,
  onChange,
  c,
  last = false,
}: {
  label: string;
  value: string;
  options: string[];
  icon: IconName;
  onChange: (value: string) => void;
  c: ReturnType<typeof useAppColors>;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.choiceRow,
        !last && {
          borderBottomWidth: 1,
          borderBottomColor: c.border,
        },
      ]}
    >
      <View style={styles.choiceTop}>
        <View
          style={[
            styles.choiceIcon,
            {
              backgroundColor: `${ACCENT}12`,
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={15}
            color={ACCENT}
          />
        </View>

        <View style={styles.choiceCopy}>
          <Text
            style={[
              styles.choiceLabel,
              { color: c.text },
            ]}
          >
            {label}
          </Text>

          <Text
            style={[
              styles.choiceCurrent,
              { color: c.muted },
            ]}
          >
            Current: {formatOption(value)}
          </Text>
        </View>
      </View>

      <View style={styles.choiceOptions}>
        {options.map((option) => {
          const selected = value === option;

          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={({ pressed }) => [
                styles.choicePill,
                {
                  backgroundColor: selected
                    ? c.primarySoft
                    : c.surfaceAlt,
                  borderColor: selected
                    ? `${c.primary}55`
                    : c.border,
                  opacity: pressed ? 0.72 : 1,
                },
              ]}
            >
              {selected && (
                <View
                  style={[
                    styles.choiceDot,
                    {
                      backgroundColor: ACCENT,
                    },
                  ]}
                />
              )}

              <Text
                style={[
                  styles.choicePillText,
                  {
                    color: selected
                      ? c.primary
                      : c.muted,
                  },
                ]}
              >
                {formatOption(option)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/* ============================================================
   TOGGLE ROW
============================================================ */

function ToggleRow({
  icon,
  title,
  description,
  value,
  onPress,
  c,
  last = false,
}: {
  icon: IconName;
  title: string;
  description: string;
  value: boolean;
  onPress: () => void;
  c: ReturnType<typeof useAppColors>;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.toggleRow,
        !last && {
          borderBottomWidth: 1,
          borderBottomColor: c.border,
        },
      ]}
    >
      <View
        style={[
          styles.toggleIcon,
          {
            backgroundColor: value
              ? c.primarySoft
              : c.surfaceAlt,
            borderColor: value
              ? `${c.primary}35`
              : c.border,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={17}
          color={value ? c.primary : c.muted}
        />
      </View>

      <View style={styles.toggleCopy}>
        <Text
          style={[
            styles.toggleTitle,
            { color: c.text },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.toggleDescription,
            { color: c.muted },
          ]}
        >
          {description}
        </Text>
      </View>

      <Pressable
        accessibilityRole="switch"
        accessibilityState={{
          checked: value,
        }}
        onPress={onPress}
        style={({ pressed }) => [
          styles.switch,
          {
            backgroundColor: value
              ? c.primary
              : c.surfaceAlt,
            borderColor: value
              ? `${c.primary}65`
              : c.border,
            opacity: pressed ? 0.72 : 1,
          },
        ]}
      >
        <View
          style={[
            styles.switchThumb,
            {
              backgroundColor: value
                ? "#0A0F0C"
                : c.muted,
              alignSelf: value
                ? "flex-end"
                : "flex-start",
            },
          ]}
        />
      </Pressable>
    </View>
  );
}

/* ============================================================
   HELPER
============================================================ */

function formatOption(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 140,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  headerCopy: {
    flex: 1,
    paddingRight: 12,
  },

  headerDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Snapshot */

  snapshot: {
    minHeight: 70,
    borderRadius: 23,
    borderWidth: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  snapshotIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  snapshotText: {
    flex: 1,
    marginLeft: 10,
    paddingRight: 8,
  },

  snapshotTitle: {
    fontSize: 13,
    fontWeight: "900",
  },

  snapshotSubtitle: {
    fontSize: 9,
    marginTop: 3,
  },

  snapshotStatus: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  snapshotDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 5,
  },

  snapshotStatusText: {
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.6,
  },

  /* Sections */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  sectionCopy: {
    flex: 1,
    marginLeft: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  sectionSubtitle: {
    fontSize: 10,
    lineHeight: 15,
    marginTop: 2,
  },

  /* Preference card */

  preferenceCard: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 25,
  },

  /* Choice */

  choiceRow: {
    paddingVertical: 14,
  },

  choiceTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
  },

  choiceIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  choiceCopy: {
    flex: 1,
    marginLeft: 10,
  },

  choiceLabel: {
    fontSize: 13,
    fontWeight: "900",
  },

  choiceCurrent: {
    fontSize: 9,
    marginTop: 2,
  },

  choiceOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },

  choicePill: {
    minHeight: 37,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  choicePillText: {
    fontSize: 10,
    fontWeight: "800",
  },

  choiceDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 5,
  },

  /* Toggle */

  toggleRow: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
  },

  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  toggleCopy: {
    flex: 1,
    marginLeft: 10,
    paddingRight: 10,
  },

  toggleTitle: {
    fontSize: 12,
    fontWeight: "900",
  },

  toggleDescription: {
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
  },

  switch: {
    width: 48,
    height: 28,
    borderRadius: 999,
    borderWidth: 1,
    padding: 3,
    justifyContent: "center",
  },

  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },

  /* Engine */

  engineCard: {
    borderRadius: 23,
    borderWidth: 1,
    padding: 16,
    marginBottom: 25,
  },

  engineHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  engineIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  engineText: {
    flex: 1,
    marginLeft: 10,
    paddingRight: 8,
  },

  engineTitle: {
    fontSize: 14,
    fontWeight: "900",
  },

  engineSubtitle: {
    fontSize: 9,
    marginTop: 2,
  },

  engineBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  engineBadgeText: {
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  engineBody: {
    fontSize: 11,
    lineHeight: 18,
    marginTop: 14,
  },

  engineNotice: {
    minHeight: 43,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 13,
  },

  engineNoticeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  engineNoticeText: {
    flex: 1,
    fontSize: 9,
    marginLeft: 7,
  },

  /* Status */

  statusBar: {
    minHeight: 62,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    flexDirection: "row",
    alignItems: "center",
  },

  statusIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  statusTextWrap: {
    flex: 1,
    marginLeft: 10,
  },

  statusTitle: {
    fontSize: 12,
    fontWeight: "900",
  },

  statusSubtitle: {
    fontSize: 9,
    marginTop: 2,
  },

  bottomSpace: {
    height: 20,
  },
});
