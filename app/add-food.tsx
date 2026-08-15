import React, { useMemo, useState } from "react";
import {
  Alert,
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
  Input,
  Screen,
  Subtitle,
  Title,
  useAppColors,
} from "@/components/ui";

import { MealType } from "@/types/fitness";
import { useFitness } from "@/hooks/useFitness";

const ACCENT = "#B7FF1A";

type IconName = keyof typeof Ionicons.glyphMap;

const foodDatabase = [
  {
    name: "Chicken breast",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    icon: "restaurant-outline" as IconName,
  },
  {
    name: "Cooked rice",
    calories: 205,
    protein: 4.3,
    carbs: 44.5,
    fat: 0.4,
    icon: "nutrition-outline" as IconName,
  },
  {
    name: "Egg",
    calories: 78,
    protein: 6.3,
    carbs: 0.6,
    fat: 5.3,
    icon: "ellipse-outline" as IconName,
  },
  {
    name: "Banana",
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    icon: "leaf-outline" as IconName,
  },
  {
    name: "Plain yogurt",
    calories: 100,
    protein: 5,
    carbs: 7,
    fat: 5,
    icon: "water-outline" as IconName,
  },
];

const mealOptions: {
  value: MealType;
  label: string;
  icon: IconName;
}[] = [
  {
    value: "breakfast",
    label: "Breakfast",
    icon: "sunny-outline",
  },
  {
    value: "lunch",
    label: "Lunch",
    icon: "restaurant-outline",
  },
  {
    value: "dinner",
    label: "Dinner",
    icon: "moon-outline",
  },
  {
    value: "snack",
    label: "Snack",
    icon: "cafe-outline",
  },
];

export default function AddFoodScreen() {
  const c = useAppColors();
  const { addFood } = useFitness();

  const [name, setName] = useState("");
  const [meal, setMeal] =
    useState<MealType>("breakfast");

  const [calories, setCalories] =
    useState("");

  const [protein, setProtein] =
    useState("");

  const [carbs, setCarbs] =
    useState("");

  const [fat, setFat] =
    useState("");

  const [servings, setServings] =
    useState("1");

  /* =========================================================
     QUICK FOOD FILTER
  ========================================================= */

  const filteredFoods = useMemo(() => {
    const query =
      name.trim().toLowerCase();

    if (!query) {
      return foodDatabase;
    }

    return foodDatabase.filter((item) =>
      item.name
        .toLowerCase()
        .includes(query)
    );
  }, [name]);

  /* =========================================================
     SELECT QUICK FOOD
  ========================================================= */

  const chooseFood = (
    item: (typeof foodDatabase)[number]
  ) => {
    setName(item.name);
    setCalories(String(item.calories));
    setProtein(String(item.protein));
    setCarbs(String(item.carbs));
    setFat(String(item.fat));
  };

  /* =========================================================
     SAVE FOOD
  ========================================================= */

  const save = () => {
    const kcal = Number(calories);
    const proteinValue =
      Number(protein) || 0;
    const carbsValue =
      Number(carbs) || 0;
    const fatValue =
      Number(fat) || 0;
    const servingsValue =
      Number(servings);

    if (!name.trim()) {
      Alert.alert(
        "Food name required",
        "Please enter a food name."
      );
      return;
    }

    if (
      !Number.isFinite(kcal) ||
      kcal < 0
    ) {
      Alert.alert(
        "Invalid calories",
        "Please enter a valid calorie amount."
      );
      return;
    }

    if (
      !Number.isFinite(
        servingsValue
      ) ||
      servingsValue <= 0
    ) {
      Alert.alert(
        "Invalid servings",
        "Please enter a valid serving amount."
      );
      return;
    }

    addFood({
      name: name.trim(),
      meal,
      calories: kcal,
      protein: Math.max(
        0,
        proteinValue
      ),
      carbs: Math.max(
        0,
        carbsValue
      ),
      fat: Math.max(
        0,
        fatValue
      ),
      servings: Math.max(
        0.1,
        servingsValue
      ),
    });

    router.back();
  };

  /* =========================================================
     CLEAR
  ========================================================= */

  const clearForm = () => {
    setName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setServings("1");
    setMeal("breakfast");
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Subtitle>
              Nutrition tracking
            </Subtitle>

            <Title>Add food</Title>

            <Text
              style={[
                styles.headerDescription,
                {
                  color: c.muted,
                },
              ]}
            >
              Quickly log your meal and keep your
              nutrition data up to date.
            </Text>
          </View>

          <Pressable
            onPress={() =>
              router.back()
            }
            style={({ pressed }) => [
              styles.closeButton,
              {
                backgroundColor:
                  c.surface,
                borderColor:
                  c.border,
                opacity:
                  pressed
                    ? 0.65
                    : 1,
              },
            ]}
          >
            <Ionicons
              name="close"
              size={19}
              color={c.muted}
            />
          </Pressable>
        </View>

        {/* ===================================================
            QUICK FOODS
        =================================================== */}

        <View style={styles.quickHeader}>
          <View>
            <Text
              style={[
                styles.quickTitle,
                { color: c.text },
              ]}
            >
              Quick add
            </Text>

            <Text
              style={[
                styles.quickSubtitle,
                { color: c.muted },
              ]}
            >
              Tap a food to auto-fill
            </Text>
          </View>

          <View
            style={[
              styles.quickBadge,
              {
                backgroundColor:
                  `${ACCENT}12`,
              },
            ]}
          >
            <Ionicons
              name="flash-outline"
              size={14}
              color={ACCENT}
            />
          </View>
        </View>

        <View
          style={[
            styles.quickGrid,
            {
              backgroundColor:
                c.surface,
              borderColor:
                c.border,
            },
          ]}
        >
          {filteredFoods.map(
            (item) => {
              const selected =
                name === item.name;

              return (
                <Pressable
                  key={item.name}
                  onPress={() =>
                    chooseFood(item)
                  }
                  style={({ pressed }) => [
                    styles.quickItem,
                    {
                      backgroundColor:
                        selected
                          ? c.primarySoft
                          : c.surfaceAlt,
                      borderColor:
                        selected
                          ? `${ACCENT}45`
                          : c.border,
                      opacity:
                        pressed
                          ? 0.72
                          : 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.quickItemIcon,
                      {
                        backgroundColor:
                          selected
                            ? `${ACCENT}18`
                            : c.surface,
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={15}
                      color={
                        selected
                          ? ACCENT
                          : c.muted
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.quickItemText
                    }
                  >
                    <Text
                      style={[
                        styles.quickItemName,
                        {
                          color:
                            selected
                              ? c.primary
                              : c.text,
                        },
                      ]}
                      numberOfLines={
                        1
                      }
                    >
                      {item.name}
                    </Text>

                    <Text
                      style={[
                        styles.quickItemMeta,
                        {
                          color:
                            c.muted,
                        },
                      ]}
                    >
                      {item.calories} kcal
                    </Text>
                  </View>

                  {selected && (
                    <View
                      style={[
                        styles.quickCheck,
                        {
                          backgroundColor:
                            ACCENT,
                        },
                      ]}
                    >
                      <Ionicons
                        name="checkmark"
                        size={9}
                        color="#0A0F0C"
                      />
                    </View>
                  )}
                </Pressable>
              );
            }
          )}
        </View>

        {/* ===================================================
            MAIN FOOD CARD
        =================================================== */}

        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                { color: c.text },
              ]}
            >
              Food details
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                { color: c.muted },
              ]}
            >
              Enter the nutrition values
            </Text>
          </View>
        </View>

        <Card
          style={[
            styles.mainCard,
            {
              backgroundColor:
                c.surface,
              borderColor:
                c.border,
            },
          ]}
        >
          {/* Food name */}

          <FieldLabel
            label="Food name"
            icon="restaurant-outline"
            c={c}
          />

          <Input
            value={name}
            onChangeText={
              setName
            }
            placeholder="e.g. Chicken breast"
            autoCapitalize="words"
          />

          <Divider c={c} />

          {/* Calories */}

          <FieldLabel
            label="Calories"
            icon="flame-outline"
            unit="kcal"
            c={c}
          />

          <Input
            value={calories}
            onChangeText={
              setCalories
            }
            keyboardType="decimal-pad"
            placeholder="e.g. 165"
          />

          <Divider c={c} />

          {/* Macros */}

          <View
            style={
              styles.macroHeader
            }
          >
            <View>
              <Text
                style={[
                  styles.macroHeaderTitle,
                  {
                    color:
                      c.text,
                  },
                ]}
              >
                Macronutrients
              </Text>

              <Text
                style={[
                  styles.macroHeaderSubtitle,
                  {
                    color:
                      c.muted,
                  },
                ]}
              >
                Optional but recommended
              </Text>
            </View>

            <Ionicons
              name="nutrition-outline"
              size={17}
              color={
                c.muted
              }
            />
          </View>

          <View
            style={
              styles.macroRow
            }
          >
            <MacroInput
              label="Protein"
              value={
                protein
              }
              onChangeText={
                setProtein
              }
              icon="barbell-outline"
              c={c}
            />

            <MacroInput
              label="Carbs"
              value={carbs}
              onChangeText={
                setCarbs
              }
              icon="leaf-outline"
              c={c}
            />

            <MacroInput
              label="Fat"
              value={fat}
              onChangeText={
                setFat
              }
              icon="water-outline"
              c={c}
            />
          </View>
        </Card>

        {/* ===================================================
            MEAL + SERVING
        =================================================== */}

        <View
          style={
            styles.sectionHeader
          }
        >
          <View>
            <Text
              style={[
                styles.sectionTitle,
                { color: c.text },
              ]}
            >
              Meal details
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                { color: c.muted },
              ]}
            >
              Choose the meal and amount
            </Text>
          </View>
        </View>

        <Card
          style={[
            styles.mealCard,
            {
              backgroundColor:
                c.surface,
              borderColor:
                c.border,
            },
          ]}
        >
          <Text
            style={[
              styles.smallLabel,
              { color: c.muted },
            ]}
          >
            MEAL
          </Text>

          <View
            style={
              styles.mealGrid
            }
          >
            {mealOptions.map(
              (option) => {
                const selected =
                  meal ===
                  option.value;

                return (
                  <Pressable
                    key={
                      option.value
                    }
                    onPress={() =>
                      setMeal(
                        option.value
                      )
                    }
                    style={({ pressed }) => [
                      styles.mealItem,
                      {
                        backgroundColor:
                          selected
                            ? c.primarySoft
                            : c.surfaceAlt,
                        borderColor:
                          selected
                            ? `${ACCENT}45`
                            : c.border,
                        opacity:
                          pressed
                            ? 0.7
                            : 1,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.mealIcon,
                        {
                          backgroundColor:
                            selected
                              ? `${ACCENT}16`
                              : c.surface,
                        },
                      ]}
                    >
                      <Ionicons
                        name={
                          option.icon
                        }
                        size={15}
                        color={
                          selected
                            ? ACCENT
                            : c.muted
                        }
                      />
                    </View>

                    <Text
                      style={[
                        styles.mealText,
                        {
                          color:
                            selected
                              ? c.primary
                              : c.muted,
                        },
                      ]}
                    >
                      {
                        option.label
                      }
                    </Text>
                  </Pressable>
                );
              }
            )}
          </View>

          <View
            style={[
              styles.innerDivider,
              {
                backgroundColor:
                  c.border,
              },
            ]}
          />

          <View
            style={
              styles.servingRow
            }
          >
            <View
              style={[
                styles.servingIcon,
                {
                  backgroundColor:
                    `${ACCENT}12`,
                },
              ]}
            >
              <Ionicons
                name="layers-outline"
                size={16}
                color={
                  ACCENT
                }
              />
            </View>

            <View
              style={
                styles.servingText
              }
            >
              <Text
                style={[
                  styles.servingTitle,
                  {
                    color:
                      c.text,
                  },
                ]}
              >
                Servings
              </Text>

              <Text
                style={[
                  styles.servingSubtitle,
                  {
                    color:
                      c.muted,
                  },
                ]}
              >
                You can use 0.5, 1, 1.5, etc.
              </Text>
            </View>

            <View
              style={
                styles.servingInputWrap
              }
            >
              <Input
                value={
                  servings
                }
                onChangeText={
                  setServings
                }
                keyboardType="decimal-pad"
                style={
                  styles.servingInput
                }
              />
            </View>
          </View>
        </Card>

        {/* ===================================================
            PREVIEW
        =================================================== */}

        <View
          style={
            styles.sectionHeader
          }
        >
          <View>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color:
                    c.text,
                },
              ]}
            >
              Nutrition preview
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
              Total based on your servings
            </Text>
          </View>
        </View>

        <View
          style={
            styles.previewRow
          }
        >
          <Preview
            label="Calories"
            value={calculateTotal(
              calories,
              servings
            )}
            unit="kcal"
            icon="flame-outline"
            c={c}
          />

          <Preview
            label="Protein"
            value={calculateTotal(
              protein,
              servings
            )}
            unit="g"
            icon="barbell-outline"
            c={c}
          />

          <Preview
            label="Carbs"
            value={calculateTotal(
              carbs,
              servings
            )}
            unit="g"
            icon="leaf-outline"
            c={c}
          />

          <Preview
            label="Fat"
            value={calculateTotal(
              fat,
              servings
            )}
            unit="g"
            icon="water-outline"
            c={c}
          />
        </View>

        {/* ===================================================
            SAVE
        =================================================== */}

        <Pressable
          onPress={save}
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor:
                c.primary,
              opacity:
                pressed
                  ? 0.78
                  : 1,
            },
          ]}
        >
          <View
            style={
              styles.saveButtonIcon
            }
          >
            <Ionicons
              name="checkmark"
              size={18}
              color="#0A0F0C"
            />
          </View>

          <View
            style={
              styles.saveButtonText
            }
          >
            <Text
              style={
                styles.saveButtonTitle
              }
            >
              Save food
            </Text>

            <Text
              style={
                styles.saveButtonSubtitle
              }
            >
              Add to today's nutrition
            </Text>
          </View>

          <Ionicons
            name="arrow-forward"
            size={19}
            color="#0A0F0C"
          />
        </Pressable>

        {/* ===================================================
            SECONDARY ACTION
        =================================================== */}

        <Pressable
          onPress={clearForm}
          style={({ pressed }) => [
            styles.clearButton,
            {
              backgroundColor:
                c.surfaceAlt,
              borderColor:
                c.border,
              opacity:
                pressed
                  ? 0.7
                  : 1,
            },
          ]}
        >
          <Ionicons
            name="refresh-outline"
            size={15}
            color={
              c.muted
            }
          />

          <Text
            style={[
              styles.clearText,
              {
                color:
                  c.muted,
              },
            ]}
          >
            Clear form
          </Text>
        </Pressable>

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
   FIELD LABEL
============================================================ */

function FieldLabel({
  label,
  icon,
  unit,
  c,
}: {
  label: string;
  icon: IconName;
  unit?: string;
  c: ReturnType<
    typeof useAppColors
  >;
}) {
  return (
    <View
      style={
        styles.fieldLabel
      }
    >
      <View
        style={[
          styles.fieldIcon,
          {
            backgroundColor:
              `${ACCENT}12`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={13}
          color={
            ACCENT
          }
        />
      </View>

      <Text
        style={[
          styles.fieldLabelText,
          {
            color:
              c.text,
          },
        ]}
      >
        {label}
      </Text>

      {unit ? (
        <Text
          style={[
            styles.fieldUnit,
            {
              color:
                c.muted,
            },
          ]}
        >
          {unit}
        </Text>
      ) : null}
    </View>
  );
}

/* ============================================================
   MACRO INPUT
============================================================ */

function MacroInput({
  label,
  value,
  onChangeText,
  icon,
  c,
}: {
  label: string;
  value: string;
  onChangeText: (
    value: string
  ) => void;
  icon: IconName;
  c: ReturnType<
    typeof useAppColors
  >;
}) {
  return (
    <View
      style={
        styles.macroInput
      }
    >
      <View
        style={[
          styles.macroInputIcon,
          {
            backgroundColor:
              `${ACCENT}12`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={12}
          color={
            ACCENT
          }
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
        {label}
      </Text>

      <Input
        value={value}
        onChangeText={
          onChangeText
        }
        keyboardType="decimal-pad"
        placeholder="0"
        style={
          styles.macroInputBox
        }
      />
    </View>
  );
}

/* ============================================================
   PREVIEW
============================================================ */

function Preview({
  label,
  value,
  unit,
  icon,
  c,
}: {
  label: string;
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
        styles.previewCard,
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
          styles.previewIcon,
          {
            backgroundColor:
              `${ACCENT}12`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={14}
          color={
            ACCENT
          }
        />
      </View>

      <Text
        style={[
          styles.previewLabel,
          {
            color:
              c.muted,
          },
        ]}
      >
        {label}
      </Text>

      <View
        style={
          styles.previewValueRow
        }
      >
        <Text
          style={[
            styles.previewValue,
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
            styles.previewUnit,
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
   DIVIDER
============================================================ */

function Divider({
  c,
}: {
  c: ReturnType<
    typeof useAppColors
  >;
}) {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor:
            c.border,
        },
      ]}
    />
  );
}

/* ============================================================
   CALCULATE TOTAL
============================================================ */

function calculateTotal(
  value: string,
  servings: string
): string {
  const base = Number(
    value
  );

  const count = Number(
    servings
  );

  if (
    !Number.isFinite(
      base
    ) ||
    !Number.isFinite(
      count
    ) ||
    count <= 0
  ) {
    return "0";
  }

  const total =
    base * count;

  return Number.isInteger(
    total
  )
    ? String(total)
    : total.toFixed(1);
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
      marginBottom: 22,
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

    closeButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    /* Quick */

    quickHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginBottom: 9,
    },

    quickTitle: {
      fontSize: 17,
      fontWeight: "900",
    },

    quickSubtitle: {
      fontSize: 10,
      marginTop: 2,
    },

    quickBadge: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    quickGrid: {
      borderWidth: 1,
      borderRadius: 22,
      padding: 9,
      flexDirection:
        "row",
      flexWrap:
        "wrap",
      justifyContent:
        "space-between",
      rowGap: 7,
      marginBottom: 25,
    },

    quickItem: {
      width: "48.7%",
      minHeight: 53,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 6,
      paddingVertical: 5,
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    quickItemIcon: {
      width: 39,
      height: 39,
      borderRadius: 20,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    quickItemText: {
      flex: 1,
      minWidth: 0,
      marginLeft: 7,
      paddingRight: 3,
    },

    quickItemName: {
      fontSize: 9,
      fontWeight: "800",
    },

    quickItemMeta: {
      fontSize: 7,
      marginTop: 2,
    },

    quickCheck: {
      width: 18,
      height: 18,
      borderRadius: 9,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    /* Sections */

    sectionHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginBottom: 9,
      marginTop: 2,
    },

    sectionTitle: {
      fontSize: 17,
      fontWeight: "900",
    },

    sectionSubtitle: {
      fontSize: 10,
      marginTop: 2,
    },

    /* Main food */

    mainCard: {
      borderRadius: 23,
      borderWidth: 1,
      padding: 16,
      marginBottom: 24,
    },

    fieldLabel: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 7,
    },

    fieldIcon: {
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems:
        "center",
      justifyContent:
        "center",
      marginRight: 7,
    },

    fieldLabelText: {
      fontSize: 11,
      fontWeight: "800",
    },

    fieldUnit: {
      fontSize: 9,
      marginLeft: 4,
    },

    divider: {
      height: 1,
      marginVertical: 14,
    },

    macroHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginBottom: 9,
    },

    macroHeaderTitle: {
      fontSize: 12,
      fontWeight: "900",
    },

    macroHeaderSubtitle: {
      fontSize: 8,
      marginTop: 2,
    },

    macroRow: {
      flexDirection:
        "row",
      gap: 7,
    },

    macroInput: {
      flex: 1,
      minWidth: 0,
    },

    macroInputIcon: {
      width: 27,
      height: 27,
      borderRadius: 14,
      alignItems:
        "center",
      justifyContent:
        "center",
      marginBottom: 5,
    },

    macroLabel: {
      fontSize: 8,
      fontWeight: "800",
      marginBottom: 4,
    },

    macroInputBox: {
      minHeight: 44,
      paddingHorizontal: 7,
      textAlign: "center",
      fontSize: 12,
      fontWeight: "700",
    },

    /* Meal */

    mealCard: {
      borderRadius: 23,
      borderWidth: 1,
      padding: 13,
      marginBottom: 24,
    },

    smallLabel: {
      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 0.8,
      marginBottom: 8,
    },

    mealGrid: {
      flexDirection:
        "row",
      flexWrap:
        "wrap",
      justifyContent:
        "space-between",
      rowGap: 7,
    },

    mealItem: {
      width: "48.7%",
      minHeight: 50,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 6,
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    mealIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    mealText: {
      flex: 1,
      fontSize: 9,
      fontWeight: "800",
      marginLeft: 7,
    },

    innerDivider: {
      height: 1,
      marginVertical: 13,
    },

    servingRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    servingIcon: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    servingText: {
      flex: 1,
      marginLeft: 9,
      paddingRight: 8,
    },

    servingTitle: {
      fontSize: 11,
      fontWeight: "900",
    },

    servingSubtitle: {
      fontSize: 8,
      lineHeight: 13,
      marginTop: 2,
    },

    servingInputWrap: {
      width: 70,
    },

    servingInput: {
      minHeight: 43,
      textAlign:
        "center",
      fontSize: 13,
      fontWeight: "900",
    },

    /* Preview */

    previewRow: {
      flexDirection:
        "row",
      gap: 7,
      marginBottom: 22,
    },

    previewCard: {
      flex: 1,
      minHeight: 95,
      borderRadius: 19,
      borderWidth: 1,
      padding: 10,
    },

    previewIcon: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    previewLabel: {
      fontSize: 8,
      fontWeight: "700",
      marginTop: 7,
    },

    previewValueRow: {
      flexDirection:
        "row",
      alignItems:
        "baseline",
      marginTop: 1,
    },

    previewValue: {
      fontSize: 16,
      fontWeight: "900",
    },

    previewUnit: {
      fontSize: 7,
      fontWeight: "700",
      marginLeft: 2,
    },

    /* Save */

    saveButton: {
      minHeight: 67,
      borderRadius: 999,
      paddingHorizontal: 9,
      flexDirection:
        "row",
      alignItems:
        "center",
      marginTop: 2,
    },

    saveButtonIcon: {
      width: 45,
      height: 45,
      borderRadius: 23,
      backgroundColor:
        "rgba(10,15,12,0.12)",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    saveButtonText: {
      flex: 1,
      marginLeft: 10,
    },

    saveButtonTitle: {
      color: "#0A0F0C",
      fontSize: 14,
      fontWeight: "900",
    },

    saveButtonSubtitle: {
      color:
        "rgba(10,15,12,0.58)",
      fontSize: 9,
      marginTop: 2,
      fontWeight: "600",
    },

    /* Clear */

    clearButton: {
      minHeight: 45,
      borderRadius: 999,
      borderWidth: 1,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginTop: 8,
    },

    clearText: {
      fontSize: 10,
      fontWeight: "800",
      marginLeft: 5,
    },

    bottomSpace: {
      height: 20,
    },
  });
