import React, { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { Button, Card, Input, Label, Screen, Title, useAppColors } from "@/components/ui";
import { MealType } from "@/types/fitness";
import { useFitness } from "@/hooks/useFitness";

const foodDatabase = [
  { name: "Chicken breast", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Cooked rice", calories: 205, protein: 4.3, carbs: 44.5, fat: 0.4 },
  { name: "Egg", calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
  { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: "Plain yogurt", calories: 100, protein: 5, carbs: 7, fat: 5 }
];

export default function AddFoodScreen() {
  const c = useAppColors();
  const { addFood } = useFitness();
  const [name, setName] = useState("");
  const [meal, setMeal] = useState<MealType>("breakfast");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [servings, setServings] = useState("1");

  const save = () => {
    const kcal = Number(calories);
    if (!name.trim() || !Number.isFinite(kcal) || kcal < 0) return;
    addFood({ name: name.trim(), meal, calories: kcal, protein: Number(protein) || 0, carbs: Number(carbs) || 0, fat: Number(fat) || 0, servings: Math.max(0.1, Number(servings) || 1) });
    router.back();
  };

  const choose = (item: typeof foodDatabase[number]) => {
    setName(item.name); setCalories(String(item.calories)); setProtein(String(item.protein)); setCarbs(String(item.carbs)); setFat(String(item.fat));
  };

  return <Screen><ScrollView contentContainerStyle={styles.content}>
    <Title>Add food</Title>
    <Text style={[styles.hint, { color: c.muted }]}>Use the built-in starter database now; the architecture is ready for an external food API later.</Text>
    <Label>Search / food name</Label><Input value={name} onChangeText={setName} placeholder="e.g. Chicken breast" />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12 }}>{foodDatabase.map(item => <Button key={item.name} title={item.name} variant="secondary" onPress={() => choose(item)} />)}</ScrollView>
    <Label>Meal</Label><Input value={meal} onChangeText={v => setMeal(v as MealType)} placeholder="breakfast / lunch / dinner / snack" autoCapitalize="none" />
    <Label>Calories</Label><Input value={calories} onChangeText={setCalories} keyboardType="decimal-pad" placeholder="kcal" />
    <Label>Protein (g)</Label><Input value={protein} onChangeText={setProtein} keyboardType="decimal-pad" placeholder="0" />
    <Label>Carbohydrates (g)</Label><Input value={carbs} onChangeText={setCarbs} keyboardType="decimal-pad" placeholder="0" />
    <Label>Fat (g)</Label><Input value={fat} onChangeText={setFat} keyboardType="decimal-pad" placeholder="0" />
    <Label>Servings</Label><Input value={servings} onChangeText={setServings} keyboardType="decimal-pad" placeholder="1" />
    <Button title="Save food" onPress={save} />
  </ScrollView></Screen>;
}
const styles = StyleSheet.create({ content: { padding: 16, paddingBottom: 50, gap: 9 }, hint: { lineHeight: 20, marginBottom: 12 }, });
