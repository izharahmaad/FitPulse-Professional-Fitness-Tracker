import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useAppColors } from "@/components/ui";

export function ProgressRing({ value, max, size = 150, label, sublabel }: { value: number; max: number; size?: number; label: string; sublabel: string }) {
  const c = useAppColors();
  const stroke = 11;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, max > 0 ? value / max : 0));
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={c.surfaceAlt} strokeWidth={stroke} fill="none" />
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={c.primary} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={circumference * (1 - progress)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </Svg>
      <Text style={[styles.label, { color: c.text }]}>{label}</Text>
      <Text style={[styles.sub, { color: c.muted }]}>{sublabel}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  label: { fontSize: 25, fontWeight: "900" },
  sub: { fontSize: 12, marginTop: 2 }
});
