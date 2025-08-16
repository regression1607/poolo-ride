import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { DesignTokens } from '../design/tokens';
import { useTheme } from '../context/ThemeContext';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: DesignTokens.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      ...DesignTokens.shadows.sm,
    };

    // Size styles
    const sizeStyles = {
      sm: {
        paddingVertical: DesignTokens.spacing.sm,
        paddingHorizontal: DesignTokens.spacing.md,
        minHeight: 36,
      },
      md: {
        paddingVertical: DesignTokens.spacing.md,
        paddingHorizontal: DesignTokens.spacing.lg,
        minHeight: 44,
      },
      lg: {
        paddingVertical: DesignTokens.spacing.lg,
        paddingHorizontal: DesignTokens.spacing.xl,
        minHeight: 52,
      },
    };

    // Variant styles
    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600' as const,
      textAlign: 'center',
    };

    // Size-based text styles
    const sizeStyles = {
      sm: { fontSize: DesignTokens.typography.fontSizes.sm },
      md: { fontSize: DesignTokens.typography.fontSizes.base },
      lg: { fontSize: DesignTokens.typography.fontSizes.lg },
    };

    // Variant-based text styles
    const variantStyles = {
      primary: { color: theme.colors.textInverse },
      secondary: { color: theme.colors.textInverse },
      outline: { color: theme.colors.primary },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? theme.colors.primary : theme.colors.textInverse}
          style={styles.loader}
        />
      )}
      <Text style={[getTextStyle(), isDisabled && styles.disabledText]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.6,
  } as ViewStyle,
  disabledText: {
    opacity: 0.8,
  } as TextStyle,
  loader: {
    marginRight: DesignTokens.spacing.sm,
  } as ViewStyle,
});

export default Button;
export type { ButtonProps };
