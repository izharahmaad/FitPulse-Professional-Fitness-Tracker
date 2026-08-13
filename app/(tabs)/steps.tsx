import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  Card,
  Button,
  Screen,
  Subtitle,
  Title,
  useAppColors,
} from "@/components/ui";

import { ProgressRing } from "@/components/ProgressRing";
import { MiniChart } from "@/components/MiniChart";
import { useFitness } from "@/hooks/useFitness";
import { usePedometer } from "@/hooks/usePedometer";
import { lastNDays } from "@/utils/date";
import { formatKm, formatNumber } from "@/utils/format";

type IconName = keyof typeof Ionicons.glyphMap;

export default function StepsScreen() {
  const c = useAppColors();

  const { state, today } = useFitness();

  const {
    status,
    requestPermission,
    reconcileIosHistory,
  } = usePedometer();

  const [message, setMessage] = useState("");

  // ---------------------------------------------------------
  // REAL 7-DAY STEP DATA
  // ---------------------------------------------------------

  const days = useMemo(() => lastNDays(7), []);

  const values = useMemo(
    () =>
      days.map((day) => state.steps[day]?.steps ?? 0),
    [days, state.steps]
  );

  // ---------------------------------------------------------
  // REAL STEP CALCULATIONS
  // ---------------------------------------------------------

  const stepGoal = Math.max(
    1,
    state.profile.stepGoal
  );

  const completion = Math.min(
    100,
    Math.round(
      (today.steps / stepGoal) * 100
    )
  );

  const remainingSteps = Math.max(
    0,
    stepGoal - today.steps
  );

  const weeklyTotal = values.reduce(
    (sum, value) => sum + value,
    0
  );

  const weeklyAverage = Math.round(
    weeklyTotal / Math.max(1, values.length)
  );

  const bestDay = Math.max(
    ...values,
    0
  );

  const goalReached =
    today.steps >= stepGoal;

  const sensorReady =
    status.available &&
    status.permissionGranted;

  // ---------------------------------------------------------
  // RECONCILE REAL IOS HISTORY
  // ---------------------------------------------------------

  useEffect(() => {
    void reconcileIosHistory();
  }, [reconcileIosHistory]);

  // ---------------------------------------------------------
  // REAL PERMISSION ACTION
  // ---------------------------------------------------------

  const request = async () => {
    const granted =
      await requestPermission();

    setMessage(
      granted
        ? "Activity permission granted. Your step sensor is ready."
        : "Activity permission was not granted."
    );
  };

  // ---------------------------------------------------------
  // SMART REAL-TIME INSIGHT
  // ---------------------------------------------------------

  const insight = useMemo(() => {
    if (goalReached) {
      return {
        icon: "checkmark-circle" as IconName,
        title: "Goal completed",
        text:
          "Excellent work. You reached your step goal today.",
      };
    }

    if (completion >= 75) {
      return {
        icon: "trending-up" as IconName,
        title: "Almost there",
        text: `${formatNumber(
          remainingSteps
        )} more steps and today's goal is complete.`,
      };
    }

    if (completion >= 40) {
      return {
        icon: "walk" as IconName,
        title: "Good progress",
        text:
          "You're building momentum. A short walk can move you closer to your goal.",
      };
    }

    return {
      icon: "footsteps" as IconName,
      title: "Let's get moving",
      text:
        "Start with a short walk and build your activity throughout the day.",
    };
  }, [
    completion,
    goalReached,
    remainingSteps,
  ]);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Subtitle>Daily activity</Subtitle>
            <Title>Steps</Title>
          </View>

          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor: c.primarySoft,
                borderColor: `${c.primary}35`,
              },
            ]}
          >
            <Ionicons
              name="footsteps"
              size={21}
              color={c.primary}
            />
          </View>
        </View>

        {/* ================================================= */}
        {/* MAIN STEP HERO */}
        {/* ================================================= */}

        <Card
          style={[
            styles.hero,
            {
              backgroundColor: c.surface,
              borderColor: c.border,
            },
          ]}
        >
          <View style={styles.heroHeader}>
            <View style={styles.heroInfo}>
              <Text
                style={[
                  styles.overline,
                  { color: c.muted },
                ]}
              >
                TODAY'S ACTIVITY
              </Text>

              <Text
                style={[
                  styles.stepNumber,
                  { color: c.text },
                ]}
              >
                {formatNumber(today.steps)}
              </Text>

              <View style={styles.goalStatus}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        c.primary,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.goalStatusText,
                    { color: c.muted },
                  ]}
                >
                  {goalReached
                    ? "Daily goal completed"
                    : `${formatNumber(
                        stepGoal
                      )} step goal`}
                </Text>
              </View>
            </View>

            {/* Progress ring */}
            <View style={styles.ringContainer}>
              <ProgressRing
                value={today.steps}
                max={stepGoal}
                size={142}
                label={`${completion}%`}
                sublabel="complete"
              />
            </View>
          </View>

          {/* Progress bar */}

          <View
            style={[
              styles.progressTrack,
              {
                backgroundColor:
                  c.surfaceAlt,
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${completion}%`,
                  backgroundColor: c.primary,
                },
              ]}
            />
          </View>

          <View style={styles.progressFooter}>
            <Text
              style={[
                styles.progressPercent,
                { color: c.primary },
              ]}
            >
              {completion}% complete
            </Text>

            <Text
              style={[
                styles.remainingText,
                { color: c.muted },
              ]}
            >
              {goalReached
                ? "Goal reached"
                : `${formatNumber(
                    remainingSteps
                  )} remaining`}
            </Text>
          </View>
        </Card>

        {/* ================================================= */}
        {/* TODAY'S ACTIVITY */}
        {/* ================================================= */}

        <SectionTitle
          title="Today's activity"
          subtitle="Your live movement summary"
        />

        <View style={styles.statsGrid}>
          <StatCard
            icon="navigate-outline"
            title="Distance"
            value={formatKm(
              today.distanceKm
            )}
            c={c}
          />

          <StatCard
            icon="flame-outline"
            title="Calories"
            value={`${today.caloriesBurned} kcal`}
            c={c}
          />

          <StatCard
            icon="flag-outline"
            title="Daily goal"
            value={formatNumber(
              stepGoal
            )}
            c={c}
          />

          <StatCard
            icon="checkmark-circle-outline"
            title="Completion"
            value={`${completion}%`}
            c={c}
          />
        </View>

        {/* ================================================= */}
        {/* SMART INSIGHT */}
        {/* ================================================= */}

        <Card
          style={[
            styles.insightCard,
            {
              backgroundColor: c.primarySoft,
              borderColor: `${c.primary}45`,
            },
          ]}
        >
          <View
            style={[
              styles.circularIcon,
              {
                backgroundColor: c.primary,
              },
            ]}
          >
            <Ionicons
              name={insight.icon}
              size={20}
              color={c.white}
            />
          </View>

          <View style={styles.insightContent}>
            <Text
              style={[
                styles.insightTitle,
                { color: c.text },
              ]}
            >
              {insight.title}
            </Text>

            <Text
              style={[
                styles.insightText,
                { color: c.muted },
              ]}
            >
              {insight.text}
            </Text>
          </View>
        </Card>

        {/* ================================================= */}
        {/* WEEKLY OVERVIEW */}
        {/* ================================================= */}

        <SectionTitle
          title="Weekly activity"
          subtitle="Your last 7 days"
          icon="bar-chart-outline"
        />

        <Card style={styles.chartCard}>
          <MiniChart
            values={values}
            labels={days}
          />

          <View
            style={[
              styles.divider,
              {
                backgroundColor:
                  c.border,
              },
            ]}
          />

          <View style={styles.weeklyStats}>
            <WeeklyStat
              label="Total"
              value={formatNumber(
                weeklyTotal
              )}
              c={c}
            />

            <WeeklyStat
              label="Daily average"
              value={formatNumber(
                weeklyAverage
              )}
              c={c}
            />

            <WeeklyStat
              label="Best day"
              value={formatNumber(
                bestDay
              )}
              c={c}
            />
          </View>
        </Card>

        {/* ================================================= */}
        {/* SENSOR CONNECTION */}
        {/* ================================================= */}

        <SectionTitle
          title="Step tracking"
          subtitle="Device sensor connection"
        />

        <Card style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <View
              style={[
                styles.circularIcon,
                {
                  backgroundColor:
                    sensorReady
                      ? c.primarySoft
                      : c.surfaceAlt,
                },
              ]}
            >
              <Ionicons
                name={
                  sensorReady
                    ? "checkmark"
                    : "hardware-chip-outline"
                }
                size={20}
                color={
                  sensorReady
                    ? c.primary
                    : c.muted
                }
              />
            </View>

            <View style={styles.sensorInfo}>
              <Text
                style={[
                  styles.sensorTitle,
                  { color: c.text },
                ]}
              >
                {sensorReady
                  ? "Step sensor connected"
                  : "Step sensor needs access"}
              </Text>

              <Text
                style={[
                  styles.sensorStatus,
                  {
                    color: sensorReady
                      ? c.primary
                      : c.muted,
                  },
                ]}
              >
                {status.message}
              </Text>
            </View>

            <View
              style={[
                styles.connectionDot,
                {
                  backgroundColor:
                    sensorReady
                      ? c.primary
                      : c.danger,
                },
              ]}
            />
          </View>

          {!status.permissionGranted && (
            <View style={styles.permissionArea}>
              <Button
                title="Allow step tracking"
                onPress={request}
              />
            </View>
          )}

          {message ? (
            <View
              style={[
                styles.messageBox,
                {
                  backgroundColor:
                    c.surfaceAlt,
                },
              ]}
            >
              <View
                style={[
                  styles.messageIcon,
                  {
                    backgroundColor:
                      c.primarySoft,
                  },
                ]}
              >
                <Ionicons
                  name="information"
                  size={15}
                  color={c.primary}
                />
              </View>

              <Text
                style={[
                  styles.messageText,
                  { color: c.muted },
                ]}
              >
                {message}
              </Text>
            </View>
          ) : null}
        </Card>

        {/* ================================================= */}
        {/* ACCURACY */}
        {/* ================================================= */}

        <Card style={styles.accuracyCard}>
          <View style={styles.accuracyHeader}>
            <View
              style={[
                styles.smallCircle,
                {
                  backgroundColor:
                    c.primarySoft,
                },
              ]}
            >
              <Ionicons
                name="shield-checkmark"
                size={17}
                color={c.primary}
              />
            </View>

            <Text
              style={[
                styles.accuracyTitle,
                { color: c.text },
              ]}
            >
              Tracking accuracy
            </Text>
          </View>

          <Text
            style={[
              styles.body,
              { color: c.muted },
            ]}
          >
            FitPulse uses your device
            pedometer for step tracking.
            Android Expo Pedometer updates
            may stop while the app is running
            in the background. FitPulse does
            not invent background steps.
            Full background and historical
            tracking can be added later
            through a native Health Connect
            adapter.
          </Text>
        </Card>

        {/* ================================================= */}
        {/* BRAND FOOTER */}
        {/* ================================================= */}

        <View style={styles.footer}>
          <View
            style={[
              styles.footerCircle,
              {
                backgroundColor:
                  c.primarySoft,
              },
            ]}
          >
            <Ionicons
              name="fitness"
              size={17}
              color={c.primary}
            />
          </View>

          <Text
            style={[
              styles.footerTitle,
              { color: c.text },
            ]}
          >
            FitPulse
          </Text>

          <Text
            style={[
              styles.footerText,
              { color: c.muted },
            ]}
          >
            Small steps. Better consistency.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

/* ========================================================= */
/* SECTION TITLE */
/* ========================================================= */

function SectionTitle({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon?: IconName;
}) {
  const c = useAppColors();

  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionText}>
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

      {icon ? (
        <View
          style={[
            styles.sectionIcon,
            {
              backgroundColor:
                c.primarySoft,
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={17}
            color={c.primary}
          />
        </View>
      ) : null}
    </View>
  );
}

/* ========================================================= */
/* STAT CARD */
/* ========================================================= */

function StatCard({
  icon,
  title,
  value,
  c,
}: {
  icon: IconName;
  title: string;
  value: string;
  c: ReturnType<typeof useAppColors>;
}) {
  return (
    <Card
      style={[
        styles.statCard,
        {
          backgroundColor: c.surface,
          borderColor: c.border,
        },
      ]}
    >
      <View
        style={[
          styles.statIcon,
          {
            backgroundColor:
              c.primarySoft,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={c.primary}
        />
      </View>

      <Text
        style={[
          styles.statTitle,
          { color: c.muted },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.statValue,
          { color: c.text },
        ]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </Card>
  );
}

/* ========================================================= */
/* WEEKLY STAT */
/* ========================================================= */

function WeeklyStat({
  label,
  value,
  c,
}: {
  label: string;
  value: string;
  c: ReturnType<typeof useAppColors>;
}) {
  return (
    <View style={styles.weeklyStat}>
      <Text
        style={[
          styles.weeklyLabel,
          { color: c.muted },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.weeklyValue,
          { color: c.text },
        ]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

/* ========================================================= */
/* STYLES */
/* ========================================================= */

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,

    // Important because your custom floating footer
    // sits over the bottom area.
    paddingBottom: 150,
  },

  /* ---------------- HEADER ---------------- */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  headerText: {
    flex: 1,
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  /* ---------------- HERO ---------------- */

  hero: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 24,
  },

  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heroInfo: {
    flex: 1,
    paddingRight: 8,
  },

  overline: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 6,
  },

  stepNumber: {
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: -1.2,
  },

  goalStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 7,
  },

  goalStatusText: {
    fontSize: 11,
    fontWeight: "600",
  },

  ringContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  progressTrack: {
    height: 7,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 22,
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  progressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 9,
  },

  progressPercent: {
    fontSize: 11,
    fontWeight: "900",
  },

  remainingText: {
    fontSize: 11,
    fontWeight: "600",
  },

  /* ---------------- SECTION ---------------- */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 11,
    marginTop: 2,
  },

  sectionText: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.2,
  },

  sectionSubtitle: {
    fontSize: 11,
    marginTop: 3,
  },

  sectionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ---------------- STATS ---------------- */

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    marginBottom: 24,
  },

  statCard: {
    width: "48.5%",
    minHeight: 116,
    marginBottom: 0,
    borderRadius: 20,
  },

  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  statTitle: {
    fontSize: 11,
    fontWeight: "600",
  },

  statValue: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 3,
  },

  /* ---------------- INSIGHT ---------------- */

  insightCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 24,
    paddingVertical: 15,
  },

  circularIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  insightContent: {
    flex: 1,
  },

  insightTitle: {
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 3,
  },

  insightText: {
    fontSize: 11,
    lineHeight: 17,
  },

  /* ---------------- CHART ---------------- */

  chartCard: {
    borderRadius: 20,
    marginBottom: 24,
  },

  divider: {
    height: 1,
    marginVertical: 18,
  },

  weeklyStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  weeklyStat: {
    flex: 1,
  },

  weeklyLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginBottom: 4,
  },

  weeklyValue: {
    fontSize: 15,
    fontWeight: "900",
  },

  /* ---------------- SENSOR ---------------- */

  sensorCard: {
    borderRadius: 20,
    marginBottom: 24,
  },

  sensorHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  sensorInfo: {
    flex: 1,
    marginLeft: 12,
  },

  sensorTitle: {
    fontSize: 14,
    fontWeight: "800",
  },

  sensorStatus: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 2,
  },

  connectionDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginLeft: 8,
  },

  permissionArea: {
    marginTop: 16,
  },

  messageBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 10,
    marginTop: 12,
  },

  messageIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  messageText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
    marginLeft: 8,
  },

  /* ---------------- ACCURACY ---------------- */

  accuracyCard: {
    borderRadius: 20,
    marginBottom: 24,
  },

  accuracyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
  },

  smallCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  accuracyTitle: {
    fontSize: 15,
    fontWeight: "900",
    marginLeft: 9,
  },

  body: {
    fontSize: 11,
    lineHeight: 18,
  },

  /* ---------------- FOOTER ---------------- */

  footer: {
    alignItems: "center",
    paddingTop: 6,
    paddingBottom: 8,
  },

  footerCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },

  footerTitle: {
    fontSize: 13,
    fontWeight: "900",
  },

  footerText: {
    fontSize: 10,
    marginTop: 2,
  },
});