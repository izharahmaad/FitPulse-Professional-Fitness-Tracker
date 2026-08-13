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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, spacing } from "@/constants/theme";
import { useColorScheme } from "react-native";

export function useAppColors() {
  const scheme = useColorScheme();
  return scheme === "dark" ? colors.dark : colors.light;
}

/**
 * Global screen container.
 *
 * Safe-area handling is centralized here so individual screens
 * don't need to manually calculate top/bottom phone insets.
 */
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
          backgroundColor: c.background,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
}

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
          backgroundColor: c.surface,
          borderColor: c.border,
        },
        props.style,
      ]}
    >
      {children}
    </View>
  );
}

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

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}) {
  const c = useAppColors();

  const bg =
    variant === "primary"
      ? c.primary
      : variant === "danger"
        ? c.danger
        : c.surfaceAlt;

  const fg =
    variant === "secondary"
      ? c.text
      : c.white;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bg,
          opacity: disabled
            ? 0.45
            : pressed
              ? 0.75
              : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          {
            color: fg,
          },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function Input(props: TextInputProps) {
  const c = useAppColors();

  return (
    <TextInput
      {...props}
      placeholderTextColor={c.muted}
      style={[
        styles.input,
        {
          color: c.text,
          borderColor: c.border,
          backgroundColor: c.surface,
        },
        props.style,
      ]}
    />
  );
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,

    // Extra room for the tab bar.
    // SafeAreaView handles the actual phone navigation area.
    paddingBottom: 140,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 7,
  },

  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },

  button: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 15,
    fontWeight: "800",
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
  },
});