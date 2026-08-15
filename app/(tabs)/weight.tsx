import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  Card,
  Input,
  Label,
  Screen,
  Subtitle,
  Title,
  useAppColors,
} from "@/components/ui";

import { MiniChart } from "@/components/MiniChart";
import { useFitness } from "@/hooks/useFitness";

const ACCENT = "#B7FF1A";

type IconName = keyof typeof Ionicons.glyphMap;

export default function WeightScreen() {
  const c = useAppColors();

  const {
    state,
    latestWeightKg,
    addWeight,
    deleteWeight,
  } = useFitness();

  const [value, setValue] = useState("");

  /* =========================================================
     REAL WEIGHT HISTORY
  ========================================================= */

  const entries = useMemo(
    () => state.weights.slice(0, 30),
    [state.weights]
  );

  const targetWeight = state.profile.targetWeightKg;

  /*
   * Safely get the oldest tracked weight.
   * The state array is never mutated.
   */
  const oldestEntry =
    entries.length > 0
      ? entries[entries.length - 1]
      : undefined;

  const startingWeight =
    oldestEntry?.weightKg ??
    state.profile.weightKg;

  /* =========================================================
     REAL CALCULATIONS
  ========================================================= */

  const weightDifference =
    latestWeightKg - startingWeight;

  const targetDifference =
    latestWeightKg - targetWeight;

  const weightGoal =
    state.profile.weightGoal;

  const progressRange = Math.abs(
    startingWeight - targetWeight
  );

  let progress = 0;

  if (progressRange > 0) {
    if (weightGoal === "lose") {
      progress =
        ((startingWeight -
          latestWeightKg) /
          progressRange) *
        100;
    } else if (weightGoal === "gain") {
      progress =
        ((latestWeightKg -
          startingWeight) /
          progressRange) *
        100;
    } else {
      const currentDistance =
        Math.abs(
          latestWeightKg -
            targetWeight
        );

      progress =
        100 -
        (currentDistance /
          progressRange) *
          100;
    }
  }

  progress = Math.max(
    0,
    Math.min(100, progress)
  );

  const goalReached =
    Math.abs(
      latestWeightKg -
        targetWeight
    ) < 0.1;

  const movingTowardGoal =
    weightGoal === "lose"
      ? weightDifference < 0
      : weightGoal === "gain"
        ? weightDifference > 0
        : Math.abs(weightDifference) < 0.1;

  const goalLabel =
    weightGoal === "lose"
      ? "Lose"
      : weightGoal === "gain"
        ? "Gain"
        : "Maintain";

  const goalIcon: IconName =
    weightGoal === "lose"
      ? "trending-down-outline"
      : weightGoal === "gain"
        ? "trending-up-outline"
        : "remove-outline";

  const statusLabel = goalReached
    ? "Reached"
    : movingTowardGoal
      ? "On track"
      : "Review";

  /* =========================================================
     SAVE WEIGHT
  ========================================================= */

  const saveWeight = () => {
    const numericValue = Number(value);

    if (
      !value.trim() ||
      !Number.isFinite(numericValue)
    ) {
      Alert.alert(
        "Invalid weight",
        "Please enter a valid weight."
      );
      return;
    }

    if (
      numericValue < 20 ||
      numericValue > 400
    ) {
      Alert.alert(
        "Invalid weight",
        "Please enter a weight between 20 kg and 400 kg."
      );
      return;
    }

    addWeight(numericValue);
    setValue("");
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const confirmDelete = (id: string) => {
    Alert.alert(
      "Delete weigh-in?",
      "This measurement will be removed from your history.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteWeight(id),
        },
      ]
    );
  };

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
            <Subtitle>Body progress</Subtitle>

            <Title>Weight</Title>

            <Text
              style={[
                styles.headerDescription,
                { color: c.muted },
              ]}
            >
              Track your measurements and see how
              you're moving toward your target.
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
              name="scale-outline"
              size={21}
              color={ACCENT}
            />
          </View>
        </View>

        {/* ===================================================
            CURRENT WEIGHT
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
          <View style={styles.heroTop}>
            <View style={styles.heroMain}>
              <Text
                style={[
                  styles.overline,
                  { color: c.muted },
                ]}
              >
                CURRENT WEIGHT
              </Text>

              <View style={styles.weightRow}>
                <Text
                  style={[
                    styles.currentWeight,
                    { color: c.text },
                  ]}
                >
                  {latestWeightKg.toFixed(1)}
                </Text>

                <Text
                  style={[
                    styles.weightUnit,
                    { color: c.muted },
                  ]}
                >
                  kg
                </Text>
              </View>

              <View style={styles.goalPill}>
                <View
                  style={[
                    styles.goalPillCircle,
                    {
                      backgroundColor: `${ACCENT}12`,
                    },
                  ]}
                >
                  <Ionicons
                    name={goalIcon}
                    size={14}
                    color={ACCENT}
                  />
                </View>

                <Text
                  style={[
                    styles.goalPillText,
                    {
                      color:
                        movingTowardGoal ||
                        goalReached
                          ? ACCENT
                          : c.muted,
                    },
                  ]}
                >
                  {goalLabel}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.statusCircle,
                {
                  backgroundColor: `${ACCENT}08`,
                  borderColor: ACCENT,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusPercent,
                  { color: c.text },
                ]}
              >
                {Math.round(progress)}%
              </Text>

              <Text
                style={[
                  styles.statusPercentLabel,
                  { color: c.muted },
                ]}
              >
                progress
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: c.border },
            ]}
          />

          <View style={styles.goalSummary}>
            <SummaryItem
              icon="flag-outline"
              label="Target"
              value={`${targetWeight.toFixed(1)} kg`}
              c={c}
            />

            <View
              style={[
                styles.summaryDivider,
                {
                  backgroundColor: c.border,
                },
              ]}
            />

            <SummaryItem
              icon={
                goalReached
                  ? "checkmark-outline"
                  : "arrow-down-outline"
              }
              label={
                goalReached
                  ? "Status"
                  : "Remaining"
              }
              value={
                goalReached
                  ? "Reached"
                  : `${Math.abs(
                      targetDifference
                    ).toFixed(1)} kg`
              }
              c={c}
            />
          </View>

          <View
            style={[
              styles.progressTrack,
              {
                backgroundColor: c.surfaceAlt,
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: ACCENT,
                  width: `${progress}%`,
                },
              ]}
            />
          </View>

          <View style={styles.progressFooter}>
            <Text
              style={[
                styles.progressLabel,
                { color: c.muted },
              ]}
            >
              Goal progress
            </Text>

            <Text
              style={[
                styles.progressValue,
                { color: ACCENT },
              ]}
            >
              {Math.round(progress)}%
            </Text>
          </View>
        </Card>

        {/* ===================================================
            QUICK STATS
        =================================================== */}

        <View style={styles.statsGrid}>
          <Stat
            icon="swap-vertical-outline"
            title="Change"
            value={`${Math.abs(
              weightDifference
            ).toFixed(1)} kg`}
            subtitle={
              weightDifference === 0
                ? "No change"
                : weightDifference < 0
                  ? "Down"
                  : "Up"
            }
            c={c}
          />

          <Stat
            icon="flag-outline"
            title="Target"
            value={`${targetWeight.toFixed(1)} kg`}
            subtitle="Goal weight"
            c={c}
          />

          <Stat
            icon="calendar-outline"
            title="Entries"
            value={`${entries.length}`}
            subtitle="Tracked"
            c={c}
          />

          <Stat
            icon="checkmark-circle-outline"
            title="Status"
            value={statusLabel}
            subtitle="Goal status"
            c={c}
          />
        </View>

        {/* ===================================================
            NEW WEIGH-IN
        =================================================== */}

        <SectionHeader
          title="New weigh-in"
          subtitle="Add your latest measurement"
          icon="add-circle-outline"
        />

        <Card
          style={[
            styles.inputCard,
            {
              backgroundColor: c.surface,
              borderColor: c.border,
            },
          ]}
        >
          <View style={styles.inputLabelRow}>
            <View
              style={[
                styles.inputCircle,
                {
                  backgroundColor: `${ACCENT}12`,
                },
              ]}
            >
              <Ionicons
                name="scale-outline"
                size={15}
                color={ACCENT}
              />
            </View>

            <Label>Weight in kilograms</Label>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Input
                value={value}
                onChangeText={setValue}
                keyboardType="decimal-pad"
                placeholder="e.g. 79.5"
                style={styles.weightInput}
              />
            </View>

            <View
              style={[
                styles.unitPill,
                {
                  backgroundColor: c.surfaceAlt,
                  borderColor: c.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.unitPillText,
                  { color: c.muted },
                ]}
              >
                kg
              </Text>
            </View>
          </View>

          <Pressable
            onPress={saveWeight}
            style={({ pressed }) => [
              styles.saveButton,
              {
                backgroundColor: c.primarySoft,
                borderColor: `${c.primary}42`,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <View
              style={[
                styles.saveIcon,
                {
                  backgroundColor: `${ACCENT}14`,
                },
              ]}
            >
              <Ionicons
                name="checkmark"
                size={17}
                color={ACCENT}
              />
            </View>

            <View style={styles.saveText}>
              <Text
                style={[
                  styles.saveTitle,
                  { color: c.text },
                ]}
              >
                Save weigh-in
              </Text>

              <Text
                style={[
                  styles.saveSubtitle,
                  { color: c.muted },
                ]}
              >
                Add this measurement to your progress
              </Text>
            </View>

            <Ionicons
              name="arrow-forward"
              size={17}
              color={ACCENT}
            />
          </Pressable>
        </Card>

        {/* ===================================================
            TREND
        =================================================== */}

        {entries.length > 1 && (
          <>
            <SectionHeader
              title="Weight trend"
              subtitle="Your recent measurements"
              icon="analytics-outline"
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
              <View style={styles.chartTop}>
                <View>
                  <Text
                    style={[
                      styles.chartTitle,
                      { color: c.text },
                    ]}
                  >
                    Recent progress
                  </Text>

                  <Text
                    style={[
                      styles.chartSubtitle,
                      { color: c.muted },
                    ]}
                  >
                    Last{" "}
                    {Math.min(
                      30,
                      entries.length
                    )}{" "}
                    weigh-ins
                  </Text>
                </View>

                <View
                  style={[
                    styles.chartBadge,
                    {
                      backgroundColor: `${ACCENT}12`,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.chartDot,
                      {
                        backgroundColor: ACCENT,
                      },
                    ]}
                  />

                  <Text
                    style={[
                      styles.chartBadgeText,
                      { color: ACCENT },
                    ]}
                  >
                    TREND
                  </Text>
                </View>
              </View>

              <MiniChart
                values={entries
                  .slice()
                  .reverse()
                  .map(
                    (entry) =>
                      entry.weightKg
                  )}
                labels={entries
                  .slice()
                  .reverse()
                  .map(
                    (entry) =>
                      entry.createdAt.slice(
                        5,
                        10
                      )
                  )}
                height={155}
              />

              <View
                style={[
                  styles.chartDivider,
                  {
                    backgroundColor: c.border,
                  },
                ]}
              />

              <View
                style={styles.chartSummary}
              >
                <ChartSummary
                  label="Current"
                  value={`${latestWeightKg.toFixed(
                    1
                  )} kg`}
                  c={c}
                />

                <ChartSummary
                  label="Target"
                  value={`${targetWeight.toFixed(
                    1
                  )} kg`}
                  c={c}
                />

                <ChartSummary
                  label="Status"
                  value={statusLabel}
                  c={c}
                />
              </View>
            </Card>
          </>
        )}

        {/* ===================================================
            HISTORY
        =================================================== */}

        <SectionHeader
          title="Weight history"
          subtitle="Your latest measurements"
          icon="list-outline"
        />

        <View style={styles.historyHeader}>
          <View
            style={[
              styles.historyCount,
              {
                backgroundColor: c.surfaceAlt,
                borderColor: c.border,
              },
            ]}
          >
            <Text
              style={[
                styles.historyCountText,
                { color: c.muted },
              ]}
            >
              {entries.length}{" "}
              {entries.length === 1
                ? "entry"
                : "entries"}
            </Text>
          </View>
        </View>

        {entries.length === 0 ? (
          <Card
            style={[
              styles.emptyCard,
              {
                backgroundColor: c.surface,
                borderColor: c.border,
              },
            ]}
          >
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor: `${ACCENT}12`,
                  borderColor: `${ACCENT}25`,
                },
              ]}
            >
              <Ionicons
                name="scale-outline"
                size={27}
                color={ACCENT}
              />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                { color: c.text },
              ]}
            >
              No weigh-ins yet
            </Text>

            <Text
              style={[
                styles.emptyText,
                { color: c.muted },
              ]}
            >
              Add your first measurement above to
              start building your weight trend.
            </Text>
          </Card>
        ) : (
          entries.map((entry, index) => {
            const previousEntry =
              entries[index + 1];

            const previousWeight =
              previousEntry?.weightKg;

            const difference =
              previousWeight !== undefined
                ? entry.weightKg -
                  previousWeight
                : 0;

            const changeColor =
              difference < 0
                ? ACCENT
                : difference > 0
                  ? c.danger
                  : c.muted;

            return (
              <View
                key={entry.id}
                style={[
                  styles.historyItem,
                  {
                    backgroundColor: c.surface,
                    borderColor: c.border,
                  },
                ]}
              >
                <View style={styles.historyLeft}>
                  <View
                    style={[
                      styles.historyCircle,
                      {
                        backgroundColor: `${ACCENT}12`,
                        borderColor: `${ACCENT}22`,
                      },
                    ]}
                  >
                    <Ionicons
                      name="scale-outline"
                      size={17}
                      color={ACCENT}
                    />
                  </View>

                  <View style={styles.historyInfo}>
                    <Text
                      style={[
                        styles.historyWeight,
                        { color: c.text },
                      ]}
                    >
                      {entry.weightKg.toFixed(1)} kg
                    </Text>

                    <Text
                      style={[
                        styles.historyDate,
                        { color: c.muted },
                      ]}
                    >
                      {new Date(
                        entry.createdAt
                      ).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <View
                  style={styles.historyRight}
                >
                  {index <
                    entries.length - 1 && (
                    <View
                      style={[
                        styles.changePill,
                        {
                          backgroundColor: `${changeColor}12`,
                          borderColor: `${changeColor}25`,
                        },
                      ]}
                    >
                      <Ionicons
                        name={
                          difference < 0
                            ? "arrow-down-outline"
                            : difference > 0
                              ? "arrow-up-outline"
                              : "remove-outline"
                        }
                        size={11}
                        color={changeColor}
                      />

                      <Text
                        style={[
                          styles.changeText,
                          {
                            color: changeColor,
                          },
                        ]}
                      >
                        {Math.abs(
                          difference
                        ).toFixed(1)}
                      </Text>
                    </View>
                  )}

                  <Pressable
                    onPress={() =>
                      confirmDelete(
                        entry.id
                      )
                    }
                    style={({ pressed }) => [
                      styles.deleteButton,
                      {
                        backgroundColor:
                          c.surfaceAlt,
                        opacity: pressed
                          ? 0.55
                          : 1,
                      },
                    ]}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={16}
                      color={c.muted}
                    />
                  </Pressable>
                </View>
              </View>
            );
          })
        )}

        {/* ===================================================
            TIP
        =================================================== */}

        <View
          style={[
            styles.tipPill,
            {
              backgroundColor: c.surface,
              borderColor: c.border,
            },
          ]}
        >
          <View
            style={[
              styles.tipCircle,
              {
                backgroundColor: `${ACCENT}12`,
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
              styles.tipText,
              { color: c.muted },
            ]}
          >
            Consistent measurements are more useful than
            daily fluctuations. Try weighing yourself under
            similar conditions.
          </Text>
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
      ) : null}
    </View>
  );
}

/* ============================================================
   SUMMARY ITEM
============================================================ */

function SummaryItem({
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
    <View style={styles.summaryItem}>
      <View
        style={[
          styles.summaryItemCircle,
          {
            backgroundColor: `${ACCENT}12`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={14}
          color={ACCENT}
        />
      </View>

      <View style={styles.summaryItemText}>
        <Text
          style={[
            styles.summaryItemLabel,
            { color: c.muted },
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.summaryItemValue,
            { color: c.text },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

/* ============================================================
   STAT
============================================================ */

function Stat({
  icon,
  title,
  value,
  subtitle,
  c,
}: {
  icon: IconName;
  title: string;
  value: string;
  subtitle: string;
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
            backgroundColor: `${ACCENT}12`,
            borderColor: `${ACCENT}22`,
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

/* ============================================================
   CHART SUMMARY
============================================================ */

function ChartSummary({
  label,
  value,
  c,
}: {
  label: string;
  value: string;
  c: ReturnType<typeof useAppColors>;
}) {
  return (
    <View style={styles.chartSummaryItem}>
      <Text
        style={[
          styles.chartSummaryLabel,
          { color: c.muted },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.chartSummaryValue,
          { color: c.text },
        ]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 150,
  },

  /* Header */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heroMain: {
    flex: 1,
    paddingRight: 10,
  },

  overline: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.15,
    marginBottom: 4,
  },

  weightRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  currentWeight: {
    fontSize: 45,
    fontWeight: "900",
    letterSpacing: -1.2,
  },

  weightUnit: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 5,
  },

  goalPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    backgroundColor: `${ACCENT}10`,
    paddingHorizontal: 7,
    paddingVertical: 4,
    marginTop: 8,
  },

  goalPillCircle: {
    width: 23,
    height: 23,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },

  goalPillText: {
    fontSize: 9,
    fontWeight: "900",
  },

  statusCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },

  statusPercent: {
    fontSize: 17,
    fontWeight: "900",
  },

  statusPercentLabel: {
    fontSize: 8,
    marginTop: 1,
  },

  divider: {
    height: 1,
    marginVertical: 17,
  },

  goalSummary: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  summaryItemCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryItemText: {
    flex: 1,
    marginLeft: 8,
  },

  summaryItemLabel: {
    fontSize: 8,
    fontWeight: "600",
  },

  summaryItemValue: {
    fontSize: 12,
    fontWeight: "900",
    marginTop: 2,
  },

  summaryDivider: {
    width: 1,
    height: 31,
    marginHorizontal: 9,
  },

  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 17,
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  progressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  progressLabel: {
    fontSize: 9,
    fontWeight: "600",
  },

  progressValue: {
    fontSize: 9,
    fontWeight: "900",
  },

  /* Stats */

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    marginBottom: 24,
  },

  statCard: {
    width: "48.5%",
    minHeight: 115,
    borderRadius: 21,
    marginBottom: 0,
  },

  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },

  statTitle: {
    fontSize: 10,
    fontWeight: "600",
  },

  statValue: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 3,
  },

  statSubtitle: {
    fontSize: 9,
    marginTop: 2,
  },

  /* Section */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  sectionText: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
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

  /* New weigh-in */

  inputCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },

  inputLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  inputCircle: {
    width: 27,
    height: 27,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  inputContainer: {
    flex: 1,
  },

  weightInput: {
    minHeight: 50,
  },

  unitPill: {
    height: 50,
    minWidth: 54,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },

  unitPillText: {
    fontSize: 12,
    fontWeight: "800",
  },

  saveButton: {
    minHeight: 62,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 11,
  },

  saveIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  saveText: {
    flex: 1,
    marginLeft: 10,
  },

  saveTitle: {
    fontSize: 13,
    fontWeight: "900",
  },

  saveSubtitle: {
    fontSize: 9,
    marginTop: 2,
  },

  /* Chart */

  chartCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },

  chartTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
  },

  chartTitle: {
    fontSize: 14,
    fontWeight: "900",
  },

  chartSubtitle: {
    fontSize: 9,
    marginTop: 2,
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
    letterSpacing: 0.6,
  },

  chartDivider: {
    height: 1,
    marginVertical: 15,
  },

  chartSummary: {
    flexDirection: "row",
  },

  chartSummaryItem: {
    flex: 1,
  },

  chartSummaryLabel: {
    fontSize: 9,
    fontWeight: "600",
  },

  chartSummaryValue: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 3,
  },

  /* History */

  historyHeader: {
    alignItems: "flex-end",
    marginBottom: 9,
    marginTop: -2,
  },

  historyCount: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  historyCountText: {
    fontSize: 8,
    fontWeight: "800",
  },

  historyItem: {
    minHeight: 68,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  historyLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },

  historyCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  historyInfo: {
    flex: 1,
    marginLeft: 10,
  },

  historyWeight: {
    fontSize: 14,
    fontWeight: "900",
  },

  historyDate: {
    fontSize: 9,
    marginTop: 3,
  },

  historyRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginLeft: 8,
  },

  changePill: {
    minHeight: 28,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  changeText: {
    fontSize: 8,
    fontWeight: "900",
    marginLeft: 2,
  },

  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Empty */

  emptyCard: {
    borderRadius: 23,
    borderWidth: 1,
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 28,
  },

  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  emptyText: {
    fontSize: 11,
    lineHeight: 18,
    textAlign: "center",
    maxWidth: 290,
    marginTop: 5,
  },

  /* Tip */

  tipPill: {
    minHeight: 58,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },

  tipCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  tipText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 15,
    marginLeft: 9,
  },

  bottomSpace: {
    height: 20,
  },
});
