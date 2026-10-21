import { Star } from "lucide-react-native";
import { View } from "react-native";

import { colors, iconSize, iconStroke } from "@/constants/theme";

import { Text } from "./text";

const tones = {
  favorite: "bg-primary-soft",
  success: "bg-success-soft",
  danger: "bg-danger-soft",
  lavender: "bg-lavender-soft",
} as const;

const textTones = {
  favorite: "text-ink",
  success: "text-success",
  danger: "text-danger",
  lavender: "text-ink",
} as const;

export function Badge({
  label,
  tone = "lavender",
  className,
}: {
  label: string;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <View
      className={`h-10 flex-row items-center gap-2 self-start rounded-full px-5 ${tones[tone]} ${className ?? ""}`}
    >
      {tone === "favorite" ? (
        <Star color={colors.ink} fill={colors.primary} size={iconSize.md} strokeWidth={iconStroke} />
      ) : null}
      <Text variant="button-sm" className={textTones[tone]}>
        {label}
      </Text>
    </View>
  );
}
