import { Text, type TextProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

export type TextColorVariant =
  | "default" // Default text color
  | "primary" // Primary color
  | "secondary" // Secondary color
  | "accent" // Accent color
  | "muted" // Muted text
  | "disabled" // Disabled state
  | "inverted" // Inverted text color
  | "success" // Success message
  | "error" // Error message
  | "warning" // Warning message
  | "info"; // Info message

export type TextStyleVariant =
  | "default" // Normal text
  | "title" // Large titles
  | "defaultSemiBold" // Semi-bold
  | "subtitle" // Subtitles
  | "link"; // Links

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: TextStyleVariant;
  variant?: TextColorVariant;
  colorName?: keyof typeof Colors.light & keyof typeof Colors.dark;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  variant,
  colorName,
  ...rest
}: ThemedTextProps) {
  // Determine the color key to use from Colors
  const getColorKey = (): keyof typeof Colors.light &
    keyof typeof Colors.dark => {
    if (colorName) {
      return colorName;
    }

    if (variant) {
      switch (variant) {
        case "primary":
          return "textPrimary";
        case "secondary":
          return "textSecondary";
        case "muted":
          return "textMuted";
        case "disabled":
          return "textDisabled";
        case "inverted":
          return "textInverted";
        case "success":
          return "success";
        case "error":
          return "error";
        case "warning":
          return "warning";
        case "info":
          return "info";
        case "accent":
          return "accent";
        default:
          return "text";
      }
    }

    return "text";
  };

  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    getColorKey()
  );

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
  },
});
