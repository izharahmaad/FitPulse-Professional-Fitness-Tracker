import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useAppColors } from "@/components/ui";

const ACCENT = "#B7FF1A";

type ProgressRingProps = {
  value: number;
  max: number;
  size?: number;
  label: string;
  sublabel: string;
};

export function ProgressRing({
  value,
  max,
  size = 150,
  label,
  sublabel,
}: ProgressRingProps) {
  const c = useAppColors();

  const stroke = Math.max(
    9,
    Math.min(14, size * 0.075)
  );

  const radius =
    (size - stroke) / 2;

  const circumference =
    2 * Math.PI * radius;

  const progress = Math.max(
    0,
    Math.min(
      1,
      max > 0
        ? value / max
        : 0
    )
  );

  const percentage = Math.round(
    progress * 100
  );

  const dashOffset =
    circumference *
    (1 - progress);

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
        },
      ]}
    >
      {/* ===================================================
          SVG RING
      =================================================== */}

      <Svg
        width={size}
        height={size}
        style={StyleSheet.absoluteFill}
      >
        {/* Outer subtle ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={c.surfaceAlt}
          strokeWidth={stroke}
          fill="none"
        />

        {/* Soft accent track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`${ACCENT}14`}
          strokeWidth={stroke + 3}
          fill="none"
        />

        {/* Main progress */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ACCENT}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${
            size / 2
          })`}
        />
      </Svg>

      {/* ===================================================
          CENTER CONTENT
      =================================================== */}

      <View style={styles.center}>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[
            styles.label,
            {
              color: c.text,
              maxWidth:
                size * 0.64,
            },
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.sublabel,
            { color: c.muted },
          ]}
        >
          {sublabel}
        </Text>

        <View
          style={[
            styles.percentBadge,
            {
              backgroundColor:
                `${ACCENT}14`,
              borderColor:
                `${ACCENT}25`,
            },
          ]}
        >
          <View
            style={[
              styles.percentDot,
              {
                backgroundColor:
                  ACCENT,
              },
            ]}
          />

          <Text
            style={[
              styles.percentText,
              { color: ACCENT },
            ]}
          >
            {percentage}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  sublabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },

  percentBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    minHeight: 22,
    paddingHorizontal: 8,
    borderRadius: 999,

    borderWidth: 1,

    marginTop: 7,
  },

  percentDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 5,
  },

  percentText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
});