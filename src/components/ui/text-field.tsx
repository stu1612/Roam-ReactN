import { Eye, EyeOff, type LucideIcon } from "lucide-react-native";
import { type ReactNode, type Ref, useState } from "react";
import { Pressable, TextInput, type TextInputProps, View } from "react-native";

import { colors, iconSize, iconStroke } from "@/constants/theme";

import { Text } from "./text";

export type TextFieldProps = Omit<TextInputProps, "secureTextEntry"> & {
  ref?: Ref<TextInput>;
  icon: LucideIcon;
  /** Masks input and adds a show/hide toggle. */
  secure?: boolean;
  /** Replaces the trailing slot, e.g. a filter button. */
  trailing?: ReactNode;
  /** Two-line field: label above the input (auth forms). */
  label?: string;
  /** Shown under the field; turns the border danger. */
  error?: string;
  className?: string;
};

export function TextField({
  icon: Icon,
  secure,
  trailing,
  label,
  error,
  className,
  onFocus,
  onBlur,
  ...props
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const input = (
    // leading-none: iOS draws TextInput text at the bottom of a taller line
    // box, so text-body's 1.5 line height pushed it down and clipped it.
    <TextInput
      accessibilityLabel={label}
      className={`font-jakarta text-body leading-none text-ink ${label ? "h-6 p-0" : "flex-1"}`}
      placeholderTextColor={colors.inkMuted}
      selectionColor={colors.lavender}
      cursorColor={colors.lavender}
      secureTextEntry={secure && hidden}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      {...props}
    />
  );

  const field = (
    <View
      className={`flex-row items-center border-[1.5px] px-4 ${
        label ? "h-18 gap-5 rounded-card" : "h-14 gap-3 rounded-field"
      } ${
        error
          ? "border-danger bg-danger-soft"
          : focused
            ? "border-lavender bg-lavender-soft"
            : label
              ? "border-surface-muted bg-surface-muted"
              : "border-border bg-surface-muted"
      } ${label || error ? "" : (className ?? "")}`}
      style={{ borderCurve: "continuous" }}
    >
      <Icon color={colors.ink} size={iconSize.lg} strokeWidth={iconStroke} />
      {label ? (
        <View className="flex-1 gap-2">
          <Text variant="button-sm">{label}</Text>
          {input}
        </View>
      ) : (
        input
      )}
      {secure ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={hidden ? "Show password" : "Hide password"}
          hitSlop={12}
          onPress={() => setHidden((h) => !h)}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          {hidden ? (
            <EyeOff
              color={colors.ink}
              size={iconSize.lg}
              strokeWidth={iconStroke}
            />
          ) : (
            <Eye
              color={colors.ink}
              size={iconSize.lg}
              strokeWidth={iconStroke}
            />
          )}
        </Pressable>
      ) : (
        trailing
      )}
    </View>
  );

  if (!label && !error) return field;
  return (
    <View className={`gap-1.5 ${className ?? ""}`}>
      {field}
      {error ? (
        <Text variant="caption" className="px-1 text-danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
