import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { DesignTokens } from '../design/tokens';
import { useTheme } from '../context/ThemeContext';

interface CardProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ 
  variant = 'elevated', 
  children, 
  style 
}: CardProps) {
  const { theme, isDark } = useTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: DesignTokens.borderRadius.lg,
      overflow: 'hidden',
    };

    const variantStyles = {
      elevated: {
        backgroundColor: theme.colors.surface,
        ...DesignTokens.shadows.md,
      },
      outlined: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      filled: {
        backgroundColor: theme.colors.backgroundSecondary,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  };

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
}

export default Card;
export type { CardProps };
