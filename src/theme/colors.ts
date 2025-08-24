// Modern color palette for Poolo ride-sharing app
export const colors = {
  // Primary brand colors for ride-sharing
  primary: {
    main: '#2E7CF6',      // Modern blue for primary actions
    light: '#5B9BF8',     // Lighter blue for hover states
    dark: '#1E5BC2',      // Darker blue for pressed states
    100: '#E6F2FF',       // Very light blue for backgrounds
    50: '#F3F8FF',        // Ultra light blue for subtle backgrounds
  },
  
  // Secondary colors for accents
  secondary: {
    main: '#10B981',      // Green for success states (ride confirmed)
    light: '#34D399',     // Light green for positive feedback
    dark: '#059669',      // Dark green for completed rides
    100: '#D1FAE5',       // Light green background
    50: '#ECFDF5',        // Ultra light green
  },
  
  // Neutral colors for text and backgrounds
  neutral: {
    900: '#111827',       // Primary text color
    800: '#1F2937',       // Secondary text color
    700: '#374151',       // Tertiary text color
    600: '#4B5563',       // Muted text color
    500: '#6B7280',       // Placeholder text
    400: '#9CA3AF',       // Border color
    300: '#D1D5DB',       // Light border
    200: '#E5E7EB',       // Background border
    100: '#F3F4F6',       // Light background
    50: '#F9FAFB',        // Ultra light background
    white: '#FFFFFF',     // Pure white
  },
  
  // Status colors for various ride states
  status: {
    success: '#10B981',   // Ride confirmed, payment successful
    warning: '#F59E0B',   // Ride pending, payment pending
    error: '#EF4444',     // Ride cancelled, payment failed
    info: '#3B82F6',      // Ride info, general information
  },
  
  // Special colors for ride-sharing features
  special: {
    gold: '#FCD34D',      // Premium/featured rides
    orange: '#FB923C',    // Urgent/last-minute rides
    purple: '#A855F7',    // VIP/luxury rides
  },
  
  // Vehicle type colors
  vehicle: {
    bike: '#8B5CF6',      // Purple for bikes/scooters
    car: '#2E7CF6',       // Blue for personal cars
    cab: '#10B981',       // Green for commercial cabs
  },
  
  // Gradients for modern UI elements
  gradients: {
    primary: 'linear-gradient(135deg, #2E7CF6 0%, #1E5BC2 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    sunset: 'linear-gradient(135deg, #FB923C 0%, #F59E0B 100%)',
    ocean: 'linear-gradient(135deg, #3B82F6 0%, #2E7CF6 100%)',
  }
};

// Typography system
export const typography = {
  // Font families
  fontFamily: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    secondary: 'SF Pro Display, -apple-system, sans-serif',
    mono: 'JetBrains Mono, Consolas, monospace',
  },
  
  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Font sizes for ride-sharing app
  fontSize: {
    xs: 12,      // Small labels, timestamps
    sm: 14,      // Body text, descriptions
    base: 16,    // Default body text
    lg: 18,      // Large body text
    xl: 20,      // Small headings
    '2xl': 24,   // Medium headings
    '3xl': 30,   // Large headings
    '4xl': 36,   // Extra large headings
    '5xl': 48,   // Hero text
  },
  
  // Line heights for optimal readability
  lineHeight: {
    tight: 1.25,    // For headings
    normal: 1.5,    // For body text
    relaxed: 1.75,  // For descriptions
  },
  
  // Letter spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
  }
};

// Spacing system
export const spacing = {
  xs: 4,    // Tight spacing
  sm: 8,    // Small spacing
  md: 12,   // Medium spacing
  lg: 16,   // Large spacing
  xl: 20,   // Extra large spacing
  '2xl': 24, // 2x large spacing
  '3xl': 32, // 3x large spacing
  '4xl': 40, // 4x large spacing
  '5xl': 48, // 5x large spacing
};

// Border radius for modern look
export const borderRadius = {
  none: 0,
  sm: 4,     // Small elements
  md: 8,     // Buttons, inputs
  lg: 12,    // Cards, containers
  xl: 16,    // Large cards
  '2xl': 20, // Hero sections
  full: 9999, // Fully rounded (pills, avatars)
};

// Shadow system for depth
export const shadows = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
  md: '0 4px 14px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 25px rgba(0, 0, 0, 0.15)',
  xl: '0 20px 40px rgba(0, 0, 0, 0.2)',
};
