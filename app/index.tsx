import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {
  Screen,
  useAppColors,
} from "@/components/ui";

const ACCENT = "#B7FF1A";

export default function Index() {
  const c = useAppColors();

  const progress = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    const animation = Animated.timing(
      progress,
      {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      }
    );

    animation.start();

    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 3000);

    return () => {
      animation.stop();
      clearTimeout(timer);
    };
  }, [progress]);

  return (
    <Screen>
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              c.background,
          },
        ]}
      >
        {/* Logo */}
        <View
          style={[
            styles.logo,
            {
              backgroundColor:
                ACCENT,
            },
          ]}
        >
          <Ionicons
            name="fitness"
            size={40}
            color="#0A0F0C"
          />
        </View>

        {/* Brand */}
        <View style={styles.brandBlock}>
          <Text
            style={[
              styles.title,
              {
                color: c.text,
              },
            ]}
          >
            FitPulse
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: c.muted,
              },
            ]}
          >
            Welcome to your fitness journey
          </Text>
        </View>

        {/* Loading */}
        <View
          style={[
            styles.progressTrack,
            {
              backgroundColor:
                c.surfaceAlt,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor:
                  ACCENT,
                width:
                  progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      "0%",
                      "100%",
                    ],
                  }),
              },
            ]}
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
          Opening FitPulse…
        </Text>

        {/* Footer */}
        <Text
          style={[
            styles.footer,
            {
              color: c.muted,
            },
          ]}
        >
          FITPULSE
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  brandBlock: {
    alignItems: "center",
    marginTop: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1,
  },

  subtitle: {
    fontSize: 11,
    marginTop: 6,
    textAlign: "center",
  },

  progressTrack: {
    width: 150,
    height: 5,
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 32,
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  loadingText: {
    fontSize: 9,
    fontWeight: "700",
    marginTop: 9,
  },

  footer: {
    position: "absolute",
    bottom: 30,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 2,
  },
});