import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/components/ui";

import { AuthHeader } from "./auth-header";

// Shared shell for the auth screens: header, title, subtitle, and a scroll
// view that keeps the focused field and button above the keyboard.
export function AuthScreen({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "height" : undefined}
      className="flex-1 bg-surface"
    >
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6"
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 16,
        }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader />
        <Text variant="hero" className="mt-8">
          {title}
        </Text>
        <Text variant="body" tone="muted" className="mt-3">
          {subtitle}
        </Text>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
