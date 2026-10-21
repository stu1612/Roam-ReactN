import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import type { LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

import { colors, iconSize, iconStroke } from "@/constants/theme";

import { Text } from "./text";

export type TabItem = { key: string; label: string; icon: LucideIcon };

const glass = isLiquidGlassAvailable();

function Surface({ children }: { children: ReactNode }) {
  const layout = "h-[72px] flex-row items-center rounded-full px-2 shadow-raised";
  // Liquid Glass on iOS 26+; translucent white elsewhere (Android, older iOS).
  // GlassView doesn't take className, so it fills a styled wrapper.
  return (
    <View className={`${layout} overflow-hidden ${glass ? "" : "border border-surface bg-glass"}`}>
      {glass ? (
        <GlassView glassEffectStyle="regular" style={{ position: "absolute", inset: 0 }} />
      ) : null}
      {children}
    </View>
  );
}

export function GlassTabBar({
  items,
  activeKey,
  onSelect,
  className,
}: {
  items: TabItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  className?: string;
}) {
  return (
    <View accessibilityRole="tablist" className={className}>
      <Surface>
        {items.map(({ key, label, icon: Icon }) => {
          const active = key === activeKey;
          return (
            <Pressable
              key={key}
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected: active }}
              onPress={() => onSelect(key)}
              className="flex-1 items-center"
              style={({ pressed }) => ({ opacity: pressed && !active ? 0.6 : 1 })}
            >
              <View
                className={`size-16 items-center justify-center gap-0.5 rounded-full ${
                  active ? "bg-primary shadow-glow" : ""
                }`}
              >
                <Icon
                  color={colors.ink}
                  fill={active ? colors.ink : "transparent"}
                  size={iconSize.lg}
                  strokeWidth={iconStroke}
                />
                <Text variant="micro">{label}</Text>
              </View>
            </Pressable>
          );
        })}
      </Surface>
    </View>
  );
}
