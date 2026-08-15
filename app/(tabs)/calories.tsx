import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {
  Card,
  Screen,
  Subtitle,
  Title,
  useAppColors,
} from "@/components/ui";

import { useFitness } from "@/hooks/useFitness";

const ACCENT = "#B7FF1A";

type IconName = keyof typeof Ionicons.glyphMap;

export default function CaloriesScreen() {
  const c = useAppColors();
  const { state, todayFoods, today } =
    useFitness();

  /* =========================================================
     REAL DATA
  ========================================================= */

  const calorieGoal = Math.max(
    1,
    state.profile.calorieGoal
  );

  const consumed = todayFoods.reduce(
    (sum, food) =>
      sum +
      food.calories *
        food.servings,
    0
  );

  const protein = todayFoods.reduce(
    (sum, food) =>
      sum +
      food.protein *
        food.servings,
    0
  );

  const carbs = todayFoods.reduce(
    (sum, food) =>
      sum +
      food.carbs *
        food.servings,
    0
  );

  const fat = todayFoods.reduce(
    (sum, food) =>
      sum +
      food.fat *
        food.servings,
    0
  );

  const remaining = Math.max(
    0,
    calorieGoal - consumed
  );

  const progress = Math.min(
    1,
    consumed /
      calorieGoal
  );

  const percentage = Math.min(
    100,
    Math.round(progress * 100)
  );

  const caloriesOver =
    Math.max(
      0,
      consumed -
        calorieGoal
    );

  const totalMacros =
    protein +
    carbs +
    fat;

  const calorieStatus =
    consumed === 0
      ? "Not started"
      : consumed <=
          calorieGoal
        ? "On target"
        : "Over target";

  const insightTitle =
    consumed === 0
      ? "Ready to track"
      : consumed <=
          calorieGoal
        ? "You're on track"
        : "Target reached";

  const insightText =
    consumed === 0
      ? "Log your first meal to start building today's nutrition picture."
      : consumed <=
          calorieGoal
        ? `${remaining.toLocaleString()} kcal remain in your daily target.`
        : `${caloriesOver.toLocaleString()} kcal above your current daily target.`;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <View
          style={styles.header}
        >
          <View
            style={styles.headerCopy}
          >
            <Subtitle>
              Daily nutrition
            </Subtitle>

            <Title>
              Calories
            </Title>

            <Text
              style={[
                styles.headerDescription,
                {
                  color:
                    c.muted,
                },
              ]}
            >
              A clear view of your intake, macros,
              and remaining daily budget.
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
              name="flame"
              size={21}
              color={ACCENT}
            />
          </View>
        </View>

        {/* ===================================================
            CALORIE HERO
        =================================================== */}

        <Card
          style={[
            styles.heroCard,
            {
              backgroundColor:
                c.surface,
              borderColor:
                c.border,
            },
          ]}
        >
          <View
            style={
              styles.heroTop
            }
          >
            <View
              style={
                styles.heroCopy
              }
            >
              <View
                style={
                  styles.statusPill
                }
              >
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        ACCENT,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.statusPillText,
                    {
                      color:
                        ACCENT,
                    },
                  ]}
                >
                  {calorieStatus}
                </Text>
              </View>

              <Text
                style={[
                  styles.eyebrow,
                  {
                    color:
                      c.muted,
                  },
                ]}
              >
                CONSUMED TODAY
              </Text>

              <View
                style={
                  styles.calorieRow
                }
              >
                <Text
                  style={[
                    styles.calorieNumber,
                    {
                      color:
                        c.text,
                    },
                  ]}
                >
                  {Math.round(
                    consumed
                  ).toLocaleString()}
                </Text>

                <Text
                  style={[
                    styles.calorieUnit,
                    {
                      color:
                        c.muted,
                    },
                  ]}
                >
                  kcal
                </Text>
              </View>

              <Text
                style={[
                  styles.goalText,
                  {
                    color:
                      c.muted,
                  },
                ]}
              >
                Daily target{" "}
                <Text
                  style={{
                    color:
                      c.text,
                    fontWeight:
                      "900",
                  }}
                >
                  {calorieGoal.toLocaleString()}
                </Text>{" "}
                kcal
              </Text>
            </View>

            {/* Circular progress */}

            <View
              style={[
                styles.progressCircle,
                {
                  backgroundColor:
                    `${ACCENT}08`,
                  borderColor:
                    ACCENT,
                },
              ]}
            >
              <Text
                style={[
                  styles.progressCircleValue,
                  {
                    color:
                      c.text,
                  },
                ]}
              >
                {percentage}%
              </Text>

              <Text
                style={[
                  styles.progressCircleLabel,
                  {
                    color:
                      c.muted,
                  },
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
                  width:
                    `${percentage}%`,
                  backgroundColor:
                    ACCENT,
                },
              ]}
            />
          </View>

          <View
            style={
              styles.progressFooter
            }
          >
            <Text
              style={[
                styles.progressLeft,
                {
                  color:
                    c.muted,
                },
              ]}
            >
              {Math.round(
                consumed
              ).toLocaleString()}{" "}
              consumed
            </Text>

            <Text
              style={[
                styles.progressRight,
                {
                  color:
                    ACCENT,
                },
              ]}
            >
              {percentage}%
            </Text>
          </View>

          {/* Summary */}

          <View
            style={[
              styles.summaryRow,
              {
                borderTopColor:
                  c.border,
              },
            ]}
          >
            <SummaryItem
              icon="restaurant-outline"
              title="Remaining"
              value={
                remaining > 0
                  ? `${remaining.toLocaleString()} kcal`
                  : "Target reached"
              }
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

            <SummaryItem
              icon="flame-outline"
              title="Activity burn"
              value={`${today.caloriesBurned} kcal`}
              c={c}
            />
          </View>
        </Card>

        {/* ===================================================
            QUICK SNAPSHOT
        =================================================== */}

        <View
          style={
            styles.snapshotRow
          }
        >
          <Snapshot
            title="Consumed"
            value={`${Math.round(
              consumed
            )}`}
            unit="kcal"
            icon="flame-outline"
            c={c}
          />

          <Snapshot
            title="Remaining"
            value={`${Math.round(
              remaining
            )}`}
            unit="kcal"
            icon="restaurant-outline"
            c={c}
          />

          <Snapshot
            title="Burned"
            value={`${today.caloriesBurned}`}
            unit="kcal"
            icon="walk-outline"
            c={c}
          />
        </View>

        {/* ===================================================
            MACROS
        =================================================== */}

        <SectionHeader
          title="Macronutrients"
          subtitle="Today's nutrition breakdown"
          icon="pie-chart-outline"
        />

        <View
          style={styles.macroRow}
        >
          <MacroCard
            title="Protein"
            value={protein}
            icon="barbell-outline"
            c={c}
          />

          <MacroCard
            title="Carbs"
            value={carbs}
            icon="leaf-outline"
            c={c}
          />

          <MacroCard
            title="Fat"
            value={fat}
            icon="water-outline"
            c={c}
          />
        </View>

        {/* Total macros pill */}

        <View
          style={[
            styles.totalMacroPill,
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
              styles.totalMacroIcon,
              {
                backgroundColor:
                  `${ACCENT}12`,
              },
            ]}
          >
            <Ionicons
              name="nutrition-outline"
              size={16}
              color={ACCENT}
            />
          </View>

          <View
            style={
              styles.totalMacroText
            }
          >
            <Text
              style={[
                styles.totalMacroTitle,
                {
                  color:
                    c.text,
                },
              ]}
            >
              Total macros
            </Text>

            <Text
              style={[
                styles.totalMacroSubtitle,
                {
                  color:
                    c.muted,
                },
              ]}
            >
              {Math.round(
                totalMacros
              )}{" "}
              g logged today
            </Text>
          </View>

          <View
            style={[
              styles.totalMacroArrow,
              {
                backgroundColor:
                  `${ACCENT}0C`,
              },
            ]}
          >
            <Ionicons
              name="chevron-forward"
              size={15}
              color={
                c.muted
              }
            />
          </View>
        </View>

        {/* ===================================================
            ADD FOOD PRIMARY ACTION
        =================================================== */}

        <Pressable
          onPress={() =>
            router.push(
              "/add-food"
            )
          }
          style={({ pressed }) => [
            styles.addFoodButton,
            {
              backgroundColor:
                c.primary,
              opacity:
                pressed
                  ? 0.8
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
            style={
              styles.addFoodIcon
            }
          >
            <Ionicons
              name="add"
              size={21}
              color="#0A0F0C"
            />
          </View>

          <View
            style={
              styles.addFoodCopy
            }
          >
            <Text
              style={
                styles.addFoodTitle
              }
            >
              Add food
            </Text>

            <Text
              style={
                styles.addFoodSubtitle
              }
            >
              Log a meal or snack
            </Text>
          </View>

          <View
            style={
              styles.addFoodArrow
            }
          >
            <Ionicons
              name="arrow-forward"
              size={18}
              color="#0A0F0C"
            />
          </View>
        </Pressable>

        {/* ===================================================
            TODAY'S MEALS
        =================================================== */}

        <SectionHeader
          title="Today's meals"
          subtitle={
            todayFoods.length ===
            0
              ? "Nothing logged yet"
              : `${todayFoods.length} ${
                  todayFoods.length ===
                  1
                    ? "entry"
                    : "entries"
                } logged today`
          }
          icon="restaurant-outline"
        />

        {todayFoods.length ===
        0 ? (
          <EmptyMeals c={c} />
        ) : (
          <View
            style={
              styles.foodList
            }
          >
            {todayFoods.map(
              (food) => {
                const foodCalories =
                  Math.round(
                    food.calories *
                      food.servings
                  );

                return (
                  <FoodItem
                    key={food.id}
                    name={
                      food.name
                    }
                    meal={
                      food.meal
                    }
                    servings={
                      food.servings
                    }
                    calories={
                      foodCalories
                    }
                    c={c}
                  />
                );
              }
            )}
          </View>
        )}

        {/* ===================================================
            DAILY INSIGHT
        =================================================== */}

        <SectionHeader
          title="Daily insight"
          subtitle="Based on your current food log"
          icon="sparkles-outline"
        />

        <View
          style={[
            styles.insightPill,
            {
              backgroundColor:
                c.surface,
              borderColor:
                `${ACCENT}30`,
            },
          ]}
        >
          <View
            style={
              styles.insightCircle
            }
          >
            <Ionicons
              name="bulb-outline"
              size={18}
              color="#0A0F0C"
            />
          </View>

          <View
            style={
              styles.insightCopy
            }
          >
            <View
              style={
                styles.insightTop
              }
            >
              <Text
                style={[
                  styles.insightEyebrow,
                  {
                    color:
                      ACCENT,
                  },
                ]}
              >
                FITPULSE INSIGHT
              </Text>

              <View
                style={[
                  styles.insightBadge,
                  {
                    backgroundColor:
                      `${ACCENT}10`,
                  },
                ]}
              >
                <View
                  style={
                    styles.insightBadgeDot
                  }
                />

                <Text
                  style={[
                    styles.insightBadgeText,
                    {
                      color:
                        ACCENT,
                    },
                  ]}
                >
                  LIVE
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.insightTitle,
                {
                  color:
                    c.text,
                },
              ]}
            >
              {insightTitle}
            </Text>

            <Text
              style={[
                styles.insightText,
                {
                  color:
                    c.muted,
                },
              ]}
            >
              {insightText}
            </Text>
          </View>
        </View>

        <View
          style={
            styles.bottomSpace
          }
        />
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
  icon: IconName;
}) {
  const c = useAppColors();

  return (
    <View
      style={
        styles.sectionHeader
      }
    >
      <View
        style={
          styles.sectionText
        }
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color:
                c.text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.sectionSubtitle,
            {
              color:
                c.muted,
            },
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
              `${ACCENT}12`,
            borderColor:
              `${ACCENT}25`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={16}
          color={ACCENT}
        />
      </View>
    </View>
  );
}

/* ============================================================
   SUMMARY ITEM
============================================================ */

function SummaryItem({
  icon,
  title,
  value,
  c,
}: {
  icon: IconName;
  title: string;
  value: string;
  c: ReturnType<
    typeof useAppColors
  >;
}) {
  return (
    <View
      style={
        styles.summaryItem
      }
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
        style={
          styles.summaryCopy
        }
      >
        <Text
          style={[
            styles.summaryLabel,
            {
              color:
                c.muted,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.summaryValue,
            {
              color:
                c.text,
            },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

/* ============================================================
   SNAPSHOT
============================================================ */

function Snapshot({
  title,
  value,
  unit,
  icon,
  c,
}: {
  title: string;
  value: string;
  unit: string;
  icon: IconName;
  c: ReturnType<
    typeof useAppColors
  >;
}) {
  return (
    <View
      style={[
        styles.snapshotCard,
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
          styles.snapshotIcon,
          {
            backgroundColor:
              `${ACCENT}10`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={14}
          color={ACCENT}
        />
      </View>

      <Text
        style={[
          styles.snapshotTitle,
          {
            color:
              c.muted,
          },
        ]}
      >
        {title}
      </Text>

      <View
        style={
          styles.snapshotValueRow
        }
      >
        <Text
          style={[
            styles.snapshotValue,
            {
              color:
                c.text,
            },
          ]}
        >
          {value}
        </Text>

        <Text
          style={[
            styles.snapshotUnit,
            {
              color:
                c.muted,
            },
          ]}
        >
          {unit}
        </Text>
      </View>
    </View>
  );
}

/* ============================================================
   MACRO CARD
============================================================ */

function MacroCard({
  title,
  value,
  icon,
  c,
}: {
  title: string;
  value: number;
  icon: IconName;
  c: ReturnType<
    typeof useAppColors
  >;
}) {
  return (
    <Card
      style={[
        styles.macroCard,
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
          styles.macroIcon,
          {
            backgroundColor:
              `${ACCENT}12`,
            borderColor:
              `${ACCENT}22`,
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
          styles.macroLabel,
          {
            color:
              c.muted,
          },
        ]}
      >
        {title}
      </Text>

      <View
        style={
          styles.macroValueRow
        }
      >
        <Text
          style={[
            styles.macroValue,
            {
              color:
                c.text,
            },
          ]}
        >
          {Math.round(
            value
          )}
        </Text>

        <Text
          style={[
            styles.macroUnit,
            {
              color:
                c.muted,
            },
          ]}
        >
          g
        </Text>
      </View>
    </Card>
  );
}

/* ============================================================
   FOOD ITEM
============================================================ */

function FoodItem({
  name,
  meal,
  servings,
  calories,
  c,
}: {
  name: string;
  meal: string;
  servings: number;
  calories: number;
  c: ReturnType<
    typeof useAppColors
  >;
}) {
  return (
    <View
      style={[
        styles.foodItem,
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
          styles.foodCircle,
          {
            backgroundColor:
              `${ACCENT}12`,
            borderColor:
              `${ACCENT}22`,
          },
        ]}
      >
        <Ionicons
          name="restaurant-outline"
          size={17}
          color={ACCENT}
        />
      </View>

      <View
        style={
          styles.foodInfo
        }
      >
        <Text
          numberOfLines={1}
          style={[
            styles.foodName,
            {
              color:
                c.text,
            },
          ]}
        >
          {name}
        </Text>

        <Text
          style={[
            styles.foodMeta,
            {
              color:
                c.muted,
            },
          ]}
        >
          {formatMeal(
            meal
          )}{" "}
          ·{" "}
          {servings}{" "}
          {servings === 1
            ? "serving"
            : "servings"}
        </Text>
      </View>

      <View
        style={
          styles.foodCalories
        }
      >
        <Text
          style={[
            styles.foodCaloriesValue,
            {
              color:
                c.text,
            },
          ]}
        >
          {calories}
        </Text>

        <Text
          style={[
            styles.foodCaloriesUnit,
            {
              color:
                c.muted,
            },
          ]}
        >
          kcal
        </Text>
      </View>
    </View>
  );
}

/* ============================================================
   EMPTY MEALS
============================================================ */

function EmptyMeals({
  c,
}: {
  c: ReturnType<
    typeof useAppColors
  >;
}) {
  return (
    <View
      style={[
        styles.emptyCard,
        {
          backgroundColor:
            c.surface,
          borderColor:
            c.border,
        },
      ]}
    >
      <View
        style={
          styles.emptyCircle
        }
      >
        <Ionicons
          name="restaurant-outline"
          size={25}
          color={ACCENT}
        />
      </View>

      <Text
        style={[
          styles.emptyTitle,
          {
            color:
              c.text,
          },
        ]}
      >
        No meals logged
      </Text>

      <Text
        style={[
          styles.emptyText,
          {
            color:
              c.muted,
          },
        ]}
      >
        Add your first meal to start tracking
        today's nutrition.
      </Text>

      <Pressable
        onPress={() =>
          router.push(
            "/add-food"
          )
        }
        style={({ pressed }) => [
          styles.emptyButton,
          {
            backgroundColor:
              c.primarySoft,
            borderColor:
              `${c.primary}40`,
            opacity:
              pressed
                ? 0.72
                : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.emptyButtonText,
            {
              color:
                c.primary,
            },
          ]}
        >
          Log first meal
        </Text>

        <View
          style={
            styles.emptyButtonCircle
          }
        >
          <Ionicons
            name="arrow-forward"
            size={13}
            color={
              c.primary
            }
          />
        </View>
      </Pressable>
    </View>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function formatMeal(
  meal: string
) {
  return meal
    .charAt(0)
    .toUpperCase() +
    meal.slice(1);
}

/* ============================================================
   STYLES
============================================================ */

const styles =
  StyleSheet.create({
    content: {
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 150,
    },

    /* Header */

    header: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginBottom: 20,
    },

    headerCopy: {
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
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    /* Hero */

    heroCard: {
      borderRadius: 26,
      borderWidth: 1,
      padding: 19,
      marginBottom: 17,
    },

    heroTop: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
    },

    heroCopy: {
      flex: 1,
      paddingRight: 10,
    },

    statusPill: {
      alignSelf:
        "flex-start",
      flexDirection:
        "row",
      alignItems:
        "center",
      borderRadius: 999,
      backgroundColor:
        `${ACCENT}0D`,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginBottom: 10,
    },

    statusDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      marginRight: 5,
    },

    statusPillText: {
      fontSize: 7,
      fontWeight:
        "900",
      letterSpacing:
        0.7,
    },

    eyebrow: {
      fontSize: 9,
      fontWeight:
        "900",
      letterSpacing:
        1.2,
    },

    calorieRow: {
      flexDirection:
        "row",
      alignItems:
        "baseline",
      marginTop: 3,
    },

    calorieNumber: {
      fontSize: 42,
      fontWeight:
        "900",
      letterSpacing:
        -1.3,
    },

    calorieUnit: {
      fontSize: 13,
      fontWeight:
        "700",
      marginLeft: 6,
    },

    goalText: {
      fontSize: 10,
      marginTop: 4,
    },

    progressCircle: {
      width: 80,
      height: 80,
      borderRadius:
        40,
      borderWidth: 4,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    progressCircleValue: {
      fontSize: 17,
      fontWeight:
        "900",
    },

    progressCircleLabel: {
      fontSize: 8,
      marginTop: 1,
    },

    progressTrack: {
      height: 8,
      borderRadius:
        999,
      overflow:
        "hidden",
      marginTop: 21,
    },

    progressFill: {
      height: "100%",
      borderRadius:
        999,
    },

    progressFooter: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginTop: 8,
    },

    progressLeft: {
      fontSize: 9,
      fontWeight:
        "600",
    },

    progressRight: {
      fontSize: 9,
      fontWeight:
        "900",
    },

    summaryRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      borderTopWidth: 1,
      marginTop: 16,
      paddingTop: 14,
    },

    summaryItem: {
      flex: 1,
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    summaryIcon: {
      width: 32,
      height: 32,
      borderRadius:
        16,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    summaryCopy: {
      flex: 1,
      marginLeft: 8,
    },

    summaryLabel: {
      fontSize: 8,
      fontWeight:
        "600",
    },

    summaryValue: {
      fontSize: 11,
      fontWeight:
        "900",
      marginTop: 2,
    },

    summaryDivider: {
      width: 1,
      height: 30,
      marginHorizontal: 8,
    },

    /* Snapshot */

    snapshotRow: {
      flexDirection:
        "row",
      gap: 8,
      marginBottom: 25,
    },

    snapshotCard: {
      flex: 1,
      minHeight: 94,
      borderRadius:
        20,
      borderWidth: 1,
      padding: 11,
    },

    snapshotIcon: {
      width: 30,
      height: 30,
      borderRadius:
        15,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    snapshotTitle: {
      fontSize: 8,
      fontWeight:
        "700",
      marginTop: 7,
    },

    snapshotValueRow: {
      flexDirection:
        "row",
      alignItems:
        "baseline",
      marginTop: 2,
    },

    snapshotValue: {
      fontSize: 17,
      fontWeight:
        "900",
    },

    snapshotUnit: {
      fontSize: 7,
      fontWeight:
        "700",
      marginLeft: 2,
    },

    /* Sections */

    sectionHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginBottom: 10,
    },

    sectionText: {
      flex: 1,
    },

    sectionTitle: {
      fontSize: 17,
      fontWeight:
        "900",
      letterSpacing:
        -0.2,
    },

    sectionSubtitle: {
      fontSize: 10,
      lineHeight: 15,
      marginTop: 3,
    },

    sectionIcon: {
      width: 36,
      height: 36,
      borderRadius:
        18,
      borderWidth: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    /* Macros */

    macroRow: {
      flexDirection:
        "row",
      gap: 8,
      marginBottom: 9,
    },

    macroCard: {
      flex: 1,
      minHeight: 100,
      borderRadius:
        20,
      padding: 12,
    },

    macroIcon: {
      width: 34,
      height: 34,
      borderRadius:
        17,
      borderWidth: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    macroLabel: {
      fontSize: 9,
      fontWeight:
        "700",
      marginTop: 8,
    },

    macroValueRow: {
      flexDirection:
        "row",
      alignItems:
        "baseline",
      marginTop: 2,
    },

    macroValue: {
      fontSize: 19,
      fontWeight:
        "900",
    },

    macroUnit: {
      fontSize: 8,
      fontWeight:
        "700",
      marginLeft: 3,
    },

    /* Total */

    totalMacroPill: {
      minHeight: 58,
      borderRadius:
        999,
      borderWidth: 1,
      paddingHorizontal: 9,
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 16,
    },

    totalMacroIcon: {
      width: 38,
      height: 38,
      borderRadius:
        19,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    totalMacroText: {
      flex: 1,
      marginLeft: 9,
    },

    totalMacroTitle: {
      fontSize: 11,
      fontWeight:
        "900",
    },

    totalMacroSubtitle: {
      fontSize: 8,
      marginTop: 2,
    },

    totalMacroArrow: {
      width: 30,
      height: 30,
      borderRadius:
        15,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    /* Add food */

    addFoodButton: {
      minHeight: 66,
      borderRadius:
        999,
      paddingHorizontal: 9,
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 25,
    },

    addFoodIcon: {
      width: 46,
      height: 46,
      borderRadius:
        23,
      backgroundColor:
        "rgba(10,15,12,0.12)",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    addFoodCopy: {
      flex: 1,
      marginLeft: 10,
    },

    addFoodTitle: {
      color:
        "#0A0F0C",
      fontSize: 14,
      fontWeight:
        "900",
    },

    addFoodSubtitle: {
      color:
        "rgba(10,15,12,0.58)",
      fontSize: 9,
      marginTop: 2,
      fontWeight:
        "600",
    },

    addFoodArrow: {
      width: 35,
      height: 35,
      borderRadius:
        18,
      backgroundColor:
        "rgba(10,15,12,0.12)",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    /* Food list */

    foodList: {
      gap: 8,
      marginBottom: 1,
    },

    foodItem: {
      minHeight: 66,
      borderRadius:
        999,
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 7,
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 0,
    },

    foodCircle: {
      width: 46,
      height: 46,
      borderRadius:
        23,
      borderWidth: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    foodInfo: {
      flex: 1,
      minWidth: 0,
      marginLeft: 9,
    },

    foodName: {
      fontSize: 12,
      fontWeight:
        "800",
    },

    foodMeta: {
      fontSize: 8,
      marginTop: 3,
    },

    foodCalories: {
      alignItems:
        "flex-end",
      marginLeft: 8,
      marginRight: 4,
    },

    foodCaloriesValue: {
      fontSize: 15,
      fontWeight:
        "900",
    },

    foodCaloriesUnit: {
      fontSize: 8,
      marginTop: 1,
    },

    /* Empty */

    emptyCard: {
      borderRadius:
        22,
      borderWidth: 1,
      alignItems:
        "center",
      padding: 24,
      marginBottom: 2,
    },

    emptyCircle: {
      width: 56,
      height: 56,
      borderRadius:
        28,
      backgroundColor:
        `${ACCENT}12`,
      borderWidth: 1,
      borderColor:
        `${ACCENT}25`,
      alignItems:
        "center",
      justifyContent:
        "center",
      marginBottom: 11,
    },

    emptyTitle: {
      fontSize: 15,
      fontWeight:
        "900",
    },

    emptyText: {
      maxWidth: 280,
      textAlign:
        "center",
      fontSize: 10,
      lineHeight: 17,
      marginTop: 5,
    },

    emptyButton: {
      width: "100%",
      minHeight: 45,
      borderRadius:
        999,
      borderWidth: 1,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginTop: 14,
      gap: 8,
    },

    emptyButtonText: {
      fontSize: 10,
      fontWeight:
        "900",
    },

    emptyButtonCircle: {
      width: 28,
      height: 28,
      borderRadius:
        14,
      backgroundColor:
        `${ACCENT}12`,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    /* Insight */

    insightPill: {
      minHeight: 82,
      borderRadius:
        999,
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 8,
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    insightCircle: {
      width: 52,
      height: 52,
      borderRadius:
        26,
      backgroundColor:
        ACCENT,
      alignItems:
        "center",
      justifyContent:
        "center",
      flexShrink: 0,
    },

    insightCopy: {
      flex: 1,
      marginLeft: 10,
      minWidth: 0,
    },

    insightTop: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginBottom: 2,
    },

    insightEyebrow: {
      fontSize: 7,
      fontWeight:
        "900",
      letterSpacing:
        0.9,
    },

    insightBadge: {
      flexDirection:
        "row",
      alignItems:
        "center",
      borderRadius:
        999,
      paddingHorizontal: 7,
      paddingVertical: 3,
      marginLeft: 6,
    },

    insightBadgeDot: {
      width: 4,
      height: 4,
      borderRadius:
        2,
      backgroundColor:
        ACCENT,
      marginRight: 4,
    },

    insightBadgeText: {
      fontSize: 6,
      fontWeight:
        "900",
      letterSpacing:
        0.6,
    },

    insightTitle: {
      fontSize: 13,
      fontWeight:
        "900",
    },

    insightText: {
      fontSize: 9,
      lineHeight: 15,
      marginTop: 3,
    },

    bottomSpace: {
      height: 20,
    },
  });