import { Minus, Plus, type LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { colors, iconSize, iconStroke } from "@/constants/theme";

import { Text } from "./text";

function StepButton({
  icon: Icon,
  label,
  disabled,
  onPress,
}: {
  icon: LucideIcon;
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={4}
      className="size-11 items-center justify-center rounded-full"
      style={({ pressed }) => ({ opacity: disabled ? 0.3 : pressed ? 0.6 : 1 })}
    >
      <Icon color={colors.ink} size={iconSize.md} strokeWidth={iconStroke} />
    </Pressable>
  );
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = Infinity,
  label = "Count",
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** What is being counted, for screen readers ("Guests"). */
  label?: string;
  className?: string;
}) {
  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ now: value, min, max: Number.isFinite(max) ? max : undefined }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === "increment" && value < max) onChange(value + 1);
        if (e.nativeEvent.actionName === "decrement" && value > min) onChange(value - 1);
      }}
      className={`h-14 flex-row items-center gap-3 self-start rounded-full border border-border bg-surface px-1.5 ${className ?? ""}`}
    >
      <StepButton icon={Minus} label={`Decrease ${label}`} disabled={value <= min} onPress={() => onChange(value - 1)} />
      <Text variant="title" className="min-w-6 text-center">
        {value}
      </Text>
      <StepButton icon={Plus} label={`Increase ${label}`} disabled={value >= max} onPress={() => onChange(value + 1)} />
    </View>
  );
}
