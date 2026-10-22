import { useState } from "react";
import { Alert, View } from "react-native";

import { AppleIcon, Button, GoogleIcon } from "@/components/ui";
import { authErrorMessage } from "@/lib/auth/clerk-errors";
import { useGoogleSignIn } from "@/lib/auth/use-google-sign-in";

export function SocialButtons({
  disabled,
  onError,
}: {
  disabled?: boolean;
  onError: (message: string) => void;
}) {
  const [pending, setPending] = useState(false);
  const signInWithGoogle = useGoogleSignIn();

  async function google() {
    setPending(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      onError(authErrorMessage(e));
    } finally {
      setPending(false);
    }
  }

  return (
    <View className="gap-3">
      <Button
        title="Continue with Google"
        variant="secondary"
        icon={<GoogleIcon />}
        loading={pending}
        disabled={disabled}
        onPress={google}
      />
      <Button
        title="Continue with Apple"
        variant="secondary"
        icon={<AppleIcon />}
        disabled={disabled || pending}
        onPress={() => Alert.alert("Coming soon", "Sign in with Apple is on its way.")}
      />
    </View>
  );
}
