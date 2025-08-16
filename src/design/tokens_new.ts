// Simplified Design System - Clean 2-Color Approach
export const DesignTokens = {
  colors: {
    // Primary brand color (Blue)
    primary: '#2563eb',
    primaryLight: '#3b82f6',
    primaryDark: '#1d4ed8',
    
    // Secondary neutral color (Gray)
    secondary: '#6b7280',
    secondaryLight: '#9ca3af',
    secondaryDark: '#374151',
    
    // Semantic colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    
    // Text colors
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    textInverse: '#ffffff',
    
    // Background colors
    background: '#ffffff',
    backgroundSecondary: '#f9fafb',
    surface: '#ffffff',
    border: '#e5e7eb',
    
    // Dark theme
    backgroundDark: '#111827',
    backgroundSecondaryDark: '#1f2937',
    surfaceDark: '#1f2937',
    textPrimaryDark: '#f9fafb',
    textSecondaryDark: '#d1d5db',
    borderDark: '#374151',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999,
  },
  
  typography: {
    fontSizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
      elevation: 5,
    },
  },
};

// Theme interfaces
export interface Theme {
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    success: string;
    warning: string;
    error: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textInverse: string;
    background: string;
    backgroundSecondary: string;
    surface: string;
    border: string;
  };
}

// Light theme
export const lightTheme: Theme = {
  colors: {
    primary: DesignTokens.colors.primary,
    primaryLight: DesignTokens.colors.primaryLight,
    primaryDark: DesignTokens.colors.primaryDark,
    secondary: DesignTokens.colors.secondary,
    secondaryLight: DesignTokens.colors.secondaryLight,
    secondaryDark: DesignTokens.colors.secondaryDark,
    success: DesignTokens.colors.success,
    warning: DesignTokens.colors.warning,
    error: DesignTokens.colors.error,
    textPrimary: DesignTokens.colors.textPrimary,
    textSecondary: DesignTokens.colors.textSecondary,
    textMuted: DesignTokens.colors.textMuted,
    textInverse: DesignTokens.colors.textInverse,
    background: DesignTokens.colors.background,
    backgroundSecondary: DesignTokens.colors.backgroundSecondary,
    surface: DesignTokens.colors.surface,
    border: DesignTokens.colors.border,
  },
};

// Dark theme
export const darkTheme: Theme = {
  colors: {
    primary: DesignTokens.colors.primary,
    primaryLight: DesignTokens.colors.primaryLight,
    primaryDark: DesignTokens.colors.primaryDark,
    secondary: DesignTokens.colors.secondaryLight,
    secondaryLight: DesignTokens.colors.secondary,
    secondaryDark: DesignTokens.colors.secondaryDark,
    success: DesignTokens.colors.success,
    warning: DesignTokens.colors.warning,
    error: DesignTokens.colors.error,
    textPrimary: DesignTokens.colors.textPrimaryDark,
    textSecondary: DesignTokens.colors.textSecondaryDark,
    textMuted: DesignTokens.colors.textSecondary,
    textInverse: DesignTokens.colors.textPrimary,
    background: DesignTokens.colors.backgroundDark,
    backgroundSecondary: DesignTokens.colors.backgroundSecondaryDark,
    surface: DesignTokens.colors.surfaceDark,
    border: DesignTokens.colors.borderDark,
  },
};
