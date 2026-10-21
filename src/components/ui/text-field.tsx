import { Eye, EyeOff, type LucideIcon } from "lucide-react-native";
import { type ReactNode, useState } from "react";
import { Pressable, TextInput, type TextInputProps, View } from "react-native";

import { colors, iconSize, iconStroke } from "@/constants/theme";

export type TextFieldProps = Omit<TextInputProps, "secureTextEntry"> & {
  icon: LucideIcon;
  /** Masks input and adds a show/hide toggle. */
  secure?: boolean;
  /** Replaces the trailing slot, e.g. a filter button. */
  trailing?: ReactNode;
  className?: string;
};

export function TextField({
  icon: Icon,
  secure,
  trailing,
  className,
  onFocus,
  onBlur,
  ...props
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View
      className={`h-14 flex-row items-center gap-3 rounded-field border-[1.5px] px-4 ${
        focused ? "border-lavender bg-lavender-soft" : "border-border bg-surface-muted"
      } ${className ?? ""}`}
      style={{ borderCurve: "continuous" }}
    >
      <Icon color={colors.ink} size={iconSize.lg} strokeWidth={iconStroke} />
      <TextInput
        className="flex-1 font-jakarta text-body text-ink"
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
      {secure ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={hidden ? "Show password" : "Hide password"}
          hitSlop={12}
          onPress={() => setHidden((h) => !h)}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          {hidden ? (
            <EyeOff color={colors.ink} size={iconSize.lg} strokeWidth={iconStroke} />
          ) : (
            <Eye color={colors.ink} size={iconSize.lg} strokeWidth={iconStroke} />
          )}
        </Pressable>
      ) : (
        trailing
      )}
    </View>
  );
}
