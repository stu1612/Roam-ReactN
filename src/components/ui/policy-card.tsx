import { ChevronRight, type LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { colors, iconSize, iconStroke } from "@/constants/theme";

import { Text } from "./text";

export function PolicyCard({
  icon: Icon,
  title,
  description,
  onPress,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  onPress?: () => void;
  className?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`flex-row items-center gap-4 rounded-field bg-lavender-soft p-3 ${className ?? ""}`}
      style={({ pressed }) => ({ borderCurve: "continuous", opacity: pressed ? 0.7 : 1 })}
    >
      <View
        className="size-12 items-center justify-center rounded-md bg-lavender/40"
        style={{ borderCurve: "continuous" }}
      >
        <Icon color={colors.ink} size={iconSize.lg} strokeWidth={iconStroke} />
      </View>
      <View className="flex-1 gap-0.5">
        <Text variant="caption" className="font-jakarta-bold">
          {title}
        </Text>
        <Text variant="micro" tone="muted" className="font-jakarta">
          {description}
        </Text>
      </View>
      <ChevronRight color={colors.ink} size={iconSize.lg} strokeWidth={iconStroke} />
    </Pressable>
  );
}
