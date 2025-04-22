import { Colors } from "@/constants/Colors";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  TextStyle,
  useColorScheme,
  ViewStyle,
  StyleSheet,
} from "react-native";
import { ThemedText } from "../ThemedText";

type ButtonVariant =
  | "filled"
  | "outline"
  | "ghost"
  | "primary"
  | "secondary"
  | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  variant = "filled",
  size = "md",
  disabled = false,
  loading = false,
  children,
  style,
  textStyle,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const sizeStyles: Record<
    ButtonSize,
    { height: number; fontSize: number; padding: number }
  > = {
    sm: { height: 36, fontSize: 14, padding: 12 },
    md: { height: 44, fontSize: 16, padding: 16 },
    lg: { height: 55, fontSize: 18, padding: 20 },
  };

  const getVariantStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    };

    switch (variant) {
      case "filled":
        return {
          ...baseStyle,
          backgroundColor: colors.neutral800,
        };
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: colors.secondary,
        };
      case "accent":
        return {
          ...baseStyle,
          backgroundColor: colors.accent,
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderColor: colors.border,
          borderWidth: 1,
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = () => {
    if (disabled) {
      return colors.textDisabled;
    }

    switch (variant) {
      case "filled":
        return colorScheme === "dark" ? colors.neutral100 : colors.neutral50;
      case "primary":
      case "secondary":
      case "accent":
        return colors.textInverted;
      case "outline":
        return colors.text;
      case "ghost":
        return colors.primary;
      default:
        return colors.text;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        getVariantStyle(),
        {
          height: sizeStyles[size].height,
          paddingHorizontal: sizeStyles[size].padding,
          opacity: disabled ? 0.5 : 1,
        },
        style, // Custom style last to ensure it takes priority
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <ThemedText
          style={StyleSheet.flatten([
            {
              fontSize: sizeStyles[size].fontSize,
              color: getTextColor(),
              textAlign: "center",
              marginBottom: 0,
              fontWeight: "700",
            },
            textStyle, // Custom text style last to ensure it takes priority
          ])}
        >
          {children}
        </ThemedText>
      )}
    </Pressable>
  );
};

export default Button;
