import { Pressable, View } from "react-native";

import { Text } from "@/components/ui";

/** "Already have an account? Sign in" style link row. */
export function AuthFooter({
  prompt,
  action,
  onPress,
  className,
}: {
  prompt: string;
  action: string;
  onPress: () => void;
  className?: string;
}) {
  return (
    <View className={`flex-row items-center justify-center gap-2 ${className ?? ""}`}>
      <Text variant="caption" tone="muted">
        {prompt}
      </Text>
      <Pressable
        accessibilityRole="link"
        hitSlop={12}
        onPress={onPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <Text variant="caption" className="font-jakarta-bold underline">
          {action}
        </Text>
      </Pressable>
    </View>
  );
}
