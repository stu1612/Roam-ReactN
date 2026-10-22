import { useSignUp } from "@clerk/expo";
import { router } from "expo-router";
import { Lock, Mail, User } from "lucide-react-native";
import { useRef, useState } from "react";
import { type TextInput, View } from "react-native";

import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthScreen } from "@/components/auth/auth-screen";
import { OrDivider } from "@/components/auth/or-divider";
import { SocialButtons } from "@/components/auth/social-buttons";
import { Button, StatusBanner, TextField } from "@/components/ui";
import { authErrorMessage } from "@/lib/auth/clerk-errors";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "@/lib/auth/validation";

type Field = "name" | "email" | "password";

export default function SignUp() {
  const { signUp } = useSignUp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Errors show once a field is left or the form is submitted, then update live.
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string>();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const errors = {
    name: validateName(name),
    email: validateEmail(email),
    password: validatePassword(password),
  };
  const shown = (f: Field) => (touched[f] ? errors[f] : undefined);
  const touch = (f: Field) => setTouched((t) => ({ ...t, [f]: true }));

  async function submit() {
    setTouched({ name: true, email: true, password: true });
    setFormError(undefined);
    if (errors.name || errors.email || errors.password) return;
    setSubmitting(true);
    try {
      const [firstName, ...rest] = name.trim().split(/\s+/);
      const created = await signUp.password({
        emailAddress: email.trim(),
        password,
        firstName,
        lastName: rest.join(" ") || undefined,
      });
      if (created.error) throw created.error;
      const sent = await signUp.verifications.sendEmailCode();
      if (sent.error) throw sent.error;
      router.push({
        pathname: "/verify",
        params: { email: email.trim(), flow: "sign-up" },
      });
    } catch (e) {
      setFormError(authErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthScreen
      title={"Create\nyour account"}
      subtitle="Join roam to save your stays, get personalized recommendations and access them across all your devices."
    >
      <View className="mt-6 gap-4">
        <TextField
          icon={User}
          label="Full name"
          placeholder="e.g. Atlas Rider"
          value={name}
          onChangeText={setName}
          onBlur={() => touch("name")}
          error={shown("name")}
          textContentType="name"
          autoComplete="name"
          autoCapitalize="words"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => emailRef.current?.focus()}
        />
        <TextField
          ref={emailRef}
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
          placeholder="At least 8 characters"
          value={password}
          onChangeText={setPassword}
          onBlur={() => touch("password")}
          error={shown("password")}
          secure
          textContentType="newPassword"
          autoComplete="new-password"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
      </View>

      {formError ? (
        <StatusBanner
          tone="error"
          message={formError}
          onDismiss={() => setFormError(undefined)}
          className="mt-4"
        />
      ) : null}

      {/* Mount point for Clerk's bot protection. */}
      <View nativeID="clerk-captcha" />

      <Button
        title="Create account"
        showArrow
        loading={submitting}
        onPress={submit}
        className="mt-6"
      />
      <OrDivider className="my-5" />
      <SocialButtons disabled={submitting} onError={setFormError} />
      <AuthFooter
        prompt="Already have an account?"
        action="Sign in"
        onPress={() => router.replace("/sign-in")}
        className="mt-6"
      />
    </AuthScreen>
  );
}
