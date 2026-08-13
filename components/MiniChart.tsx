import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppColors } from "@/components/ui";
import { formatShortDate } from "@/utils/date";

export function MiniChart({ values, labels, height = 130, format = "number" }: { values: number[]; labels?: string[]; height?: number; format?: "number" | "decimal" }) {
  const c = useAppColors();
  const max = Math.max(1, ...values);
  return (
    <View style={{ height }}>
      <View style={[styles.chart, { height: height - 24 }]}>
        {values.map((value, index) => (
          <View key={`${index}-${value}`} style={styles.barWrap}>
            <View style={[styles.bar, { height: `${Math.max(3, (value / max) * 100)}%`, backgroundColor: c.primary }]} />
          </View>
        ))}
      </View>
      {labels && <View style={styles.labels}>{labels.map((label, index) => <Text key={`${label}-${index}`} style={[styles.label, { color: c.muted }]}>{formatShortDate(label)}</Text>)}</View>}
    </View>
  );
}
const styles = StyleSheet.create({
  chart: { flexDirection: "row", alignItems: "flex-end", gap: 5 },
  barWrap: { flex: 1, height: "100%", justifyContent: "flex-end" },
  bar: { width: "100%", minHeight: 3, borderRadius: 5 },
  labels: { flexDirection: "row", marginTop: 5 },
  label: { flex: 1, fontSize: 9, textAlign: "center" }
});
