import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card, Screen, Subtitle, Title, useAppColors } from "@/components/ui";
import { MiniChart } from "@/components/MiniChart";
import { useFitness } from "@/hooks/useFitness";
import { lastNDays } from "@/utils/date";

export default function StatisticsScreen() {
  const c = useAppColors();
  const { state } = useFitness();

  // -----------------------------
  // Date ranges
  // -----------------------------
  const days14 = lastNDays(14);
  const days30 = lastNDays(30);

  // -----------------------------
  // Step data
  // -----------------------------
  const steps14 = days14.map(
    (day) => state.steps[day]?.steps ?? 0
  );

  const steps30 = days30.map(
    (day) => state.steps[day]?.steps ?? 0
  );

  // -----------------------------
  // Calories data
  // -----------------------------
  const calories14 = days14.map((day) =>
    state.foods
      .filter((food) => food.createdAt.slice(0, 10) === day)
      .reduce(
        (sum, food) => sum + food.calories * food.servings,
        0
      )
  );

  // -----------------------------
  // Step calculations
  // -----------------------------
  const averageSteps = Math.round(
    steps14.reduce((sum, value) => sum + value, 0) /
      Math.max(1, steps14.length)
  );

  const highestSteps = Math.max(...steps14, 0);

  const highestDayIndex = steps14.indexOf(highestSteps);

  // FIX:
  // Never directly use days14[highestDayIndex].
  // If the index is invalid, show N/A.
  const highestDay =
    highestDayIndex >= 0 && days14[highestDayIndex]
      ? days14[highestDayIndex]
      : "N/A";

  const goalDays = steps14.filter(
    (value) => value >= state.profile.stepGoal
  ).length;

  const goalCompletion = Math.round(
    (goalDays / Math.max(1, steps14.length)) * 100
  );

  const trackedDays = steps14.filter(
    (value) => value > 0
  ).length;

  // -----------------------------
  // Monthly calculations
  // -----------------------------
  const monthlyTotal = steps30.reduce(
    (sum, value) => sum + value,
    0
  );

  const monthlyAverage = Math.round(
    monthlyTotal / Math.max(1, steps30.length)
  );

  const monthlyBest = Math.max(...steps30, 0);

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Subtitle>Insights & trends</Subtitle>
          <Title>Statistics</Title>

          <Text style={[styles.headerDescription, { color: c.muted }]}>
            Understand your activity, consistency, and progress over time.
          </Text>
        </View>

        {/* Overview */}
        <View style={styles.overviewGrid}>
          <StatCard
            title="Daily average"
            value={averageSteps.toLocaleString()}
            subtitle="steps"
            icon="↑"
          />

          <StatCard
            title="Best day"
            value={highestSteps.toLocaleString()}
            subtitle="steps"
            icon="★"
          />

          <StatCard
            title="Goal rate"
            value={`${goalCompletion}%`}
            subtitle="last 14 days"
            icon="%"
          />

          <StatCard
            title="Tracked"
            value={`${trackedDays}`}
            subtitle="active days"
            icon="●"
          />
        </View>

        {/* 14 Day Steps */}
        <Card style={styles.chartCard}>
          <Text style={[styles.heading, { color: c.text }]}>
            Steps · Last 14 Days
          </Text>

          <Text style={[styles.chartDescription, { color: c.muted }]}>
            Your daily walking activity compared across the last two weeks.
          </Text>

          <MiniChart
            values={steps14}
            labels={days14}
          />
        </Card>

        {/* Calories */}
        <Card style={styles.chartCard}>
          <Text style={[styles.heading, { color: c.text }]}>
            Calories Consumed
          </Text>

          <Text style={[styles.chartDescription, { color: c.muted }]}>
            Daily calorie intake based on the meals you logged.
          </Text>

          <MiniChart
            values={calories14}
            labels={days14}
          />
        </Card>

        {/* Monthly */}
        <Card style={styles.chartCard}>
          <Text style={[styles.heading, { color: c.text }]}>
            Monthly Activity
          </Text>

          <Text style={[styles.chartDescription, { color: c.muted }]}>
            Your step activity across the last 30 days.
          </Text>

          <MiniChart
            values={steps30}
            labels={days30}
            height={160}
          />

          <View style={styles.monthlySummary}>
            <View>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: c.muted },
                ]}
              >
                Total steps
              </Text>

              <Text
                style={[
                  styles.summaryValue,
                  { color: c.text },
                ]}
              >
                {monthlyTotal.toLocaleString()}
              </Text>
            </View>

            <View>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: c.muted },
                ]}
              >
                Daily average
              </Text>

              <Text
                style={[
                  styles.summaryValue,
                  { color: c.text },
                ]}
              >
                {monthlyAverage.toLocaleString()}
              </Text>
            </View>

            <View>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: c.muted },
                ]}
              >
                Best day
              </Text>

              <Text
                style={[
                  styles.summaryValue,
                  { color: c.text },
                ]}
              >
                {monthlyBest.toLocaleString()}
              </Text>
            </View>
          </View>
        </Card>

        {/* Highlights */}
        <Card style={styles.highlightCard}>
          <Text style={[styles.heading, { color: c.text }]}>
            Your Highlights
          </Text>

          <StatRow
            label="Average daily steps"
            value={`${averageSteps.toLocaleString()} steps`}
          />

          <StatRow
            label="Best step day"
            value={`${highestSteps.toLocaleString()} steps`}
          />

          {/* FIXED LINE */}
          <StatRow
            label="Best day"
            value={highestDay}
          />

          <StatRow
            label="Goal completion"
            value={`${goalCompletion}%`}
          />

          <StatRow
            label="Tracked days"
            value={`${trackedDays}/14`}
          />
        </Card>

        {/* Insight */}
        <Card style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View
              style={[
                styles.insightIcon,
                { backgroundColor: c.primarySoft },
              ]}
            >
              <Text
                style={[
                  styles.insightIconText,
                  { color: c.primary },
                ]}
              >
                ✦
              </Text>
            </View>

            <Text
              style={[
                styles.insightTitle,
                { color: c.text },
              ]}
            >
              What this means
            </Text>
          </View>

          <Text
            style={[
              styles.insightText,
              { color: c.muted },
            ]}
          >
            Focus on consistency rather than chasing a single
            perfect day. Your trends become more useful as you
            continue recording real activity.
          </Text>
        </Card>

        {/* Data note */}
        <Text style={[styles.footerNote, { color: c.muted }]}>
          FitPulse statistics are calculated from the activity,
          food, and health data recorded in the app.
        </Text>
      </ScrollView>
    </Screen>
  );
}

// -------------------------------------
// Stat Card
// -------------------------------------

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}) {
  const c = useAppColors();

  return (
    <Card style={styles.statCard}>
      <View style={styles.statTop}>
        <Text
          style={[
            styles.statIcon,
            { color: c.primary },
          ]}
        >
          {icon}
        </Text>

        <Text
          style={[
            styles.statTitle,
            { color: c.muted },
          ]}
        >
          {title}
        </Text>
      </View>

      <Text
        style={[
          styles.statValue,
          { color: c.text },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.statSubtitle,
          { color: c.muted },
        ]}
      >
        {subtitle}
      </Text>
    </Card>
  );
}

// -------------------------------------
// Highlight Row
// -------------------------------------

function StatRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const c = useAppColors();

  return (
    <View
      style={[
        styles.row,
        { borderBottomColor: c.border },
      ]}
    >
      <Text
        style={[
          styles.rowLabel,
          { color: c.muted },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.rowValue,
          { color: c.text },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

// -------------------------------------
// Styles
// -------------------------------------

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 110,
  },

  header: {
    marginBottom: 20,
  },

  headerDescription: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    maxWidth: 340,
  },

  overviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },

  statCard: {
    width: "48%",
    minHeight: 125,
    justifyContent: "space-between",
  },

  statTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  statIcon: {
    fontSize: 16,
    fontWeight: "900",
  },

  statTitle: {
    fontSize: 12,
    fontWeight: "600",
  },

  statValue: {
    fontSize: 24,
    fontWeight: "900",
    marginTop: 12,
  },

  statSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },

  chartCard: {
    marginTop: 10,
  },

  heading: {
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 5,
  },

  chartDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },

  monthlySummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    paddingTop: 15,
    borderTopWidth: 1,
  },

  summaryLabel: {
    fontSize: 10,
    marginBottom: 4,
  },

  summaryValue: {
    fontSize: 16,
    fontWeight: "900",
  },

  highlightCard: {
    marginTop: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
  },

  rowLabel: {
    fontSize: 13,
    flex: 1,
  },

  rowValue: {
    fontSize: 13,
    fontWeight: "800",
    marginLeft: 12,
  },

  insightCard: {
    marginTop: 10,
  },

  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  insightIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  insightIconText: {
    fontSize: 18,
    fontWeight: "900",
  },

  insightTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  insightText: {
    fontSize: 14,
    lineHeight: 21,
  },

  footerNote: {
    textAlign: "center",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 18,
    paddingHorizontal: 20,
  },
});