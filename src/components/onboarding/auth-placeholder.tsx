import { Link, router } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Logo, Text } from "@/components/ui";

// Stand-in until Clerk custom flows are built (see prompts/03-onboarding.md).
export function AuthPlaceholder({ title }: { title: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }}
      className="flex-1 gap-4 bg-surface px-6"
    >
      <Logo height={40} />
      <Text variant="hero" className="mt-6">
        {title}
      </Text>
      <Text variant="body" tone="muted">
        Coming soon. Accounts arrive with the Clerk sign-in flow.
      </Text>
      <View className="flex-1" />
      {__DEV__ ? (
        <Link href="/design-system" asChild>
          <Button title="Design system" variant="secondary" />
        </Link>
      ) : null}
      <Button title="Back" variant="secondary" onPress={() => router.back()} />
    </View>
  );
}
