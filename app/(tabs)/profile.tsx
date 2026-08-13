import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

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

export default function ProfileScreen() {
  const c = useAppColors();

  const {
    state,
    updateProfile,
    bmr,
    tdee,
  } = useFitness();

  const p = state.profile;

  const [name, setName] = useState(p.name);
  const [age, setAge] = useState(String(p.age));
  const [height, setHeight] = useState(String(p.heightCm));
  const [weight, setWeight] = useState(String(p.weightKg));
  const [target, setTarget] = useState(String(p.targetWeightKg));
  const [stepGoal, setStepGoal] = useState(String(p.stepGoal));
  const [waterGoal, setWaterGoal] = useState(String(p.waterGoalMl));
  const [calorieGoal, setCalorieGoal] = useState(
    String(p.calorieGoal)
  );

  const [saved, setSaved] = useState(false);

  const save = () => {
    updateProfile({
      name: name.trim() || "You",

      age: Math.max(
        13,
        Math.min(100, Number(age) || p.age)
      ),

      heightCm: Math.max(
        120,
        Math.min(230, Number(height) || p.heightCm)
      ),

      weightKg: Math.max(
        30,
        Math.min(300, Number(weight) || p.weightKg)
      ),

      targetWeightKg: Math.max(
        30,
        Math.min(300, Number(target) || p.targetWeightKg)
      ),

      stepGoal: Math.max(
        1000,
        Math.min(50000, Number(stepGoal) || p.stepGoal)
      ),

      waterGoalMl: Math.max(
        500,
        Math.min(6000, Number(waterGoal) || p.waterGoalMl)
      ),

      calorieGoal: Math.max(
        1200,
        Math.min(6000, Number(calorieGoal) || p.calorieGoal)
      ),
    });

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const weightDifference = p.weightKg - p.targetWeightKg;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Subtitle>Your personal setup</Subtitle>
            <Title>Profile</Title>
          </View>

          <View
            style={[
              styles.profileIcon,
              {
                backgroundColor: c.primarySoft,
                borderColor: c.border,
              },
            ]}
          >
            <Ionicons
              name="person-outline"
              size={25}
              color={c.primary}
            />
          </View>
        </View>

        {/* Profile overview */}
        <Card style={styles.overviewCard}>
          <View style={styles.overviewTop}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: c.primarySoft,
                },
              ]}
            >
              <Text
                style={[
                  styles.avatarText,
                  {
                    color: c.primary,
                  },
                ]}
              >
                {(p.name || "Y").charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.overviewInfo}>
              <Text
                style={[
                  styles.profileName,
                  { color: c.text },
                ]}
                numberOfLines={1}
              >
                {p.name || "You"}
              </Text>

              <Text
                style={[
                  styles.profileDescription,
                  { color: c.muted },
                ]}
              >
                {p.age} years · {p.heightCm} cm
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.overviewDivider,
              { backgroundColor: c.border },
            ]}
          />

          <View style={styles.quickStats}>
            <QuickStat
              icon="scale-outline"
              label="Weight"
              value={`${p.weightKg.toFixed(1)} kg`}
            />

            <QuickStat
              icon="flag-outline"
              label="Target"
              value={`${p.targetWeightKg.toFixed(1)} kg`}
            />

            <QuickStat
              icon="footsteps-outline"
              label="Steps"
              value={p.stepGoal.toLocaleString()}
            />
          </View>
        </Card>

        {/* Personal information */}
        <SectionHeader
          icon="person-circle-outline"
          title="Personal information"
          subtitle="Keep your basic details up to date"
        />

        <Card>
          <Label>Name</Label>

          <Input
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            autoCapitalize="words"
          />

          <View style={styles.spacer} />

          <Label>Age</Label>

          <Input
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            placeholder="25"
          />

          <View style={styles.spacer} />

          <Label>Height (cm)</Label>

          <Input
            value={height}
            onChangeText={setHeight}
            keyboardType="decimal-pad"
            placeholder="180"
          />
        </Card>

        {/* Body goals */}
        <SectionHeader
          icon="fitness-outline"
          title="Body & goals"
          subtitle="Set the numbers FitPulse uses for calculations"
        />

        <Card>
          <Label>Current weight (kg)</Label>

          <Input
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            placeholder="80"
          />

          <View style={styles.spacer} />

          <Label>Target weight (kg)</Label>

          <Input
            value={target}
            onChangeText={setTarget}
            keyboardType="decimal-pad"
            placeholder="75"
          />

          <View style={styles.goalHint}>
            <Ionicons
              name={
                weightDifference > 0
                  ? "trending-down-outline"
                  : "checkmark-circle-outline"
              }
              size={17}
              color={c.primary}
            />

            <Text
              style={[
                styles.goalHintText,
                { color: c.muted },
              ]}
            >
              {weightDifference > 0
                ? `${weightDifference.toFixed(1)} kg toward your target`
                : "You are currently at or below your target weight"}
            </Text>
          </View>
        </Card>

        {/* Daily targets */}
        <SectionHeader
          icon="analytics-outline"
          title="Daily targets"
          subtitle="Customize your daily fitness goals"
        />

        <Card>
          <TargetRow
            icon="footsteps-outline"
            title="Step goal"
            description="Daily movement target"
            value={stepGoal}
            onChangeText={setStepGoal}
            keyboardType="number-pad"
            suffix="steps"
          />

          <View
            style={[
              styles.targetDivider,
              { backgroundColor: c.border },
            ]}
          />

          <TargetRow
            icon="water-outline"
            title="Water goal"
            description="Daily hydration target"
            value={waterGoal}
            onChangeText={setWaterGoal}
            keyboardType="number-pad"
            suffix="ml"
          />

          <View
            style={[
              styles.targetDivider,
              { backgroundColor: c.border },
            ]}
          />

          <TargetRow
            icon="flame-outline"
            title="Calorie goal"
            description="Daily calorie target"
            value={calorieGoal}
            onChangeText={setCalorieGoal}
            keyboardType="number-pad"
            suffix="kcal"
          />
        </Card>

        {/* Save */}
        <View style={styles.saveContainer}>
          <Button
            title={saved ? "Profile saved" : "Save profile"}
            onPress={save}
          />

          {saved && (
            <View style={styles.savedMessage}>
              <Ionicons
                name="checkmark-circle"
                size={17}
                color={c.primary}
              />

              <Text
                style={[
                  styles.savedText,
                  { color: c.primary },
                ]}
              >
                Your fitness profile has been updated.
              </Text>
            </View>
          )}
        </View>

        {/* Calorie engine */}
        <SectionHeader
          icon="flame-outline"
          title="Calorie engine"
          subtitle="Your estimated daily energy requirements"
        />

        <Card>
          <View style={styles.engineHeader}>
            <View>
              <Text
                style={[
                  styles.engineTitle,
                  { color: c.text },
                ]}
              >
                Energy overview
              </Text>

              <Text
                style={[
                  styles.engineSubtitle,
                  { color: c.muted },
                ]}
              >
                Based on your current profile
              </Text>
            </View>

            <View
              style={[
                styles.engineIcon,
                {
                  backgroundColor: c.primarySoft,
                },
              ]}
            >
              <Ionicons
                name="flash-outline"
                size={20}
                color={c.primary}
              />
            </View>
          </View>

          <View style={styles.energyGrid}>
            <EnergyStat
              label="BMR"
              value={`${bmr}`}
              unit="kcal/day"
              icon="bed-outline"
            />

            <EnergyStat
              label="Estimated TDEE"
              value={`${tdee}`}
              unit="kcal/day"
              icon="walk-outline"
            />
          </View>

          <View
            style={[
              styles.targetCalories,
              {
                backgroundColor: c.primarySoft,
              },
            ]}
          >
            <View style={styles.targetCaloriesIcon}>
              <Ionicons
                name="flame-outline"
                size={18}
                color={c.primary}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.targetCaloriesLabel,
                  { color: c.muted },
                ]}
              >
                Your daily target
              </Text>

              <Text
                style={[
                  styles.targetCaloriesValue,
                  { color: c.text },
                ]}
              >
                {p.calorieGoal.toLocaleString()} kcal
              </Text>
            </View>
          </View>
        </Card>

        {/* Current options */}
        <SectionHeader
          icon="options-outline"
          title="Current options"
          subtitle="Your current fitness preferences"
        />

        <Card>
          <OptionRow
            icon="male-female-outline"
            label="Gender"
            value={capitalize(p.gender)}
          />

          <OptionRow
            icon="speedometer-outline"
            label="Activity level"
            value={capitalize(p.activityLevel)}
          />

          <OptionRow
            icon="flag-outline"
            label="Weight goal"
            value={capitalize(p.weightGoal)}
          />

          <OptionRow
            icon="water-outline"
            label="Water target"
            value={`${p.waterGoalMl.toLocaleString()} ml`}
            last
          />
        </Card>

        {/* Settings */}
        <Button
          title="Open settings"
          variant="secondary"
          onPress={() => router.push("/settings")}
        />

        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={19}
            color={c.primary}
          />

          <Text
            style={[
              styles.infoText,
              { color: c.muted },
            ]}
          >
            FitPulse uses your profile information to estimate
            calorie needs, walking calories, hydration targets,
            and fitness progress.
          </Text>
        </View>

        <View style={styles.footerSpace} />
      </ScrollView>
    </Screen>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
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
            backgroundColor: c.primarySoft,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={c.primary}
        />
      </View>

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
    </View>
  );
}

function QuickStat({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  const c = useAppColors();

  return (
    <View style={styles.quickStat}>
      <Ionicons
        name={icon}
        size={17}
        color={c.primary}
      />

      <Text
        style={[
          styles.quickLabel,
          { color: c.muted },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.quickValue,
          { color: c.text },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function TargetRow({
  icon,
  title,
  description,
  value,
  onChangeText,
  keyboardType,
  suffix,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: "number-pad" | "decimal-pad";
  suffix: string;
}) {
  const c = useAppColors();

  return (
    <View style={styles.targetRow}>
      <View
        style={[
          styles.targetIcon,
          {
            backgroundColor: c.primarySoft,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={19}
          color={c.primary}
        />
      </View>

      <View style={styles.targetInfo}>
        <Text
          style={[
            styles.targetTitle,
            { color: c.text },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.targetDescription,
            { color: c.muted },
          ]}
        >
          {description}
        </Text>
      </View>

      <View style={styles.targetInputWrapper}>
        <Input
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          style={styles.targetInput}
        />

        <Text
          style={[
            styles.targetSuffix,
            { color: c.muted },
          ]}
        >
          {suffix}
        </Text>
      </View>
    </View>
  );
}

function EnergyStat({
  label,
  value,
  unit,
  icon,
}: {
  label: string;
  value: string;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  const c = useAppColors();

  return (
    <View
      style={[
        styles.energyStat,
        {
          backgroundColor: c.surfaceAlt,
          borderColor: c.border,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={19}
        color={c.primary}
      />

      <Text
        style={[
          styles.energyLabel,
          { color: c.muted },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.energyValue,
          { color: c.text },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.energyUnit,
          { color: c.muted },
        ]}
      >
        {unit}
      </Text>
    </View>
  );
}

function OptionRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}) {
  const c = useAppColors();

  return (
    <View
      style={[
        styles.optionRow,
        !last && {
          borderBottomWidth: 1,
          borderBottomColor: c.border,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={19}
        color={c.primary}
      />

      <Text
        style={[
          styles.optionLabel,
          { color: c.muted },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.optionValue,
          { color: c.text },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function capitalize(value: string) {
  if (!value) return "Not set";

  return value.charAt(0).toUpperCase() + value.slice(1);
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 140,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  headerText: {
    flex: 1,
  },

  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  overviewCard: {
    padding: 18,
  },

  overviewTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 25,
    fontWeight: "900",
  },

  overviewInfo: {
    flex: 1,
    marginLeft: 14,
  },

  profileName: {
    fontSize: 20,
    fontWeight: "900",
  },

  profileDescription: {
    fontSize: 13,
    marginTop: 4,
  },

  overviewDivider: {
    height: 1,
    marginVertical: 18,
  },

  quickStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  quickStat: {
    flex: 1,
    alignItems: "center",
  },

  quickLabel: {
    fontSize: 11,
    marginTop: 5,
  },

  quickValue: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 3,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },

  sectionIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  sectionText: {
    flex: 1,
    marginLeft: 11,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  sectionSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },

  spacer: {
    height: 14,
  },

  goalHint: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 7,
  },

  goalHintText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },

  targetRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 70,
  },

  targetIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  targetInfo: {
    flex: 1,
    marginLeft: 11,
  },

  targetTitle: {
    fontSize: 14,
    fontWeight: "800",
  },

  targetDescription: {
    fontSize: 11,
    marginTop: 3,
  },

  targetInputWrapper: {
    width: 105,
    position: "relative",
  },

  targetInput: {
    minHeight: 44,
    paddingRight: 34,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "700",
  },

  targetSuffix: {
    position: "absolute",
    right: 9,
    top: 14,
    fontSize: 9,
    fontWeight: "700",
  },

  targetDivider: {
    height: 1,
    marginVertical: 4,
  },

  saveContainer: {
    marginTop: 4,
    marginBottom: 8,
  },

  savedMessage: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
  },

  savedText: {
    fontSize: 12,
    fontWeight: "700",
  },

  engineHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  engineTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  engineSubtitle: {
    fontSize: 11,
    marginTop: 3,
  },

  engineIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  energyGrid: {
    flexDirection: "row",
    gap: 10,
  },

  energyStat: {
    flex: 1,
    borderRadius: 15,
    borderWidth: 1,
    padding: 13,
  },

  energyLabel: {
    fontSize: 11,
    marginTop: 8,
  },

  energyValue: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 2,
  },

  energyUnit: {
    fontSize: 10,
    marginTop: 1,
  },

  targetCalories: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    padding: 12,
    marginTop: 10,
  },

  targetCaloriesIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  targetCaloriesLabel: {
    fontSize: 10,
    marginBottom: 2,
  },

  targetCaloriesValue: {
    fontSize: 18,
    fontWeight: "900",
  },

  optionRow: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
  },

  optionLabel: {
    flex: 1,
    marginLeft: 11,
    fontSize: 13,
  },

  optionValue: {
    fontSize: 13,
    fontWeight: "800",
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    marginTop: 16,
    paddingHorizontal: 4,
  },

  infoText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 18,
  },

  footerSpace: {
    height: 20,
  },
});