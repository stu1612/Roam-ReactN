import { Stack } from "expo-router";
import {
  Bath,
  Bookmark,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  Heart,
  Home,
  List,
  Lock,
  Mail,
  Map,
  MapPin,
  MessageSquareMore,
  PawPrint,
  Search,
  Settings,
  Share,
  SlidersHorizontal,
  Sailboat,
  Tent,
  TreePalm,
  TreePine,
  User,
  Luggage,
} from "lucide-react-native";
import { type ReactNode, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  AppleIcon,
  Badge,
  Button,
  Chip,
  CodeInput,
  GlassTabBar,
  GoogleIcon,
  IconButton,
  ListingCard,
  Logo,
  PolicyCard,
  ProfileList,
  ProfileRow,
  SearchField,
  SegmentedControl,
  StatusBanner,
  Stepper,
  Text,
  TextField,
  Toggle,
} from "@/components/ui";
import { colors, iconSize, iconStroke } from "@/constants/theme";

// Dev-only gallery of every design-system component, in the order of the
// design sheet, for comparing against the design on device.

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-4 rounded-card bg-surface p-4" style={{ borderCurve: "continuous" }}>
      <Text variant="title">{title}</Text>
      {children}
    </View>
  );
}

const swatches = [
  ["Primary Yellow", "bg-primary"],
  ["Lavender", "bg-lavender"],
  ["Text Primary", "bg-ink"],
  ["Text Secondary", "bg-ink-muted"],
  ["Surface White", "bg-surface border border-border"],
  ["Surface Gray", "bg-surface-muted"],
  ["Border Gray", "bg-border"],
  ["Glass Blur", "bg-glass border border-border"],
  ["Scrim", "bg-scrim"],
] as const;

const filters = ["Cabins", "Under $300", "Pet Friendly", "Quiet"];
const categories = [
  { label: "All Stays", icon: Home },
  { label: "Cabins", icon: TreePine },
  { label: "Beach", icon: Sailboat },
  { label: "City", icon: Building2 },
  { label: "Villas", icon: TreePalm },
];
const tabs = [
  { key: "home", label: "Home", icon: Home },
  { key: "search", label: "Search", icon: Search },
  { key: "trips", label: "Trips", icon: Calendar },
  { key: "profile", label: "Profile", icon: User },
];
const glyphs = [Home, Search, Heart, Calendar, User, Settings, MapPin, SlidersHorizontal];

export default function DesignSystem() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState("Cabins");
  const [category, setCategory] = useState("All Stays");
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState("home");
  const [segment, setSegment] = useState(0);
  const [toggle, setToggle] = useState(true);
  const [count, setCount] = useState(1);
  const [banners, setBanners] = useState({ success: true, error: true });
  const [name, setName] = useState("Joanna Smith");
  const [code, setCode] = useState("12");

  return (
    <>
      <Stack.Screen options={{ title: "Design system" }} />
      <ScrollView
        className="flex-1 bg-surface-muted"
        contentContainerClassName="gap-4 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        keyboardShouldPersistTaps="handled"
      >
        <Section title="01. Brand">
          <Logo />
          <Text variant="heading" tone="muted" className="font-jakarta">
            Find unforgettable stays for every kind of trip.
          </Text>
        </Section>

        <Section title="02. Color palette">
          <View className="flex-row flex-wrap gap-3">
            {swatches.map(([label, cls]) => (
              <View key={label} className="w-[22%] gap-1">
                <View className={`h-14 rounded-md ${cls}`} style={{ borderCurve: "continuous" }} />
                <Text variant="micro">{label}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="03. Typography">
          <Text variant="display">Find your next stay</Text>
          <Text variant="hero">Find a stay that fits your story</Text>
          <Text variant="heading">Modern Cabin with Hot Tub</Text>
          <Text variant="body" tone="muted">
            From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for
            every kind of trip.
          </Text>
          <Text variant="caption">Lake Arrowhead, CA</Text>
          <Button title="Book this stay" size="sm" className="self-start" />
        </Section>

        <Section title="04. Buttons">
          <Button title="Book this stay" showArrow />
          <Button title="Continue with Google" variant="secondary" icon={<GoogleIcon />} />
          <Button title="Continue with Apple" variant="secondary" icon={<AppleIcon />} />
          <Button title="Loading" loading />
          <Button title="Disabled" disabled />
          <View className="flex-row gap-4">
            <IconButton icon={Heart} accessibilityLabel="Save" />
            <IconButton icon={Share} accessibilityLabel="Share" />
            <IconButton icon={Search} accessibilityLabel="Search" />
            <IconButton icon={Bookmark} accessibilityLabel="Bookmark" />
          </View>
        </Section>

        <Section title="05. Input fields">
          <SearchField placeholder="Search stays" defaultValue="Cabins in California" onFiltersPress={() => {}} />
          <TextField icon={User} placeholder="Enter your name" />
          <TextField icon={User} placeholder="Enter your name" value={name} onChangeText={setName} />
          <TextField icon={Lock} placeholder="Password" defaultValue="secret123" secure />
          <TextField icon={User} label="Full name" placeholder="e.g. Adrian Hajdin" />
          <TextField icon={Lock} label="Password" placeholder="At least 8 characters" secure />
          <TextField icon={Mail} label="Email address" defaultValue="adrian@" error="Enter a valid email address" />
          <CodeInput value={code} onChangeText={setCode} />
          <CodeInput value="000000" onChangeText={() => {}} error />
        </Section>

        <Section title="06. Filter chips">
          <View className="flex-row flex-wrap gap-2">
            {filters.map((f) => (
              <Chip key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
            ))}
          </View>
          <View className="flex-row flex-wrap gap-2">
            {categories.map((c) => (
              <Chip
                key={c.label}
                label={c.label}
                icon={c.icon}
                selected={category === c.label}
                onPress={() => setCategory(c.label)}
              />
            ))}
          </View>
        </Section>

        <Section title="07. Listing card">
          <ListingCard
            title="Modern Cabin with Hot Tub"
            location="Lake Arrowhead, CA"
            rating={4.9}
            reviewCount={342}
            pricePerNight={280}
            imageUri="https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600"
            amenities={[
              { label: "Hot Tub", icon: Bath },
              { label: "Pet Friendly", icon: PawPrint },
            ]}
            saved={saved}
            onToggleSave={() => setSaved((s) => !s)}
          />
        </Section>

        <Section title="08. Policy card">
          <PolicyCard
            icon={MessageSquareMore}
            title="Ask about policies"
            description="Cancellation, house rules, pets, check-in and more."
          />
          <PolicyCard
            icon={FileText}
            title="Free cancellation"
            description="Full refund up to 7 days before check-in."
          />
        </Section>

        <Section title="09. Profile row">
          <ProfileList>
            <ProfileRow icon={User} label="Personal info" />
            <ProfileRow icon={CreditCard} label="Payment methods" />
            <ProfileRow icon={Luggage} label="Trips" />
          </ProfileList>
        </Section>

        <Section title="10. Bottom navigation">
          <GlassTabBar items={tabs} activeKey={tab} onSelect={setTab} />
        </Section>

        <Section title="11. Iconography">
          <View className="flex-row flex-wrap gap-3">
            {glyphs.map((Glyph, i) => (
              <View key={i} className="size-12 items-center justify-center rounded-full border border-border">
                <Glyph color={colors.ink} size={iconSize.lg} strokeWidth={iconStroke} />
              </View>
            ))}
          </View>
        </Section>

        <Section title="12. Segmented control">
          <SegmentedControl
            segments={[
              { label: "List", icon: List },
              { label: "Map", icon: Map },
            ]}
            selectedIndex={segment}
            onChange={setSegment}
          />
        </Section>

        <Section title="13. Toggles / Steppers">
          <View className="flex-row items-center gap-6">
            <Toggle value={toggle} onValueChange={setToggle} accessibilityLabel="Example toggle" />
            <Stepper value={count} onChange={setCount} min={0} max={16} label="Guests" />
          </View>
        </Section>

        <Section title="14. Status / Alerts">
          {banners.success ? (
            <StatusBanner
              tone="success"
              message="Account created successfully"
              onDismiss={() => setBanners((b) => ({ ...b, success: false }))}
            />
          ) : null}
          {banners.error ? (
            <StatusBanner
              tone="error"
              message="Something went wrong. Please try again."
              onDismiss={() => setBanners((b) => ({ ...b, error: false }))}
            />
          ) : null}
        </Section>

        <Section title="15. Tags / Badges">
          <View className="flex-row flex-wrap gap-2">
            <Badge tone="favorite" label="Guest favorite" />
            <Badge tone="success" label="New" />
            <Badge tone="danger" label="20% off" />
            <Badge tone="lavender" label="Superhost" />
          </View>
        </Section>

        <View className="items-center">
          <Tent color={colors.inkMuted} size={iconSize.md} strokeWidth={iconStroke} />
        </View>
      </ScrollView>
    </>
  );
}
