import { Link, Stack } from "expo-router";
import { View } from "react-native";

import { Button, Logo, Text } from "@/components/ui";

export default function Index() {
  return (
    <View className="flex-1 justify-center gap-4 bg-surface-muted px-4">
      <Stack.Screen options={{ headerShown: false }} />
      <Logo />
      <Text variant="heading" tone="muted" className="font-jakarta">
        Find unforgettable stays for every kind of trip.
      </Text>
      {__DEV__ ? (
        <Link href="/design-system" asChild>
          <Button title="Design system" variant="secondary" className="mt-6" />
        </Link>
      ) : null}
    </View>
  );
}
