import { Switch, type SwitchProps } from "react-native";

import { colors } from "@/constants/theme";

// The native Switch, tinted with the brand. Not rebuilt: native styling is the
// design system for platform controls.
export function Toggle(props: Omit<SwitchProps, "trackColor" | "thumbColor" | "ios_backgroundColor">) {
  return (
    <Switch
      trackColor={{ false: colors.border, true: colors.primary }}
      thumbColor={colors.surface}
      ios_backgroundColor={colors.border}
      {...props}
    />
  );
}
