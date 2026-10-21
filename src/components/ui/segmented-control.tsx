import type { LucideIcon } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

import { colors, iconSize, iconStroke, motion } from "@/constants/theme";

import { Text } from "./text";

export type Segment = { label: string; icon?: LucideIcon };

export function SegmentedControl({
  segments,
  selectedIndex,
  onChange,
  className,
}: {
  segments: Segment[];
  selectedIndex: number;
  onChange: (index: number) => void;
  className?: string;
}) {
  const [width, setWidth] = useState(0);
  const segmentWidth = width / segments.length;

  const thumbStyle = useAnimatedStyle(() => ({
    width: segmentWidth,
    transform: [{ translateX: withTiming(selectedIndex * segmentWidth, { duration: motion.base }) }],
  }));

  return (
    <View
      accessibilityRole="tablist"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width - 8)}
      className={`h-14 flex-row rounded-full bg-surface-muted p-1 ${className ?? ""}`}
    >
      {width > 0 ? (
        <Animated.View style={[{ position: "absolute", top: 4, bottom: 4, left: 4 }, thumbStyle]}>
          <View className="flex-1 rounded-full bg-ink" />
        </Animated.View>
      ) : null}
      {segments.map(({ label, icon: Icon }, i) => {
        const selected = i === selectedIndex;
        const tint = selected ? colors.surface : colors.ink;
        return (
          <Pressable
            key={label}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(i)}
            className="flex-1 flex-row items-center justify-center gap-2"
            style={({ pressed }) => ({ opacity: pressed && !selected ? 0.7 : 1 })}
          >
            {Icon ? <Icon color={tint} size={iconSize.md} strokeWidth={iconStroke} /> : null}
            <Text variant="caption" className={selected ? "text-surface" : "text-ink"}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
