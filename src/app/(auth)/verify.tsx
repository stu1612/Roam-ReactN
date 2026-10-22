import { useSignIn, useSignUp } from "@clerk/expo";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import { AuthScreen } from "@/components/auth/auth-screen";
import { Button, CodeInput, StatusBanner, Text } from "@/components/ui";
import { authErrorMessage } from "@/lib/auth/clerk-errors";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function Verify() {
  // One screen confirms both a new sign-up's email and a sign-in on a new device.
  const { email, flow } = useLocalSearchParams<{ email?: string; flow?: "sign-up" | "sign-in" }>();
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  async function submit(value = code) {
    if (value.length < CODE_LENGTH || submitting) return;
    setError(undefined);
    setNotice(undefined);
    setSubmitting(true);
    try {
      // The root layout's guards move to home once the session is active.
      if (flow === "sign-in") {
        const checked = await signIn.mfa.verifyEmailCode({ code: value });
        if (checked.error) throw checked.error;
        if (signIn.status !== "complete") throw new Error(`Unhandled sign-in status: ${signIn.status}`);
        const done = await signIn.finalize();
        if (done.error) throw done.error;
      } else {
        const checked = await signUp.verifications.verifyEmailCode({ code: value });
        if (checked.error) throw checked.error;
        if (signUp.status !== "complete") throw new Error(`Unhandled sign-up status: ${signUp.status}`);
        const done = await signUp.finalize();
        if (done.error) throw done.error;
      }
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  async function resend() {
    setCooldown(RESEND_SECONDS);
    setError(undefined);
    try {
      const sent =
        flow === "sign-in"
          ? await signIn.mfa.sendEmailCode()
          : await signUp.verifications.sendEmailCode();
      if (sent.error) throw sent.error;
      setNotice("We sent you a new code.");
    } catch (e) {
      setError(authErrorMessage(e));
    }
  }

  return (
    <AuthScreen
      title={"Check\nyour email"}
      subtitle={
        <>
          We sent a 6-digit code to{" "}
          <Text variant="body" className="font-jakarta-medium">
            {email ?? "your email"}
          </Text>
          .
        </>
      }
    >
      <View className="mt-8">
        <CodeInput
          value={code}
          onChangeText={(c) => {
            setCode(c);
            if (error) setError(undefined);
          }}
          onComplete={submit}
          length={CODE_LENGTH}
          error={!!error}
          autoFocus
        />
      </View>

      {error || notice ? (
        <StatusBanner
          tone={error ? "error" : "success"}
          message={(error ?? notice) as string}
          className="mt-4"
        />
      ) : null}

      <Button
        title="Verify"
        showArrow
        loading={submitting}
        disabled={code.length < CODE_LENGTH}
        onPress={() => submit()}
        className="mt-6"
      />

      <View className="mt-6 flex-row items-center justify-center gap-2">
        <Text variant="caption" tone="muted">
          Didn&apos;t get it?
        </Text>
        {cooldown > 0 ? (
          <Text variant="caption" tone="muted">
            Resend in 0:{String(cooldown).padStart(2, "0")}
          </Text>
        ) : (
          <Pressable
            accessibilityRole="button"
            hitSlop={12}
            onPress={resend}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Text variant="caption" className="font-jakarta-bold underline">
              Resend code
            </Text>
          </Pressable>
        )}
      </View>
    </AuthScreen>
  );
}
