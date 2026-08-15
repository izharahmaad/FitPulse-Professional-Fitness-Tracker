import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewProps,
  ViewStyle,
  StyleProp,
  useColorScheme,
} from "react-native";
import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  colors,
  radius,
  spacing,
} from "@/constants/theme";

/* =========================================================
   GLOBAL COLORS
========================================================= */

export function useAppColors() {
  const scheme = useColorScheme();

  return scheme === "dark"
    ? colors.dark
    : colors.light;
}

/* =========================================================
   GLOBAL SCREEN
========================================================= */

export function Screen({
  children,
  style,
  ...props
}: ViewProps & {
  style?: StyleProp<ViewStyle>;
}) {
  const c = useAppColors();

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[
        styles.screen,
        {
          backgroundColor:
            c.background,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
}

/* =========================================================
   GLOBAL CARD
========================================================= */

export function Card({
  children,
  ...props
}: ViewProps) {
  const c = useAppColors();

  return (
    <View
      {...props}
      style={[
        styles.card,
        {
          backgroundColor:
            c.surface,
          borderColor:
            c.border,
        },
        props.style,
      ]}
    >
      {children}
    </View>
  );
}

/* =========================================================
   TITLE
========================================================= */

export function Title({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = useAppColors();

  return (
    <Text
      style={[
        styles.title,
        {
          color: c.text,
        },
      ]}
    >
      {children}
    </Text>
  );
}

/* =========================================================
   SUBTITLE
========================================================= */

export function Subtitle({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = useAppColors();

  return (
    <Text
      style={[
        styles.subtitle,
        {
          color: c.muted,
        },
      ]}
    >
      {children}
    </Text>
  );
}

/* =========================================================
   LABEL
========================================================= */

export function Label({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = useAppColors();

  return (
    <Text
      style={[
        styles.label,
        {
          color: c.muted,
        },
      ]}
    >
      {children}
    </Text>
  );
}

/* =========================================================
   GLOBAL BUTTON
========================================================= */

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  variant?:
    | "primary"
    | "secondary"
    | "danger";
  disabled?: boolean;
}) {
  const c = useAppColors();

  const isPrimary =
    variant === "primary";

  const isDanger =
    variant === "danger";

  const backgroundColor =
    isDanger
      ? `${c.danger}16`
      : isPrimary
        ? c.primarySoft
        : c.surfaceAlt;

  const borderColor =
    isDanger
      ? `${c.danger}40`
      : isPrimary
        ? `${c.primary}45`
        : c.border;

  const textColor =
    isDanger
      ? c.danger
      : isPrimary
        ? c.primary
        : c.text;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderColor,
          opacity: disabled
            ? 0.45
            : pressed
              ? 0.72
              : 1,
          transform: [
            {
              scale: pressed
                ? 0.985
                : 1,
            },
          ],
        },
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          {
            color: textColor,
          },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

/* =========================================================
   INPUT
========================================================= */

export function Input(
  props: TextInputProps
) {
  const c = useAppColors();

  return (
    <TextInput
      {...props}
      placeholderTextColor={
        c.muted
      }
      selectionColor={
        c.primary
      }
      style={[
        styles.input,
        {
          color: c.text,
          borderColor: c.border,
          backgroundColor:
            c.surface,
        },
        props.style,
      ]}
    />
  );
}

/* =========================================================
   GLOBAL STYLES
========================================================= */

export const styles =
  StyleSheet.create({
    /* -----------------------------------------------------
       Screen
    ----------------------------------------------------- */

    screen: {
      flex: 1,
    },

    /* -----------------------------------------------------
       Shared content
    ----------------------------------------------------- */

    content: {
      paddingHorizontal:
        spacing.lg,

      paddingTop:
        spacing.md,

      /*
       * Extra room for the custom
       * floating navigation bar.
       *
       * SafeAreaView handles the
       * physical device inset.
       */
      paddingBottom: 140,
    },

    /* -----------------------------------------------------
       Typography
    ----------------------------------------------------- */

    title: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: "900",
      letterSpacing: -0.7,
    },

    subtitle: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "600",
      letterSpacing: 0.2,
    },

    label: {
      fontSize: 10,
      lineHeight: 15,
      fontWeight: "800",
      textTransform:
        "uppercase",
      letterSpacing: 0.9,
      marginBottom: 7,
    },

    /* -----------------------------------------------------
       Cards
    ----------------------------------------------------- */

    card: {
      borderRadius:
        radius.xl,

      borderWidth: 1,

      padding:
        spacing.lg,

      marginBottom:
        spacing.md,
    },

    /* -----------------------------------------------------
       Buttons
    ----------------------------------------------------- */

    button: {
      minHeight: 48,

      paddingHorizontal:
        spacing.xl,

      borderRadius:
        radius.pill,

      borderWidth: 1,

      alignItems: "center",
      justifyContent: "center",
    },

    buttonText: {
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 0.1,
    },

    /* -----------------------------------------------------
       Inputs
    ----------------------------------------------------- */

    input: {
      minHeight: 48,

      borderWidth: 1,

      borderRadius:
        radius.pill,

      paddingHorizontal:
        spacing.lg,

      fontSize: 15,

      fontWeight: "600",
    },
  });