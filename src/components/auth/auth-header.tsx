import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { Logo } from "@/components/ui";
import { colors, iconSize, iconStroke } from "@/constants/theme";

export function AuthHeader() {
  return (
    <View className="flex-row items-center justify-between">
      {router.canGoBack() ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.back()}
          className="size-12 items-center justify-center rounded-full border border-border bg-surface"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <ChevronLeft
            color={colors.ink}
            size={iconSize.lg}
            strokeWidth={iconStroke}
          />
        </Pressable>
      ) : (
        <View className="size-12" />
      )}
      <Logo height={26} />
    </View>
  );
}
