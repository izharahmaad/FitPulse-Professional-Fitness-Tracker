import React, {
  useMemo,
  useState,
} from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {
  Input,
  Screen,
  useAppColors,
} from "@/components/ui";

import { useFitness } from "@/hooks/useFitness";
import {
  ActivityLevel,
  Gender,
  WeightGoal,
} from "@/types/fitness";

import {
  completeOnboarding,
} from "@/services/onboarding";

const ACCENT = "#B7FF1A";

type IconName =
  keyof typeof Ionicons.glyphMap;

const TOTAL_STEPS = 4;

export default function OnboardingScreen() {
  const c = useAppColors();

  const {
    state,
    updateProfile,
  } = useFitness();

  const profile =
    state.profile;

  const [step, setStep] =
    useState(0);

  const [name, setName] =
    useState(profile.name || "");

  const [age, setAge] =
    useState(
      String(
        profile.age || ""
      )
    );

  const [height, setHeight] =
    useState(
      String(
        profile.heightCm || ""
      )
    );

  const [weight, setWeight] =
    useState(
      String(
        profile.weightKg || ""
      )
    );

  const [
    targetWeight,
    setTargetWeight,
  ] = useState(
    String(
      profile.targetWeightKg || ""
    )
  );

  const [gender, setGender] =
    useState<Gender>(
      profile.gender
    );

  const [
    activityLevel,
    setActivityLevel,
  ] = useState<ActivityLevel>(
    profile.activityLevel
  );

  const [weightGoal, setWeightGoal] =
    useState<WeightGoal>(
      profile.weightGoal
    );

  const [stepGoal, setStepGoal] =
    useState(
      String(
        profile.stepGoal || 10000
      )
    );

  const [waterGoal, setWaterGoal] =
    useState(
      String(
        profile.waterGoalMl ||
          2500
      )
    );

  const [calorieGoal, setCalorieGoal] =
    useState(
      String(
        profile.calorieGoal ||
          2000
      )
    );

  const [error, setError] =
    useState("");

  const progress =
    (step + 1) /
    TOTAL_STEPS;

  const canContinue =
    useMemo(() => {
      if (step === 0) {
        return (
          name.trim().length >=
          2
        );
      }

      if (step === 1) {
        return (
          Number(age) >= 13 &&
          Number(age) <= 100 &&
          Number(height) >= 120 &&
          Number(height) <= 230 &&
          Number(weight) >= 30 &&
          Number(weight) <= 300
        );
      }

      if (step === 2) {
        return (
          Number(targetWeight) >=
          30 &&
          Number(targetWeight) <=
            300
        );
      }

      return (
        Number(stepGoal) >= 1000 &&
        Number(waterGoal) >= 500 &&
        Number(calorieGoal) >=
          1200
      );
    }, [
      step,
      name,
      age,
      height,
      weight,
      targetWeight,
      stepGoal,
      waterGoal,
      calorieGoal,
    ]);

  const finish = async () => {
    if (!canContinue) {
      setError(
        "Please complete the required fields before continuing."
      );
      return;
    }

    updateProfile({
      name:
        name.trim() || "You",

      age: clamp(
        Number(age),
        13,
        100
      ),

      heightCm: clamp(
        Number(height),
        120,
        230
      ),

      weightKg: clamp(
        Number(weight),
        30,
        300
      ),

      targetWeightKg: clamp(
        Number(targetWeight),
        30,
        300
      ),

      gender,

      activityLevel,

      weightGoal,

      stepGoal: clamp(
        Number(stepGoal),
        1000,
        50000
      ),

      waterGoalMl: clamp(
        Number(waterGoal),
        500,
        6000
      ),

      calorieGoal: clamp(
        Number(calorieGoal),
        1200,
        6000
      ),
    });

    await completeOnboarding();

    router.replace("/(tabs)");
  };

  const next = () => {
    setError("");

    if (!canContinue) {
      setError(
        "Please complete the required fields."
      );
      return;
    }

    if (
      step <
      TOTAL_STEPS - 1
    ) {
      setStep(
        (current) =>
          current + 1
      );
      return;
    }

    void finish();
  };

  const back = () => {
    setError("");

    if (step > 0) {
      setStep(
        (current) =>
          current - 1
      );
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS ===
          "ios"
            ? "padding"
            : undefined
        }
      >
        <View
          style={styles.topBar}
        >
          <View
            style={
              styles.brandRow
            }
          >
            <View
              style={[
                styles.brandCircle,
                {
                  backgroundColor:
                    ACCENT,
                },
              ]}
            >
              <Ionicons
                name="fitness"
                size={17}
                color="#0A0F0C"
              />
            </View>

            <Text
              style={[
                styles.brandText,
                {
                  color:
                    c.text,
                },
              ]}
            >
              FitPulse
            </Text>
          </View>

          <Text
            style={[
              styles.stepCounter,
              {
                color:
                  c.muted,
              },
            ]}
          >
            {step + 1}/{TOTAL_STEPS}
          </Text>
        </View>

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
                width: `${progress * 100}%`,
                backgroundColor:
                  ACCENT,
              },
            ]}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
        >
          {step === 0 && (
            <StepWelcome
              name={name}
              setName={setName}
              c={c}
            />
          )}

          {step === 1 && (
            <StepBody
              age={age}
              setAge={setAge}
              height={height}
              setHeight={setHeight}
              weight={weight}
              setWeight={setWeight}
              gender={gender}
              setGender={setGender}
              c={c}
            />
          )}

          {step === 2 && (
            <StepGoal
              targetWeight={
                targetWeight
              }
              setTargetWeight={
                setTargetWeight
              }
              weightGoal={
                weightGoal
              }
              setWeightGoal={
                setWeightGoal
              }
              activityLevel={
                activityLevel
              }
              setActivityLevel={
                setActivityLevel
              }
              c={c}
            />
          )}

          {step === 3 && (
            <StepTargets
              stepGoal={
                stepGoal
              }
              setStepGoal={
                setStepGoal
              }
              waterGoal={
                waterGoal
              }
              setWaterGoal={
                setWaterGoal
              }
              calorieGoal={
                calorieGoal
              }
              setCalorieGoal={
                setCalorieGoal
              }
              c={c}
            />
          )}

          {error ? (
            <View
              style={[
                styles.errorPill,
                {
                  backgroundColor:
                    `${c.danger}10`,
                  borderColor:
                    `${c.danger}35`,
                },
              ]}
            >
              <Ionicons
                name="alert-circle-outline"
                size={15}
                color={
                  c.danger
                }
              />

              <Text
                style={[
                  styles.errorText,
                  {
                    color:
                      c.danger,
                  },
                ]}
              >
                {error}
              </Text>
            </View>
          ) : null}
        </ScrollView>

        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor:
                c.background,
              borderTopColor:
                c.border,
            },
          ]}
        >
          {step > 0 ? (
            <Pressable
              onPress={back}
              style={({ pressed }) => [
                styles.backButton,
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
                name="arrow-back"
                size={17}
                color={
                  c.muted
                }
              />

              <Text
                style={[
                  styles.backText,
                  {
                    color:
                      c.muted,
                  },
                ]}
              >
                Back
              </Text>
            </Pressable>
          ) : (
            <View
              style={
                styles.backPlaceholder
              }
            />
          )}

          <Pressable
            onPress={next}
            style={({ pressed }) => [
              styles.continueButton,
              {
                backgroundColor:
                  ACCENT,
                opacity:
                  canContinue
                    ? pressed
                      ? 0.78
                      : 1
                    : 0.4,
              },
            ]}
          >
            <Text
              style={
                styles.continueText
              }
            >
              {step ===
              TOTAL_STEPS - 1
                ? "Start FitPulse"
                : "Continue"}
            </Text>

            <View
              style={
                styles.continueIcon
              }
            >
              <Ionicons
                name={
                  step ===
                  TOTAL_STEPS - 1
                    ? "checkmark"
                    : "arrow-forward"
                }
                size={16}
                color="#0A0F0C"
              />
            </View>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

/* ============================================================
   STEP 1
============================================================ */

function StepWelcome({
  name,
  setName,
  c,
}: {
  name: string;
  setName: (
    value: string
  ) => void;
  c: ReturnType<
    typeof useAppColors
  >;
}) {
  return (
    <View>
      <View
        style={[
          styles.heroIcon,
          {
            backgroundColor:
              `${ACCENT}14`,
            borderColor:
              `${ACCENT}25`,
          },
        ]}
      >
        <Ionicons
          name="person"
          size={27}
          color={ACCENT}
        />
      </View>

      <Text
        style={[
          styles.pageTitle,
          {
            color:
              c.text,
          },
        ]}
      >
        Welcome to FitPulse
      </Text>

      <Text
        style={[
          styles.pageDescription,
          {
            color:
              c.muted,
          },
        ]}
      >
        Let's personalize your fitness dashboard so
        your goals and calculations are based on you.
      </Text>

      <View
        style={[
          styles.formCard,
          {
            backgroundColor:
              c.surface,
            borderColor:
              c.border,
          },
        ]}
      >
        <FieldLabel
          icon="person-outline"
          label="Your name"
          c={c}
        />

        <Input
          value={name}
          onChangeText={setName}
          placeholder="e.g. Izhar"
          autoCapitalize="words"
        />
      </View>
    </View>
  );
}

/* ============================================================
   STEP 2
============================================================ */

function StepBody({
  age,
  setAge,
  height,
  setHeight,
  weight,
  setWeight,
  gender,
  setGender,
  c,
}: {
  age: string;
  setAge: (
    value: string
  ) => void;
  height: string;
  setHeight: (
    value: string
  ) => void;
  weight: string;
  setWeight: (
    value: string
  ) => void;
  gender: Gender;
  setGender: (
    value: Gender
  ) => void;
  c: ReturnType<
    typeof useAppColors
  >;
}) {
  return (
    <View>
      <View
        style={[
          styles.heroIcon,
          {
            backgroundColor:
              `${ACCENT}14`,
            borderColor:
              `${ACCENT}25`,
          },
        ]}
      >
        <Ionicons
          name="body-outline"
          size={27}
          color={ACCENT}
        />
      </View>

      <Text
        style={[
          styles.pageTitle,
          {
            color:
              c.text,
          },
        ]}
      >
        Tell us about you
      </Text>

      <Text
        style={[
          styles.pageDescription,
          {
            color:
              c.muted,
          },
        ]}
      >
        These details help FitPulse calculate your
        energy needs and fitness progress.
      </Text>

      <View
        style={[
          styles.formCard,
          {
            backgroundColor:
              c.surface,
            borderColor:
              c.border,
          },
        ]}
      >
        <FieldLabel
          icon="calendar-outline"
          label="Age"
          c={c}
        />

        <Input
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          placeholder="e.g. 24"
        />

        <Divider c={c} />

        <FieldLabel
          icon="resize-outline"
          label="Height (cm)"
          c={c}
        />

        <Input
          value={height}
          onChangeText={setHeight}
          keyboardType="decimal-pad"
          placeholder="e.g. 180"
        />

        <Divider c={c} />

        <FieldLabel
          icon="scale-outline"
          label="Current weight (kg)"
          c={c}
        />

        <Input
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
          placeholder="e.g. 80"
        />

        <Divider c={c} />

        <FieldLabel
          icon="male-female-outline"
          label="Gender"
          c={c}
        />

        <ChoiceRow
          value={gender}
          options={[
            {
              value:
                "male",
              label:
                "Male",
            },
            {
              value:
                "female",
              label:
                "Female",
            },
          ]}
          onChange={(value) =>
            setGender(
              value as Gender
            )
          }
          c={c}
        />
      </View>
    </View>
  );
}

/* ============================================================
   STEP 3
============================================================ */

function StepGoal({
  targetWeight,
  setTargetWeight,
  weightGoal,
  setWeightGoal,
  activityLevel,
  setActivityLevel,
  c,
}: {
  targetWeight: string;
  setTargetWeight: (
    value: string
  ) => void;
  weightGoal: WeightGoal;
  setWeightGoal: (
    value: WeightGoal
  ) => void;
  activityLevel: ActivityLevel;
  setActivityLevel: (
    value: ActivityLevel
  ) => void;
  c: ReturnType<
    typeof useAppColors
  >;
}) {
  return (
    <View>
      <View
        style={[
          styles.heroIcon,
          {
            backgroundColor:
              `${ACCENT}14`,
            borderColor:
              `${ACCENT}25`,
          },
        ]}
      >
        <Ionicons
          name="flag-outline"
          size={27}
          color={ACCENT}
        />
      </View>

      <Text
        style={[
          styles.pageTitle,
          {
            color:
              c.text,
          },
        ]}
      >
        Set your direction
      </Text>

      <Text
        style={[
          styles.pageDescription,
          {
            color:
              c.muted,
          },
        ]}
      >
        Choose what you want to achieve and how active
        you are on a typical day.
      </Text>

      <View
        style={[
          styles.formCard,
          {
            backgroundColor:
              c.surface,
            borderColor:
              c.border,
          },
        ]}
      >
        <FieldLabel
          icon="flag-outline"
          label="Weight goal"
          c={c}
        />

        <ChoiceRow
          value={weightGoal}
          options={[
            {
              value:
                "lose",
              label:
                "Lose",
              icon:
                "trending-down-outline",
            },
            {
              value:
                "maintain",
              label:
                "Maintain",
              icon:
                "remove-outline",
            },
            {
              value:
                "gain",
              label:
                "Gain",
              icon:
                "trending-up-outline",
            },
          ]}
          onChange={(value) =>
            setWeightGoal(
              value as WeightGoal
            )
          }
          c={c}
        />

        <Divider c={c} />

        <FieldLabel
          icon="scale-outline"
          label="Target weight (kg)"
          c={c}
        />

        <Input
          value={targetWeight}
          onChangeText={
            setTargetWeight
          }
          keyboardType="decimal-pad"
          placeholder="e.g. 75"
        />

        <Divider c={c} />

        <FieldLabel
          icon="speedometer-outline"
          label="Activity level"
          c={c}
        />

        <ChoiceGrid
          value={activityLevel}
          options={[
            {
              value:
                "sedentary",
              label:
                "Sedentary",
            },
            {
              value:
                "light",
              label:
                "Light",
            },
            {
              value:
                "moderate",
              label:
                "Moderate",
            },
            {
              value:
                "high",
              label:
                "High",
            },
            {
              value:
                "athlete",
              label:
                "Athlete",
            },
          ]}
          onChange={(value) =>
            setActivityLevel(
              value as ActivityLevel
            )
          }
          c={c}
        />
      </View>
    </View>
  );
}

/* ============================================================
   STEP 4
============================================================ */

function StepTargets({
  stepGoal,
  setStepGoal,
  waterGoal,
  setWaterGoal,
  calorieGoal,
  setCalorieGoal,
  c,
}: {
  stepGoal: string;
  setStepGoal: (
    value: string
  ) => void;
  waterGoal: string;
  setWaterGoal: (
    value: string
  ) => void;
  calorieGoal: string;
  setCalorieGoal: (
    value: string
  ) => void;
  c: ReturnType<
    typeof useAppColors
  >;
}) {
  return (
    <View>
      <View
        style={[
          styles.heroIcon,
          {
            backgroundColor:
              `${ACCENT}14`,
            borderColor:
              `${ACCENT}25`,
          },
        ]}
      >
        <Ionicons
          name="sparkles-outline"
          size={27}
          color={ACCENT}
        />
      </View>

      <Text
        style={[
          styles.pageTitle,
          {
            color:
              c.text,
          },
        ]}
      >
        Build your daily targets
      </Text>

      <Text
        style={[
          styles.pageDescription,
          {
            color:
              c.muted,
          },
        ]}
      >
        These goals power your Home dashboard and daily
        progress tracking.
      </Text>

      <View
        style={[
          styles.formCard,
          {
            backgroundColor:
              c.surface,
            borderColor:
              c.border,
          },
        ]}
      >
        <TargetInput
          icon="footsteps-outline"
          title="Step goal"
          description="Daily movement target"
          value={stepGoal}
          onChangeText={setStepGoal}
          suffix="steps"
          c={c}
        />

        <Divider c={c} />

        <TargetInput
          icon="water-outline"
          title="Water goal"
          description="Daily hydration target"
          value={waterGoal}
          onChangeText={setWaterGoal}
          suffix="ml"
          c={c}
        />

        <Divider c={c} />

        <TargetInput
          icon="flame-outline"
          title="Calorie goal"
          description="Daily energy target"
          value={calorieGoal}
          onChangeText={
            setCalorieGoal
          }
          suffix="kcal"
          c={c}
        />
      </View>

      <View
        style={[
          styles.readyCard,
          {
            backgroundColor:
              `${ACCENT}08`,
            borderColor:
              `${ACCENT}25`,
          },
        ]}
      >
        <View
          style={
            styles.readyCircle
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
            styles.readyText
          }
        >
          <Text
            style={[
              styles.readyTitle,
              {
                color:
                  c.text,
              },
            ]}
          >
            You're almost ready
          </Text>

          <Text
            style={[
              styles.readySubtitle,
              {
                color:
                  c.muted,
              },
            ]}
          >
            FitPulse will use these values throughout
            your dashboard.
          </Text>
        </View>
      </View>
    </View>
  );
}

/* ============================================================
   FIELD LABEL
============================================================ */

function FieldLabel({
  icon,
  label,
  c,
}: {
  icon: IconName;
  label: string;
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
          color={ACCENT}
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
    </View>
  );
}

/* ============================================================
   CHOICE ROW
============================================================ */

function ChoiceRow({
  value,
  options,
  onChange,
  c,
}: {
  value: string;
  options: {
    value: string;
    label: string;
    icon?: IconName;
  }[];
  onChange: (
    value: string
  ) => void;
  c: ReturnType<
    typeof useAppColors
  >;
}) {
  return (
    <View
      style={
        styles.choiceWrap
      }
    >
      {options.map(
        (option) => {
          const selected =
            option.value ===
            value;

          return (
            <Pressable
              key={
                option.value
              }
              onPress={() =>
                onChange(
                  option.value
                )
              }
              style={({ pressed }) => [
                styles.choicePill,
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
              {option.icon ? (
                <Ionicons
                  name={
                    option.icon
                  }
                  size={14}
                  color={
                    selected
                      ? ACCENT
                      : c.muted
                  }
                />
              ) : null}

              <Text
                style={[
                  styles.choiceText,
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

              {selected ? (
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={
                    ACCENT
                  }
                />
              ) : null}
            </Pressable>
          );
        }
      )}
    </View>
  );
}

/* ============================================================
   CHOICE GRID
============================================================ */

function ChoiceGrid({
  value,
  options,
  onChange,
  c,
}: {
  value: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (
    value: string
  ) => void;
  c: ReturnType<
    typeof useAppColors
  >;
}) {
  return (
    <View
      style={
        styles.grid
      }
    >
      {options.map(
        (option) => {
          const selected =
            option.value ===
            value;

          return (
            <Pressable
              key={
                option.value
              }
              onPress={() =>
                onChange(
                  option.value
                )
              }
              style={({ pressed }) => [
                styles.gridItem,
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
              <Text
                style={[
                  styles.gridText,
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
  );
}

/* ============================================================
   TARGET INPUT
============================================================ */

function TargetInput({
  icon,
  title,
  description,
  value,
  onChangeText,
  suffix,
  c,
}: {
  icon: IconName;
  title: string;
  description: string;
  value: string;
  onChangeText: (
    value: string
  ) => void;
  suffix: string;
  c: ReturnType<
    typeof useAppColors
  >;
}) {
  return (
    <View
      style={
        styles.targetRow
      }
    >
      <View
        style={[
          styles.targetIcon,
          {
            backgroundColor:
              `${ACCENT}12`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={17}
          color={ACCENT}
        />
      </View>

      <View
        style={
          styles.targetCopy
        }
      >
        <Text
          style={[
            styles.targetTitle,
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
            styles.targetDescription,
            {
              color:
                c.muted,
            },
          ]}
        >
          {description}
        </Text>
      </View>

      <View
        style={
          styles.targetInputWrap
        }
      >
        <Input
          value={value}
          onChangeText={
            onChangeText
          }
          keyboardType="decimal-pad"
          style={
            styles.targetInput
          }
        />

        <Text
          style={[
            styles.targetSuffix,
            {
              color:
                c.muted,
            },
          ]}
        >
          {suffix}
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
   CLAMP
============================================================ */

function clamp(
  value: number,
  min: number,
  max: number
) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.max(
    min,
    Math.min(max, value)
  );
}

/* ============================================================
   STYLES
============================================================ */

const styles =
  StyleSheet.create({
    flex: {
      flex: 1,
    },

    topBar: {
      height: 58,
      paddingHorizontal: 16,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
    },

    brandRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    brandCircle: {
      width: 32,
      height: 32,
      borderRadius:
        16,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    brandText: {
      fontSize: 15,
      fontWeight:
        "900",
      marginLeft: 8,
    },

    stepCounter: {
      fontSize: 10,
      fontWeight:
        "800",
    },

    progressTrack: {
      height: 4,
      marginHorizontal: 16,
      borderRadius:
        999,
      overflow:
        "hidden",
    },

    progressFill: {
      height: "100%",
      borderRadius:
        999,
    },

    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 28,
      paddingBottom: 30,
    },

    heroIcon: {
      width: 58,
      height: 58,
      borderRadius:
        29,
      borderWidth: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
      marginBottom: 17,
    },

    pageTitle: {
      fontSize: 28,
      fontWeight:
        "900",
      letterSpacing:
        -0.8,
    },

    pageDescription: {
      fontSize: 12,
      lineHeight: 19,
      marginTop: 7,
      marginBottom: 21,
      maxWidth: 350,
    },

    formCard: {
      borderRadius:
        24,
      borderWidth: 1,
      padding: 15,
    },

    fieldLabel: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 7,
    },

    fieldIcon: {
      width: 27,
      height: 27,
      borderRadius:
        14,
      alignItems:
        "center",
      justifyContent:
        "center",
      marginRight: 7,
    },

    fieldLabelText: {
      fontSize: 11,
      fontWeight:
        "800",
    },

    divider: {
      height: 1,
      marginVertical: 14,
    },

    choiceWrap: {
      flexDirection:
        "row",
      flexWrap:
        "wrap",
      gap: 7,
    },

    choicePill: {
      minHeight: 39,
      borderRadius:
        999,
      borderWidth: 1,
      paddingHorizontal: 11,
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 6,
    },

    choiceText: {
      fontSize: 10,
      fontWeight:
        "800",
    },

    grid: {
      flexDirection:
        "row",
      flexWrap:
        "wrap",
      justifyContent:
        "space-between",
      rowGap: 7,
    },

    gridItem: {
      width: "48.5%",
      minHeight: 42,
      borderRadius:
        999,
      borderWidth: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
      paddingHorizontal: 10,
    },

    gridText: {
      fontSize: 9,
      fontWeight:
        "800",
    },

    targetRow: {
      minHeight: 58,
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    targetIcon: {
      width: 40,
      height: 40,
      borderRadius:
        20,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    targetCopy: {
      flex: 1,
      marginLeft: 9,
      paddingRight: 6,
    },

    targetTitle: {
      fontSize: 11,
      fontWeight:
        "900",
    },

    targetDescription: {
      fontSize: 8,
      marginTop: 2,
    },

    targetInputWrap: {
      width: 93,
      position:
        "relative",
    },

    targetInput: {
      minHeight: 44,
      paddingRight: 32,
      textAlign:
        "right",
      fontSize: 13,
      fontWeight:
        "800",
    },

    targetSuffix: {
      position:
        "absolute",
      right: 9,
      top: 15,
      fontSize: 8,
      fontWeight:
        "800",
    },

    readyCard: {
      minHeight: 65,
      borderRadius:
        999,
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 7,
      flexDirection:
        "row",
      alignItems:
        "center",
      marginTop: 13,
    },

    readyCircle: {
      width: 47,
      height: 47,
      borderRadius:
        24,
      backgroundColor:
        ACCENT,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    readyText: {
      flex: 1,
      marginLeft: 9,
    },

    readyTitle: {
      fontSize: 11,
      fontWeight:
        "900",
    },

    readySubtitle: {
      fontSize: 8,
      lineHeight: 14,
      marginTop: 2,
    },

    errorPill: {
      minHeight: 44,
      borderRadius:
        999,
      borderWidth: 1,
      paddingHorizontal: 10,
      flexDirection:
        "row",
      alignItems:
        "center",
      marginTop: 14,
    },

    errorText: {
      flex: 1,
      fontSize: 9,
      lineHeight: 14,
      marginLeft: 7,
    },

    bottomBar: {
      minHeight: 76,
      borderTopWidth: 1,
      paddingHorizontal: 16,
      paddingTop: 9,
      paddingBottom: 9,
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 8,
    },

    backButton: {
      width: 82,
      height: 52,
      borderRadius:
        999,
      borderWidth: 1,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap: 6,
    },

    backPlaceholder: {
      width: 82,
    },

    backText: {
      fontSize: 10,
      fontWeight:
        "800",
    },

    continueButton: {
      flex: 1,
      height: 52,
      borderRadius:
        999,
      paddingHorizontal: 8,
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    continueText: {
      flex: 1,
      color: "#0A0F0C",
      fontSize: 12,
      fontWeight:
        "900",
      textAlign:
        "center",
    },

    continueIcon: {
      width: 36,
      height: 36,
      borderRadius:
        18,
      backgroundColor:
        "rgba(10,15,12,0.12)",
      alignItems:
        "center",
      justifyContent:
        "center",
    },
  });