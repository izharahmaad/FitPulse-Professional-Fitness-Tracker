import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {
  Button,
  Card,
  Screen,
  Subtitle,
  Title,
  useAppColors,
} from "@/components/ui";

import { useFitness } from "@/hooks/useFitness";

export default function CaloriesScreen() {
  const c = useAppColors();
  const { state, todayFoods, today } = useFitness();

  const calorieGoal = Math.max(1, state.profile.calorieGoal);

  const consumed = todayFoods.reduce(
    (sum, food) => sum + food.calories * food.servings,
    0
  );

  const protein = todayFoods.reduce(
    (sum, food) => sum + food.protein * food.servings,
    0
  );

  const carbs = todayFoods.reduce(
    (sum, food) => sum + food.carbs * food.servings,
    0
  );

  const fat = todayFoods.reduce(
    (sum, food) => sum + food.fat * food.servings,
    0
  );

  const remaining = Math.max(0, calorieGoal - consumed);

  const progress = Math.min(1, consumed / calorieGoal);

  const consumedPercent = Math.round(progress * 100);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Subtitle>Daily nutrition</Subtitle>
            <Title>Calories</Title>
          </View>

          <View
            style={[
              styles.headerIcon,
              { backgroundColor: c.primarySoft },
            ]}
          >
            <Ionicons
              name="flame"
              size={22}
              color={c.primary}
            />
          </View>
        </View>

        {/* Main calorie card */}
        <Card
          style={[
            styles.calorieCard,
            {
              borderColor: c.border,
            },
          ]}
        >
          <View style={styles.calorieTop}>
            <View>
              <Text
                style={[
                  styles.eyebrow,
                  { color: c.muted },
                ]}
              >
                CONSUMED TODAY
              </Text>

              <View style={styles.calorieNumberRow}>
                <Text
                  style={[
                    styles.calorieNumber,
                    { color: c.text },
                  ]}
                >
                  {Math.round(consumed).toLocaleString()}
                </Text>

                <Text
                  style={[
                    styles.calorieUnit,
                    { color: c.muted },
                  ]}
                >
                  kcal
                </Text>
              </View>

              <Text
                style={[
                  styles.goalText,
                  { color: c.muted },
                ]}
              >
                Daily target{" "}
                <Text style={{ color: c.text, fontWeight: "800" }}>
                  {calorieGoal.toLocaleString()} kcal
                </Text>
              </Text>
            </View>

            <View
              style={[
                styles.percentCircle,
                {
                  borderColor: c.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.percent,
                  { color: c.text },
                ]}
              >
                {consumedPercent}%
              </Text>

              <Text
                style={[
                  styles.percentLabel,
                  { color: c.muted },
                ]}
              >
                used
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
                  width: `${consumedPercent}%`,
                },
              ]}
            />
          </View>

          {/* Calorie breakdown */}
          <View style={styles.calorieStats}>
            <View style={styles.calorieStat}>
              <View
                style={[
                  styles.smallIcon,
                  { backgroundColor: c.primarySoft },
                ]}
              >
                <Ionicons
                  name="restaurant-outline"
                  size={16}
                  color={c.primary}
                />
              </View>

              <View>
                <Text
                  style={[
                    styles.statLabel,
                    { color: c.muted },
                  ]}
                >
                  Remaining
                </Text>

                <Text
                  style={[
                    styles.statValue,
                    { color: c.text },
                  ]}
                >
                  {remaining.toLocaleString()} kcal
                </Text>
              </View>
            </View>

            <View style={styles.calorieStat}>
              <View
                style={[
                  styles.smallIcon,
                  { backgroundColor: c.primarySoft },
                ]}
              >
                <Ionicons
                  name="flame-outline"
                  size={16}
                  color={c.primary}
                />
              </View>

              <View>
                <Text
                  style={[
                    styles.statLabel,
                    { color: c.muted },
                  ]}
                >
                  Activity burn
                </Text>

                <Text
                  style={[
                    styles.statValue,
                    { color: c.text },
                  ]}
                >
                  {today.caloriesBurned} kcal
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Macro section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                { color: c.text },
              ]}
            >
              Macronutrients
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                { color: c.muted },
              ]}
            >
              Your nutrition breakdown today
            </Text>
          </View>

          <Ionicons
            name="pie-chart-outline"
            size={20}
            color={c.muted}
          />
        </View>

        <View style={styles.macros}>
          <Macro
            label="Protein"
            value={protein}
            icon="barbell-outline"
            color={c.primary}
          />

          <Macro
            label="Carbs"
            value={carbs}
            icon="leaf-outline"
            color={c.accent}
          />

          <Macro
            label="Fat"
            value={fat}
            icon="water-outline"
            color={c.blue}
          />
        </View>

        {/* Add food CTA */}
        <Button
          title="Add food"
          onPress={() => router.push("/add-food")}
        />

        {/* Meals */}
        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                { color: c.text },
              ]}
            >
              Today's meals
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                { color: c.muted },
              ]}
            >
              {todayFoods.length === 0
                ? "Nothing logged yet"
                : `${todayFoods.length} ${
                    todayFoods.length === 1 ? "meal" : "meals"
                  } logged`}
            </Text>
          </View>

          <Ionicons
            name="restaurant-outline"
            size={20}
            color={c.muted}
          />
        </View>

        {todayFoods.length === 0 ? (
          <Card style={styles.emptyCard}>
            <View
              style={[
                styles.emptyIcon,
                { backgroundColor: c.primarySoft },
              ]}
            >
              <Ionicons
                name="restaurant-outline"
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
              No meals logged
            </Text>

            <Text
              style={[
                styles.emptyText,
                { color: c.muted },
              ]}
            >
              Start tracking your nutrition by adding
              your first meal of the day.
            </Text>

            <View style={styles.emptyButton}>
              <Button
                title="Log first meal"
                onPress={() => router.push("/add-food")}
              />
            </View>
          </Card>
        ) : (
          <View style={styles.foodList}>
            {todayFoods.map((food) => {
              const foodCalories = Math.round(
                food.calories * food.servings
              );

              return (
                <Card
                  key={food.id}
                  style={styles.foodCard}
                >
                  <View
                    style={[
                      styles.foodIcon,
                      { backgroundColor: c.primarySoft },
                    ]}
                  >
                    <Ionicons
                      name="restaurant-outline"
                      size={19}
                      color={c.primary}
                    />
                  </View>

                  <View style={styles.foodInfo}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.foodName,
                        { color: c.text },
                      ]}
                    >
                      {food.name}
                    </Text>

                    <Text
                      style={[
                        styles.foodMeta,
                        { color: c.muted },
                      ]}
                    >
                      {food.meal} • {food.servings}{" "}
                      {food.servings === 1
                        ? "serving"
                        : "servings"}
                    </Text>
                  </View>

                  <View style={styles.foodCalories}>
                    <Text
                      style={[
                        styles.foodCaloriesValue,
                        { color: c.text },
                      ]}
                    >
                      {foodCalories}
                    </Text>

                    <Text
                      style={[
                        styles.foodCaloriesUnit,
                        { color: c.muted },
                      ]}
                    >
                      kcal
                    </Text>
                  </View>
                </Card>
              );
            })}
          </View>
        )}

        {/* Daily insight */}
        <Card style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View
              style={[
                styles.insightIcon,
                { backgroundColor: c.primarySoft },
              ]}
            >
              <Ionicons
                name="bulb-outline"
                size={19}
                color={c.primary}
              />
            </View>

            <Text
              style={[
                styles.insightTitle,
                { color: c.text },
              ]}
            >
              Daily insight
            </Text>
          </View>

          <Text
            style={[
              styles.insightText,
              { color: c.muted },
            ]}
          >
            {consumed === 0
              ? "Log your meals throughout the day to get a clearer picture of your nutrition."
              : consumed < calorieGoal * 0.5
              ? "You're still early in your calorie target. Keep logging meals so your daily picture stays accurate."
              : consumed <= calorieGoal
              ? "You're within your calorie target. Keep your meals balanced and stay consistent."
              : "You've reached your calorie target for today. Focus on hydration and balanced choices."}
          </Text>
        </Card>

        {/* Bottom spacing */}
        <View style={styles.footerSpace} />
      </ScrollView>
    </Screen>
  );
}

function Macro({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}) {
  const c = useAppColors();

  return (
    <Card style={styles.macro}>
      <View
        style={[
          styles.macroIcon,
          { backgroundColor: `${color}22` },
        ]}
      >
        <Ionicons
          name={icon}
          size={17}
          color={color}
        />
      </View>

      <Text
        style={[
          styles.macroLabel,
          { color: c.muted },
        ]}
      >
        {label}
      </Text>

      <View style={styles.macroValueRow}>
        <Text
          style={[
            styles.macroValue,
            { color: c.text },
          ]}
        >
          {Math.round(value)}
        </Text>

        <Text
          style={[
            styles.macroUnit,
            { color: c.muted },
          ]}
        >
          g
        </Text>
      </View>
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
    marginBottom: 18,
  },

  headerText: {
    flex: 1,
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  calorieCard: {
    padding: 20,
    marginBottom: 24,
  },

  calorieTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  calorieNumberRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 5,
  },

  calorieNumber: {
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: -1,
  },

  calorieUnit: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 6,
    marginBottom: 8,
  },

  goalText: {
    fontSize: 12,
    marginTop: 3,
  },

  percentCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  percent: {
    fontSize: 17,
    fontWeight: "900",
  },

  percentLabel: {
    fontSize: 10,
    marginTop: 1,
  },

  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 22,
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  calorieStats: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },

  calorieStat: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  smallIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  statLabel: {
    fontSize: 10,
    fontWeight: "600",
  },

  statValue: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
  },

  sectionSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  macros: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 18,
  },

  macro: {
    flex: 1,
    padding: 13,
    marginBottom: 0,
  },

  macroIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  macroLabel: {
    fontSize: 11,
    fontWeight: "700",
  },

  macroValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 2,
  },

  macroValue: {
    fontSize: 20,
    fontWeight: "900",
  },

  macroUnit: {
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 3,
    marginBottom: 3,
  },

  foodList: {
    gap: 10,
  },

  foodCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 0,
  },

  foodIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  foodInfo: {
    flex: 1,
    minWidth: 0,
  },

  foodName: {
    fontSize: 14,
    fontWeight: "800",
  },

  foodMeta: {
    fontSize: 11,
    marginTop: 4,
  },

  foodCalories: {
    alignItems: "flex-end",
    marginLeft: 10,
  },

  foodCaloriesValue: {
    fontSize: 16,
    fontWeight: "900",
  },

  foodCaloriesUnit: {
    fontSize: 10,
    marginTop: 1,
  },

  emptyCard: {
    alignItems: "center",
    padding: 24,
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
    fontSize: 16,
    fontWeight: "900",
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 6,
    maxWidth: 290,
  },

  emptyButton: {
    width: "100%",
    marginTop: 16,
  },

  insightCard: {
    marginTop: 24,
    padding: 18,
  },

  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  insightTitle: {
    fontSize: 15,
    fontWeight: "900",
  },

  insightText: {
    fontSize: 13,
    lineHeight: 21,
    marginTop: 12,
  },

  footerSpace: {
    height: 20,
  },
});