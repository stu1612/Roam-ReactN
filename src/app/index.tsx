import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, useWindowDimensions, View } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CURVE_HEIGHT } from "@/components/onboarding/curved-top";
import { OnboardingSlide } from "@/components/onboarding/onboarding-slide";
import { ProgressBars } from "@/components/onboarding/progress-bars";
import { slides } from "@/components/onboarding/slides";
import { Button, GoogleIcon, Logo, Text } from "@/components/ui";

/** Space between the slide text and the buttons. */
const TEXT_GAP = 24;

export default function Onboarding() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // Slide area and tallest slide text, measured, so the card always fits
  // above the buttons whatever the copy length or screen size.
  const [listHeight, setListHeight] = useState(0);
  const [textHeight, setTextHeight] = useState(0);
  const fitted = listHeight - textHeight - CURVE_HEIGHT - TEXT_GAP;
  const cardTop = Math.round(
    listHeight && textHeight ? Math.min(height * 0.58, fitted) : height * 0.58,
  );
  const progress = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    progress.value = e.contentOffset.x / width;
  });

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      <Animated.FlatList
        data={slides}
        keyExtractor={(s) => s.location}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onLayout={(e) => setListHeight(e.nativeEvent.layout.height)}
        renderItem={({ item }) => (
          <OnboardingSlide
            slide={item}
            width={width}
            cardTop={cardTop}
            onTextLayout={(h) => setTextHeight((prev) => Math.max(prev, h))}
          />
        )}
      />

      <View
        pointerEvents="box-none"
        style={{ paddingTop: insets.top + 8 }}
        className="absolute inset-x-0 top-0 flex-row items-center justify-between px-6"
      >
        <Logo height={40} />
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/sign-in")}
          className="h-12 justify-center rounded-full bg-glass px-5"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Text variant="button-sm">Skip</Text>
        </Pressable>
      </View>

      <View
        pointerEvents="none"
        style={{ top: cardTop + CURVE_HEIGHT - 12 }}
        className="absolute left-6"
      >
        <ProgressBars count={slides.length} progress={progress} />
      </View>

      <View style={{ paddingBottom: insets.bottom + 4 }} className="gap-3 bg-surface px-6 pt-3">
        <Button title="Get started" showArrow onPress={() => router.push("/sign-up")} />
        <Button
          title="Continue with Google"
          variant="secondary"
          icon={<GoogleIcon />}
          onPress={() => router.push("/sign-in")}
        />
      </View>
    </View>
  );
}
