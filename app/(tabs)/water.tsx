import React, { useMemo, useState } from "react";
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
  Input,
  Label,
  Screen,
  Subtitle,
  Title,
  useAppColors,
} from "@/components/ui";

import { useFitness } from "@/hooks/useFitness";

const ACCENT = "#B7FF1A";

type IconName = keyof typeof Ionicons.glyphMap;

export default function WaterScreen() {
  const c = useAppColors();

  const {
    state,
    todayWaterMl,
    addWater,
  } = useFitness();

  const [custom, setCustom] = useState("");

  /* =========================================================
     REAL HYDRATION DATA
  ========================================================= */

  const goal = Math.max(
    1,
    state.profile.waterGoalMl
  );

  const percent = Math.min(
    100,
    Math.round(
      (todayWaterMl / goal) * 100
    )
  );

  const remaining = Math.max(
    0,
    goal - todayWaterMl
  );

  const status = useMemo(() => {
    if (percent >= 100) {
      return {
        title: "Goal completed",
        description:
          "Excellent hydration today. Keep the consistency going.",
        icon: "checkmark-circle" as IconName,
      };
    }

    if (percent >= 75) {
      return {
        title: "Almost there",
        description:
          "You're close to reaching today's hydration goal.",
        icon: "water" as IconName,
      };
    }

    if (percent >= 40) {
      return {
        title: "Good progress",
        description:
          "Keep drinking regularly throughout the day.",
        icon: "trending-up" as IconName,
      };
    }

    return {
      title: "Stay hydrated",
      description:
        "Start with a glass of water and build your progress.",
      icon: "water-outline" as IconName,
    };
  }, [percent]);

  const addCustomWater = () => {
    const amount = Number(custom);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
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
        {/* ===================================================
            HEADER
        =================================================== */}

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Subtitle>Daily hydration</Subtitle>

            <Title>Water</Title>

            <Text
              style={[
                styles.headerDescription,
                { color: c.muted },
              ]}
            >
              Stay hydrated and keep your daily
              intake on track.
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
              name="water"
              size={22}
              color={ACCENT}
            />
          </View>
        </View>

        {/* ===================================================
            HYDRATION HERO
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
            <View style={styles.heroInfo}>
              <Text
                style={[
                  styles.eyebrow,
                  { color: c.muted },
                ]}
              >
                TODAY'S INTAKE
              </Text>

              <View style={styles.amountRow}>
                <Text
                  style={[
                    styles.big,
                    { color: c.text },
                  ]}
                >
                  {(todayWaterMl / 1000).toFixed(1)}
                </Text>

                <Text
                  style={[
                    styles.liter,
                    { color: c.muted },
                  ]}
                >
                  L
                </Text>
              </View>

              <Text
                style={[
                  styles.goalText,
                  { color: c.muted },
                ]}
              >
                Daily target{" "}
                <Text
                  style={{
                    color: c.text,
                    fontWeight: "800",
                  }}
                >
                  {(goal / 1000).toFixed(1)} L
                </Text>
              </Text>
            </View>

            <View
              style={[
                styles.percentCircle,
                {
                  backgroundColor: `${ACCENT}08`,
                  borderColor: ACCENT,
                },
              ]}
            >
              <Text
                style={[
                  styles.percent,
                  { color: c.text },
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

          {/* Progress */}

          <View
            style={[
              styles.track,
              {
                backgroundColor:
                  c.surfaceAlt,
              },
            ]}
          >
            <View
              style={[
                styles.fill,
                {
                  backgroundColor: ACCENT,
                  width: `${percent}%`,
                },
              ]}
            />
          </View>

          <View style={styles.progressFooter}>
            <Text
              style={[
                styles.progressText,
                { color: c.muted },
              ]}
            >
              Daily hydration goal
            </Text>

            <Text
              style={[
                styles.progressPercent,
                { color: ACCENT },
              ]}
            >
              {percent}%
            </Text>
          </View>

          {/* Remaining */}

          <View
            style={[
              styles.remainingBox,
              {
                backgroundColor:
                  c.surfaceAlt,
                borderColor: c.border,
              },
            ]}
          >
            <View
              style={[
                styles.remainingCircle,
                {
                  backgroundColor: `${ACCENT}14`,
                  borderColor: `${ACCENT}25`,
                },
              ]}
            >
              <Ionicons
                name="water-outline"
                size={18}
                color={ACCENT}
              />
            </View>

            <View style={styles.remainingText}>
              <Text
                style={[
                  styles.remainingTitle,
                  { color: c.text },
                ]}
              >
                {remaining > 0
                  ? `${(
                      remaining / 1000
                    ).toFixed(1)} L remaining`
                  : "Daily goal reached"}
              </Text>

              <Text
                style={[
                  styles.remainingSubtitle,
                  { color: c.muted },
                ]}
              >
                {remaining > 0
                  ? "Keep going to complete today's target."
                  : "Great work staying hydrated today."}
              </Text>
            </View>
          </View>
        </Card>

        {/* ===================================================
            STATUS
        =================================================== */}

        <Card
          style={[
            styles.statusCard,
            {
              backgroundColor: c.surface,
              borderColor: c.border,
            },
          ]}
        >
          <View
            style={[
              styles.statusCircle,
              {
                backgroundColor: `${ACCENT}14`,
                borderColor: `${ACCENT}25`,
              },
            ]}
          >
            <Ionicons
              name={status.icon}
              size={20}
              color={ACCENT}
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

        {/* ===================================================
            QUICK ADD
        =================================================== */}

        <SectionHeader
          title="Quick add"
          subtitle="Log water with one tap"
          icon="flash-outline"
        />

        <View style={styles.quickGrid}>
          {[250, 350, 500, 750].map(
            (amount) => (
              <Pressable
                key={amount}
                onPress={() =>
                  addWater(amount)
                }
                style={({ pressed }) => [
                  styles.quickButton,
                  {
                    backgroundColor:
                      c.surface,
                    borderColor: c.border,
                    opacity: pressed
                      ? 0.72
                      : 1,
                    transform: [
                      {
                        scale:
                          pressed
                            ? 0.985
                            : 1,
                      },
                    ],
                  },
                ]}
              >
                <View
                  style={[
                    styles.quickCircle,
                    {
                      backgroundColor: `${ACCENT}14`,
                      borderColor: `${ACCENT}25`,
                    },
                  ]}
                >
                  <Ionicons
                    name="water-outline"
                    size={18}
                    color={ACCENT}
                  />
                </View>

                <View style={styles.quickText}>
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
                </View>

                <View
                  style={[
                    styles.quickAddCircle,
                    {
                      backgroundColor: `${ACCENT}10`,
                    },
                  ]}
                >
                  <Ionicons
                    name="add"
                    size={16}
                    color={c.muted}
                  />
                </View>
              </Pressable>
            )
          )}
        </View>

        {/* ===================================================
            CUSTOM AMOUNT
        =================================================== */}

        <SectionHeader
          title="Custom amount"
          subtitle="Add any amount of water"
          icon="create-outline"
        />

        <Card
          style={[
            styles.customCard,
            {
              backgroundColor: c.surface,
              borderColor: c.border,
            },
          ]}
        >
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

            <Pressable
              onPress={addCustomWater}
              style={({ pressed }) => [
                styles.customButton,
                {
                  backgroundColor:
                    c.primarySoft,
                  borderColor: `${c.primary}45`,
                  opacity: pressed
                    ? 0.72
                    : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.customButtonCircle,
                  {
                    backgroundColor: `${ACCENT}14`,
                  },
                ]}
              >
                <Ionicons
                  name="add"
                  size={17}
                  color={ACCENT}
                />
              </View>

              <Text
                style={[
                  styles.customButtonText,
                  { color: c.primary },
                ]}
              >
                Add
              </Text>
            </Pressable>
          </View>
        </Card>

        {/* ===================================================
            HYDRATION TIP
        =================================================== */}

        <SectionHeader
          title="Hydration tip"
          subtitle="A simple way to stay consistent"
          icon="bulb-outline"
        />

        <Card
          style={[
            styles.tipCard,
            {
              backgroundColor: `${ACCENT}08`,
              borderColor: `${ACCENT}25`,
            },
          ]}
        >
          <View
            style={[
              styles.tipCircle,
              {
                backgroundColor: ACCENT,
              },
            ]}
          >
            <Ionicons
              name="bulb-outline"
              size={18}
              color="#0A0F0C"
            />
          </View>

          <View style={styles.tipContent}>
            <Text
              style={[
                styles.tipTitle,
                { color: c.text },
              ]}
            >
              Keep it consistent
            </Text>

            <Text
              style={[
                styles.tipText,
                { color: c.muted },
              ]}
            >
              Smaller amounts throughout the day
              can make it easier to stay consistent
              with your hydration goal.
            </Text>
          </View>
        </Card>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </Screen>
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
    marginBottom: 20,
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
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  /* Hero */

  hero: {
    padding: 20,
    borderRadius: 26,
    marginBottom: 12,
  },

  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heroInfo: {
    flex: 1,
    paddingRight: 10,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },

  big: {
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: -1,
  },

  liter: {
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 5,
  },

  goalText: {
    fontSize: 11,
    marginTop: 3,
  },

  percentCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  percent: {
    fontSize: 18,
    fontWeight: "900",
  },

  percentLabel: {
    fontSize: 9,
    marginTop: 1,
  },

  track: {
    height: 8,
    borderRadius: 999,
    marginTop: 22,
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    borderRadius: 999,
  },

  progressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  progressText: {
    fontSize: 10,
    fontWeight: "600",
  },

  progressPercent: {
    fontSize: 10,
    fontWeight: "900",
  },

  remainingBox: {
    minHeight: 62,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 11,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  remainingCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  remainingText: {
    flex: 1,
    marginLeft: 10,
  },

  remainingTitle: {
    fontSize: 13,
    fontWeight: "800",
  },

  remainingSubtitle: {
    fontSize: 10,
    lineHeight: 16,
    marginTop: 2,
  },

  /* Status */

  statusCard: {
    minHeight: 72,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  statusCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  statusContent: {
    flex: 1,
    marginLeft: 11,
  },

  statusTitle: {
    fontSize: 14,
    fontWeight: "900",
  },

  statusDescription: {
    fontSize: 11,
    lineHeight: 17,
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

  /* Quick add */

  quickGrid: {
    gap: 9,
    marginBottom: 24,
  },

  quickButton: {
    width: "100%",
    minHeight: 64,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  quickCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  quickText: {
    flex: 1,
    flexDirection: "row",
    alignItems: "baseline",
    marginLeft: 11,
  },

  quickAmount: {
    fontSize: 18,
    fontWeight: "900",
  },

  quickUnit: {
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 3,
  },

  quickAddCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Custom */

  customCard: {
    borderRadius: 21,
    marginBottom: 24,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },

  inputWrapper: {
    flex: 1,
  },

  customButton: {
    height: 48,
    minWidth: 78,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  customButtonCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  customButtonText: {
    fontSize: 12,
    fontWeight: "900",
    marginRight: 4,
  },

  /* Tip */

  tipCard: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 15,
  },

  tipCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 11,
    lineHeight: 18,
    marginTop: 5,
  },

  bottomSpace: {
    height: 20,
  },
});