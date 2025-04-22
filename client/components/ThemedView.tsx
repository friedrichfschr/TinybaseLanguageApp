import { SafeAreaView, ScrollView, View, type ViewProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

export type ViewColorVariant =
  | "default" // Default background
  | "primary" // Primary color
  | "secondary" // Secondary color
  | "accent" // Accent color
  | "surface" // Surface color
  | "surfaceHover" // Surface hover color
  | "surfaceActive"; // Surface active color

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: ViewColorVariant;
  colorName?: keyof typeof Colors.light & keyof typeof Colors.dark;
};

// Helper function to determine the color key based on variant
const getColorKey = (
  variant?: ViewColorVariant,
  colorName?: keyof typeof Colors.light & keyof typeof Colors.dark
): keyof typeof Colors.light & keyof typeof Colors.dark => {
  if (colorName) {
    return colorName;
  }

  if (variant) {
    switch (variant) {
      case "primary":
        return "primary";
      case "secondary":
        return "secondary";
      case "accent":
        return "accent";
      case "surface":
        return "surface";
      case "surfaceHover":
        return "surfaceHover";
      case "surfaceActive":
        return "surfaceActive";
      default:
        return "background";
    }
  }

  return "background";
};

export function ThemedSafeAreaView({
  style,
  lightColor,
  darkColor,
  variant,
  colorName,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    getColorKey(variant, colorName)
  );

  return <SafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant,
  colorName,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    getColorKey(variant, colorName)
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function ThemedScrollView({
  style,
  lightColor,
  darkColor,
  variant,
  colorName,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    getColorKey(variant, colorName)
  );

  return <ScrollView style={[{ backgroundColor }, style]} {...otherProps} />;
}
