import React, {
  useCallback,
  useState,
} from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  router,
  useFocusEffect,
} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";

import {
  Screen,
  Subtitle,
  Title,
  useAppColors,
} from "@/components/ui";

import { useFitness } from "@/hooks/useFitness";
import {
  formatKm,
  formatNumber,
} from "@/utils/format";

import {
  getProfileImage,
} from "@/services/profileImage";

const STEP_GREEN = "#B7FF1A";

type IconName =
  keyof typeof Ionicons.glyphMap;

export default function HomeScreen() {
  const c = useAppColors();

  const {
    state,
    hydrated,
    today,
    todayFoods,
    todayWaterMl,
    latestWeightKg,
  } = useFitness();

  /* =========================================================
     PROFILE IMAGE
  ========================================================= */

  const [profileImage, setProfileImage] =
    useState<string | null>(null);

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

  /* =========================================================
     REAL CALORIE DATA
  ========================================================= */

  const caloriesConsumed =
    todayFoods.reduce(
      (sum, food) =>
        sum +
        food.calories *
          food.servings,
      0
    );

  const calorieGoal = Math.max(
    1,
    state.profile.calorieGoal
  );

  const caloriesRemaining =
    Math.max(
      0,
      calorieGoal -
        caloriesConsumed
    );

  const calorieProgress =
    Math.min(
      100,
      Math.round(
        (caloriesConsumed /
          calorieGoal) *
          100
      )
    );

  /* =========================================================
     REAL STEP DATA
  ========================================================= */

  const stepGoal = Math.max(
    1,
    state.profile.stepGoal
  );

  const stepsRemaining =
    Math.max(
      0,
      stepGoal -
        today.steps
    );

  const stepProgress =
    Math.min(
      1,
      today.steps /
        stepGoal
    );

  const stepPercent =
    Math.min(
      100,
      Math.round(
        stepProgress * 100
      )
    );

  /* =========================================================
     REAL WATER DATA
  ========================================================= */

  const waterGoal = Math.max(
    1,
    state.profile.waterGoalMl
  );

  const waterPercent =
    Math.min(
      100,
      Math.round(
        (todayWaterMl /
          waterGoal) *
          100
      )
    );

  /* =========================================================
     PROFILE INITIALS
  ========================================================= */

  const profileInitials = (
    state.profile.name ||
    "You"
  )
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part
        .charAt(0)
        .toUpperCase()
    )
    .join("");

  /* =========================================================
     DASHBOARD STATES
  ========================================================= */

  const stepsComplete =
    today.steps >= stepGoal;

  const waterComplete =
    todayWaterMl >= waterGoal;

  const caloriesComplete =
    caloriesConsumed >=
    calorieGoal;

  /* =========================================================
     LOADING
  ========================================================= */

  if (!hydrated) {
    return (
      <Screen>
        <View style={styles.loading}>
          <View
            style={[
              styles.loadingCircle,
              {
                backgroundColor:
                  `${STEP_GREEN}18`,
                borderColor:
                  `${STEP_GREEN}35`,
              },
            ]}
          >
            <Ionicons
              name="fitness-outline"
              size={28}
              color={STEP_GREEN}
            />
          </View>

          <Text
            style={[
              styles.loadingText,
              {
                color: c.muted,
              },
            ]}
          >
            Loading your fitness data…
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Subtitle>
              Daily overview
            </Subtitle>

            <Title>
              {state.profile.name
                ? `Hi, ${state.profile.name}`
                : "Welcome back"}
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
              Here's your fitness overview
              for today.
            </Text>
          </View>

          <Pressable
            onPress={() =>
              router.push(
                "/profile"
              )
            }
            style={({ pressed }) => [
              styles.profileButton,
              {
                backgroundColor:
                  `${STEP_GREEN}16`,
                borderColor:
                  `${STEP_GREEN}30`,
                opacity:
                  pressed
                    ? 0.72
                    : 1,
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
                  styles.profileImage
                }
              />
            ) : (
              <Text
                style={[
                  styles.profileInitials,
                  {
                    color:
                      STEP_GREEN,
                  },
                ]}
              >
                {profileInitials ||
                  "Y"}
              </Text>
            )}

            <View
              style={[
                styles.profileStatusDot,
                {
                  backgroundColor:
                    STEP_GREEN,
                },
              ]}
            />
          </Pressable>
        </View>

        {/* ===================================================
            STEP HERO
        =================================================== */}

        <View
          style={[
            styles.stepCard,
            {
              backgroundColor:
                c.surface,
              borderColor:
                c.border,
            },
          ]}
        >
          <View style={styles.stepHeader}>
            <View>
              <Text
                style={[
                  styles.cardEyebrow,
                  {
                    color:
                      c.muted,
                  },
                ]}
              >
                TODAY'S ACTIVITY
              </Text>

              <Text
                style={[
                  styles.stepTitle,
                  {
                    color:
                      c.text,
                  },
                ]}
              >
                Steps
              </Text>
            </View>

            <View
              style={[
                styles.liveBadge,
                {
                  backgroundColor:
                    `${STEP_GREEN}12`,
                  borderColor:
                    `${STEP_GREEN}28`,
                },
              ]}
            >
              <View
                style={[
                  styles.liveDot,
                  {
                    backgroundColor:
                      STEP_GREEN,
                  },
                ]}
              />

              <Text
                style={[
                  styles.liveText,
                  {
                    color:
                      STEP_GREEN,
                  },
                ]}
              >
                LIVE
              </Text>
            </View>
          </View>

          <View
            style={styles.ringContainer}
          >
            <StepProgressRing
              progress={
                stepProgress
              }
              steps={
                today.steps
              }
              goal={
                stepGoal
              }
              trackColor={
                c.surfaceAlt
              }
            />
          </View>

          <View
            style={styles.stepBottom}
          >
            <View
              style={
                styles.stepBottomItem
              }
            >
              <Text
                style={[
                  styles.bottomValue,
                  {
                    color:
                      c.text,
                  },
                ]}
              >
                {formatNumber(
                  stepsRemaining
                )}
              </Text>

              <Text
                style={[
                  styles.bottomLabel,
                  {
                    color:
                      c.muted,
                  },
                ]}
              >
                remaining
              </Text>
            </View>

            <View
              style={[
                styles.verticalDivider,
                {
                  backgroundColor:
                    c.border,
                },
              ]}
            />

            <View
              style={
                styles.stepBottomItem
              }
            >
              <Text
                style={[
                  styles.bottomValue,
                  {
                    color:
                      c.text,
                  },
                ]}
              >
                {stepPercent}%
              </Text>

              <Text
                style={[
                  styles.bottomLabel,
                  {
                    color:
                      c.muted,
                  },
                ]}
              >
                of daily goal
              </Text>
            </View>
          </View>
        </View>

        {/* ===================================================
            ACTIVITY
        =================================================== */}

        <View
          style={
            styles.sectionHeader
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
            Activity
          </Text>

          <View
            style={[
              styles.sectionPill,
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
                styles.sectionPillDot,
                {
                  backgroundColor:
                    STEP_GREEN,
                },
              ]}
            />

            <Text
              style={[
                styles.sectionPillText,
                {
                  color:
                    c.muted,
                },
              ]}
            >
              Today
            </Text>
          </View>
        </View>

        <View
          style={
            styles.activityGrid
          }
        >
          <DashboardMetric
            icon="navigate-outline"
            title="Distance"
            value={formatKm(
              today.distanceKm
            )}
            color={
              STEP_GREEN
            }
            muted={
              c.muted
            }
            text={
              c.text
            }
            border={
              c.border
            }
            surface={
              c.surface
            }
          />

          <DashboardMetric
            icon="flame-outline"
            title="Burned"
            value={`${today.caloriesBurned}`}
            suffix="kcal"
            color={
              STEP_GREEN
            }
            muted={
              c.muted
            }
            text={
              c.text
            }
            border={
              c.border
            }
            surface={
              c.surface
            }
          />
        </View>

        {/* ===================================================
            NUTRITION
        =================================================== */}

        <View
          style={
            styles.sectionHeader
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
            Nutrition
          </Text>

          <Pressable
            onPress={() =>
              router.push(
                "/calories"
              )
            }
            style={
              styles.viewButton
            }
          >
            <Text
              style={[
                styles.viewText,
                {
                  color:
                    STEP_GREEN,
                },
              ]}
            >
              View
            </Text>

            <Ionicons
              name="chevron-forward"
              size={13}
              color={
                STEP_GREEN
              }
            />
          </Pressable>
        </View>

        <Pressable
          onPress={() =>
            router.push(
              "/calories"
            )
          }
          style={({ pressed }) => [
            styles.nutritionCard,
            {
              backgroundColor:
                c.surface,
              borderColor:
                c.border,
              opacity:
                pressed
                  ? 0.86
                  : 1,
            },
          ]}
        >
          <View
            style={
              styles.nutritionTop
            }
          >
            <View
              style={[
                styles.featureIcon,
                {
                  backgroundColor:
                    `${STEP_GREEN}18`,
                  borderColor:
                    `${STEP_GREEN}2C`,
                },
              ]}
            >
              <Ionicons
                name="flame-outline"
                size={21}
                color={
                  STEP_GREEN
                }
              />
            </View>

            <View
              style={
                styles.nutritionText
              }
            >
              <Text
                style={[
                  styles.nutritionTitle,
                  {
                    color:
                      c.text,
                  },
                ]}
              >
                Calories
              </Text>

              <Text
                style={[
                  styles.nutritionSubtitle,
                  {
                    color:
                      c.muted,
                  },
                ]}
              >
                {Math.round(
                  caloriesConsumed
                ).toLocaleString()}{" "}
                of{" "}
                {calorieGoal.toLocaleString()}{" "}
                kcal
              </Text>
            </View>

            <View
              style={
                styles.calorieNumbers
              }
            >
              <Text
                style={[
                  styles.calorieMain,
                  {
                    color:
                      c.text,
                  },
                ]}
              >
                {Math.round(
                  caloriesRemaining
                ).toLocaleString()}
              </Text>

              <Text
                style={[
                  styles.calorieRemaining,
                  {
                    color:
                      c.muted,
                  },
                ]}
              >
                left
              </Text>
            </View>
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
                  backgroundColor:
                    STEP_GREEN,
                  width: `${calorieProgress}%`,
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
                styles.progressLabel,
                {
                  color:
                    c.muted,
                },
              ]}
            >
              Daily calorie target
            </Text>

            <Text
              style={[
                styles.progressPercent,
                {
                  color:
                    STEP_GREEN,
                },
              ]}
            >
              {
                calorieProgress
              }%
            </Text>
          </View>
        </Pressable>

        {/* ===================================================
            QUICK ACTIONS
        =================================================== */}

        <View
          style={
            styles.sectionHeader
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
            Quick actions
          </Text>

          <Text
            style={[
              styles.sectionCaption,
              {
                color:
                  c.muted,
              },
            ]}
          >
            Shortcuts
          </Text>
        </View>

        <View
          style={
            styles.actionsGrid
          }
        >
          <QuickAction
            title="Add food"
            subtitle="Track meal"
            icon="add-circle-outline"
            onPress={() =>
              router.push(
                "/add-food"
              )
            }
            c={c}
          />

          <QuickAction
            title="Water"
            subtitle={`${waterPercent}% of goal`}
            icon="water-outline"
            onPress={() =>
              router.push(
                "/water"
              )
            }
            c={c}
          />

          <QuickAction
            title="Weight"
            subtitle={`${latestWeightKg.toFixed(
              1
            )} kg`}
            icon="scale-outline"
            onPress={() =>
              router.push(
                "/weight"
              )
            }
            c={c}
          />

          <QuickAction
            title="Statistics"
            subtitle="View trends"
            icon="stats-chart-outline"
            onPress={() =>
              router.push(
                "/statistics"
              )
            }
            c={c}
          />
        </View>

        {/* ===================================================
            TODAY STATUS
        =================================================== */}

        <View
          style={
            styles.sectionHeader
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
            Today's progress
          </Text>

          <Text
            style={[
              styles.sectionCaption,
              {
                color:
                  c.muted,
              },
            ]}
          >
            Live
          </Text>
        </View>

        <View
          style={[
            styles.statusCard,
            {
              backgroundColor:
                c.surface,
              borderColor:
                c.border,
            },
          ]}
        >
          <StatusRow
            icon="footsteps-outline"
            title="Steps"
            value={`${formatNumber(
              today.steps
            )} / ${formatNumber(
              stepGoal
            )}`}
            progress={
              stepProgress
            }
            completed={
              stepsComplete
            }
            c={c}
          />

          <StatusRow
            icon="water-outline"
            title="Water"
            value={`${(
              todayWaterMl /
              1000
            ).toFixed(
              1
            )} / ${(
              waterGoal /
              1000
            ).toFixed(
              1
            )} L`}
            progress={Math.min(
              1,
              todayWaterMl /
                waterGoal
            )}
            completed={
              waterComplete
            }
            c={c}
          />

          <StatusRow
            icon="flame-outline"
            title="Calories"
            value={`${Math.round(
              caloriesConsumed
            )} / ${calorieGoal} kcal`}
            progress={Math.min(
              1,
              caloriesConsumed /
                calorieGoal
            )}
            completed={
              caloriesComplete
            }
            c={c}
          />
        </View>

        {/* ===================================================
            SMALL DAILY NOTE
        =================================================== */}

        <View
          style={[
            styles.dailyNote,
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
              styles.dailyNoteIcon
            }
          >
            <Ionicons
              name="sparkles-outline"
              size={16}
              color={
                STEP_GREEN
              }
            />
          </View>

          <View
            style={
              styles.dailyNoteText
            }
          >
            <Text
              style={[
                styles.dailyNoteTitle,
                {
                  color:
                    c.text,
                },
              ]}
            >
              Keep the momentum
            </Text>

            <Text
              style={[
                styles.dailyNoteSubtitle,
                {
                  color:
                    c.muted,
                },
              ]}
            >
              Small consistent actions make the biggest
              difference.
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

/* =========================================================
   STEP RING
========================================================= */

function StepProgressRing({
  progress,
  steps,
  goal,
  trackColor,
}: {
  progress: number;
  steps: number;
  goal: number;
  trackColor: string;
}) {
  const size = 220;
  const strokeWidth = 13;

  const radius =
    (size -
      strokeWidth) /
    2;

  const circumference =
    2 *
    Math.PI *
    radius;

  const safeProgress =
    Math.max(
      0,
      Math.min(
        1,
        progress
      )
    );

  const strokeDashoffset =
    circumference *
    (1 -
      safeProgress);

  return (
    <View
      style={[
        styles.ringWrapper,
        {
          width:
            size,
          height:
            size,
        },
      ]}
    >
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <Circle
          cx={
            size / 2
          }
          cy={
            size / 2
          }
          r={radius}
          stroke={
            trackColor
          }
          strokeWidth={
            strokeWidth
          }
          fill="none"
        />

        <Circle
          cx={
            size / 2
          }
          cy={
            size / 2
          }
          r={radius}
          stroke={
            STEP_GREEN
          }
          strokeWidth={
            strokeWidth
          }
          strokeLinecap="round"
          fill="none"
          strokeDasharray={
            circumference
          }
          strokeDashoffset={
            strokeDashoffset
          }
          rotation="-90"
          origin={`${size / 2}, ${
            size / 2
          }`}
        />
      </Svg>

      <View
        style={
          styles.ringCenter
        }
      >
        <Text
          style={
            styles.ringSteps
          }
        >
          {formatNumber(
            steps
          )}
        </Text>

        <Text
          style={
            styles.ringLabel
          }
        >
          STEPS
        </Text>

        <Text
          style={
            styles.ringGoal
          }
        >
          GOAL{" "}
          {formatNumber(
            goal
          )}
        </Text>
      </View>
    </View>
  );
}

/* =========================================================
   ACTIVITY METRIC
========================================================= */

function DashboardMetric({
  icon,
  title,
  value,
  suffix,
  color,
  muted,
  text,
  border,
  surface,
}: {
  icon: IconName;
  title: string;
  value: string;
  suffix?: string;
  color: string;
  muted: string;
  text: string;
  border: string;
  surface: string;
}) {
  return (
    <View
      style={[
        styles.metricCard,
        {
          backgroundColor:
            surface,
          borderColor:
            border,
        },
      ]}
    >
      <View
        style={[
          styles.metricIcon,
          {
            backgroundColor:
              `${color}18`,
            borderColor:
              `${color}2A`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={19}
          color={
            color
          }
        />
      </View>

      <Text
        style={[
          styles.metricTitle,
          {
            color:
              muted,
          },
        ]}
      >
        {title}
      </Text>

      <View
        style={
          styles.metricValueRow
        }
      >
        <Text
          style={[
            styles.metricValue,
            {
              color:
                text,
            },
          ]}
        >
          {value}
        </Text>

        {suffix ? (
          <Text
            style={[
              styles.metricSuffix,
              {
                color:
                  muted,
              },
            ]}
          >
            {suffix}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  title,
  subtitle,
  icon,
  onPress,
  c,
}: {
  title: string;
  subtitle: string;
  icon: IconName;
  onPress: () => void;
  c: ReturnType<
    typeof useAppColors
  >;
}) {
  return (
    <Pressable
      onPress={
        onPress
      }
      style={({ pressed }) => [
        styles.quickAction,
        {
          backgroundColor:
            c.surface,
          borderColor:
            c.border,
          opacity:
            pressed
              ? 0.78
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
          styles.quickIcon,
          {
            backgroundColor:
              `${STEP_GREEN}18`,
            borderColor:
              `${STEP_GREEN}2A`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={
            STEP_GREEN
          }
        />
      </View>

      <View
        style={
          styles.quickText
        }
      >
        <Text
          style={[
            styles.quickTitle,
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
            styles.quickSubtitle,
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
        style={
          styles.quickArrow
        }
      >
        <Ionicons
          name="chevron-forward"
          size={14}
          color={
            c.muted
          }
        />
      </View>
    </Pressable>
  );
}

/* =========================================================
   STATUS ROW
========================================================= */

function StatusRow({
  icon,
  title,
  value,
  progress,
  completed,
  c,
}: {
  icon: IconName;
  title: string;
  value: string;
  progress: number;
  completed: boolean;
  c: ReturnType<
    typeof useAppColors
  >;
}) {
  const safeProgress =
    Math.max(
      0,
      Math.min(
        1,
        progress
      )
    );

  return (
    <View
      style={
        styles.statusRow
      }
    >
      <View
        style={[
          styles.statusIcon,
          {
            backgroundColor:
              completed
                ? `${STEP_GREEN}20`
                : `${STEP_GREEN}12`,
            borderColor:
              completed
                ? `${STEP_GREEN}38`
                : `${STEP_GREEN}24`,
          },
        ]}
      >
        <Ionicons
          name={
            completed
              ? "checkmark"
              : icon
          }
          size={17}
          color={
            STEP_GREEN
          }
        />
      </View>

      <View
        style={
          styles.statusContent
        }
      >
        <View
          style={
            styles.statusTop
          }
        >
          <Text
            style={[
              styles.statusTitle,
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
              styles.statusValue,
              {
                color:
                  c.muted,
              },
            ]}
          >
            {value}
          </Text>
        </View>

        <View
          style={[
            styles.statusTrack,
            {
              backgroundColor:
                c.surfaceAlt,
            },
          ]}
        >
          <View
            style={[
              styles.statusFill,
              {
                backgroundColor:
                  STEP_GREEN,
                width: `${safeProgress * 100}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({
    content: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 140,
    },

    /* Loading */

    loading: {
      flex: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
      gap: 12,
    },

    loadingCircle: {
      width: 62,
      height: 62,
      borderRadius: 31,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderWidth: 1,
    },

    loadingText: {
      fontSize: 14,
      fontWeight: "600",
    },

    /* Header */

    header: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginBottom: 18,
    },

    headerText: {
      flex: 1,
      paddingRight: 12,
    },

    headerDescription: {
      fontSize: 11,
      lineHeight: 17,
      marginTop: 4,
    },

    profileButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
      position:
        "relative",
    },

    profileImage: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },

    profileInitials: {
      fontSize: 15,
      fontWeight: "900",
    },

    profileStatusDot: {
      position:
        "absolute",
      right: -1,
      bottom: 1,
      width: 11,
      height: 11,
      borderRadius: 6,
      borderWidth: 2,
      borderColor:
        "#111812",
    },

    /* Hero */

    stepCard: {
      borderRadius: 28,
      borderWidth: 1,
      padding: 20,
      overflow:
        "hidden",
    },

    stepHeader: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "flex-start",
    },

    cardEyebrow: {
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 1.2,
    },

    stepTitle: {
      fontSize: 23,
      fontWeight: "900",
      marginTop: 3,
    },

    liveBadge: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
    },

    liveDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },

    liveText: {
      fontSize: 9,
      fontWeight: "900",
      letterSpacing: 0.8,
    },

    ringContainer: {
      alignItems:
        "center",
      justifyContent:
        "center",
      marginTop: 8,
    },

    ringWrapper: {
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    ringCenter: {
      position:
        "absolute",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    ringSteps: {
      color:
        "#F5F7F2",
      fontSize: 34,
      fontWeight: "900",
      letterSpacing: -1,
    },

    ringLabel: {
      color:
        STEP_GREEN,
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.4,
      marginTop: -2,
    },

    ringGoal: {
      color:
        "#858C82",
      fontSize: 9,
      fontWeight: "700",
      marginTop: 7,
    },

    stepBottom: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginTop: 4,
    },

    stepBottomItem: {
      flex: 1,
      alignItems:
        "center",
    },

    bottomValue: {
      fontSize: 18,
      fontWeight: "900",
    },

    bottomLabel: {
      fontSize: 11,
      marginTop: 3,
    },

    verticalDivider: {
      width: 1,
      height: 30,
    },

    /* Sections */

    sectionHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginTop: 24,
      marginBottom: 10,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "900",
      letterSpacing: -0.2,
    },

    sectionCaption: {
      fontSize: 10,
      fontWeight: "700",
    },

    sectionPill: {
      minHeight: 27,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 8,
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 5,
    },

    sectionPillDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
    },

    sectionPillText: {
      fontSize: 8,
      fontWeight: "700",
    },

    viewButton: {
      minHeight: 28,
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 2,
      paddingLeft: 5,
    },

    viewText: {
      fontSize: 11,
      fontWeight: "900",
    },

    /* Activity */

    activityGrid: {
      flexDirection:
        "row",
      gap: 10,
    },

    metricCard: {
      flex: 1,
      minHeight: 124,
      borderRadius: 21,
      borderWidth: 1,
      padding: 14,
    },

    metricIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderWidth: 1,
    },

    metricTitle: {
      fontSize: 11,
      fontWeight: "600",
      marginTop: 11,
    },

    metricValueRow: {
      flexDirection:
        "row",
      alignItems:
        "baseline",
      marginTop: 3,
      gap: 4,
    },

    metricValue: {
      fontSize: 21,
      fontWeight: "900",
    },

    metricSuffix: {
      fontSize: 9,
      fontWeight: "700",
    },

    /* Nutrition */

    nutritionCard: {
      borderRadius: 22,
      borderWidth: 1,
      padding: 16,
    },

    nutritionTop: {
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    featureIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderWidth: 1,
    },

    nutritionText: {
      flex: 1,
      marginLeft: 11,
    },

    nutritionTitle: {
      fontSize: 15,
      fontWeight: "800",
    },

    nutritionSubtitle: {
      fontSize: 10,
      marginTop: 3,
    },

    calorieNumbers: {
      alignItems:
        "flex-end",
    },

    calorieMain: {
      fontSize: 20,
      fontWeight: "900",
    },

    calorieRemaining: {
      fontSize: 9,
      marginTop: 1,
    },

    progressTrack: {
      height: 8,
      borderRadius: 999,
      overflow:
        "hidden",
      marginTop: 17,
    },

    progressFill: {
      height: "100%",
      borderRadius: 999,
    },

    progressFooter: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
      marginTop: 8,
    },

    progressLabel: {
      fontSize: 9,
      fontWeight: "600",
    },

    progressPercent: {
      fontSize: 9,
      fontWeight: "900",
    },

    /* Quick Actions */

    actionsGrid: {
      gap: 8,
    },

    quickAction: {
      minHeight: 64,
      borderRadius: 999,
      borderWidth: 1,
      flexDirection:
        "row",
      alignItems:
        "center",
      paddingHorizontal: 8,
    },

    quickIcon: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderWidth: 1,
    },

    quickText: {
      flex: 1,
      marginLeft: 10,
    },

    quickTitle: {
      fontSize: 12,
      fontWeight: "800",
    },

    quickSubtitle: {
      fontSize: 9,
      marginTop: 2,
    },

    quickArrow: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor:
        "rgba(128,128,128,0.08)",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginRight: 5,
    },

    /* Status */

    statusCard: {
      borderRadius: 23,
      borderWidth: 1,
      padding: 14,
    },

    statusRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginVertical: 7,
    },

    statusIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderWidth: 1,
    },

    statusContent: {
      flex: 1,
      marginLeft: 11,
    },

    statusTop: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
      marginBottom: 7,
    },

    statusTitle: {
      fontSize: 11,
      fontWeight: "800",
    },

    statusValue: {
      fontSize: 9,
      fontWeight: "600",
    },

    statusTrack: {
      height: 6,
      borderRadius: 999,
      overflow:
        "hidden",
    },

    statusFill: {
      height: "100%",
      borderRadius: 999,
    },

    /* Daily note */

    dailyNote: {
      minHeight: 60,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 7,
      flexDirection:
        "row",
      alignItems:
        "center",
      marginTop: 18,
    },

    dailyNoteIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        `${STEP_GREEN}12`,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    dailyNoteText: {
      flex: 1,
      marginLeft: 9,
    },

    dailyNoteTitle: {
      fontSize: 10,
      fontWeight: "900",
    },

    dailyNoteSubtitle: {
      fontSize: 8,
      lineHeight: 14,
      marginTop: 2,
    },

    bottomSpace: {
      height: 20,
    },
  });