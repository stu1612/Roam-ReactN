import type { LucideIcon } from "lucide-react-native";
import { Pressable } from "react-native";

import { colors, iconSize, iconStroke } from "@/constants/theme";

import { Text } from "./text";

export type ChipProps = {
  label: string;
  selected?: boolean;
  /** Category chips ("All Stays", "Cabins") carry an icon and select in yellow;
   *  filter chips ("Under $300") are text only and select in lavender. */
  icon?: LucideIcon;
  onPress?: () => void;
  className?: string;
};

export function Chip({ label, selected, icon: Icon, onPress, className }: ChipProps) {
  const selectedBg = Icon ? "bg-primary" : "bg-lavender";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      className={`flex-row items-center gap-2 rounded-full ${Icon ? "h-12 px-4" : "h-12 px-6"} ${
        selected ? selectedBg : "bg-surface-muted"
      } ${className ?? ""}`}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      {Icon ? (
        <Icon
          color={colors.ink}
          fill={selected ? colors.ink : "transparent"}
          size={selected ? iconSize.lg : iconSize.md}
          strokeWidth={iconStroke}
        />
      ) : null}
      <Text variant={Icon ? "caption" : "button-sm"}>{label}</Text>
    </Pressable>
  );
}
