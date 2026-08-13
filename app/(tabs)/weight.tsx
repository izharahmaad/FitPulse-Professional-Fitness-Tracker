import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  Button,
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

export default function WeightScreen() {
  const c = useAppColors();

  const {
    state,
    latestWeightKg,
    addWeight,
    deleteWeight,
  } = useFitness();

  const [value, setValue] = useState("");

  /*
   * Keep the original state array untouched.
   * Newest weight is displayed first.
   */
  const entries = useMemo(
    () => state.weights.slice(0, 30),
    [state.weights]
  );

  const targetWeight = state.profile.targetWeightKg;

  /*
   * Safely get the oldest tracked weight.
   * If there are no entries, use the profile's starting weight.
   */
  const oldestEntry = entries.length > 0
    ? entries[entries.length - 1]
    : undefined;

  const startingWeight = oldestEntry?.weightKg ?? state.profile.weightKg;

  const weightDifference = latestWeightKg - startingWeight;

  const targetDifference = latestWeightKg - targetWeight;

  const progressRange = Math.abs(
    startingWeight - targetWeight
  );

  const progress =
    progressRange > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (Math.abs(startingWeight - latestWeightKg) /
              progressRange) *
              100
          )
        )
      : 0;

  const isMovingTowardGoal =
    state.profile.weightGoal === "lose"
      ? weightDifference < 0
      : state.profile.weightGoal === "gain"
        ? weightDifference > 0
        : Math.abs(weightDifference) < 0.1;

  const saveWeight = () => {
    const numericValue = Number(value);

    if (!value.trim() || !Number.isFinite(numericValue)) {
      Alert.alert(
        "Invalid weight",
        "Please enter a valid weight."
      );
      return;
    }

    if (numericValue < 20 || numericValue > 400) {
      Alert.alert(
        "Invalid weight",
        "Please enter a weight between 20 kg and 400 kg."
      );
      return;
    }

    addWeight(numericValue);
    setValue("");
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      "Delete weigh-in?",
      "This weigh-in will be removed from your history.",
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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Subtitle>Body progress</Subtitle>
            <Title>Weight</Title>
          </View>

          <View
            style={[
              styles.headerIcon,
              { backgroundColor: c.primarySoft },
            ]}
          >
            <Ionicons
              name="scale-outline"
              size={22}
              color={c.primary}
            />
          </View>
        </View>

        {/* Current Weight */}
        <Card style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text
                style={[
                  styles.label,
                  { color: c.muted },
                ]}
              >
                Current weight
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
                    styles.unit,
                    { color: c.muted },
                  ]}
                >
                  kg
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.goalBadge,
                {
                  backgroundColor: isMovingTowardGoal
                    ? c.primarySoft
                    : c.surfaceAlt,
                },
              ]}
            >
              <Ionicons
                name={
                  state.profile.weightGoal === "gain"
                    ? "trending-up-outline"
                    : state.profile.weightGoal === "lose"
                      ? "trending-down-outline"
                      : "remove-outline"
                }
                size={17}
                color={c.primary}
              />

              <Text
                style={[
                  styles.goalBadgeText,
                  { color: c.primary },
                ]}
              >
                {state.profile.weightGoal === "lose"
                  ? "Lose"
                  : state.profile.weightGoal === "gain"
                    ? "Gain"
                    : "Maintain"}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: c.border },
            ]}
          />

          <View style={styles.targetRow}>
            <View>
              <Text
                style={[
                  styles.smallLabel,
                  { color: c.muted },
                ]}
              >
                Target
              </Text>

              <Text
                style={[
                  styles.targetValue,
                  { color: c.text },
                ]}
              >
                {targetWeight.toFixed(1)} kg
              </Text>
            </View>

            <View style={styles.targetRight}>
              <Text
                style={[
                  styles.smallLabel,
                  { color: c.muted },
                ]}
              >
                Remaining
              </Text>

              <Text
                style={[
                  styles.targetValue,
                  { color: c.primary },
                ]}
              >
                {Math.abs(targetDifference).toFixed(1)} kg
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: c.surfaceAlt },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: c.primary,
                  width: `${progress}%`,
                },
              ]}
            />
          </View>

          <View style={styles.progressLabels}>
            <Text
              style={[
                styles.progressText,
                { color: c.muted },
              ]}
            >
              Goal progress
            </Text>

            <Text
              style={[
                styles.progressText,
                { color: c.primary },
              ]}
            >
              {Math.round(progress)}%
            </Text>
          </View>
        </Card>

        {/* Statistics */}
        <View style={styles.statsGrid}>
          <Stat
            icon="trending-down-outline"
            title="Change"
            value={`${Math.abs(weightDifference).toFixed(1)} kg`}
            subtitle={
              weightDifference === 0
                ? "No change"
                : weightDifference < 0
                  ? "Down"
                  : "Up"
            }
          />

          <Stat
            icon="flag-outline"
            title="Target"
            value={`${targetWeight.toFixed(1)} kg`}
            subtitle="Goal weight"
          />

          <Stat
            icon="calendar-outline"
            title="Entries"
            value={`${entries.length}`}
            subtitle="Tracked"
          />

          <Stat
            icon="analytics-outline"
            title="Status"
            value={
              isMovingTowardGoal
                ? "On track"
                : "Review"
            }
            subtitle="Progress"
          />
        </View>

        {/* New weigh-in */}
        <Text
          style={[
            styles.sectionTitle,
            { color: c.text },
          ]}
        >
          New weigh-in
        </Text>

        <Card>
          <Label>Weight in kilograms</Label>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Input
                value={value}
                onChangeText={setValue}
                keyboardType="decimal-pad"
                placeholder="e.g. 79.5"
              />
            </View>

            <View style={styles.kgBadge}>
              <Text
                style={[
                  styles.kgText,
                  { color: c.muted },
                ]}
              >
                kg
              </Text>
            </View>
          </View>

          <View style={styles.saveButton}>
            <Button
              title="Save weigh-in"
              onPress={saveWeight}
            />
          </View>
        </Card>

        {/* Trend */}
        {entries.length > 1 && (
          <>
            <View style={styles.sectionHeader}>
              <View>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: c.text },
                  ]}
                >
                  Weight trend
                </Text>

                <Text
                  style={[
                    styles.sectionSubtitle,
                    { color: c.muted },
                  ]}
                >
                  Your recent progress
                </Text>
              </View>

              <View
                style={[
                  styles.trendBadge,
                  {
                    backgroundColor: c.primarySoft,
                  },
                ]}
              >
                <Ionicons
                  name="analytics-outline"
                  size={16}
                  color={c.primary}
                />
              </View>
            </View>

            <Card>
              <MiniChart
                values={entries
                  .slice()
                  .reverse()
                  .map((entry) => entry.weightKg)}
                labels={entries
                  .slice()
                  .reverse()
                  .map((entry) =>
                    entry.createdAt.slice(5, 10)
                  )}
              />
            </Card>
          </>
        )}

        {/* History */}
        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                { color: c.text },
              ]}
            >
              Weight history
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                { color: c.muted },
              ]}
            >
              Your latest measurements
            </Text>
          </View>

          <Text
            style={[
              styles.entryCount,
              { color: c.muted },
            ]}
          >
            {entries.length} entries
          </Text>
        </View>

        {entries.length === 0 ? (
          <Card style={styles.emptyCard}>
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor: c.primarySoft,
                },
              ]}
            >
              <Ionicons
                name="scale-outline"
                size={28}
                color={c.primary}
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
              Add your first weigh-in above to start
              building your weight trend.
            </Text>
          </Card>
        ) : (
          entries.map((entry, index) => {
            /*
             * Safely access the previous entry.
             */
            const previousEntry =
              entries[index + 1];

            const previousWeight =
              previousEntry?.weightKg;

            const difference =
              previousWeight !== undefined
                ? entry.weightKg - previousWeight
                : 0;

            return (
              <Card
                key={entry.id}
                style={styles.historyCard}
              >
                <View style={styles.historyLeft}>
                  <View
                    style={[
                      styles.historyIcon,
                      {
                        backgroundColor:
                          c.surfaceAlt,
                      },
                    ]}
                  >
                    <Ionicons
                      name="scale-outline"
                      size={18}
                      color={c.primary}
                    />
                  </View>

                  <View>
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

                <View style={styles.historyRight}>
                  {index < entries.length - 1 && (
                    <View style={styles.changeContainer}>
                      <Ionicons
                        name={
                          difference < 0
                            ? "arrow-down-outline"
                            : difference > 0
                              ? "arrow-up-outline"
                              : "remove-outline"
                        }
                        size={14}
                        color={
                          difference <= 0
                            ? c.primary
                            : c.danger
                        }
                      />

                      <Text
                        style={[
                          styles.changeText,
                          {
                            color:
                              difference <= 0
                                ? c.primary
                                : c.danger,
                          },
                        ]}
                      >
                        {Math.abs(
                          difference
                        ).toFixed(1)}
                      </Text>
                    </View>
                  )}

                  <Ionicons
                    name="trash-outline"
                    size={19}
                    color={c.muted}
                    onPress={() =>
                      confirmDelete(entry.id)
                    }
                  />
                </View>
              </Card>
            );
          })
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={c.muted}
          />

          <Text
            style={[
              styles.footerText,
              { color: c.muted },
            ]}
          >
            Consistent measurements are more useful
            than daily fluctuations. Try weighing
            yourself under similar conditions.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Stat({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  subtitle: string;
}) {
  const c = useAppColors();

  return (
    <Card style={styles.statCard}>
      <View
        style={[
          styles.statIcon,
          {
            backgroundColor: c.primarySoft,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={17}
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

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 120,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  hero: {
    marginTop: 2,
    padding: 20,
  },

  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
  },

  weightRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 3,
  },

  currentWeight: {
    fontSize: 46,
    fontWeight: "900",
    letterSpacing: -1,
  },

  unit: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 5,
  },

  goalBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 999,
  },

  goalBadgeText: {
    fontSize: 12,
    fontWeight: "800",
  },

  divider: {
    height: 1,
    marginVertical: 18,
  },

  targetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  targetRight: {
    alignItems: "flex-end",
  },

  smallLabel: {
    fontSize: 12,
    fontWeight: "600",
  },

  targetValue: {
    fontSize: 17,
    fontWeight: "900",
    marginTop: 3,
  },

  progressTrack: {
    height: 9,
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 18,
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  progressText: {
    fontSize: 11,
    fontWeight: "700",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },

  statCard: {
    width: "48%",
    marginBottom: 0,
    padding: 14,
  },

  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  statTitle: {
    fontSize: 11,
    fontWeight: "600",
  },

  statValue: {
    fontSize: 19,
    fontWeight: "900",
    marginTop: 3,
  },

  statSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    marginTop: 22,
    marginBottom: 12,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  sectionSubtitle: {
    fontSize: 12,
    marginTop: -7,
    marginBottom: 12,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  inputContainer: {
    flex: 1,
  },

  kgBadge: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  kgText: {
    fontSize: 14,
    fontWeight: "800",
  },

  saveButton: {
    marginTop: 10,
  },

  trendBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  entryCount: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
  },

  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 9,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },

  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  historyIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  historyWeight: {
    fontSize: 16,
    fontWeight: "900",
  },

  historyDate: {
    fontSize: 11,
    marginTop: 3,
  },

  historyRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  changeText: {
    fontSize: 12,
    fontWeight: "800",
  },

  emptyCard: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 22,
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "900",
  },

  emptyText: {
    textAlign: "center",
    lineHeight: 20,
    fontSize: 13,
    marginTop: 6,
  },

  footer: {
    flexDirection: "row",
    gap: 7,
    alignItems: "flex-start",
    marginTop: 20,
    paddingHorizontal: 4,
    paddingBottom: 10,
  },

  footerText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
  },
});