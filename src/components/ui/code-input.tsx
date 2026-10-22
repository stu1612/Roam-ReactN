import { useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";

import { Text } from "./text";

export type CodeInputProps = {
  value: string;
  onChangeText: (code: string) => void;
  /** Called once all digits are entered. */
  onComplete?: (code: string) => void;
  length?: number;
  error?: boolean;
  autoFocus?: boolean;
};

// One hidden TextInput drives the boxes, so paste and iOS one-time-code
// autofill fill every box at once.
export function CodeInput({
  value,
  onChangeText,
  onComplete,
  length = 6,
  error,
  autoFocus,
}: CodeInputProps) {
  const input = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      accessibilityLabel="Verification code"
      onPress={() => input.current?.focus()}
      className="flex-row gap-2"
    >
      {Array.from({ length }, (_, i) => {
        const active = focused && i === Math.min(value.length, length - 1);
        return (
          <View
            key={i}
            className={`h-16 flex-1 items-center justify-center rounded-field border-[1.5px] ${
              error
                ? "border-danger bg-danger-soft"
                : active
                  ? "border-lavender bg-lavender-soft"
                  : "border-surface-muted bg-surface-muted"
            }`}
            style={{ borderCurve: "continuous" }}
          >
            <Text variant="title">{value[i] ?? ""}</Text>
          </View>
        );
      })}
      <TextInput
        ref={input}
        value={value}
        onChangeText={(text) => {
          const code = text.replace(/\D/g, "").slice(0, length);
          onChangeText(code);
          if (code.length === length) onComplete?.(code);
        }}
        maxLength={length}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        caretHidden
        className="absolute size-px opacity-0"
      />
    </Pressable>
  );
}
