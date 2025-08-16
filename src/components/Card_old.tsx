import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { DesignTokens } from '../design/tokens';
import { useTheme } from '../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
  blur?: boolean;
}

export function Card({ 
  children, 
  variant = 'elevated', 
  padding = 'md',
  style,
  blur = false
}: CardProps) {
  const { theme } = useTheme();

  const paddingStyles = {
    none: { padding: 0 },
    sm: { padding: DesignTokens.spacing.sm },
    md: { padding: DesignTokens.spacing.md },
    lg: { padding: DesignTokens.spacing.lg },
    xl: { padding: DesignTokens.spacing.xl },
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.surface,
          borderRadius: DesignTokens.borderRadius.xl,
          ...DesignTokens.shadows.lg,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface,
          borderRadius: DesignTokens.borderRadius.xl,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'glass':
        return {
          backgroundColor: theme.colors.glass,
          borderRadius: DesignTokens.borderRadius.xl,
          borderWidth: 1,
          borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          ...DesignTokens.shadows.md,
        };
      default:
        return {};
    }
  };

  const cardStyle: ViewStyle = {
    ...getVariantStyles(),
    ...paddingStyles[padding],
    ...style,
  };

  if (blur && variant === 'glass') {
    return (
      <BlurView 
        intensity={theme.isDark ? 50 : 80} 
        style={[styles.container, cardStyle]}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View style={[styles.container, cardStyle]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default Card;
export type { CardProps };
