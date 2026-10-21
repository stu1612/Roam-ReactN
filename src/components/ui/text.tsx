import { Text as RNText, type TextProps as RNTextProps } from "react-native";

const variants = {
  display: "font-jakarta-bold text-display",
  heading: "font-jakarta-bold text-heading",
  title: "font-jakarta-bold text-title",
  body: "font-jakarta text-body",
  caption: "font-jakarta-medium text-caption",
  button: "font-jakarta-medium text-button",
  "button-sm": "font-jakarta-medium text-button-sm",
  micro: "font-jakarta-medium text-micro",
} as const;

const tones = {
  default: "text-ink",
  muted: "text-ink-muted",
} as const;

export type TextVariant = keyof typeof variants;

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  tone?: keyof typeof tones;
  className?: string;
};

export function Text({ variant = "body", tone = "default", className, ...props }: TextProps) {
  // Two font-family classes would resolve by stylesheet order, not string
  // order, so a caller's font-jakarta* replaces the variant's.
  const base = /\bfont-jakarta/.test(className ?? "")
    ? variants[variant].replace(/font-jakarta\S*/, "")
    : variants[variant];
  return <RNText className={`${base} ${tones[tone]} ${className ?? ""}`} {...props} />;
}
