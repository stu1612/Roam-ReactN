import { View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { colors } from "@/constants/theme";

const ACTIVE_WIDTH = 52;
const INACTIVE_WIDTH = 48;

/** `progress` is the scroll position in pages (0 = first slide). */
export function ProgressBars({ count, progress }: { count: number; progress: SharedValue<number> }) {
  return (
    <View className="flex-row gap-3" accessibilityElementsHidden importantForAccessibility="no">
      {Array.from({ length: count }, (_, i) => (
        <Bar key={i} index={i} progress={progress} />
      ))}
    </View>
  );
}

function Bar({ index, progress }: { index: number; progress: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const t = Math.max(0, 1 - Math.abs(progress.value - index));
    return {
      width: interpolate(t, [0, 1], [INACTIVE_WIDTH, ACTIVE_WIDTH]),
      backgroundColor: interpolateColor(t, [0, 1], [colors.surfaceMuted, colors.lavender]),
    };
  });
  return (
    <View className="h-1.5 overflow-hidden rounded-full">
      <Animated.View style={[{ height: "100%" }, style]} />
    </View>
  );
}
