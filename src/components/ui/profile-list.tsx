import { ChevronRight, type LucideIcon } from "lucide-react-native";
import { Children, Fragment, type ReactNode } from "react";
import { Pressable, View } from "react-native";

import { colors, iconSize, iconStroke } from "@/constants/theme";

import { Text } from "./text";

// A grouped list: one white surface with hairlines, not a card per row.
export function ProfileList({ children, className }: { children: ReactNode; className?: string }) {
  const rows = Children.toArray(children);
  return (
    <View
      className={`overflow-hidden rounded-field border border-border bg-surface ${className ?? ""}`}
      style={{ borderCurve: "continuous" }}
    >
      {rows.map((row, i) => (
        <Fragment key={i}>
          {i > 0 ? <View className="ml-14 h-px bg-border" /> : null}
          {row}
        </Fragment>
      ))}
    </View>
  );
}

export function ProfileRow({
  icon: Icon,
  label,
  onPress,
}: {
  icon: LucideIcon;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-14 flex-row items-center gap-4 px-4"
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
    >
      <Icon color={colors.ink} size={iconSize.lg} strokeWidth={iconStroke} />
      <Text variant="caption" className="flex-1">
        {label}
      </Text>
      <ChevronRight color={colors.ink} size={iconSize.md} strokeWidth={iconStroke} />
    </Pressable>
  );
}
