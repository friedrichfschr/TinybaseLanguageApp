import React from "react";
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TextStyle,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../ThemedText";

type InputVariant =
  | "default"
  | "filled"
  | "outlined"
  | "ghost"
  | "primary"
  | "secondary"
  | "accent";
type InputSize = "sm" | "md" | "lg";

interface TextInputProps extends Omit<RNTextInputProps, "style"> {
  label?: string;
  error?: string;
  variant?: InputVariant;
  size?: InputSize;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  variant = "default",
  size = "md",
  containerStyle,
  inputStyle,
  disabled = false,
  ...props
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const sizeStyles: Record<
    InputSize,
    { height?: number; fontSize: number; padding: number }
  > = {
    sm: { fontSize: 14, padding: 8 },
    md: { height: 50, fontSize: 16, padding: 14 },
    lg: { height: 55, fontSize: 18, padding: 16 },
  };

  const getVariantStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: 16,
      backgroundColor: colors.surface,
    };

    switch (variant) {
      case "filled":
        return {
          ...baseStyle,
          backgroundColor: colors.surfaceHover,
        };
      case "outlined":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colors.border,
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: colors.primaryBackground,
          borderWidth: 1,
          borderColor: colors.primary,
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: colors.secondaryBackground,
          borderWidth: 1,
          borderColor: colors.secondary,
        };
      case "accent":
        return {
          ...baseStyle,
          backgroundColor:
            colorScheme === "dark"
              ? "rgba(251, 191, 36, 0.1)"
              : "rgba(245, 158, 11, 0.1)",
          borderWidth: 1,
          borderColor: colors.accent,
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
      case "primary":
        return colors.textPrimary;
      case "secondary":
        return colors.textSecondary;
      case "accent":
        return colors.accent;
      default:
        return colors.text;
    }
  };

  const getLabelColor = () => {
    if (disabled) {
      return colors.textDisabled;
    }

    switch (variant) {
      case "primary":
        return colors.textPrimary;
      case "secondary":
        return colors.textSecondary;
      case "accent":
        return colors.accent;
      default:
        return colors.textMuted;
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <ThemedText style={[styles.label, { color: getLabelColor() }]}>
          {label}
        </ThemedText>
      )}
      <View style={[getVariantStyle(), disabled && styles.disabled]}>
        <RNTextInput
          style={[
            {
              height: sizeStyles[size].height,
              fontSize: sizeStyles[size].fontSize,
              padding: sizeStyles[size].padding,
              color: getTextColor(),
            },
            inputStyle, // Custom style overrides
          ]}
          placeholderTextColor={colors.textMuted}
          editable={!disabled}
          {...props}
        />
      </View>
      {error && (
        <ThemedText style={styles.error} variant="error">
          {error}
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default TextInput;
