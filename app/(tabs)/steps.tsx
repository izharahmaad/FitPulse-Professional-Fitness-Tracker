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
import {
  formatKm,
  formatNumber,
} from "@/utils/format";

const ACCENT = "#B7FF1A";

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

  /* =========================================================
     REAL 7-DAY STEP DATA
  ========================================================= */

  const days = useMemo(
    () => lastNDays(7),
    []
  );

  const values = useMemo(
    () =>
      days.map(
        (day) =>
          state.steps[day]?.steps ?? 0
      ),
    [days, state.steps]
  );

  /* =========================================================
     REAL STEP CALCULATIONS
  ========================================================= */

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
    weeklyTotal /
      Math.max(1, values.length)
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

  /* =========================================================
     REAL SENSOR RECONCILIATION
  ========================================================= */

  useEffect(() => {
    void reconcileIosHistory();
  }, [reconcileIosHistory]);

  /* =========================================================
     REAL PERMISSION ACTION
  ========================================================= */

  const request = async () => {
    const granted =
      await requestPermission();

    setMessage(
      granted
        ? "Activity permission granted. Your step sensor is ready."
        : "Activity permission was not granted."
    );
  };

  /* =========================================================
     SMART REAL-TIME INSIGHT
  ========================================================= */

  const insight = useMemo(() => {
    if (goalReached) {
      return {
        icon:
          "checkmark-circle" as IconName,
        title: "Goal completed",
        text:
          "Excellent work. You reached your step goal today.",
      };
    }

    if (completion >= 75) {
      return {
        icon:
          "trending-up" as IconName,
        title: "Almost there",
        text: `${formatNumber(
          remainingSteps
        )} more steps and today's goal is complete.`,
      };
    }

    if (completion >= 40) {
      return {
        icon:
          "walk" as IconName,
        title: "Good progress",
        text:
          "You're building momentum. A short walk can move you closer to your goal.",
      };
    }

    return {
      icon:
        "footsteps" as IconName,
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
        {/* ===================================================
            HEADER
        =================================================== */}

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Subtitle>Daily activity</Subtitle>

            <Title>Steps</Title>

            <Text
              style={[
                styles.headerDescription,
                { color: c.muted },
              ]}
            >
              Track your walking activity and daily
              movement progress.
            </Text>
          </View>

          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor: `${ACCENT}14`,
                borderColor: `${ACCENT}28`,
              },
            ]}
          >
            <Ionicons
              name="footsteps"
              size={21}
              color={ACCENT}
            />
          </View>
        </View>

        {/* ===================================================
            MAIN HERO
        =================================================== */}

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
            <View style={styles.heroCopy}>
              <Text
                style={[
                  styles.eyebrow,
                  { color: c.muted },
                ]}
              >
                TODAY'S STEPS
              </Text>

              <Text
                style={[
                  styles.heroNumber,
                  { color: c.text },
                ]}
              >
                {formatNumber(today.steps)}
              </Text>

              <View style={styles.goalLine}>
                <View
                  style={[
                    styles.goalDot,
                    {
                      backgroundColor: ACCENT,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.goalLineText,
                    { color: c.muted },
                  ]}
                >
                  {goalReached
                    ? "Daily goal completed"
                    : `${formatNumber(
                        stepGoal
                      )} step daily goal`}
                </Text>
              </View>
            </View>

            <View style={styles.heroRing}>
              <ProgressRing
                value={today.steps}
                max={stepGoal}
                size={148}
                label={`${completion}%`}
                sublabel="complete"
              />
            </View>
          </View>

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
                  backgroundColor: ACCENT,
                  width: `${completion}%`,
                },
              ]}
            />
          </View>

          <View style={styles.progressFooter}>
            <Text
              style={[
                styles.progressLeft,
                { color: ACCENT },
              ]}
            >
              {completion}% complete
            </Text>

            <Text
              style={[
                styles.progressRight,
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

          <View
            style={[
              styles.heroSummary,
              {
                borderTopColor: c.border,
              },
            ]}
          >
            <SummaryStat
              icon="navigate-outline"
              label="Distance"
              value={formatKm(
                today.distanceKm
              )}
              c={c}
            />

            <View
              style={[
                styles.summaryDivider,
                {
                  backgroundColor:
                    c.border,
                },
              ]}
            />

            <SummaryStat
              icon="flame-outline"
              label="Burned"
              value={`${today.caloriesBurned} kcal`}
              c={c}
            />
          </View>
        </Card>

        {/* ===================================================
            TODAY'S ACTIVITY
        =================================================== */}

        <SectionHeader
          title="Today's activity"
          subtitle="Live movement summary"
          icon="pulse-outline"
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
            title="Calories burned"
            value={`${today.caloriesBurned}`}
            suffix="kcal"
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

        {/* ===================================================
            FITPULSE INSIGHT — PILL
        =================================================== */}

        <Pressable
          style={({ pressed }) => [
            styles.insightCard,
            {
              backgroundColor: c.surface,
              borderColor: `${ACCENT}38`,
              opacity: pressed ? 0.82 : 1,
              transform: [
                {
                  scale: pressed
                    ? 0.985
                    : 1,
                },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.insightIcon,
              {
                backgroundColor: ACCENT,
              },
            ]}
          >
            <Ionicons
              name={insight.icon}
              size={18}
              color="#0A0F0C"
            />
          </View>

          <View
            style={styles.insightContent}
          >
            <View
              style={
                styles.insightTopRow
              }
            >
              <Text
                style={[
                  styles.insightEyebrow,
                  { color: ACCENT },
                ]}
              >
                FITPULSE INSIGHT
              </Text>

              <View
                style={[
                  styles.insightBadge,
                  {
                    backgroundColor:
                      `${ACCENT}12`,
                    borderColor:
                      `${ACCENT}25`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.insightBadgeDot,
                    {
                      backgroundColor:
                        ACCENT,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.insightBadgeText,
                    { color: ACCENT },
                  ]}
                >
                  LIVE
                </Text>
              </View>
            </View>

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
        </Pressable>

        {/* ===================================================
            WEEKLY TREND
        =================================================== */}

        <SectionHeader
          title="Weekly trend"
          subtitle="Your last 7 days"
          icon="bar-chart-outline"
        />

        <Card
          style={[
            styles.chartCard,
            {
              backgroundColor: c.surface,
              borderColor: c.border,
            },
          ]}
        >
          <View style={styles.chartHeader}>
            <View>
              <Text
                style={[
                  styles.chartTitle,
                  { color: c.text },
                ]}
              >
                Daily steps
              </Text>

              <Text
                style={[
                  styles.chartSubtitle,
                  { color: c.muted },
                ]}
              >
                Real recorded step activity
              </Text>
            </View>

            <View
              style={[
                styles.chartBadge,
                {
                  backgroundColor:
                    `${ACCENT}12`,
                },
              ]}
            >
              <View
                style={[
                  styles.chartDot,
                  {
                    backgroundColor:
                      ACCENT,
                  },
                ]}
              />

              <Text
                style={[
                  styles.chartBadgeText,
                  { color: ACCENT },
                ]}
              >
                7 DAYS
              </Text>
            </View>
          </View>

          <View style={styles.chartArea}>
            <MiniChart
              values={values}
              labels={days}
              height={155}
            />
          </View>

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

        {/* ===================================================
            STEP TRACKING — FULL PILL
        =================================================== */}

        <SectionHeader
          title="Step tracking"
          subtitle="Device sensor connection"
          icon="hardware-chip-outline"
        />

        <View
          style={[
            styles.sensorPill,
            {
              backgroundColor: c.surface,
              borderColor: c.border,
            },
          ]}
        >
          <View
            style={[
              styles.sensorCircle,
              {
                backgroundColor:
                  sensorReady
                    ? `${ACCENT}14`
                    : c.surfaceAlt,
                borderColor:
                  sensorReady
                    ? `${ACCENT}30`
                    : c.border,
              },
            ]}
          >
            <Ionicons
              name={
                sensorReady
                  ? "pulse"
                  : "hardware-chip-outline"
              }
              size={18}
              color={
                sensorReady
                  ? ACCENT
                  : c.muted
              }
            />
          </View>

          <View
            style={styles.sensorInfo}
          >
            <View
              style={
                styles.sensorTitleRow
              }
            >
              <Text
                style={[
                  styles.sensorTitle,
                  { color: c.text },
                ]}
                numberOfLines={1}
              >
                {sensorReady
                  ? "Step sensor connected"
                  : "Step sensor needs access"}
              </Text>

              <View
                style={[
                  styles.sensorStatusPill,
                  {
                    backgroundColor:
                      sensorReady
                        ? `${ACCENT}12`
                        : `${c.danger}12`,
                    borderColor:
                      sensorReady
                        ? `${ACCENT}28`
                        : `${c.danger}30`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.sensorStatusDot,
                    {
                      backgroundColor:
                        sensorReady
                          ? ACCENT
                          : c.danger,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.sensorStatusText,
                    {
                      color:
                        sensorReady
                          ? ACCENT
                          : c.danger,
                    },
                  ]}
                >
                  {sensorReady
                    ? "READY"
                    : "OFF"}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.sensorStatusMessage,
                { color: c.muted },
              ]}
              numberOfLines={2}
            >
              {status.message}
            </Text>
          </View>
        </View>

        {!status.permissionGranted && (
          <View
            style={styles.permissionArea}
          >
            <Button
              title="Allow step tracking"
              onPress={request}
            />
          </View>
        )}

        {message ? (
          <View
            style={[
              styles.messagePill,
              {
                backgroundColor:
                  c.surfaceAlt,
                borderColor:
                  c.border,
              },
            ]}
          >
            <View
              style={[
                styles.messageCircle,
                {
                  backgroundColor:
                    `${ACCENT}12`,
                },
              ]}
            >
              <Ionicons
                name="information-outline"
                size={15}
                color={ACCENT}
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

        {/* ===================================================
            TRACKING ACCURACY
        =================================================== */}

        <SectionHeader
          title="Tracking accuracy"
          subtitle="How FitPulse handles your step data"
          icon="shield-checkmark-outline"
        />

        <Card
          style={[
            styles.accuracyCard,
            {
              backgroundColor:
                `${ACCENT}08`,
              borderColor:
                `${ACCENT}25`,
            },
          ]}
        >
          <View
            style={styles.accuracyTop}
          >
            <View
              style={[
                styles.accuracyIcon,
                {
                  backgroundColor:
                    ACCENT,
                },
              ]}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#0A0F0C"
              />
            </View>

            <Text
              style={[
                styles.accuracyTitle,
                { color: c.text },
              ]}
            >
              Real sensor data
            </Text>
          </View>

          <Text
            style={[
              styles.accuracyText,
              { color: c.muted },
            ]}
          >
            FitPulse uses your device pedometer
            for observed step data. Android Expo
            Pedometer updates may stop while the
            app is in the background, so FitPulse
            does not invent background steps.
            Full background and historical tracking
            can be added through a native Health
            Connect adapter.
          </Text>
        </Card>

        <View
          style={styles.bottomSpace}
        />
      </ScrollView>
    </Screen>
  );
}

/* ========================================================= */
/* SECTION HEADER                                            */
/* ========================================================= */

function SectionHeader({
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
    <View
      style={styles.sectionHeader}
    >
      <View
        style={styles.sectionText}
      >
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
                `${ACCENT}14`,
              borderColor:
                `${ACCENT}25`,
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={17}
            color={ACCENT}
          />
        </View>
      ) : null}
    </View>
  );
}

/* ========================================================= */
/* SUMMARY STAT                                              */
/* ========================================================= */

function SummaryStat({
  icon,
  label,
  value,
  c,
}: {
  icon: IconName;
  label: string;
  value: string;
  c: ReturnType<typeof useAppColors>;
}) {
  return (
    <View
      style={styles.summaryStat}
    >
      <View
        style={[
          styles.summaryIcon,
          {
            backgroundColor:
              `${ACCENT}12`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={14}
          color={ACCENT}
        />
      </View>

      <View
        style={styles.summaryCopy}
      >
        <Text
          style={[
            styles.summaryLabel,
            { color: c.muted },
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.summaryValue,
            { color: c.text },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

/* ========================================================= */
/* STAT CARD                                                 */
/* ========================================================= */

function StatCard({
  icon,
  title,
  value,
  suffix,
  c,
}: {
  icon: IconName;
  title: string;
  value: string;
  suffix?: string;
  c: ReturnType<typeof useAppColors>;
}) {
  return (
    <Card
      style={[
        styles.statCard,
        {
          backgroundColor:
            c.surface,
          borderColor:
            c.border,
        },
      ]}
    >
      <View
        style={[
          styles.statIcon,
          {
            backgroundColor:
              `${ACCENT}12`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={17}
          color={ACCENT}
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

      <View
        style={styles.statValueRow}
      >
        <Text
          style={[
            styles.statValue,
            { color: c.text },
          ]}
          numberOfLines={1}
        >
          {value}
        </Text>

        {suffix ? (
          <Text
            style={[
              styles.statSuffix,
              { color: c.muted },
            ]}
          >
            {suffix}
          </Text>
        ) : null}
      </View>
    </Card>
  );
}

/* ========================================================= */
/* WEEKLY STAT                                               */
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
    <View
      style={styles.weeklyStat}
    >
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
      >
        {value}
      </Text>
    </View>
  );
}

/* ========================================================= */
/* STYLES                                                     */
/* ========================================================= */

const styles =
  StyleSheet.create({
    content: {
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 150,
    },

    /* Header */

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 19,
    },

    headerText: {
      flex: 1,
      paddingRight: 12,
    },

    headerDescription: {
      fontSize: 11,
      lineHeight: 17,
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

    /* Hero */

    hero: {
      borderRadius: 26,
      borderWidth: 1,
      padding: 19,
      marginBottom: 24,
    },

    heroHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    heroCopy: {
      flex: 1,
      paddingRight: 10,
    },

    eyebrow: {
      fontSize: 9,
      fontWeight: "900",
      letterSpacing: 1.15,
      marginBottom: 5,
    },

    heroNumber: {
      fontSize: 41,
      fontWeight: "900",
      letterSpacing: -1.4,
    },

    goalLine: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 7,
    },

    goalDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 7,
    },

    goalLineText: {
      fontSize: 10,
      fontWeight: "600",
    },

    heroRing: {
      alignItems: "center",
      justifyContent: "center",
    },

    progressTrack: {
      height: 8,
      borderRadius: 999,
      overflow: "hidden",
      marginTop: 20,
    },

    progressFill: {
      height: "100%",
      borderRadius: 999,
    },

    progressFooter: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      marginTop: 8,
    },

    progressLeft: {
      fontSize: 10,
      fontWeight: "900",
    },

    progressRight: {
      fontSize: 10,
      fontWeight: "600",
    },

    heroSummary: {
      flexDirection: "row",
      alignItems: "center",
      borderTopWidth: 1,
      marginTop: 16,
      paddingTop: 14,
    },

    summaryStat: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },

    summaryIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },

    summaryCopy: {
      flex: 1,
      marginLeft: 8,
    },

    summaryLabel: {
      fontSize: 8,
      fontWeight: "600",
    },

    summaryValue: {
      fontSize: 12,
      fontWeight: "900",
      marginTop: 2,
    },

    summaryDivider: {
      width: 1,
      height: 31,
      marginHorizontal: 9,
    },

    /* Sections */

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 10,
    },

    sectionText: {
      flex: 1,
    },

    sectionTitle: {
      fontSize: 17,
      fontWeight: "900",
      letterSpacing: -0.2,
    },

    sectionSubtitle: {
      fontSize: 10,
      lineHeight: 15,
      marginTop: 3,
    },

    sectionIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    /* Stats */

    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent:
        "space-between",
      rowGap: 10,
      marginBottom: 24,
    },

    statCard: {
      width: "48.5%",
      minHeight: 112,
      borderRadius: 21,
      marginBottom: 0,
    },

    statIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 9,
    },

    statTitle: {
      fontSize: 10,
      fontWeight: "600",
    },

    statValueRow: {
      flexDirection: "row",
      alignItems: "baseline",
      marginTop: 3,
    },

    statValue: {
      fontSize: 18,
      fontWeight: "900",
    },

    statSuffix: {
      fontSize: 8,
      fontWeight: "700",
      marginLeft: 3,
    },

    /* FitPulse Insight */

    insightCard: {
      minHeight: 86,
      borderRadius: 999,
      borderWidth: 1,
      paddingVertical: 11,
      paddingLeft: 11,
      paddingRight: 13,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
    },

    insightIcon: {
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },

    insightContent: {
      flex: 1,
      marginLeft: 11,
      minWidth: 0,
    },

    insightTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 3,
    },

    insightEyebrow: {
      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 1,
    },

    insightBadge: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 7,
      paddingVertical: 3,
      marginLeft: 8,
    },

    insightBadgeDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      marginRight: 4,
    },

    insightBadgeText: {
      fontSize: 7,
      fontWeight: "900",
      letterSpacing: 0.6,
    },

    insightTitle: {
      fontSize: 14,
      fontWeight: "900",
    },

    insightText: {
      fontSize: 10,
      lineHeight: 16,
      marginTop: 3,
    },

    /* Chart */

    chartCard: {
      borderRadius: 22,
      padding: 16,
      marginBottom: 24,
    },

    chartHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 8,
    },

    chartTitle: {
      fontSize: 14,
      fontWeight: "900",
    },

    chartSubtitle: {
      fontSize: 9,
      marginTop: 3,
    },

    chartBadge: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 5,
    },

    chartDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      marginRight: 5,
    },

    chartBadgeText: {
      fontSize: 7,
      fontWeight: "900",
      letterSpacing: 0.7,
    },

    chartArea: {
      marginTop: 4,
    },

    divider: {
      height: 1,
      marginVertical: 15,
    },

    weeklyStats: {
      flexDirection: "row",
    },

    weeklyStat: {
      flex: 1,
    },

    weeklyLabel: {
      fontSize: 9,
      fontWeight: "600",
    },

    weeklyValue: {
      fontSize: 15,
      fontWeight: "900",
      marginTop: 3,
    },

    /* Sensor pill */

    sensorPill: {
      minHeight: 68,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 8,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },

    sensorCircle: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },

    sensorInfo: {
      flex: 1,
      marginLeft: 10,
      minWidth: 0,
    },

    sensorTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    sensorTitle: {
      flex: 1,
      fontSize: 12,
      fontWeight: "900",
      paddingRight: 7,
    },

    sensorStatusPill: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 7,
      paddingVertical: 4,
    },

    sensorStatusDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      marginRight: 4,
    },

    sensorStatusText: {
      fontSize: 7,
      fontWeight: "900",
      letterSpacing: 0.6,
    },

    sensorStatusMessage: {
      fontSize: 9,
      lineHeight: 14,
      marginTop: 3,
    },

    permissionArea: {
      marginTop: 7,
      marginBottom: 10,
    },

    messagePill: {
      minHeight: 48,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 7,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
    },

    messageCircle: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
    },

    messageText: {
      flex: 1,
      fontSize: 9,
      lineHeight: 15,
      marginLeft: 8,
    },

    /* Accuracy */

    accuracyCard: {
      borderRadius: 22,
      padding: 16,
      marginBottom: 15,
      borderWidth: 1,
    },

    accuracyTop: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },

    accuracyIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: "center",
      justifyContent: "center",
    },

    accuracyTitle: {
      fontSize: 14,
      fontWeight: "900",
      marginLeft: 9,
    },

    accuracyText: {
      fontSize: 10,
      lineHeight: 17,
    },

    bottomSpace: {
      height: 20,
    },
  });
