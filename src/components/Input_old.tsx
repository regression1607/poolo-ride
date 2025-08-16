import React, { useState } from 'react';
import { 
  TextInput as RNTextInput, 
  View, 
  Text, 
  StyleSheet, 
  TextInputProps,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { DesignTokens } from '../design/tokens';
import { useTheme } from '../context/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled';
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export function Input({
  label,
  error,
  icon,
  size = 'md',
  variant = 'outlined',
  style,
  containerStyle,
  inputStyle,
  ...props
}: InputProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const sizeStyles = {
    sm: {
      paddingVertical: DesignTokens.spacing.sm,
      paddingHorizontal: DesignTokens.spacing.md,
      fontSize: DesignTokens.typography.fontSizes.sm,
    },
    md: {
      paddingVertical: DesignTokens.spacing.md,
      paddingHorizontal: DesignTokens.spacing.lg,
      fontSize: DesignTokens.typography.fontSizes.base,
    },
    lg: {
      paddingVertical: DesignTokens.spacing.lg,
      paddingHorizontal: DesignTokens.spacing.xl,
      fontSize: DesignTokens.typography.fontSizes.lg,
    },
  };

  const getVariantStyles = (): ViewStyle => {
    const baseStyle = {
      borderRadius: DesignTokens.borderRadius.lg,
      borderWidth: 2,
    };

    if (variant === 'filled') {
      return {
        ...baseStyle,
        backgroundColor: theme.colors.surfaceVariant,
        borderColor: isFocused ? theme.colors.primary : 'transparent',
      };
    }

    return {
      ...baseStyle,
      backgroundColor: theme.colors.surface,
      borderColor: error 
        ? theme.colors.error 
        : isFocused 
          ? theme.colors.primary 
          : theme.colors.border,
    };
  };

  const textInputStyle: TextStyle = {
    ...sizeStyles[size],
    color: theme.colors.text,
    fontWeight: '500' as const,
    flex: 1,
  };

  const containerStyles: ViewStyle = {
    ...getVariantStyles(),
    flexDirection: 'row',
    alignItems: 'center',
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <View style={containerStyles}>
        {icon && (
          <View style={styles.iconContainer}>
            {icon}
          </View>
        )}
        <RNTextInput
          style={[textInputStyle, inputStyle]}
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
  iconContainer: {
    marginRight: DesignTokens.spacing.sm,
  },
  error: {
    fontSize: DesignTokens.typography.fontSizes.xs,
    marginTop: DesignTokens.spacing.xs,
    fontWeight: '500' as const,
  },
});

export default Input;
export type { InputProps };
