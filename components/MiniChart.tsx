import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAppColors } from "@/components/ui";
import { formatShortDate } from "@/utils/date";

const ACCENT = "#B7FF1A";

type MiniChartProps = {
  values: number[];
  labels?: string[];
  height?: number;
  format?: "number" | "decimal";
};

export function MiniChart({
  values,
  labels,
  height = 130,
  format = "number",
}: MiniChartProps) {
  const c = useAppColors();

  /* ---------------------------------------------------------
     Safety
  --------------------------------------------------------- */

  if (!values || values.length === 0) {
    return (
      <View
        style={[
          styles.empty,
          {
            height,
            backgroundColor: c.surfaceAlt,
          },
        ]}
      >
        <Text
          style={[
            styles.emptyText,
            { color: c.muted },
          ]}
        >
          No data recorded yet
        </Text>
      </View>
    );
  }

  /* ---------------------------------------------------------
     Data calculations
  --------------------------------------------------------- */

  const maxValue = Math.max(
    1,
    ...values
  );

  const highestValue = Math.max(
    ...values
  );

  const highestIndex =
    values.indexOf(highestValue);

  /*
   * Prevent tiny values from disappearing completely.
   */
  const MIN_BAR_HEIGHT = 6;

  /*
   * Keep chart readable at different lengths.
   *
   * 7 days  -> every label
   * 14 days -> every 2nd label
   * 30 days -> every 5th label
   */
  const labelInterval =
    values.length <= 7
      ? 1
      : values.length <= 14
      ? 2
      : 5;

  const chartHeight =
    Math.max(70, height - 38);

  /* ---------------------------------------------------------
     Value formatter
  --------------------------------------------------------- */

  const formatValue = (
    value: number
  ): string => {
    if (format === "decimal") {
      return value.toFixed(1);
    }

    return Math.round(
      value
    ).toLocaleString();
  };

  return (
    <View
      style={[
        styles.container,
        { height },
      ]}
    >
      {/* ---------------------------------------------------
          Y-axis guide values
      --------------------------------------------------- */}

      <View style={styles.chartArea}>
        <View
          pointerEvents="none"
          style={styles.gridLines}
        >
          <View
            style={[
              styles.gridLine,
              { backgroundColor: c.border },
            ]}
          />

          <View
            style={[
              styles.gridLine,
              { backgroundColor: c.border },
            ]}
          />

          <View
            style={[
              styles.gridLine,
              { backgroundColor: c.border },
            ]}
          />

          <View
            style={[
              styles.gridLine,
              { backgroundColor: c.border },
            ]}
          />
        </View>

        {/* -------------------------------------------------
            Bars
        ------------------------------------------------- */}

        <View style={styles.bars}>
          {values.map(
            (value, index) => {
              const ratio =
                maxValue > 0
                  ? value / maxValue
                  : 0;

              const barHeight = Math.max(
                value > 0
                  ? MIN_BAR_HEIGHT
                  : 2,
                ratio * chartHeight
              );

              const isHighest =
                index ===
                  highestIndex &&
                highestValue > 0;

              return (
                <View
                  key={`${index}-${value}`}
                  style={styles.barSlot}
                >
                  <View
                    style={[
                      styles.bar,
                      {
                        height:
                          barHeight,
                        backgroundColor:
                          isHighest
                            ? ACCENT
                            : `${ACCENT}AA`,
                      },
                      isHighest &&
                        styles.highestBar,
                    ]}
                  />
                </View>
              );
            }
          )}
        </View>
      </View>

      {/* ---------------------------------------------------
          Date labels
      --------------------------------------------------- */}

      {labels && labels.length > 0 ? (
        <View style={styles.labels}>
          {labels.map(
            (label, index) => {
              const shouldShow =
                index === 0 ||
                index ===
                  labels.length - 1 ||
                index %
                  labelInterval ===
                  0;

              return (
                <View
                  key={`${label}-${index}`}
                  style={styles.labelSlot}
                >
                  {shouldShow ? (
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.label,
                        {
                          color:
                            c.muted,
                        },
                      ]}
                    >
                      {formatShortDate(
                        label
                      )}
                    </Text>
                  ) : null}
                </View>
              );
            }
          )}
        </View>
      ) : null}

      {/* ---------------------------------------------------
          Highest value indicator
      --------------------------------------------------- */}

      {highestValue > 0 ? (
        <View
          pointerEvents="none"
          style={styles.highestBadge}
        >
          <View
            style={[
              styles.badgeDot,
              {
                backgroundColor:
                  ACCENT,
              },
            ]}
          />

          <Text
            style={[
              styles.badgeText,
              { color: c.muted },
            ]}
          >
            Peak {formatValue(highestValue)}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },

  chartArea: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },

  gridLines: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    paddingVertical: 2,
  },

  gridLine: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
    opacity: 0.6,
  },

  bars: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,

    flexDirection: "row",
    alignItems: "flex-end",

    gap: 3,
    paddingHorizontal: 2,
  },

  barSlot: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  bar: {
    width: "72%",
    minWidth: 3,
    minHeight: 2,

    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,

    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },

  highestBar: {
    width: "82%",
  },

  labels: {
    height: 28,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 2,
  },

  labelSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
  },

  label: {
    fontSize: 8,
    fontWeight: "600",
    textAlign: "center",
  },

  highestBadge: {
    position: "absolute",
    right: 2,
    top: 0,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 7,
    paddingVertical: 4,

    borderRadius: 999,
  },

  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 5,
  },

  badgeText: {
    fontSize: 8,
    fontWeight: "700",
  },

  empty: {
    width: "100%",
    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    fontSize: 11,
    fontWeight: "600",
  },
});