import { Image } from "expo-image";
import { MapPin } from "lucide-react-native";
import { View } from "react-native";

import { Text } from "@/components/ui";
import { colors, iconSize, iconStroke } from "@/constants/theme";

import { CURVE_HEIGHT, CurvedTop } from "./curved-top";
import type { Slide } from "./slides";

type Props = {
  slide: Slide;
  width: number;
  /** Where the white card's curved edge starts. */
  cardTop: number;
  /** Reports the text block's height so the screen can fit the card above the buttons. */
  onTextLayout: (height: number) => void;
};

export function OnboardingSlide({ slide, width, cardTop, onTextLayout }: Props) {
  return (
    <View style={{ width }} className="flex-1 bg-surface">
      <View
        style={{ height: cardTop + CURVE_HEIGHT }}
        className="absolute inset-x-0 top-0"
      >
        <Image
          source={slide.photo}
          contentFit="cover"
          transition={200}
          style={{ flex: 1 }}
          accessibilityIgnoresInvertColors
        />
      </View>

      <View
        style={{ top: cardTop - 56 }}
        className="absolute left-6 h-12 flex-row items-center gap-2 rounded-full bg-scrim px-4"
      >
        <MapPin
          color={colors.surface}
          fill={colors.surface}
          size={iconSize.md}
          strokeWidth={iconStroke}
        />
        <Text variant="caption" className="text-surface">
          {slide.location}
        </Text>
      </View>

      <View style={{ top: cardTop }} className="absolute inset-x-0">
        <CurvedTop width={width} />
        {/* Leaves room for the progress bars, which sit above the slides. */}
        <View
          onLayout={(e) => onTextLayout(e.nativeEvent.layout.height)}
          className="gap-3 bg-surface px-6 pt-5"
        >
          <Text variant="hero">{slide.title}</Text>
          <Text variant="body" tone="muted">
            {slide.body}
          </Text>
        </View>
      </View>
    </View>
  );
}
