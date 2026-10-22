import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { AppleIcon, Button, GoogleIcon } from "@/components/ui";
import { authErrorMessage, type OAuthProvider, signInWithOAuth } from "@/lib/auth/mock-auth";

export function SocialButtons({
  disabled,
  onError,
}: {
  disabled?: boolean;
  onError: (message: string) => void;
}) {
  const [pending, setPending] = useState<OAuthProvider | null>(null);

  async function start(provider: OAuthProvider) {
    setPending(provider);
    try {
      await signInWithOAuth(provider);
      if (router.canDismiss()) router.dismissAll();
      router.replace("/home");
    } catch (e) {
      onError(authErrorMessage(e));
    } finally {
      setPending(null);
    }
  }

  const busy = disabled || pending !== null;
  return (
    <View className="gap-3">
      <Button
        title="Continue with Google"
        variant="secondary"
        icon={<GoogleIcon />}
        loading={pending === "google"}
        disabled={busy && pending !== "google"}
        onPress={() => start("google")}
      />
      <Button
        title="Continue with Apple"
        variant="secondary"
        icon={<AppleIcon />}
        loading={pending === "apple"}
        disabled={busy && pending !== "apple"}
        onPress={() => start("apple")}
      />
    </View>
  );
}
