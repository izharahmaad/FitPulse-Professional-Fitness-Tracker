export const colors = {
  light: {
    background: "#F5F7F8",
    surface: "#FFFFFF",
    surfaceAlt: "#EEF2F1",
    text: "#101817",
    muted: "#6B7472",
    border: "#DDE4E1",

    primary: "#18A77A",
    primarySoft: "#DDF7ED",

    accent: "#F2B84B",
    danger: "#EF5B68",
    blue: "#4F8CFF",

    white: "#FFFFFF",
  },

  dark: {
    background: "#090F0D",
    surface: "#111A17",
    surfaceAlt: "#18231F",

    text: "#F2F7F5",
    muted: "#8E9C96",
    border: "#26332E",

    primary: "#20C997",
    primarySoft: "#12382D",

    accent: "#F5B84B",
    danger: "#FF6673",
    blue: "#5B9BFF",

    white: "#FFFFFF",
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 26,
  pill: 999,
} as const;