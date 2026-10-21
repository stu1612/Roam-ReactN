// JS-side mirror of the tokens in global.css, only for values that can't go
// through className: icon colors and sizes passed as props, placeholder and
// spinner colors, Switch track colors, and animation durations.
// Keep in sync with global.css @theme.

export const colors = {
  primary: "#FFC629",
  lavender: "#C9B4FF",
  ink: "#0B0B1A",
  inkMuted: "#6B7280",
  surface: "#FFFFFF",
  surfaceMuted: "#F4F5F7",
  border: "#E5E7EB",
  success: "#16A34A",
  danger: "#E11D48",
} as const;

export const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

export const iconStroke = 2;

export const motion = {
  fast: 150, // press, toggle
  base: 250, // focus border, segment thumb
} as const;
