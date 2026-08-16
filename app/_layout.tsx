import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { FitnessProvider } from "@/store/FitnessProvider";

export default function RootLayout() {
  return (
    <FitnessProvider>
      <StatusBar style="auto" />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* App startup / welcome screen */}
        <Stack.Screen name="index" />

        {/* Main application */}
        <Stack.Screen name="(tabs)" />

        {/* Add food modal */}
        <Stack.Screen
          name="add-food"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
    </FitnessProvider>
  );
}