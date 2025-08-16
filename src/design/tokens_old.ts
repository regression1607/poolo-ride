// Design System - Modern UI Tokens
export const DesignTokens = {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
    },
    success: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    dark: {
      50: '#1e293b',
      100: '#0f172a',
      200: '#020617',
      800: '#1e293b',
      900: '#0f172a',
    }
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    '4xl': 80,
    '5xl': 96,
  },
  
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
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
      '4xl': 36,
      '5xl': 48,
      '6xl': 60,
    },
    fontWeights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeights: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },
  
  shadows: {
    sm: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
      elevation: 8,
    },
    xl: {
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.25,
      shadowRadius: 25,
      elevation: 12,
    },
  },
  
  gradients: {
    primary: ['#667eea', '#764ba2'],
    secondary: ['#f093fb', '#f5576c'],
    success: ['#4facfe', '#00f2fe'],
    sunset: ['#ff9a9e', '#fecfef'],
    ocean: ['#2196f3', '#21cbf3'],
    royal: ['#141e30', '#243b55'],
  },
};

// Theme interface
export interface Theme {
  colors: {
    background: string;
    surface: string;
    surfaceVariant: string;
    primary: string;
    primaryVariant: string;
    secondary: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    borderLight: string;
    success: string;
    warning: string;
    error: string;
    overlay: string;
    glass: string;
  };
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: {
    background: DesignTokens.colors.neutral[50],
    surface: '#ffffff',
    surfaceVariant: DesignTokens.colors.neutral[100],
    primary: DesignTokens.colors.primary[600],
    primaryVariant: DesignTokens.colors.primary[700],
    secondary: DesignTokens.colors.secondary[600],
    text: DesignTokens.colors.neutral[900],
    textSecondary: DesignTokens.colors.neutral[700],
    textMuted: DesignTokens.colors.neutral[500],
    border: DesignTokens.colors.neutral[200],
    borderLight: DesignTokens.colors.neutral[100],
    success: DesignTokens.colors.success[600],
    warning: DesignTokens.colors.warning[600],
    error: DesignTokens.colors.error[600],
    overlay: 'rgba(0, 0, 0, 0.5)',
    glass: 'rgba(255, 255, 255, 0.8)',
  },
  isDark: false,
};

export const darkTheme: Theme = {
  colors: {
    background: DesignTokens.colors.dark[200],
    surface: DesignTokens.colors.dark[100],
    surfaceVariant: DesignTokens.colors.dark[50],
    primary: DesignTokens.colors.primary[400],
    primaryVariant: DesignTokens.colors.primary[300],
    secondary: DesignTokens.colors.secondary[400],
    text: DesignTokens.colors.neutral[50],
    textSecondary: DesignTokens.colors.neutral[200],
    textMuted: DesignTokens.colors.neutral[400],
    border: DesignTokens.colors.neutral[700],
    borderLight: DesignTokens.colors.neutral[800],
    success: DesignTokens.colors.success[400],
    warning: DesignTokens.colors.warning[400],
    error: DesignTokens.colors.error[400],
    overlay: 'rgba(0, 0, 0, 0.7)',
    glass: 'rgba(30, 41, 59, 0.8)',
  },
  isDark: true,
};
