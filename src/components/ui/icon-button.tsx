import type { LucideIcon } from "lucide-react-native";
import { Pressable } from "react-native";

import { colors, iconSize, iconStroke } from "@/constants/theme";

const sizes = {
  md: { container: "size-14", icon: iconSize.lg },
  sm: { container: "size-8", icon: iconSize.sm },
} as const;

const variants = {
  muted: "bg-surface-muted",
  surface: "bg-surface",
} as const;

export type IconButtonProps = {
  icon: LucideIcon;
  accessibilityLabel: string;
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
  /** Fills the icon, e.g. a saved heart. */
  active?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
};

export function IconButton({
  icon: Icon,
  accessibilityLabel,
  size = "md",
  variant = "muted",
  active,
  disabled,
  onPress,
  className,
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled, selected: active }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={size === "sm" ? 8 : 0}
      className={`items-center justify-center rounded-full ${variants[variant]} ${sizes[size].container} ${className ?? ""}`}
      style={({ pressed }) => ({ opacity: disabled ? 0.4 : pressed ? 0.7 : 1 })}
    >
      <Icon
        color={colors.ink}
        fill={active ? colors.ink : "transparent"}
        size={sizes[size].icon}
        strokeWidth={iconStroke}
      />
    </Pressable>
  );
}
