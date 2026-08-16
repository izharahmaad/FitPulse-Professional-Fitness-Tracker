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

  const logoScale = useRef(
    new Animated.Value(0.7)
  ).current;

  const logoOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const contentOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const progress = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 70,
        useNativeDriver: true,
      }),

      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        delay: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(progress, {
        toValue: 1,
        duration: 1650,
        delay: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [
    logoScale,
    logoOpacity,
    contentOpacity,
    progress,
  ]);

  return (
    <Screen>
      <View
        style={[
          styles.container,
          {
            backgroundColor: c.background,
          },
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glow,
            {
              backgroundColor: `${ACCENT}10`,
              opacity: logoOpacity,
              transform: [
                {
                  scale: logoScale,
                },
              ],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.logo,
            {
              backgroundColor: ACCENT,
              opacity: logoOpacity,
              transform: [
                {
                  scale: logoScale,
                },
              ],
            },
          ]}
        >
          <Ionicons
            name="fitness"
            size={40}
            color="#0A0F0C"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: contentOpacity,
            },
          ]}
        >
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
        </Animated.View>

        <View
          style={[
            styles.progressTrack,
            {
              backgroundColor: c.surfaceAlt,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: ACCENT,
                width: progress.interpolate({
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

        <Animated.Text
          style={[
            styles.loadingText,
            {
              color: c.muted,
              opacity: contentOpacity,
            },
          ]}
        >
          Opening FitPulse…
        </Animated.Text>

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

  glow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
  },

  logo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
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