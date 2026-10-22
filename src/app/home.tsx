import { useClerk, useUser } from "@clerk/expo";
import { Link, Stack } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Logo, Text } from "@/components/ui";

// Signed-in placeholder until the home screen is designed.
export default function Home() {
  const insets = useSafeAreaInsets();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [signingOut, setSigningOut] = useState(false);

  // The root layout's guards move to onboarding once the session ends.
  async function onSignOut() {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  }
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
        Signed in as {user?.primaryEmailAddress?.emailAddress}. Stays arrive with search.
      </Text>
      <View className="flex-1" />
      {__DEV__ ? (
        <Link href="/design-system" asChild>
          <Button title="Design system" variant="secondary" />
        </Link>
      ) : null}
      <Button title="Sign out" variant="secondary" loading={signingOut} onPress={onSignOut} />
    </View>
  );
}
