import { ArrowRight } from "lucide-react-native";
import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";

import { colors, iconSize, iconStroke } from "@/constants/theme";

import { Text } from "./text";

const variants = {
  primary: "bg-primary",
  secondary: "bg-surface border border-border",
} as const;

const sizes = {
  lg: { container: "h-14 px-6 gap-3", text: "button" },
  sm: { container: "h-10 px-5 gap-2", text: "button-sm" },
} as const;

export type ButtonProps = {
  title: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Shown before the title, e.g. <GoogleIcon />. */
  icon?: ReactNode;
  /** Primary buttons show a trailing arrow ("Book this stay →"). */
  showArrow?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
};

export function Button({
  title,
  variant = "primary",
  size = "lg",
  icon,
  showArrow,
  loading,
  disabled,
  onPress,
  className,
}: ButtonProps) {
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={onPress}
      className={`flex-row items-center justify-center rounded-full ${variants[variant]} ${sizes[size].container} ${className ?? ""}`}
      style={({ pressed }) => ({ opacity: disabled ? 0.4 : pressed ? 0.7 : 1 })}
    >
      {loading ? (
        <ActivityIndicator color={colors.ink} />
      ) : (
        <>
          {icon}
          <Text variant={sizes[size].text} className={showArrow ? "flex-1 text-center" : undefined}>
            {title}
          </Text>
          {showArrow ? (
            <ArrowRight color={colors.ink} size={iconSize.lg} strokeWidth={iconStroke} />
          ) : null}
          {/* Balances the arrow so the title stays centered. */}
          {showArrow ? <View className="w-6" /> : null}
        </>
      )}
    </Pressable>
  );
}
