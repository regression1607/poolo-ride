import React, { useState } from 'react';
import { 
  View, 
  TextInput as RNTextInput, 
  Text, 
  StyleSheet, 
  TextInputProps,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { DesignTokens } from '../design/tokens';
import { useTheme } from '../context/ThemeContext';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  variant?: 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export function Input({
  label,
  error,
  variant = 'outlined',
  size = 'md',
  containerStyle,
  inputStyle,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useTheme();

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: DesignTokens.borderRadius.md,
      borderWidth: 1,
    };

    // Size styles
    const sizeStyles = {
      sm: {
        paddingHorizontal: DesignTokens.spacing.sm,
        paddingVertical: DesignTokens.spacing.xs,
        minHeight: 36,
      },
      md: {
        paddingHorizontal: DesignTokens.spacing.md,
        paddingVertical: DesignTokens.spacing.sm,
        minHeight: 44,
      },
      lg: {
        paddingHorizontal: DesignTokens.spacing.lg,
        paddingVertical: DesignTokens.spacing.md,
        minHeight: 52,
      },
    };

    // Variant styles
    const variantStyles = {
      outlined: {
        backgroundColor: theme.colors.surface,
        borderColor: isFocused ? theme.colors.primary : theme.colors.border,
      },
      filled: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderColor: 'transparent',
      },
    };

    // Error state
    const errorStyle = error ? {
      borderColor: theme.colors.error,
    } : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...errorStyle,
    };
  };

  const getInputStyle = (): TextStyle => {
    const sizeStyles = {
      sm: { fontSize: DesignTokens.typography.fontSizes.sm },
      md: { fontSize: DesignTokens.typography.fontSizes.base },
      lg: { fontSize: DesignTokens.typography.fontSizes.lg },
    };

    return {
      color: theme.colors.textPrimary,
      fontWeight: '400' as const,
      flex: 1,
      ...sizeStyles[size],
    };
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <View style={getContainerStyle()}>
        <RNTextInput
          style={[getInputStyle(), inputStyle]}
          placeholderTextColor={theme.colors.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: DesignTokens.spacing.sm,
  },
  label: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    fontWeight: '600' as const,
    marginBottom: DesignTokens.spacing.xs,
  },
  error: {
    fontSize: DesignTokens.typography.fontSizes.xs,
    marginTop: DesignTokens.spacing.xs,
    fontWeight: '500' as const,
  },
});

export default Input;
export type { InputProps };
