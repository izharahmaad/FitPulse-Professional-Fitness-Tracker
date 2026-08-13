import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
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

import { useFitness } from "@/hooks/useFitness";

export default function WaterScreen() {
  const c = useAppColors();

  const { state, todayWaterMl, addWater } = useFitness();

  const [custom, setCustom] = useState("");

  const goal = Math.max(1, state.profile.waterGoalMl);

  const percent = Math.min(
    100,
    Math.round((todayWaterMl / goal) * 100)
  );

  const remaining = Math.max(0, goal - todayWaterMl);

  const status = useMemo(() => {
    if (percent >= 100) {
      return {
        title: "Goal completed",
        description: "Excellent hydration today. Keep it consistent.",
        icon: "checkmark-circle",
      };
    }

    if (percent >= 75) {
      return {
        title: "Almost there",
        description: "You're close to reaching today's hydration goal.",
        icon: "water",
      };
    }

    if (percent >= 40) {
      return {
        title: "Good progress",
        description: "Keep drinking regularly throughout the day.",
        icon: "trending-up",
      };
    }

    return {
      title: "Stay hydrated",
      description: "Start with a glass of water and build your progress.",
      icon: "alert-circle-outline",
    };
  }, [percent]);

  const addCustomWater = () => {
    const amount = Number(custom);

    if (!Number.isFinite(amount) || amount <= 0) {
      return;
    }

    addWater(amount);
    setCustom("");
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
            <Subtitle>Daily hydration</Subtitle>
            <Title>Water</Title>
          </View>

          <View
            style={[
              styles.headerIcon,
              { backgroundColor: c.primarySoft },
            ]}
          >
            <Ionicons
              name="water"
              size={23}
              color={c.primary}
            />
          </View>
        </View>

        {/* Main hydration card */}
        <Card style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={[styles.eyebrow, { color: c.muted }]}>
                TODAY'S INTAKE
              </Text>

              <View style={styles.amountRow}>
                <Text style={[styles.big, { color: c.text }]}>
                  {(todayWaterMl / 1000).toFixed(1)}
                </Text>

                <Text style={[styles.liter, { color: c.muted }]}>
                  L
                </Text>
              </View>

              <Text style={[styles.goalText, { color: c.muted }]}>
                of {(goal / 1000).toFixed(1)} L daily goal
              </Text>
            </View>

            <View
              style={[
                styles.percentCircle,
                {
                  borderColor: c.primary,
                  backgroundColor: c.primarySoft,
                },
              ]}
            >
              <Text
                style={[
                  styles.percent,
                  { color: c.primary },
                ]}
              >
                {percent}%
              </Text>

              <Text
                style={[
                  styles.percentLabel,
                  { color: c.muted },
                ]}
              >
                complete
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <View
            style={[
              styles.track,
              { backgroundColor: c.surfaceAlt },
            ]}
          >
            <View
              style={[
                styles.fill,
                {
                  backgroundColor: c.primary,
                  width: `${percent}%`,
                },
              ]}
            />
          </View>

          {/* Remaining */}
          <View
            style={[
              styles.remainingBox,
              { backgroundColor: c.surfaceAlt },
            ]}
          >
            <Ionicons
              name="water-outline"
              size={20}
              color={c.primary}
            />

            <View style={styles.remainingText}>
              <Text
                style={[
                  styles.remainingTitle,
                  { color: c.text },
                ]}
              >
                {remaining > 0
                  ? `${(remaining / 1000).toFixed(1)} L remaining`
                  : "Daily goal reached"}
              </Text>

              <Text
                style={[
                  styles.remainingSubtitle,
                  { color: c.muted },
                ]}
              >
                {remaining > 0
                  ? "Keep going to complete your goal."
                  : "Great work staying hydrated."}
              </Text>
            </View>
          </View>
        </Card>

        {/* Status */}
        <Card style={styles.statusCard}>
          <View
            style={[
              styles.statusIcon,
              { backgroundColor: c.primarySoft },
            ]}
          >
            <Ionicons
              name={status.icon as keyof typeof Ionicons.glyphMap}
              size={20}
              color={c.primary}
            />
          </View>

          <View style={styles.statusContent}>
            <Text
              style={[
                styles.statusTitle,
                { color: c.text },
              ]}
            >
              {status.title}
            </Text>

            <Text
              style={[
                styles.statusDescription,
                { color: c.muted },
              ]}
            >
              {status.description}
            </Text>
          </View>
        </Card>

        {/* Quick add */}
        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                { color: c.text },
              ]}
            >
              Quick add
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                { color: c.muted },
              ]}
            >
              Log your water in one tap
            </Text>
          </View>

          <Ionicons
            name="flash-outline"
            size={21}
            color={c.primary}
          />
        </View>

        <View style={styles.quickGrid}>
          {[250, 350, 500, 750].map((amount) => (
            <Pressable
              key={amount}
              onPress={() => addWater(amount)}
              style={({ pressed }) => [
                styles.quickButton,
                {
                  backgroundColor: c.surface,
                  borderColor: c.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.quickIcon,
                  { backgroundColor: c.primarySoft },
                ]}
              >
                <Ionicons
                  name="water-outline"
                  size={19}
                  color={c.primary}
                />
              </View>

              <Text
                style={[
                  styles.quickAmount,
                  { color: c.text },
                ]}
              >
                {amount}
              </Text>

              <Text
                style={[
                  styles.quickUnit,
                  { color: c.muted },
                ]}
              >
                ml
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Custom amount */}
        <Card style={styles.customCard}>
          <View style={styles.customHeader}>
            <View>
              <Text
                style={[
                  styles.customTitle,
                  { color: c.text },
                ]}
              >
                Custom amount
              </Text>

              <Text
                style={[
                  styles.customSubtitle,
                  { color: c.muted },
                ]}
              >
                Add any amount of water
              </Text>
            </View>

            <Ionicons
              name="create-outline"
              size={21}
              color={c.primary}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Label>Amount (ml)</Label>

              <Input
                value={custom}
                onChangeText={setCustom}
                keyboardType="number-pad"
                placeholder="e.g. 400"
              />
            </View>

            <View style={styles.addButtonWrapper}>
              <Button
                title="Add"
                onPress={addCustomWater}
              />
            </View>
          </View>
        </Card>

        {/* Hydration tips */}
        <Card style={styles.tipCard}>
          <View
            style={[
              styles.tipIcon,
              { backgroundColor: c.primarySoft },
            ]}
          >
            <Ionicons
              name="bulb-outline"
              size={20}
              color={c.primary}
            />
          </View>

          <View style={styles.tipContent}>
            <Text
              style={[
                styles.tipTitle,
                { color: c.text },
              ]}
            >
              Hydration tip
            </Text>

            <Text
              style={[
                styles.tipText,
                { color: c.muted },
              ]}
            >
              Drinking smaller amounts consistently
              throughout the day is usually easier than
              trying to catch up all at once.
            </Text>
          </View>
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons
            name="shield-checkmark-outline"
            size={16}
            color={c.muted}
          />

          <Text
            style={[
              styles.footerText,
              { color: c.muted },
            ]}
          >
            FitPulse hydration tracking
          </Text>
        </View>
      </ScrollView>
    </Screen>
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
    marginBottom: 18,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  hero: {
    padding: 20,
    marginBottom: 12,
  },

  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 5,
  },

  amountRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  big: {
    fontSize: 48,
    fontWeight: "900",
    lineHeight: 55,
  },

  liter: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 5,
  },

  goalText: {
    fontSize: 13,
    marginTop: 2,
  },

  percentCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  percent: {
    fontSize: 21,
    fontWeight: "900",
  },

  percentLabel: {
    fontSize: 9,
    marginTop: 1,
  },

  track: {
    height: 10,
    borderRadius: 999,
    marginTop: 24,
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    borderRadius: 999,
  },

  remainingBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 13,
    marginTop: 16,
  },

  remainingText: {
    marginLeft: 10,
    flex: 1,
  },

  remainingTitle: {
    fontSize: 14,
    fontWeight: "800",
  },

  remainingSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },

  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  statusIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  statusContent: {
    flex: 1,
    marginLeft: 12,
  },

  statusTitle: {
    fontSize: 15,
    fontWeight: "800",
  },

  statusDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
  },

  sectionSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  quickButton: {
    width: "48%",
    minHeight: 82,
    borderRadius: 17,
    borderWidth: 1,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  quickAmount: {
    fontSize: 17,
    fontWeight: "900",
  },

  quickUnit: {
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 3,
    marginTop: 5,
  },

  customCard: {
    marginBottom: 14,
  },

  customHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  customTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  customSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },

  inputWrapper: {
    flex: 1,
  },

  addButtonWrapper: {
    width: 82,
    marginBottom: 1,
  },

  tipCard: {
    flexDirection: "row",
    marginTop: 2,
  },

  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  tipContent: {
    flex: 1,
    marginLeft: 11,
  },

  tipTitle: {
    fontSize: 14,
    fontWeight: "900",
  },

  tipText: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  footer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 24,
    gap: 6,
  },

  footerText: {
    fontSize: 11,
    fontWeight: "600",
  },
});