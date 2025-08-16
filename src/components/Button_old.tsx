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
import { LinearGradient } from 'expo-linear-gradient';
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
      fontWeight: DesignTokens.typography.fontWeights.semibold,
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
  style,
  textStyle,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();
  
  const sizeStyles = {
    sm: {
      paddingVertical: DesignTokens.spacing.sm,
      paddingHorizontal: DesignTokens.spacing.md,
      borderRadius: DesignTokens.borderRadius.md,
    },
    md: {
      paddingVertical: DesignTokens.spacing.md,
      paddingHorizontal: DesignTokens.spacing.lg,
      borderRadius: DesignTokens.borderRadius.lg,
    },
    lg: {
      paddingVertical: DesignTokens.spacing.lg,
      paddingHorizontal: DesignTokens.spacing.xl,
      borderRadius: DesignTokens.borderRadius.xl,
    },
  };

  const textSizes = {
    sm: DesignTokens.typography.fontSizes.sm,
    md: DesignTokens.typography.fontSizes.base,
    lg: DesignTokens.typography.fontSizes.lg,
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: theme.colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: theme.colors.primary,
          borderWidth: 0,
        };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return '#ffffff';
      case 'outline':
      case 'ghost':
        return theme.colors.primary;
      default:
        return '#ffffff';
    }
  };

  const buttonStyles: ViewStyle[] = [
    styles.button,
    sizeStyles[size],
    getVariantStyles(),
    disabled ? styles.disabled : {},
  ].filter(Boolean);

  const textStyles: TextStyle[] = [
    styles.text,
    {
      fontSize: textSizes[size],
      color: getTextColor(),
    },
    disabled ? styles.disabledText : {},
  ].filter(Boolean);

  if (variant === 'gradient') {
    return (
      <TouchableOpacity 
        {...props} 
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.button,
            sizeStyles[size],
            disabled && styles.disabled,
            style,
          ] as ViewStyle[]}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <>
              {icon}
              <Text style={[{ 
                fontSize: textSizes[size],
                fontWeight: '600' as const,
                color: '#ffffff',
              }, textStyle]}>
                {children}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[...buttonStyles, style]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={getTextColor()} 
          size="small" 
        />
      ) : (
        <>
          {icon}
          <Text style={[...textStyles, textStyle]}>
            {children}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DesignTokens.spacing.sm,
    ...DesignTokens.shadows.md,
  } as ViewStyle,
  text: {
    fontWeight: '600' as const,
    textAlign: 'center',
  } as TextStyle,
  disabled: {
    opacity: 0.5,
  } as ViewStyle,
  disabledText: {
    opacity: 0.7,
  } as TextStyle,
});

export default Button;
export type { ButtonProps };
