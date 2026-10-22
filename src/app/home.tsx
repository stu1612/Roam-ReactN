import { Link, router, Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Logo, Text } from "@/components/ui";

// Rebuild the stack as onboarding → sign in, so sign in keeps its back button
// the same way it has when reached from onboarding.
function signOut() {
  router.replace("/");
  router.push("/sign-in");
}

// Signed-in placeholder until the home screen is designed.
export default function Home() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }}
      className="flex-1 gap-4 bg-surface px-6"
    >
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <Logo height={40} />
      <Text variant="hero" className="mt-6">
        You&apos;re in
      </Text>
      <Text variant="body" tone="muted">
        Sign-in is mocked for now. Stays arrive with search.
      </Text>
      <View className="flex-1" />
      {__DEV__ ? (
        <Link href="/design-system" asChild>
          <Button title="Design system" variant="secondary" />
        </Link>
      ) : null}
      <Button title="Sign out" variant="secondary" onPress={signOut} />
    </View>
  );
}
