import React, {
  useCallback,
  useEffect,
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
     KEEP LOCAL FORM IN SYNC WITH PROFILE
  ========================================================= */

  useEffect(() => {
    setName(p.name);
    setAge(String(p.age));
    setHeight(String(p.heightCm));
    setWeight(String(p.weightKg));
    setTarget(String(p.targetWeightKg));
    setStepGoal(String(p.stepGoal));
    setWaterGoal(String(p.waterGoalMl));
    setCalorieGoal(String(p.calorieGoal));
  }, [
    p.name,
    p.age,
    p.heightCm,
    p.weightKg,
    p.targetWeightKg,
    p.stepGoal,
    p.waterGoalMl,
    p.calorieGoal,
  ]);

  /* =========================================================
     PROFILE IMAGE
  ========================================================= */

  const loadProfileImage =
    useCallback(async () => {
      try {
        const uri =
          await getProfileImage();

        setProfileImage(uri);
      } catch {
        setProfileImage(null);
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      void loadProfileImage();
    }, [loadProfileImage])
  );

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
          await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.9,
          });

        if (result.canceled) {
          return;
        }

        const asset =
          result.assets?.[0];

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
              try {
                await removeProfileImage();
                setProfileImage(null);
              } catch {
                Alert.alert(
                  "Unable to remove photo",
                  "Please try again."
                );
              }
            },
          },
        ]
      );
    };

  /* =========================================================
     SAVE
  ========================================================= */

  const save = () => {
    updateProfile({
      name:
        name.trim() || "You",

      age: clamp(
        Number(age),
        13,
        100,
        p.age
      ),

      heightCm: clamp(
        Number(height),
        120,
        230,
        p.heightCm
      ),

      weightKg: clamp(
        Number(weight),
        30,
        300,
        p.weightKg
      ),

      targetWeightKg: clamp(
        Number(target),
        30,
        300,
        p.targetWeightKg
      ),

      stepGoal: clamp(
        Number(stepGoal),
        1000,
        50000,
        p.stepGoal
      ),

      waterGoalMl: clamp(
        Number(waterGoal),
        500,
        6000,
        p.waterGoalMl
      ),

      calorieGoal: clamp(
        Number(calorieGoal),
        1200,
        6000,
        p.calorieGoal
      ),
    });

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2200);
  };

  /* =========================================================
     DERIVED DATA
  ========================================================= */

  const currentWeight =
    Number(weight) ||
    p.weightKg;

  const targetWeight =
    Number(target) ||
    p.targetWeightKg;

  const weightDifference =
    currentWeight -
    targetWeight;

  const goalType =
    p.weightGoal;

  const targetReached =
    goalType === "lose"
      ? currentWeight <=
        targetWeight
      : goalType === "gain"
      ? currentWeight >=
        targetWeight
      : Math.abs(
          weightDifference
        ) < 0.2;

  const direction =
    goalType === "gain"
      ? "increase"
      : goalType === "lose"
      ? "decrease"
      : "maintain";

  const goalProgress =
    calculateGoalProgress(
      p.weightKg,
      targetWeight,
      p.weightGoal
    );

  const initials = (
    name.trim() ||
    p.name ||
    "You"
  )
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part
        .charAt(0)
        .toUpperCase()
    )
    .join("");

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
          <View
            style={styles.headerCopy}
          >
            <Subtitle>
              Personal fitness hub
            </Subtitle>

            <Title>
              Profile
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
              Your identity, body metrics, goals, and
              daily targets in one place.
            </Text>
          </View>

          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor:
                  `${ACCENT}12`,
                borderColor:
                  `${ACCENT}25`,
              },
            ]}
          >
            <Ionicons
              name="person"
              size={20}
              color={ACCENT}
            />
          </View>
        </View>

        {/* ===================================================
            PROFILE HERO
        =================================================== */}

        <Card
          style={[
            styles.profileHero,
            {
              backgroundColor:
                c.surface,
              borderColor:
                c.border,
            },
          ]}
        >
          <View
            style={styles.profileHeroTop}
          >
            <Pressable
              onPress={
                pickProfilePhoto
              }
              onLongPress={
                profileImage
                  ? removePhoto
                  : undefined
              }
              style={({ pressed }) => [
                styles.avatarButton,
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
                  style={
                    styles.avatarImage
                  }
                />
              ) : (
                <View
                  style={[
                    styles.avatarFallback,
                    {
                      backgroundColor:
                        `${ACCENT}12`,
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

              <View
                style={
                  styles.cameraBadge
                }
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
                styles.profileIdentity
              }
            >
              <Text
                style={[
                  styles.profileName,
                  {
                    color:
                      c.text,
                  },
                ]}
                numberOfLines={1}
              >
                {name.trim() ||
                  "You"}
              </Text>

              <Text
                style={[
                  styles.profileMeta,
                  {
                    color:
                      c.muted,
                  },
                ]}
              >
                {p.age} years ·{" "}
                {p.heightCm} cm
              </Text>

              <View
                style={styles.profileTags}
              >
                <Tag
                  icon="fitness-outline"
                  label={capitalize(
                    p.activityLevel
                  )}
                  color={
                    c.primary
                  }
                  background={
                    c.primarySoft
                  }
                />

                <Tag
                  icon="flag-outline"
                  label={capitalize(
                    p.weightGoal
                  )}
                  color={ACCENT}
                  background={`${ACCENT}0C`}
                />
              </View>
            </View>

            <View
              style={[
                styles.heroStatus,
                {
                  backgroundColor:
                    targetReached
                      ? `${ACCENT}12`
                      : c.surfaceAlt,
                  borderColor:
                    targetReached
                      ? `${ACCENT}25`
                      : c.border,
                },
              ]}
            >
              <View
                style={[
                  styles.heroStatusDot,
                  {
                    backgroundColor:
                      targetReached
                        ? ACCENT
                        : c.muted,
                  },
                ]}
              />

              <Text
                style={[
                  styles.heroStatusText,
                  {
                    color:
                      targetReached
                        ? ACCENT
                        : c.muted,
                  },
                ]}
              >
                {targetReached
                  ? "On target"
                  : "Active"}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.heroDivider,
              {
                backgroundColor:
                  c.border,
              },
            ]}
          />

          <View
            style={styles.profileStats}
          >
            <ProfileStat
              icon="scale-outline"
              label="Weight"
              value={currentWeight.toFixed(
                1
              )}
              unit="kg"
              c={c}
            />

            <ProfileStat
              icon="flag-outline"
              label="Target"
              value={targetWeight.toFixed(
                1
              )}
              unit="kg"
              c={c}
            />

            <ProfileStat
              icon="footsteps-outline"
              label="Steps"
              value={Number(
                stepGoal
              ).toLocaleString()}
              unit="daily"
              c={c}
            />
          </View>

          <Text
            style={[
              styles.photoHint,
              {
                color:
                  c.muted,
              },
            ]}
          >
            Tap your photo to change it
            {profileImage
              ? " · hold to remove"
              : ""}
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
          <View
            style={
              styles.goalTop
            }
          >
            <View
              style={
                styles.goalCopy
              }
            >
              <View
                style={
                  styles.goalBadge
                }
              >
                <View
                  style={
                    styles.goalBadgeDot
                  }
                />

                <Text
                  style={[
                    styles.goalBadgeText,
                    {
                      color:
                        ACCENT,
                    },
                  ]}
                >
                  {goalType ===
                  "lose"
                    ? "WEIGHT LOSS"
                    : goalType ===
                      "gain"
                    ? "WEIGHT GAIN"
                    : "MAINTAIN"}
                </Text>
              </View>

              <View
                style={
                  styles.goalWeightRow
                }
              >
                <View>
                  <Text
                    style={[
                      styles.smallLabel,
                      {
                        color:
                          c.muted,
                      },
                    ]}
                  >
                    Current
                  </Text>

                  <Text
                    style={[
                      styles.largeWeight,
                      {
                        color:
                          c.text,
                      },
                    ]}
                  >
                    {currentWeight.toFixed(
                      1
                    )}
                    <Text
                      style={
                        styles.weightUnit
                      }
                    >
                      kg
                    </Text>
                  </Text>
                </View>

                <View
                  style={
                    styles.goalArrow
                  }
                >
                  <Ionicons
                    name="arrow-forward"
                    size={15}
                    color={
                      c.muted
                    }
                  />
                </View>

                <View>
                  <Text
                    style={[
                      styles.smallLabel,
                      {
                        color:
                          c.muted,
                      },
                    ]}
                  >
                    Target
                  </Text>

                  <Text
                    style={[
                      styles.largeTarget,
                      {
                        color:
                          ACCENT,
                      },
                    ]}
                  >
                    {targetWeight.toFixed(
                      1
                    )}
                    <Text
                      style={
                        styles.weightUnit
                      }
                    >
                      kg
                    </Text>
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={[
                styles.goalCircle,
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
                  styles.goalPercent,
                  {
                    color:
                      c.text,
                  },
                ]}
              >
                {goalProgress}%
              </Text>

              <Text
                style={[
                  styles.goalPercentLabel,
                  {
                    color:
                      c.muted,
                  },
                ]}
              >
                progress
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
            style={
              styles.goalFooter
            }
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
                  )} kg to ${direction}`}
            </Text>

            <Text
              style={[
                styles.goalFooterPercent,
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
            PERSONAL
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
              onChangeText={
                setName
              }
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
              onChangeText={
                setAge
              }
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
              onChangeText={
                setHeight
              }
              keyboardType="decimal-pad"
              placeholder="180"
            />
          </Field>
        </Card>

        {/* ===================================================
            BODY & GOALS
        =================================================== */}

        <SectionHeader
          icon="body-outline"
          title="Body & goals"
          subtitle="Numbers used for progress calculations"
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
              value={
                weight
              }
              onChangeText={
                setWeight
              }
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
              value={
                target
              }
              onChangeText={
                setTarget
              }
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
            value={
              calorieGoal
            }
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
                  ? 0.74
                  : 1,
            },
          ]}
        >
          <View
            style={[
              styles.saveIcon,
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
              color={
                ACCENT
              }
            />
          </View>

          <View
            style={
              styles.saveCopy
            }
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
                  `${ACCENT}10`,
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
              color={
                ACCENT
              }
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
            <View
              style={
                styles.engineCopy
              }
            >
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
                styles.engineIcon,
                {
                  backgroundColor:
                    `${ACCENT}12`,
                  borderColor:
                    `${ACCENT}22`,
                },
              ]}
            >
              <Ionicons
                name="flash-outline"
                size={18}
                color={
                  ACCENT
                }
              />
            </View>
          </View>

          <View
            style={
              styles.energyGrid
            }
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
              styles.targetCaloriePill,
              {
                backgroundColor:
                  `${ACCENT}08`,
                borderColor:
                  `${ACCENT}22`,
              },
            ]}
          >
            <View
              style={
                styles.targetCalorieIcon
              }
            >
              <Ionicons
                name="flame-outline"
                size={16}
                color={
                  ACCENT
                }
              />
            </View>

            <View
              style={
                styles.targetCalorieText
              }
            >
              <Text
                style={[
                  styles.targetCalorieLabel,
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
                  styles.targetCalorieValue,
                  {
                    color:
                      c.text,
                  },
                ]}
              >
                {Number(
                  calorieGoal
                ).toLocaleString()}{" "}
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
              styles.settingsIcon,
              {
                backgroundColor:
                  c.surfaceAlt,
              },
            ]}
          >
            <Ionicons
              name="settings-outline"
              size={18}
              color={
                c.muted
              }
            />
          </View>

          <View
            style={
              styles.settingsCopy
            }
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

          <View
            style={
              styles.settingsArrow
            }
          >
            <Ionicons
              name="chevron-forward"
              size={15}
              color={
                c.muted
              }
            />
          </View>
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
   TAG
============================================================ */

function Tag({
  icon,
  label,
  color,
  background,
}: {
  icon: IconName;
  label: string;
  color: string;
  background: string;
}) {
  return (
    <View
      style={[
        styles.tag,
        {
          backgroundColor:
            background,
          borderColor:
            `${color}35`,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={9}
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
        {label}
      </Text>
    </View>
  );
}

/* ============================================================
   SECTION HEADER
============================================================ */

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
      style={
        styles.sectionHeader
      }
    >
      <View
        style={[
          styles.sectionIcon,
          {
            backgroundColor:
              `${ACCENT}12`,
            borderColor:
              `${ACCENT}24`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={16}
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

/* ============================================================
   PROFILE STAT
============================================================ */

function ProfileStat({
  icon,
  label,
  value,
  unit,
  c,
}: {
  icon: IconName;
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
        styles.profileStat
      }
    >
      <View
        style={[
          styles.profileStatIcon,
          {
            backgroundColor:
              `${ACCENT}10`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={12}
          color={ACCENT}
        />
      </View>

      <Text
        style={[
          styles.profileStatLabel,
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
          styles.profileStatValueRow
        }
      >
        <Text
          style={[
            styles.profileStatValue,
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
            styles.profileStatUnit,
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
   FIELD
============================================================ */

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
                `${ACCENT}10`,
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={12}
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

/* ============================================================
   TARGET ROW
============================================================ */

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
              `${ACCENT}10`,
            borderColor:
              `${ACCENT}20`,
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
          styles.targetInputWrap
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

/* ============================================================
   ENERGY STAT
============================================================ */

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
          styles.energyIcon,
          {
            backgroundColor:
              `${ACCENT}10`,
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
   HELPERS
============================================================ */

function clamp(
  value: number,
  min: number,
  max: number,
  fallback: number
) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(
    min,
    Math.min(max, value)
  );
}

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

function calculateGoalProgress(
  startingWeight: number,
  targetWeight: number,
  goal:
    | "lose"
    | "maintain"
    | "gain"
) {
  if (goal === "maintain") {
    return Math.abs(
      startingWeight -
        targetWeight
    ) < 0.2
      ? 100
      : 0;
  }

  const distance = Math.abs(
    startingWeight -
      targetWeight
  );

  if (distance === 0) {
    return 100;
  }

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(
        (
          Math.abs(
            startingWeight -
              targetWeight
          ) /
          distance
        ) *
          100
      )
    )
  );
}

/* ============================================================
   STYLES
============================================================ */

const styles =
  StyleSheet.create({
    content: {
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 145,
    },

    /* Header */

    header: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginBottom: 19,
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

    /* Profile Hero */

    profileHero: {
      borderRadius: 25,
      borderWidth: 1,
      padding: 16,
      marginBottom: 24,
    },

    profileHeroTop: {
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    avatarButton: {
      width: 68,
      height: 68,
      position:
        "relative",
      flexShrink: 0,
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
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    avatarText: {
      fontSize: 24,
      fontWeight: "900",
    },

    cameraBadge: {
      position:
        "absolute",
      right: -1,
      bottom: -1,
      width: 25,
      height: 25,
      borderRadius: 13,
      backgroundColor:
        ACCENT,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderWidth: 2,
      borderColor:
        "#111812",
    },

    profileIdentity: {
      flex: 1,
      minWidth: 0,
      marginLeft: 12,
    },

    profileName: {
      fontSize: 20,
      fontWeight: "900",
    },

    profileMeta: {
      fontSize: 10,
      marginTop: 3,
    },

    profileTags: {
      flexDirection:
        "row",
      gap: 6,
      marginTop: 8,
    },

    tag: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 4,
      paddingHorizontal: 7,
      paddingVertical: 4,
      borderRadius:
        999,
      borderWidth: 1,
    },

    tagText: {
      fontSize: 7,
      fontWeight:
        "900",
    },

    heroStatus: {
      minHeight: 26,
      borderRadius:
        999,
      borderWidth: 1,
      paddingHorizontal: 7,
      flexDirection:
        "row",
      alignItems:
        "center",
      marginLeft: 5,
    },

    heroStatusDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      marginRight: 4,
    },

    heroStatusText: {
      fontSize: 7,
      fontWeight:
        "900",
    },

    heroDivider: {
      height: 1,
      marginVertical: 16,
    },

    profileStats: {
      flexDirection:
        "row",
    },

    profileStat: {
      flex: 1,
      alignItems:
        "center",
    },

    profileStatIcon: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems:
        "center",
      justifyContent:
        "center",
      marginBottom: 5,
    },

    profileStatLabel: {
      fontSize: 8,
      fontWeight:
        "600",
    },

    profileStatValueRow: {
      flexDirection:
        "row",
      alignItems:
        "baseline",
      marginTop: 2,
    },

    profileStatValue: {
      fontSize: 14,
      fontWeight:
        "900",
    },

    profileStatUnit: {
      fontSize: 7,
      marginLeft: 2,
    },

    photoHint: {
      textAlign:
        "center",
      fontSize: 8,
      lineHeight: 14,
      marginTop: 12,
    },

    /* Goal */

    goalCard: {
      borderRadius: 23,
      borderWidth: 1,
      padding: 17,
      marginBottom: 24,
    },

    goalTop: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
    },

    goalCopy: {
      flex: 1,
      paddingRight: 10,
    },

    goalBadge: {
      alignSelf:
        "flex-start",
      flexDirection:
        "row",
      alignItems:
        "center",
      backgroundColor:
        `${ACCENT}0C`,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius:
        999,
      marginBottom: 8,
    },

    goalBadgeDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor:
        ACCENT,
      marginRight: 5,
    },

    goalBadgeText: {
      color:
        ACCENT,
      fontSize: 7,
      fontWeight:
        "900",
      letterSpacing:
        0.8,
    },

    goalWeightRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    smallLabel: {
      fontSize: 8,
      fontWeight:
        "600",
    },

    largeWeight: {
      fontSize: 25,
      fontWeight:
        "900",
      marginTop: 2,
    },

    largeTarget: {
      fontSize: 21,
      fontWeight:
        "900",
      marginTop: 6,
    },

    weightUnit: {
      fontSize: 9,
      fontWeight:
        "700",
    },

    goalArrow: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor:
        "rgba(128,128,128,0.08)",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginHorizontal: 8,
    },

    goalCircle: {
      width: 68,
      height: 68,
      borderRadius: 34,
      borderWidth: 3,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    goalPercent: {
      fontSize: 15,
      fontWeight:
        "900",
    },

    goalPercentLabel: {
      fontSize: 7,
      marginTop: 1,
    },

    goalTrack: {
      height: 8,
      borderRadius:
        999,
      overflow:
        "hidden",
      marginTop: 17,
    },

    goalFill: {
      height: "100%",
      borderRadius:
        999,
    },

    goalFooter: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginTop: 8,
    },

    goalFooterText: {
      fontSize: 9,
      fontWeight:
        "600",
    },

    goalFooterPercent: {
      fontSize: 9,
      fontWeight:
        "900",
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
      borderRadius:
        18,
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
      fontWeight:
        "900",
    },

    sectionSubtitle: {
      fontSize: 9,
      lineHeight: 14,
      marginTop: 2,
    },

    /* Forms */

    formCard: {
      borderRadius:
        21,
      borderWidth: 1,
      padding: 15,
      marginBottom: 18,
    },

    field: {
      width:
        "100%",
    },

    fieldSpacing: {
      marginBottom: 14,
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
      borderRadius:
        13,
      alignItems:
        "center",
      justifyContent:
        "center",
      marginRight: 7,
    },

    /* Targets */

    targetsCard: {
      borderRadius:
        21,
      borderWidth: 1,
      paddingHorizontal: 10,
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
      borderRadius:
        20,
      borderWidth: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    targetInfo: {
      flex: 1,
      marginLeft: 10,
      paddingRight: 7,
    },

    targetTitle: {
      fontSize: 12,
      fontWeight:
        "800",
    },

    targetDescription: {
      fontSize: 8,
      lineHeight: 14,
      marginTop: 2,
    },

    targetInputWrap: {
      width: 104,
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
      top: 14,
      fontSize: 8,
      fontWeight:
        "700",
    },

    /* Save */

    saveButton: {
      minHeight: 65,
      borderRadius:
        999,
      borderWidth: 1,
      paddingHorizontal: 9,
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 24,
    },

    saveIcon: {
      width: 44,
      height: 44,
      borderRadius:
        22,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    saveCopy: {
      flex: 1,
      marginLeft: 10,
    },

    saveTitle: {
      fontSize: 14,
      fontWeight:
        "900",
    },

    saveSubtitle: {
      fontSize: 9,
      marginTop: 2,
    },

    saveArrow: {
      width: 34,
      height: 34,
      borderRadius:
        17,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    /* Engine */

    engineCard: {
      borderRadius:
        22,
      borderWidth: 1,
      padding: 15,
      marginBottom: 18,
    },

    engineHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginBottom: 14,
    },

    engineCopy: {
      flex: 1,
      paddingRight: 8,
    },

    engineTitle: {
      fontSize: 15,
      fontWeight:
        "900",
    },

    engineSubtitle: {
      fontSize: 9,
      lineHeight: 14,
      marginTop: 2,
    },

    engineIcon: {
      width: 40,
      height: 40,
      borderRadius:
        20,
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
      minHeight: 104,
      borderRadius:
        18,
      borderWidth: 1,
      padding: 11,
    },

    energyIcon: {
      width: 31,
      height: 31,
      borderRadius:
        16,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    energyLabel: {
      fontSize: 8,
      marginTop: 7,
    },

    energyValue: {
      fontSize: 21,
      fontWeight:
        "900",
      marginTop: 2,
    },

    energyUnit: {
      fontSize: 7,
      marginTop: 1,
    },

    targetCaloriePill: {
      minHeight: 58,
      borderRadius:
        999,
      borderWidth: 1,
      flexDirection:
        "row",
      alignItems:
        "center",
      paddingHorizontal: 8,
      marginTop: 9,
    },

    targetCalorieIcon: {
      width: 39,
      height: 39,
      borderRadius:
        20,
      backgroundColor:
        `${ACCENT}12`,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    targetCalorieText: {
      flex: 1,
      marginLeft: 9,
    },

    targetCalorieLabel: {
      fontSize: 8,
    },

    targetCalorieValue: {
      fontSize: 16,
      fontWeight:
        "900",
      marginTop: 1,
    },

    /* Settings */

    settingsButton: {
      minHeight: 62,
      borderRadius:
        999,
      borderWidth: 1,
      paddingHorizontal: 9,
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    settingsIcon: {
      width: 42,
      height: 42,
      borderRadius:
        21,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    settingsCopy: {
      flex: 1,
      marginLeft: 10,
    },

    settingsTitle: {
      fontSize: 12,
      fontWeight:
        "900",
    },

    settingsSubtitle: {
      fontSize: 8,
      lineHeight: 14,
      marginTop: 2,
    },

    settingsArrow: {
      width: 31,
      height: 31,
      borderRadius:
        16,
      backgroundColor:
        "rgba(128,128,128,0.08)",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    divider: {
      height: 1,
      marginVertical: 13,
    },

    bottomSpace: {
      height: 20,
    },
  });
