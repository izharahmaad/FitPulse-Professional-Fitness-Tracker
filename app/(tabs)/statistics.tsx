import React, { useEffect, useMemo } from "react";
import {
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

import { MiniChart } from "@/components/MiniChart";
import { useFitness } from "@/hooks/useFitness";
import { usePedometer } from "@/hooks/usePedometer";
import { lastNDays } from "@/utils/date";

const ACCENT = "#B7FF1A";

type IconName = keyof typeof Ionicons.glyphMap;

export default function StatisticsScreen() {
  const c = useAppColors();

  const { state } = useFitness();

  const {
    status,
    reconcileIosHistory,
  } = usePedometer();

  /* =========================================================
     REAL SENSOR RECONCILIATION
  ========================================================= */

  useEffect(() => {
    void reconcileIosHistory();
  }, [reconcileIosHistory]);

  /* =========================================================
     DATE RANGES
  ========================================================= */

  const days14 = useMemo(
    () => lastNDays(14),
    []
  );

  const days30 = useMemo(
    () => lastNDays(30),
    []
  );

  /* =========================================================
     REAL STEP DATA
  ========================================================= */

  const steps14 = useMemo(
    () =>
      days14.map(
        (day) =>
          state.steps[day]?.steps ?? 0
      ),
    [days14, state.steps]
  );

  const steps30 = useMemo(
    () =>
      days30.map(
        (day) =>
          state.steps[day]?.steps ?? 0
      ),
    [days30, state.steps]
  );

  /* =========================================================
     REAL CALORIE DATA
  ========================================================= */

  const calories14 = useMemo(
    () =>
      days14.map((day) =>
        state.foods
          .filter(
            (food) =>
              food.createdAt.slice(
                0,
                10
              ) === day
          )
          .reduce(
            (sum, food) =>
              sum +
              food.calories *
                food.servings,
            0
          )
      ),
    [days14, state.foods]
  );

  /* =========================================================
     14-DAY METRICS
  ========================================================= */

  const averageSteps = Math.round(
    steps14.reduce(
      (sum, value) =>
        sum + value,
      0
    ) /
      Math.max(
        1,
        steps14.length
      )
  );

  const highestSteps = Math.max(
    ...steps14,
    0
  );

  const highestDayIndex =
    steps14.indexOf(
      highestSteps
    );

  const highestDay =
    highestDayIndex >= 0 &&
    days14[highestDayIndex]
      ? days14[highestDayIndex]
      : "N/A";

  const goalDays = steps14.filter(
    (value) =>
      value >= state.profile.stepGoal
  ).length;

  const goalRate = Math.round(
    (goalDays /
      Math.max(
        1,
        steps14.length
      )) *
      100
  );

  const trackedDays =
    steps14.filter(
      (value) => value > 0
    ).length;

  /* =========================================================
     30-DAY METRICS
  ========================================================= */

  const monthlyTotal =
    steps30.reduce(
      (sum, value) =>
        sum + value,
      0
    );

  const monthlyAverage =
    Math.round(
      monthlyTotal /
        Math.max(
          1,
          steps30.length
        )
    );

  const monthlyBest = Math.max(
    ...steps30,
    0
  );

  /* =========================================================
     CALORIE METRICS
  ========================================================= */

  const calorieTotal = Math.round(
    calories14.reduce(
      (sum, value) =>
        sum + value,
      0
    )
  );

  const calorieAverage = Math.round(
    calorieTotal /
      Math.max(
        1,
        calories14.length
      )
  );

  const highestCalorieDay =
    Math.max(
      ...calories14,
      0
    );

  /* =========================================================
     SENSOR STATUS
  ========================================================= */

  const sensorReady =
    status.available &&
    status.permissionGranted;

  /* =========================================================
     SMART INSIGHT
  ========================================================= */

  const insight = useMemo(() => {
    if (trackedDays === 0) {
      return {
        title:
          "Your history is just getting started",
        text:
          "Keep using the device step sensor and recording meals. Your trends will become more meaningful as real data accumulates.",
        icon:
          "analytics-outline" as IconName,
      };
    }

    if (goalRate >= 70) {
      return {
        title:
          "Excellent consistency",
        text:
          "You've reached your daily step target on most tracked days. Your routine is showing strong consistency.",
        icon:
          "trending-up-outline" as IconName,
      };
    }

    if (goalRate >= 40) {
      return {
        title:
          "Good momentum",
        text:
          "You're building a useful activity pattern. More consistent days should raise your goal completion rate.",
        icon:
          "walk-outline" as IconName,
      };
    }

    return {
      title:
        "Build the routine first",
      text:
        "Your trend is still developing. Focus on regular movement rather than chasing a single high-step day.",
      icon:
        "footsteps-outline" as IconName,
    };
  }, [
    trackedDays,
    goalRate,
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
            <Subtitle>
              Performance overview
            </Subtitle>

            <Title>
              Statistics
            </Title>

            <Text
              style={[
                styles.headerDescription,
                { color: c.muted },
              ]}
            >
              Your recorded activity, nutrition,
              and consistency over time.
            </Text>
          </View>

          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor:
                  `${ACCENT}14`,
                borderColor:
                  `${ACCENT}28`,
              },
            ]}
          >
            <Ionicons
              name="stats-chart"
              size={21}
              color={ACCENT}
            />
          </View>
        </View>

        {/* ===================================================
            LIVE SENSOR STATUS
        =================================================== */}

        <View
          style={[
            styles.liveBar,
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
              styles.liveCircle,
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
              size={17}
              color={
                sensorReady
                  ? ACCENT
                  : c.muted
              }
            />
          </View>

          <View style={styles.liveText}>
            <Text
              style={[
                styles.liveTitle,
                { color: c.text },
              ]}
            >
              {sensorReady
                ? "Live step tracking"
                : "Step sensor unavailable"}
            </Text>

            <Text
              style={[
                styles.liveSubtitle,
                { color: c.muted },
              ]}
              numberOfLines={1}
            >
              {status.message}
            </Text>
          </View>

          <View
            style={[
              styles.liveDot,
              {
                backgroundColor:
                  sensorReady
                    ? ACCENT
                    : c.danger,
              },
            ]}
          />
        </View>

        {/* ===================================================
            KPI ROW
        =================================================== */}

        <View style={styles.kpiRow}>
          <Kpi
            label="Avg. steps"
            value={averageSteps.toLocaleString()}
            icon="trending-up-outline"
            c={c}
          />

          <Kpi
            label="Goal rate"
            value={`${goalRate}%`}
            icon="flag-outline"
            c={c}
          />

          <Kpi
            label="Tracked"
            value={`${trackedDays}/14`}
            icon="calendar-outline"
            c={c}
          />
        </View>

        {/* ===================================================
            MAIN 30-DAY ACTIVITY GRAPH
        =================================================== */}

        <Card
          style={[
            styles.heroChart,
            {
              backgroundColor:
                c.surface,
              borderColor:
                c.border,
            },
          ]}
        >
          <View style={styles.heroChartHeader}>
            <View style={styles.heroChartText}>
              <Text
                style={[
                  styles.eyebrow,
                  { color: c.muted },
                ]}
              >
                ACTIVITY TREND
              </Text>

              <View style={styles.titleRow}>
                <Text
                  style={[
                    styles.heroChartTitle,
                    { color: c.text },
                  ]}
                >
                  Last 30 days
                </Text>

                <View
                  style={[
                    styles.chartBadge,
                    {
                      backgroundColor:
                        `${ACCENT}14`,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chartBadgeText,
                      { color: ACCENT },
                    ]}
                  >
                    REAL DATA
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  styles.heroChartDescription,
                  { color: c.muted },
                ]}
              >
                Daily steps captured from your
                recorded device activity.
              </Text>
            </View>
          </View>

          <View style={styles.heroChartArea}>
            <MiniChart
              values={steps30}
              labels={days30}
              height={190}
            />
          </View>

          <View
            style={[
              styles.heroStats,
              {
                borderTopColor:
                  c.border,
              },
            ]}
          >
            <HeroStat
              label="Total"
              value={
                monthlyTotal.toLocaleString()
              }
              c={c}
            />

            <HeroStat
              label="Daily avg."
              value={
                monthlyAverage.toLocaleString()
              }
              c={c}
            />

            <HeroStat
              label="Best"
              value={
                monthlyBest.toLocaleString()
              }
              c={c}
            />
          </View>
        </Card>

        {/* ===================================================
            RECENT PERFORMANCE
        =================================================== */}

        <SectionHeader
          title="Recent performance"
          subtitle="Last 14 days"
          icon="footsteps-outline"
        />

        <Card
          style={[
            styles.secondaryChart,
            {
              backgroundColor:
                c.surface,
              borderColor:
                c.border,
            },
          ]}
        >
          <View style={styles.chartHeader}>
            <View style={styles.chartHeaderText}>
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
                  styles.chartDescription,
                  { color: c.muted },
                ]}
              >
                A closer look at your recent
                consistency.
              </Text>
            </View>

            <View
              style={[
                styles.chartCircle,
                {
                  backgroundColor:
                    `${ACCENT}14`,
                },
              ]}
            >
              <Ionicons
                name="footsteps-outline"
                size={17}
                color={ACCENT}
              />
            </View>
          </View>

          <View style={styles.chartArea}>
            <MiniChart
              values={steps14}
              labels={days14}
              height={145}
            />
          </View>

          <View
            style={[
              styles.detailRow,
              {
                borderTopColor:
                  c.border,
              },
            ]}
          >
            <Detail
              label="Average"
              value={
                averageSteps.toLocaleString()
              }
              c={c}
            />

            <Detail
              label="Best"
              value={
                highestSteps.toLocaleString()
              }
              c={c}
            />

            <Detail
              label="Goal rate"
              value={`${goalRate}%`}
              c={c}
            />
          </View>
        </Card>

        {/* ===================================================
            CALORIE TREND
        =================================================== */}

        <SectionHeader
          title="Nutrition trend"
          subtitle="Calories · last 14 days"
          icon="flame-outline"
        />

        <Card
          style={[
            styles.secondaryChart,
            {
              backgroundColor:
                c.surface,
              borderColor:
                c.border,
            },
          ]}
        >
          <View style={styles.chartHeader}>
            <View style={styles.chartHeaderText}>
              <Text
                style={[
                  styles.chartTitle,
                  { color: c.text },
                ]}
              >
                Calorie intake
              </Text>

              <Text
                style={[
                  styles.chartDescription,
                  { color: c.muted },
                ]}
              >
                Based only on meals recorded
                inside FitPulse.
              </Text>
            </View>

            <View
              style={[
                styles.chartCircle,
                {
                  backgroundColor:
                    `${ACCENT}14`,
                },
              ]}
            >
              <Ionicons
                name="flame-outline"
                size={17}
                color={ACCENT}
              />
            </View>
          </View>

          <View style={styles.chartArea}>
            <MiniChart
              values={calories14}
              labels={days14}
              height={140}
            />
          </View>

          <View
            style={[
              styles.detailRow,
              {
                borderTopColor:
                  c.border,
              },
            ]}
          >
            <Detail
              label="Total"
              value={`${calorieTotal}`}
              suffix="kcal"
              c={c}
            />

            <Detail
              label="Daily avg."
              value={`${calorieAverage}`}
              suffix="kcal"
              c={c}
            />

            <Detail
              label="Peak"
              value={`${highestCalorieDay}`}
              suffix="kcal"
              c={c}
            />
          </View>
        </Card>

        {/* ===================================================
            HIGHLIGHTS
        =================================================== */}

        <SectionHeader
          title="Highlights"
          subtitle="Key moments from your history"
          icon="sparkles-outline"
        />

        <Card
          style={[
            styles.highlightCard,
            {
              backgroundColor:
                c.surface,
              borderColor:
                c.border,
            },
          ]}
        >
          <Highlight
            icon="trophy-outline"
            label="Best step day"
            value={
              highestSteps.toLocaleString()
            }
            suffix="steps"
            c={c}
          />

          <Highlight
            icon="calendar-outline"
            label="Best recorded date"
            value={highestDay}
            suffix=""
            c={c}
          />

          <Highlight
            icon="flag-outline"
            label="Goal completion"
            value={`${goalRate}%`}
            suffix=""
            c={c}
          />

          <Highlight
            icon="checkmark-circle-outline"
            label="Tracked days"
            value={`${trackedDays}/14`}
            suffix=""
            c={c}
            last
          />
        </Card>

        {/* ===================================================
            INSIGHT
        =================================================== */}

        <Card
          style={[
            styles.insightCard,
            {
              backgroundColor:
                `${ACCENT}08`,
              borderColor:
                `${ACCENT}26`,
            },
          ]}
        >
          <View
            style={[
              styles.insightCircle,
              {
                backgroundColor:
                  ACCENT,
              },
            ]}
          >
            <Ionicons
              name={insight.icon}
              size={19}
              color="#0A0F0C"
            />
          </View>

          <View style={styles.insightContent}>
            <Text
              style={[
                styles.insightEyebrow,
                { color: ACCENT },
              ]}
            >
              FITPULSE INSIGHT
            </Text>

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

        {/* Bottom spacing only */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </Screen>
  );
}

/* ========================================================= */
/* KPI */
/* ========================================================= */

function Kpi({
  label,
  value,
  icon,
  c,
}: {
  label: string;
  value: string;
  icon: IconName;
  c: ReturnType<typeof useAppColors>;
}) {
  return (
    <View
      style={[
        styles.kpi,
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
          styles.kpiIcon,
          {
            backgroundColor:
              `${ACCENT}14`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={15}
          color={ACCENT}
        />
      </View>

      <Text
        style={[
          styles.kpiLabel,
          { color: c.muted },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.kpiValue,
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
/* HERO STAT */
/* ========================================================= */

function HeroStat({
  label,
  value,
  c,
}: {
  label: string;
  value: string;
  c: ReturnType<typeof useAppColors>;
}) {
  return (
    <View style={styles.heroStat}>
      <Text
        style={[
          styles.heroStatLabel,
          { color: c.muted },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.heroStatValue,
          { color: c.text },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

/* ========================================================= */
/* DETAIL */
/* ========================================================= */

function Detail({
  label,
  value,
  suffix,
  c,
}: {
  label: string;
  value: string;
  suffix?: string;
  c: ReturnType<typeof useAppColors>;
}) {
  return (
    <View style={styles.detail}>
      <Text
        style={[
          styles.detailLabel,
          { color: c.muted },
        ]}
      >
        {label}
      </Text>

      <View style={styles.detailValueRow}>
        <Text
          style={[
            styles.detailValue,
            { color: c.text },
          ]}
        >
          {value}
        </Text>

        {suffix ? (
          <Text
            style={[
              styles.detailSuffix,
              { color: c.muted },
            ]}
          >
            {suffix}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/* ========================================================= */
/* HIGHLIGHT */
/* ========================================================= */

function Highlight({
  icon,
  label,
  value,
  suffix,
  c,
  last = false,
}: {
  icon: IconName;
  label: string;
  value: string;
  suffix: string;
  c: ReturnType<typeof useAppColors>;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.highlight,
        !last && {
          borderBottomWidth: 1,
          borderBottomColor:
            c.border,
        },
      ]}
    >
      <View
        style={[
          styles.highlightIcon,
          {
            backgroundColor:
              `${ACCENT}14`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={16}
          color={ACCENT}
        />
      </View>

      <Text
        style={[
          styles.highlightLabel,
          { color: c.muted },
        ]}
      >
        {label}
      </Text>

      <View style={styles.highlightValueRow}>
        <Text
          style={[
            styles.highlightValue,
            { color: c.text },
          ]}
        >
          {value}
        </Text>

        {suffix ? (
          <Text
            style={[
              styles.highlightSuffix,
              { color: c.muted },
            ]}
          >
            {suffix}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/* ========================================================= */
/* SECTION HEADER */
/* ========================================================= */

function SectionHeader({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: IconName;
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
    paddingBottom: 130,
  },

  /* Header */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  headerText: {
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

  /* Live sensor */

  liveBar: {
    minHeight: 58,

    /*
     * Fully rounded pill,
     * same language as your footer.
     */
    borderRadius: 999,

    borderWidth: 1,

    paddingHorizontal: 9,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 18,
  },

  liveCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,

    borderWidth: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  liveText: {
    flex: 1,
    marginLeft: 10,
    paddingRight: 8,
  },

  liveTitle: {
    fontSize: 12,
    fontWeight: "900",
  },

  liveSubtitle: {
    fontSize: 9,
    lineHeight: 14,
    marginTop: 2,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 7,
  },

  /* KPI */

  kpiRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 25,
  },

  kpi: {
    flex: 1,
    minHeight: 103,

    borderRadius: 20,
    borderWidth: 1,

    padding: 11,
  },

  kpiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 8,
  },

  kpiLabel: {
    fontSize: 9,
    fontWeight: "700",
  },

  kpiValue: {
    fontSize: 16,
    fontWeight: "900",
    marginTop: 4,
  },

  /* Hero graph */

  heroChart: {
    borderRadius: 24,
    padding: 17,
    marginBottom: 25,
  },

  heroChartHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  heroChartText: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 3,
  },

  heroChartTitle: {
    fontSize: 21,
    fontWeight: "900",
    letterSpacing: -0.4,
  },

  chartBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  chartBadgeText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  heroChartDescription: {
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },

  heroChartArea: {
    marginTop: 17,
    minHeight: 190,
  },

  heroStats: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 14,
    marginTop: 5,
  },

  heroStat: {
    flex: 1,
  },

  heroStatLabel: {
    fontSize: 9,
    fontWeight: "600",
  },

  heroStatValue: {
    fontSize: 16,
    fontWeight: "900",
    marginTop: 3,
  },

  /* Sections */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 11,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Secondary charts */

  secondaryChart: {
    borderRadius: 22,
    padding: 16,
    marginBottom: 25,
  },

  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  chartHeaderText: {
    flex: 1,
    paddingRight: 10,
  },

  chartTitle: {
    fontSize: 15,
    fontWeight: "900",
  },

  chartDescription: {
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },

  chartCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",
  },

  chartArea: {
    marginTop: 13,
  },

  detailRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 13,
    marginTop: 6,
  },

  detail: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 9,
    fontWeight: "600",
  },

  detailValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 3,
  },

  detailValue: {
    fontSize: 14,
    fontWeight: "900",
  },

  detailSuffix: {
    fontSize: 9,
    fontWeight: "600",
    marginLeft: 3,
  },

  /* Highlights */

  highlightCard: {
    borderRadius: 22,
    borderWidth: 1,

    paddingHorizontal: 8,

    marginBottom: 25,
  },

  highlight: {
    minHeight: 59,

    flexDirection: "row",
    alignItems: "center",
  },

  highlightIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",
  },

  highlightLabel: {
    flex: 1,

    fontSize: 11,
    fontWeight: "600",

    marginLeft: 10,
  },

  highlightValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginLeft: 8,
  },

  highlightValue: {
    fontSize: 12,
    fontWeight: "900",
  },

  highlightSuffix: {
    fontSize: 9,
    marginLeft: 3,
  },

  /* Insight */

  insightCard: {
    flexDirection: "row",

    borderRadius: 21,
    borderWidth: 1,

    padding: 15,
    marginBottom: 10,
  },

  insightCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,

    alignItems: "center",
    justifyContent: "center",
  },

  insightContent: {
    flex: 1,
    marginLeft: 11,
  },

  insightEyebrow: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 3,
  },

  insightTitle: {
    fontSize: 14,
    fontWeight: "900",
  },

  insightText: {
    fontSize: 11,
    lineHeight: 18,
    marginTop: 5,
  },

  bottomSpace: {
    height: 20,
  },
});