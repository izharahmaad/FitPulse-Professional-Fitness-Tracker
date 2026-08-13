import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FitnessProvider } from "@/store/FitnessProvider";

export default function RootLayout() {
  return (
    <FitnessProvider>
      <StatusBar style="auto" />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />

        <Stack.Screen
          name="add-food"
          options={{ presentation: "modal" }}
        />
      </Stack>
    </FitnessProvider>
  );
}