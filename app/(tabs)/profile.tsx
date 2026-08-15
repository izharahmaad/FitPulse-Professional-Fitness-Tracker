import React, {
  useCallback,
  useState,
} from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import * as ImagePicker from "expo-image-picker";

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

import {
  getProfileImage,
  saveProfileImage,
  removeProfileImage,
} from "@/services/profileImage";

const ACCENT = "#B7FF1A";

type IconName =
  keyof typeof Ionicons.glyphMap;

export default function ProfileScreen() {
  const c = useAppColors();

  const {
    state,
    updateProfile,
    bmr,
    tdee,
  } = useFitness();

  const p = state.profile;

  const [profileImage, setProfileImage] =
    useState<string | null>(null);

  const [name, setName] =
    useState(p.name);

  const [age, setAge] =
    useState(String(p.age));

  const [height, setHeight] =
    useState(String(p.heightCm));

  const [weight, setWeight] =
    useState(String(p.weightKg));

  const [target, setTarget] =
    useState(String(p.targetWeightKg));

  const [stepGoal, setStepGoal] =
    useState(String(p.stepGoal));

  const [waterGoal, setWaterGoal] =
    useState(String(p.waterGoalMl));

  const [calorieGoal, setCalorieGoal] =
    useState(String(p.calorieGoal));

  const [saved, setSaved] =
    useState(false);

  /* =========================================================
     LOAD PROFILE PHOTO
  ========================================================= */

  const loadProfileImage = useCallback(
    async () => {
      const uri =
        await getProfileImage();

      setProfileImage(uri);
    },
    []
  );

  useFocusEffect(
    useCallback(() => {
      void loadProfileImage();
    }, [loadProfileImage])
  );

  /* =========================================================
     PICK PROFILE PHOTO
  ========================================================= */

  const pickProfilePhoto =
    async () => {
      try {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            "Photo permission required",
            "Allow FitPulse to access your photos so you can choose a profile picture."
          );

          return;
        }

        const result =
          await ImagePicker.launchImageLibraryAsync(
            {
              mediaTypes: ["images"],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.9,
            }
          );

        if (result.canceled) {
          return;
        }

        const asset =
          result.assets[0];

        if (!asset?.uri) {
          return;
        }

        await saveProfileImage(
          asset.uri
        );

        setProfileImage(
          asset.uri
        );
      } catch {
        Alert.alert(
          "Unable to select photo",
          "Something went wrong while selecting your profile picture."
        );
      }
    };

  /* =========================================================
     REMOVE PROFILE PHOTO
  ========================================================= */

  const removePhoto =
    async () => {
      if (!profileImage) {
        return;
      }

      Alert.alert(
        "Remove profile photo?",
        "Your profile picture will be removed from FitPulse.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Remove",
            style: "destructive",
            onPress: async () => {
              await removeProfileImage();

              setProfileImage(
                null
              );
            },
          },
        ]
      );
    };

  /* =========================================================
     SAVE PROFILE
  ========================================================= */

  const save = () => {
    updateProfile({
      name:
        name.trim() || "You",

      age: Math.max(
        13,
        Math.min(
          100,
          Number(age) || p.age
        )
      ),

      heightCm: Math.max(
        120,
        Math.min(
          230,
          Number(height) ||
            p.heightCm
        )
      ),

      weightKg: Math.max(
        30,
        Math.min(
          300,
          Number(weight) ||
            p.weightKg
        )
      ),

      targetWeightKg:
        Math.max(
          30,
          Math.min(
            300,
            Number(target) ||
              p.targetWeightKg
          )
        ),

      stepGoal: Math.max(
        1000,
        Math.min(
          50000,
          Number(stepGoal) ||
            p.stepGoal
        )
      ),

      waterGoalMl: Math.max(
        500,
        Math.min(
          6000,
          Number(waterGoal) ||
            p.waterGoalMl
        )
      ),

      calorieGoal: Math.max(
        1200,
        Math.min(
          6000,
          Number(calorieGoal) ||
            p.calorieGoal
        )
      ),
    });

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  /* =========================================================
     CALCULATIONS
  ========================================================= */

  const weightDifference =
    p.weightKg -
    p.targetWeightKg;

  const targetReached =
    weightDifference <= 0;

  const initials = (
    p.name?.trim() ||
    "You"
  )
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");

  const goalProgress =
    targetReached
      ? 100
      : Math.max(
          0,
          Math.min(
            100,
            Math.round(
              ((p.weightKg -
                Math.abs(
                  weightDifference
                )) /
                Math.max(
                  1,
                  p.weightKg
                )) *
                100
            )
          )
        );

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
          <View style={styles.headerText}>
            <Subtitle>
              Personal fitness hub
            </Subtitle>

            <Title>
              Profile
            </Title>

            <Text
              style={[
                styles.headerDescription,
                { color: c.muted },
              ]}
            >
              Manage your identity, body metrics,
              goals, and daily targets.
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
              name="person"
              size={21}
              color={ACCENT}
            />
          </View>
        </View>

        {/* ===================================================
            PROFILE IDENTITY
        =================================================== */}

        <Card
          style={[
            styles.identityCard,
            {
              backgroundColor:
                c.surface,
              borderColor:
                c.border,
            },
          ]}
        >
          <View style={styles.identityTop}>
            {/* PROFILE PHOTO */}

            <Pressable
              onPress={pickProfilePhoto}
              onLongPress={
                profileImage
                  ? removePhoto
                  : undefined
              }
              style={({ pressed }) => [
                styles.avatarWrapper,
                {
                  transform: [
                    {
                      scale:
                        pressed
                          ? 0.96
                          : 1,
                    },
                  ],
                },
              ]}
            >
              {profileImage ? (
                <Image
                  source={{
                    uri: profileImage,
                  }}
                  style={styles.avatarImage}
                />
              ) : (
                <View
                  style={[
                    styles.avatarFallback,
                    {
                      backgroundColor:
                        `${ACCENT}16`,
                      borderColor:
                        `${ACCENT}30`,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.avatarText,
                      {
                        color:
                          ACCENT,
                      },
                    ]}
                  >
                    {initials ||
                      "Y"}
                  </Text>
                </View>
              )}

              {/* Camera badge */}

              <View
                style={[
                  styles.cameraBadge,
                  {
                    backgroundColor:
                      ACCENT,
                  },
                ]}
              >
                <Ionicons
                  name="camera"
                  size={12}
                  color="#0A0F0C"
                />
              </View>
            </Pressable>

            <View
              style={
                styles.identityInfo
              }
            >
              <Text
                style={[
                  styles.identityName,
                  { color: c.text },
                ]}
                numberOfLines={1}
              >
                {p.name ||
                  "You"}
              </Text>

              <Text
                style={[
                  styles.identityMeta,
                  { color: c.muted },
                ]}
              >
                {p.age} years ·{" "}
                {p.heightCm} cm
              </Text>

              <View
                style={styles.tags}
              >
                <Tag
                  icon="fitness-outline"
                  text={capitalize(
                    p.activityLevel
                  )}
                  color={c.primary}
                  bg={c.primarySoft}
                />

                <Tag
                  icon="flag-outline"
                  text={capitalize(
                    p.weightGoal
                  )}
                  color={ACCENT}
                  bg={`${ACCENT}10`}
                />
              </View>
            </View>
          </View>

          <View
            style={[
              styles.divider,
              {
                backgroundColor:
                  c.border,
              },
            ]}
          />

          <View
            style={styles.identityStats}
          >
            <IdentityStat
              label="Weight"
              value={`${p.weightKg.toFixed(
                1
              )}`}
              unit="kg"
              c={c}
            />

            <IdentityStat
              label="Target"
              value={`${p.targetWeightKg.toFixed(
                1
              )}`}
              unit="kg"
              c={c}
            />

            <IdentityStat
              label="Steps"
              value={p.stepGoal.toLocaleString()}
              unit="daily"
              c={c}
            />
          </View>

          <Text
            style={[
              styles.photoHint,
              { color: c.muted },
            ]}
          >
            Tap your photo to change it · hold to remove
          </Text>
        </Card>

        {/* ===================================================
            GOAL PROGRESS
        =================================================== */}

        <SectionHeader
          icon="flag-outline"
          title="Goal progress"
          subtitle="Your current weight journey"
        />

        <Card
          style={[
            styles.goalCard,
            {
              backgroundColor:
                c.surface,
              borderColor:
                c.border,
            },
          ]}
        >
          <View style={styles.goalTop}>
            <View style={styles.goalText}>
              <Text
                style={[
                  styles.eyebrow,
                  { color: c.muted },
                ]}
              >
                WEIGHT TARGET
              </Text>

              <View
                style={
                  styles.weightRow
                }
              >
                <Text
                  style={[
                    styles.currentWeight,
                    {
                      color:
                        c.text,
                    },
                  ]}
                >
                  {p.weightKg.toFixed(
                    1
                  )}
                </Text>

                <Text
                  style={[
                    styles.unit,
                    {
                      color:
                        c.muted,
                    },
                  ]}
                >
                  kg
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={15}
                  color={c.muted}
                  style={{
                    marginHorizontal:
                      7,
                  }}
                />

                <Text
                  style={[
                    styles.targetWeight,
                    {
                      color:
                        ACCENT,
                    },
                  ]}
                >
                  {p.targetWeightKg.toFixed(
                    1
                  )}
                </Text>

                <Text
                  style={[
                    styles.unit,
                    {
                      color:
                        c.muted,
                    },
                  ]}
                >
                  kg
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.goalCircle,
                {
                  borderColor:
                    ACCENT,
                  backgroundColor:
                    `${ACCENT}08`,
                },
              ]}
            >
              <Text
                style={[
                  styles.goalPercent,
                  {
                    color:
                      c.text,
                  },
                ]}
              >
                {goalProgress}%
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.goalTrack,
              {
                backgroundColor:
                  c.surfaceAlt,
              },
            ]}
          >
            <View
              style={[
                styles.goalFill,
                {
                  backgroundColor:
                    ACCENT,
                  width: `${goalProgress}%`,
                },
              ]}
            />
          </View>

          <View
            style={styles.goalFooter}
          >
            <Text
              style={[
                styles.goalFooterText,
                {
                  color:
                    c.muted,
                },
              ]}
            >
              {targetReached
                ? "Target reached"
                : `${Math.abs(
                    weightDifference
                  ).toFixed(
                    1
                  )} kg remaining`}
            </Text>

            <Text
              style={[
                styles.goalFooterText,
                {
                  color:
                    ACCENT,
                },
              ]}
            >
              {goalProgress}%
            </Text>
          </View>
        </Card>

        {/* ===================================================
            PERSONAL INFORMATION
        =================================================== */}

        <SectionHeader
          icon="person-circle-outline"
          title="Personal information"
          subtitle="Basic information used by FitPulse"
        />

        <Card
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
          <Field
            label="Name"
            icon="person-outline"
            c={c}
          >
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              autoCapitalize="words"
            />
          </Field>

          <Field
            label="Age"
            icon="calendar-outline"
            c={c}
          >
            <Input
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              placeholder="25"
            />
          </Field>

          <Field
            label="Height"
            unit="cm"
            icon="resize-outline"
            c={c}
            last
          >
            <Input
              value={height}
              onChangeText={setHeight}
              keyboardType="decimal-pad"
              placeholder="180"
            />
          </Field>
        </Card>

        {/* ===================================================
            BODY
        =================================================== */}

        <SectionHeader
          icon="body-outline"
          title="Body & goals"
          subtitle="Numbers used for fitness calculations"
        />

        <Card
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
          <Field
            label="Current weight"
            unit="kg"
            icon="scale-outline"
            c={c}
          >
            <Input
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              placeholder="80"
            />
          </Field>

          <Field
            label="Target weight"
            unit="kg"
            icon="flag-outline"
            c={c}
            last
          >
            <Input
              value={target}
              onChangeText={setTarget}
              keyboardType="decimal-pad"
              placeholder="75"
            />
          </Field>
        </Card>

        {/* ===================================================
            DAILY TARGETS
        =================================================== */}

        <SectionHeader
          icon="analytics-outline"
          title="Daily targets"
          subtitle="Customize your everyday goals"
        />

        <Card
          style={[
            styles.targetsCard,
            {
              backgroundColor:
                c.surface,
              borderColor:
                c.border,
            },
          ]}
        >
          <TargetRow
            icon="footsteps-outline"
            title="Step goal"
            description="Daily movement target"
            value={stepGoal}
            onChangeText={
              setStepGoal
            }
            keyboardType="number-pad"
            suffix="steps"
            c={c}
          />

          <Divider c={c} />

          <TargetRow
            icon="water-outline"
            title="Water goal"
            description="Daily hydration target"
            value={waterGoal}
            onChangeText={
              setWaterGoal
            }
            keyboardType="number-pad"
            suffix="ml"
            c={c}
          />

          <Divider c={c} />

          <TargetRow
            icon="flame-outline"
            title="Calorie goal"
            description="Daily nutrition target"
            value={calorieGoal}
            onChangeText={
              setCalorieGoal
            }
            keyboardType="number-pad"
            suffix="kcal"
            c={c}
          />
        </Card>

        {/* ===================================================
            SAVE
        =================================================== */}

        <Pressable
          onPress={save}
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor:
                c.primarySoft,
              borderColor:
                `${c.primary}45`,
              opacity:
                pressed
                  ? 0.72
                  : 1,
            },
          ]}
        >
          <View
            style={[
              styles.saveCircle,
              {
                backgroundColor:
                  `${ACCENT}14`,
              },
            ]}
          >
            <Ionicons
              name={
                saved
                  ? "checkmark"
                  : "save-outline"
              }
              size={18}
              color={ACCENT}
            />
          </View>

          <View
            style={styles.saveText}
          >
            <Text
              style={[
                styles.saveTitle,
                {
                  color:
                    c.text,
                },
              ]}
            >
              {saved
                ? "Profile saved"
                : "Save profile"}
            </Text>

            <Text
              style={[
                styles.saveSubtitle,
                {
                  color:
                    c.muted,
                },
              ]}
            >
              {saved
                ? "Your changes are now active"
                : "Apply your latest changes"}
            </Text>
          </View>

          <View
            style={[
              styles.saveArrow,
              {
                backgroundColor:
                  `${ACCENT}12`,
              },
            ]}
          >
            <Ionicons
              name={
                saved
                  ? "checkmark"
                  : "arrow-forward"
              }
              size={16}
              color={ACCENT}
            />
          </View>
        </Pressable>

        {/* ===================================================
            CALORIE ENGINE
        =================================================== */}

        <SectionHeader
          icon="flame-outline"
          title="Calorie engine"
          subtitle="Estimated daily energy requirements"
        />

        <Card
          style={[
            styles.engineCard,
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
              styles.engineHeader
            }
          >
            <View>
              <Text
                style={[
                  styles.engineTitle,
                  {
                    color:
                      c.text,
                  },
                ]}
              >
                Energy overview
              </Text>

              <Text
                style={[
                  styles.engineSubtitle,
                  {
                    color:
                      c.muted,
                  },
                ]}
              >
                Calculated from your current profile
              </Text>
            </View>

            <View
              style={[
                styles.engineCircle,
                {
                  backgroundColor:
                    `${ACCENT}14`,
                  borderColor:
                    `${ACCENT}25`,
                },
              ]}
            >
              <Ionicons
                name="flash-outline"
                size={19}
                color={ACCENT}
              />
            </View>
          </View>

          <View
            style={styles.energyGrid}
          >
            <EnergyStat
              label="BMR"
              value={`${bmr}`}
              unit="kcal/day"
              icon="bed-outline"
              c={c}
            />

            <EnergyStat
              label="TDEE"
              value={`${tdee}`}
              unit="kcal/day"
              icon="walk-outline"
              c={c}
            />
          </View>

          <View
            style={[
              styles.calorieTarget,
              {
                backgroundColor:
                  `${ACCENT}08`,
                borderColor:
                  `${ACCENT}24`,
              },
            ]}
          >
            <View
              style={[
                styles.calorieTargetCircle,
                {
                  backgroundColor:
                    `${ACCENT}14`,
                },
              ]}
            >
              <Ionicons
                name="flame-outline"
                size={17}
                color={ACCENT}
              />
            </View>

            <View
              style={
                styles.calorieTargetText
              }
            >
              <Text
                style={[
                  styles.calorieTargetLabel,
                  {
                    color:
                      c.muted,
                  },
                ]}
              >
                Current daily target
              </Text>

              <Text
                style={[
                  styles.calorieTargetValue,
                  {
                    color:
                      c.text,
                  },
                ]}
              >
                {p.calorieGoal.toLocaleString()}{" "}
                kcal
              </Text>
            </View>
          </View>
        </Card>

        {/* ===================================================
            SETTINGS
        =================================================== */}

        <Pressable
          onPress={() =>
            router.push(
              "/settings"
            )
          }
          style={({ pressed }) => [
            styles.settingsButton,
            {
              backgroundColor:
                c.surface,
              borderColor:
                c.border,
              opacity:
                pressed
                  ? 0.72
                  : 1,
            },
          ]}
        >
          <View
            style={[
              styles.settingsCircle,
              {
                backgroundColor:
                  c.surfaceAlt,
              },
            ]}
          >
            <Ionicons
              name="settings-outline"
              size={18}
              color={c.muted}
            />
          </View>

          <View
            style={styles.settingsText}
          >
            <Text
              style={[
                styles.settingsTitle,
                {
                  color:
                    c.text,
                },
              ]}
            >
              Open settings
            </Text>

            <Text
              style={[
                styles.settingsSubtitle,
                {
                  color:
                    c.muted,
                },
              ]}
            >
              Notifications and app preferences
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={c.muted}
          />
        </Pressable>

        <View
          style={styles.bottomSpace}
        />
      </ScrollView>
    </Screen>
  );
}

/* ========================================================= */
/* TAG                                                        */
/* ========================================================= */

function Tag({
  icon,
  text,
  color,
  bg,
}: {
  icon: IconName;
  text: string;
  color: string;
  bg: string;
}) {
  return (
    <View
      style={[
        styles.tag,
        {
          backgroundColor:
            bg,
          borderColor:
            `${color}35`,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={10}
        color={color}
      />

      <Text
        style={[
          styles.tagText,
          {
            color,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

/* ========================================================= */
/* SECTION HEADER                                              */
/* ========================================================= */

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
}) {
  const c = useAppColors();

  return (
    <View
      style={styles.sectionHeader}
    >
      <View
        style={[
          styles.sectionIcon,
          {
            backgroundColor:
              `${ACCENT}14`,
            borderColor:
              `${ACCENT}25`,
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
    </View>
  );
}

/* ========================================================= */
/* IDENTITY STAT                                               */
/* ========================================================= */

function IdentityStat({
  label,
  value,
  unit,
  c,
}: {
  label: string;
  value: string;
  unit: string;
  c: ReturnType<
    typeof useAppColors
  >;
}) {
  return (
    <View
      style={
        styles.identityStat
      }
    >
      <Text
        style={[
          styles.identityStatLabel,
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
          styles.identityValueRow
        }
      >
        <Text
          style={[
            styles.identityStatValue,
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
            styles.identityStatUnit,
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

/* ========================================================= */
/* FIELD                                                        */
/* ========================================================= */

function Field({
  label,
  unit,
  icon,
  children,
  c,
  last = false,
}: {
  label: string;
  unit?: string;
  icon: IconName;
  children: React.ReactNode;
  c: ReturnType<
    typeof useAppColors
  >;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.field,
        !last && styles.fieldSpacing,
      ]}
    >
      <View
        style={
          styles.fieldLabel
        }
      >
        <View
          style={[
            styles.fieldCircle,
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

        <Label>
          {unit
            ? `${label} (${unit})`
            : label}
        </Label>
      </View>

      {children}
    </View>
  );
}

/* ========================================================= */
/* TARGET ROW                                                  */
/* ========================================================= */

function TargetRow({
  icon,
  title,
  description,
  value,
  onChangeText,
  keyboardType,
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
  keyboardType?:
    | "number-pad"
    | "decimal-pad";
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
          styles.targetCircle,
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
          size={17}
          color={ACCENT}
        />
      </View>

      <View
        style={
          styles.targetInfo
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
          styles.targetInputWrapper
        }
      >
        <Input
          value={value}
          onChangeText={
            onChangeText
          }
          keyboardType={
            keyboardType
          }
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

/* ========================================================= */
/* ENERGY STAT                                                 */
/* ========================================================= */

function EnergyStat({
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
        styles.energyStat,
        {
          backgroundColor:
            c.surfaceAlt,
          borderColor:
            c.border,
        },
      ]}
    >
      <View
        style={[
          styles.energyCircle,
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

      <Text
        style={[
          styles.energyLabel,
          {
            color:
              c.muted,
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.energyValue,
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
          styles.energyUnit,
          {
            color:
              c.muted,
          },
        ]}
      >
        {unit}
      </Text>
    </View>
  );
}

/* ========================================================= */
/* DIVIDER                                                      */
/* ========================================================= */

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

/* ========================================================= */
/* CAPITALIZE                                                   */
/* ========================================================= */

function capitalize(
  value: string
) {
  if (!value) {
    return "Not set";
  }

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

/* ========================================================= */
/* STYLES                                                       */
/* ========================================================= */

const styles =
  StyleSheet.create({
    content: {
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 140,
    },

    /* Header */

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 19,
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
      borderWidth: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    /* Identity */

    identityCard: {
      borderRadius: 26,
      padding: 17,
      marginBottom: 25,
    },

    identityTop: {
      flexDirection: "row",
      alignItems: "center",
    },

    avatarWrapper: {
      width: 68,
      height: 68,
      position: "relative",
    },

    avatarImage: {
      width: 68,
      height: 68,
      borderRadius: 34,
    },

    avatarFallback: {
      width: 68,
      height: 68,
      borderRadius: 34,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    avatarText: {
      fontSize: 23,
      fontWeight: "900",
    },

    cameraBadge: {
      position: "absolute",
      right: -1,
      bottom: -1,
      width: 25,
      height: 25,
      borderRadius: 13,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderWidth: 2,
      borderColor:
        "#111812",
    },

    identityInfo: {
      flex: 1,
      marginLeft: 13,
    },

    identityName: {
      fontSize: 20,
      fontWeight: "900",
    },

    identityMeta: {
      fontSize: 11,
      marginTop: 3,
    },

    tags: {
      flexDirection: "row",
      gap: 6,
      marginTop: 8,
    },

    tag: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 4,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 7,
      paddingVertical: 4,
    },

    tagText: {
      fontSize: 8,
      fontWeight: "900",
    },

    divider: {
      height: 1,
      marginVertical: 17,
    },

    identityStats: {
      flexDirection: "row",
    },

    identityStat: {
      flex: 1,
    },

    identityStatLabel: {
      fontSize: 9,
      fontWeight: "600",
    },

    identityValueRow: {
      flexDirection:
        "row",
      alignItems:
        "baseline",
      marginTop: 3,
    },

    identityStatValue: {
      fontSize: 16,
      fontWeight: "900",
    },

    identityStatUnit: {
      fontSize: 9,
      marginLeft: 3,
    },

    photoHint: {
      textAlign: "center",
      fontSize: 9,
      marginTop: 13,
    },

    /* Goal */

    goalCard: {
      borderRadius: 23,
      padding: 17,
      marginBottom: 25,
    },

    goalTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    goalText: {
      flex: 1,
    },

    eyebrow: {
      fontSize: 9,
      fontWeight: "900",
      letterSpacing: 1,
    },

    weightRow: {
      flexDirection:
        "row",
      alignItems:
        "baseline",
      marginTop: 4,
    },

    currentWeight: {
      fontSize: 28,
      fontWeight: "900",
    },

    targetWeight: {
      fontSize: 21,
      fontWeight: "900",
    },

    unit: {
      fontSize: 9,
      marginLeft: 3,
    },

    goalCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 3,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    goalPercent: {
      fontSize: 14,
      fontWeight: "900",
    },

    goalTrack: {
      height: 7,
      borderRadius: 999,
      overflow: "hidden",
      marginTop: 17,
    },

    goalFill: {
      height: "100%",
      borderRadius: 999,
    },

    goalFooter: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      marginTop: 7,
    },

    goalFooterText: {
      fontSize: 9,
      fontWeight: "700",
    },

    /* Section */

    sectionHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 10,
    },

    sectionIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    sectionText: {
      flex: 1,
      marginLeft: 10,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "900",
    },

    sectionSubtitle: {
      fontSize: 10,
      lineHeight: 15,
      marginTop: 2,
    },

    /* Forms */

    formCard: {
      borderRadius: 21,
      padding: 16,
      marginBottom: 18,
    },

    field: {
      width: "100%",
    },

    fieldSpacing: {
      marginBottom: 15,
    },

    fieldLabel: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 7,
    },

    fieldCircle: {
      width: 25,
      height: 25,
      borderRadius: 13,
      alignItems:
        "center",
      justifyContent:
        "center",
      marginRight: 7,
    },

    /* Targets */

    targetsCard: {
      borderRadius: 21,
      paddingHorizontal: 11,
      paddingVertical: 7,
      marginBottom: 18,
    },

    targetRow: {
      minHeight: 67,
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    targetCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    targetInfo: {
      flex: 1,
      marginLeft: 10,
      paddingRight: 8,
    },

    targetTitle: {
      fontSize: 13,
      fontWeight: "800",
    },

    targetDescription: {
      fontSize: 9,
      lineHeight: 15,
      marginTop: 2,
    },

    targetInputWrapper: {
      width: 105,
      position:
        "relative",
    },

    targetInput: {
      minHeight: 44,
      paddingRight: 33,
      textAlign: "right",
      fontSize: 13,
      fontWeight: "800",
    },

    targetSuffix: {
      position:
        "absolute",
      right: 9,
      top: 14,
      fontSize: 8,
      fontWeight: "700",
    },

    /* Save */

    saveButton: {
      minHeight: 64,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 10,
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 25,
    },

    saveCircle: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    saveText: {
      flex: 1,
      marginLeft: 11,
    },

    saveTitle: {
      fontSize: 14,
      fontWeight: "900",
    },

    saveSubtitle: {
      fontSize: 10,
      marginTop: 2,
    },

    saveArrow: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    /* Engine */

    engineCard: {
      borderRadius: 22,
      padding: 16,
      marginBottom: 18,
    },

    engineHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginBottom: 15,
    },

    engineTitle: {
      fontSize: 16,
      fontWeight: "900",
    },

    engineSubtitle: {
      fontSize: 10,
      marginTop: 2,
    },

    engineCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    energyGrid: {
      flexDirection:
        "row",
      gap: 9,
    },

    energyStat: {
      flex: 1,
      minHeight: 108,
      borderRadius: 18,
      borderWidth: 1,
      padding: 12,
    },

    energyCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    energyLabel: {
      fontSize: 9,
      marginTop: 8,
    },

    energyValue: {
      fontSize: 21,
      fontWeight: "900",
      marginTop: 2,
    },

    energyUnit: {
      fontSize: 8,
      marginTop: 1,
    },

    calorieTarget: {
      minHeight: 58,
      borderRadius: 18,
      borderWidth: 1,
      flexDirection:
        "row",
      alignItems:
        "center",
      paddingHorizontal: 10,
      marginTop: 9,
    },

    calorieTargetCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    calorieTargetText: {
      flex: 1,
      marginLeft: 9,
    },

    calorieTargetLabel: {
      fontSize: 9,
    },

    calorieTargetValue: {
      fontSize: 17,
      fontWeight: "900",
      marginTop: 1,
    },

    /* Settings */

    settingsButton: {
      minHeight: 62,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 11,
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    settingsCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    settingsText: {
      flex: 1,
      marginLeft: 10,
    },

    settingsTitle: {
      fontSize: 13,
      fontWeight: "900",
    },

    settingsSubtitle: {
      fontSize: 9,
      marginTop: 2,
    },

    bottomSpace: {
      height: 20,
    },
  });