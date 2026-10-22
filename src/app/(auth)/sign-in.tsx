import { useSignIn } from "@clerk/expo";
import { router } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
import { useRef, useState } from "react";
import { Alert, Pressable, type TextInput, View } from "react-native";

import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthScreen } from "@/components/auth/auth-screen";
import { OrDivider } from "@/components/auth/or-divider";
import { SocialButtons } from "@/components/auth/social-buttons";
import { Button, StatusBanner, Text, TextField } from "@/components/ui";
import { authErrorMessage } from "@/lib/auth/clerk-errors";
import { validateEmail } from "@/lib/auth/validation";

type Field = "email" | "password";

export default function SignIn() {
  const { signIn } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string>();
  const passwordRef = useRef<TextInput>(null);

  // Sign in only checks the password is present; length rules are for sign up.
  const errors = {
    email: validateEmail(email),
    password: password ? undefined : "Enter your password",
  };
  const shown = (f: Field) => (touched[f] ? errors[f] : undefined);
  const touch = (f: Field) => setTouched((t) => ({ ...t, [f]: true }));

  async function submit() {
    setTouched({ email: true, password: true });
    setFormError(undefined);
    if (errors.email || errors.password) return;
    setSubmitting(true);
    try {
      const attempt = await signIn.password({ emailAddress: email.trim(), password });
      if (attempt.error) throw attempt.error;
      if (signIn.status === "complete") {
        // The root layout's guards move to home once the session is active.
        const done = await signIn.finalize();
        if (done.error) throw done.error;
        return;
      }
      // New device (device trust) or email-code second factor: confirm by code.
      const canEmail = signIn.supportedSecondFactors?.some((f) => f.strategy === "email_code");
      if (
        (signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor") &&
        canEmail
      ) {
        const sent = await signIn.mfa.sendEmailCode();
        if (sent.error) throw sent.error;
        router.push({ pathname: "/verify", params: { email: email.trim(), flow: "sign-in" } });
        return;
      }
      throw new Error(`Unhandled sign-in status: ${signIn.status}`);
    } catch (e) {
      setFormError(authErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthScreen
      title={"Welcome\nback"}
      subtitle="Sign in to see your saved stays and pick up where you left off."
    >
      <View className="mt-6 gap-4">
        <TextField
          icon={Mail}
          label="Email address"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          onBlur={() => touch("email")}
          error={shown("email")}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <TextField
          ref={passwordRef}
          icon={Lock}
          label="Password"
          placeholder="Your password"
          value={password}
          onChangeText={setPassword}
          onBlur={() => touch("password")}
          error={shown("password")}
          secure
          textContentType="password"
          autoComplete="current-password"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        hitSlop={12}
        onPress={() => Alert.alert("Coming soon", "Password reset arrives with real accounts.")}
        className="mt-3 self-end"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <Text variant="caption">Forgot password?</Text>
      </Pressable>

      {formError ? (
        <StatusBanner
          tone="error"
          message={formError}
          onDismiss={() => setFormError(undefined)}
          className="mt-4"
        />
      ) : null}

      <Button title="Sign in" showArrow loading={submitting} onPress={submit} className="mt-6" />
      <OrDivider className="my-5" />
      <SocialButtons disabled={submitting} onError={setFormError} />
      <AuthFooter
        prompt="New to roam?"
        action="Sign up"
        onPress={() => router.replace("/sign-up")}
        className="mt-6"
      />
    </AuthScreen>
  );
}
