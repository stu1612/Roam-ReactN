import { Search, SlidersHorizontal } from "lucide-react-native";
import { Pressable } from "react-native";

import { colors, iconSize, iconStroke } from "@/constants/theme";

import { TextField, type TextFieldProps } from "./text-field";

export type SearchFieldProps = Omit<TextFieldProps, "icon" | "secure" | "trailing"> & {
  onFiltersPress?: () => void;
};

export function SearchField({ onFiltersPress, ...props }: SearchFieldProps) {
  return (
    <TextField
      icon={Search}
      returnKeyType="search"
      accessibilityLabel="Search stays"
      trailing={
        onFiltersPress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Filters"
            hitSlop={12}
            onPress={onFiltersPress}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <SlidersHorizontal color={colors.ink} size={iconSize.lg} strokeWidth={iconStroke} />
          </Pressable>
        ) : null
      }
      {...props}
    />
  );
}
