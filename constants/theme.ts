export const colors = {
  light: {
    background: "#F4F7F3",
    surface: "#FFFFFF",
    surfaceAlt: "#EAF0EB",

    text: "#101510",
    muted: "#6D776F",
    border: "#D9E1DB",

    primary: "#8EDC18",
    primarySoft: "#E7F8C8",

    accent: "#B7FF1A",
    danger: "#E9545B",

    white: "#FFFFFF",
  },

  dark: {
    background: "#0A0F0C",
    surface: "#111812",
    surfaceAlt: "#182019",

    text: "#F1F5EF",
    muted: "#8D988F",
    border: "#263129",

    /*
     * Main FitPulse brand color.
     * Use this for:
     * - progress rings
     * - progress bars
     * - active navigation
     * - important icons
     * - primary actions
     */
    primary: "#B7FF1A",

    /*
     * Softer version used behind icons,
     * selected states and subtle highlights.
     */
    primarySoft: "#1C3510",

    /*
     * Kept for compatibility with existing
     * components, but avoid using it as a
     * separate visual accent throughout the app.
     */
    accent: "#B7FF1A",

    danger: "#FF626B",

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