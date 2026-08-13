import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card, Screen, Subtitle, Title, useAppColors } from "@/components/ui";
import { useFitness } from "@/hooks/useFitness";
import { ActivityLevel, Gender, WeightGoal } from "@/types/fitness";

export default function SettingsScreen() {
  const c = useAppColors();
  const { state, updateProfile, setNotificationSettings } = useFitness();
  const p = state.profile;
  const n = state.notifications;
  return <Screen><ScrollView contentContainerStyle={styles.content}>
    <Subtitle>Preferences</Subtitle><Title>Settings</Title>
    <Card><Text style={[styles.heading, { color: c.text }]}>Body & activity</Text>
      <Choice label="Gender" value={p.gender} options={["male", "female"]} onChange={v => updateProfile({ gender: v as Gender })} />
      <Choice label="Activity" value={p.activityLevel} options={["sedentary", "light", "moderate", "high", "athlete"]} onChange={v => updateProfile({ activityLevel: v as ActivityLevel })} />
      <Choice label="Weight goal" value={p.weightGoal} options={["lose", "maintain", "gain"]} onChange={v => updateProfile({ weightGoal: v as WeightGoal })} />
      <Choice label="Units" value={p.units} options={["metric", "imperial"]} onChange={v => updateProfile({ units: v as "metric" | "imperial" })} />
    </Card>
    <Card><Text style={[styles.heading, { color: c.text }]}>Notifications</Text>
      <Toggle label="Enable reminders" value={n.enabled} onPress={() => setNotificationSettings({ enabled: !n.enabled })} />
      <Toggle label="Water reminder" value={n.water} onPress={() => setNotificationSettings({ water: !n.water })} />
      <Toggle label="Meal reminder" value={n.meals} onPress={() => setNotificationSettings({ meals: !n.meals })} />
      <Toggle label="Step goal reminder" value={n.stepGoal} onPress={() => setNotificationSettings({ stepGoal: !n.stepGoal })} />
      <Toggle label="Weight reminder" value={n.weight} onPress={() => setNotificationSettings({ weight: !n.weight })} />
      <Toggle label="Inactivity reminder" value={n.inactivity} onPress={() => setNotificationSettings({ inactivity: !n.inactivity })} />
    </Card>
    <Card><Text style={[styles.heading, { color: c.text }]}>Manual calorie goal</Text><Text style={{ color: c.muted, lineHeight: 21 }}>Automatic calorie targets use Mifflin–St Jeor + TDEE. If you need a fixed target, change the stored goal from the Profile workflow in a future backend-enabled version.</Text></Card>
  </ScrollView></Screen>;
}
function Choice({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const c = useAppColors();
  return <View style={{ marginBottom: 15 }}><Text style={{ color: c.muted, fontSize: 12, fontWeight: "800", marginBottom: 7 }}>{label}</Text><View style={styles.options}>{options.map(o => <Button key={o} title={o} variant={o === value ? "primary" : "secondary"} onPress={() => onChange(o)} />)}</View></View>;
}
function Toggle({ label, value, onPress }: { label: string; value: boolean; onPress: () => void }) {
  const c = useAppColors();
  return <View style={styles.toggle}><Text style={{ color: c.text, fontWeight: "700", flex: 1 }}>{label}</Text><Button title={value ? "On" : "Off"} variant={value ? "primary" : "secondary"} onPress={onPress} /></View>;
}
const styles = StyleSheet.create({ content: { padding: 16, paddingBottom: 100 }, heading: { fontSize: 17, fontWeight: "900", marginBottom: 15 }, options: { flexDirection: "row", flexWrap: "wrap", gap: 7 }, toggle: { flexDirection: "row", alignItems: "center", paddingVertical: 7, gap: 10 } });
