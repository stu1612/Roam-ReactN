import { Image } from "expo-image";
import { Heart, MapPin, Star, type LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { colors, iconSize, iconStroke } from "@/constants/theme";

import { IconButton } from "./icon-button";
import { Text } from "./text";

export type ListingAmenity = { label: string; icon: LucideIcon };

export type ListingCardProps = {
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  imageUri: string;
  amenities?: ListingAmenity[];
  saved?: boolean;
  onToggleSave?: () => void;
  onPress?: () => void;
  className?: string;
};

export function ListingCard({
  title,
  location,
  rating,
  reviewCount,
  pricePerNight,
  imageUri,
  amenities = [],
  saved,
  onToggleSave,
  onPress,
  className,
}: ListingCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${location}, rated ${rating}, $${pricePerNight} a night`}
      onPress={onPress}
      className={`flex-row gap-4 rounded-card bg-surface p-2 shadow-card ${className ?? ""}`}
      style={({ pressed }) => ({ borderCurve: "continuous", opacity: pressed ? 0.85 : 1 })}
    >
      <View>
        {/* expo-image doesn't take className, so the wrapper sizes and clips it. */}
        <View className="h-40 w-40 overflow-hidden rounded-field bg-surface-muted" style={{ borderCurve: "continuous" }}>
          <Image
            source={{ uri: imageUri }}
            contentFit="cover"
            transition={200}
            accessibilityIgnoresInvertColors
            style={{ flex: 1 }}
          />
        </View>
        {onToggleSave ? (
          <IconButton
            icon={Heart}
            size="sm"
            variant="surface"
            active={saved}
            accessibilityLabel={saved ? "Remove from saved" : "Save stay"}
            onPress={onToggleSave}
            className="absolute top-2 right-2"
          />
        ) : null}
      </View>

      <View className="flex-1 justify-center gap-1.5 py-1">
        <Text variant="title" numberOfLines={2}>
          {title}
        </Text>
        <View className="flex-row items-center gap-1">
          <MapPin color={colors.inkMuted} size={iconSize.sm} strokeWidth={iconStroke} />
          <Text variant="caption" tone="muted" className="font-jakarta" numberOfLines={1}>
            {location}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Star color={colors.primary} fill={colors.primary} size={iconSize.sm} strokeWidth={iconStroke} />
          <Text variant="caption">{rating.toFixed(1)}</Text>
          <Text variant="caption" tone="muted" className="font-jakarta">
            ({reviewCount})
          </Text>
        </View>
        {amenities.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {amenities.slice(0, 2).map(({ label, icon: Icon }) => (
              <View key={label} className="h-7 flex-row items-center gap-1.5 rounded-sm bg-surface-muted px-2">
                <Icon color={colors.ink} size={iconSize.sm} strokeWidth={iconStroke} />
                <Text variant="micro">{label}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <View className="flex-row items-baseline gap-1">
          <Text variant="title">${pricePerNight}</Text>
          <Text variant="caption" tone="muted" className="font-jakarta">
            / night
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
