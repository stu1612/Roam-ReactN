import { useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Platform } from "react-native";

// Browser OAuth through Clerk (works in Expo Go). Resolves true when a session
// was created; the root layout's guards then move the guest to home. A
// cancelled browser resolves false without an error.
export function useGoogleSignIn() {
  const { startSSOFlow } = useSSO();

  // Warm up the Android browser so the sheet opens quickly.
  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => void WebBrowser.coolDownAsync();
  }, []);

  return async function signInWithGoogle() {
    const { createdSessionId, setActive } = await startSSOFlow({
      strategy: "oauth_google",
      redirectUrl: AuthSession.makeRedirectUri(),
    });
    if (!createdSessionId || !setActive) return false;
    await setActive({ session: createdSessionId });
    return true;
  };
}
