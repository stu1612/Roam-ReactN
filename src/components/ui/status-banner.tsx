import { CircleAlert, CircleCheck, X } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { colors, iconSize, iconStroke } from "@/constants/theme";

import { Text } from "./text";

const tones = {
  success: { container: "bg-success-soft border-success/20", text: "text-ink", color: colors.success, Icon: CircleCheck },
  error: { container: "bg-danger-soft border-danger/20", text: "text-danger", color: colors.danger, Icon: CircleAlert },
} as const;

// Named StatusBanner so it doesn't clash with React Native's Alert.
export function StatusBanner({
  message,
  tone,
  onDismiss,
  className,
}: {
  message: string;
  tone: keyof typeof tones;
  onDismiss?: () => void;
  className?: string;
}) {
  const t = tones[tone];
  return (
    <View
      accessibilityRole="alert"
      className={`min-h-12 flex-row items-center gap-3 rounded-md border px-4 py-3 ${t.container} ${className ?? ""}`}
      style={{ borderCurve: "continuous" }}
    >
      <t.Icon color={colors.surface} fill={t.color} size={iconSize.lg} strokeWidth={iconStroke} />
      <Text variant="caption" className={`flex-1 ${t.text}`}>
        {message}
      </Text>
      {onDismiss ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          hitSlop={12}
          onPress={onDismiss}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <X color={t.color} size={iconSize.md} strokeWidth={iconStroke} />
        </Pressable>
      ) : null}
    </View>
  );
}
