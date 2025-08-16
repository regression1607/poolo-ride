import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/src/components';
import { IconSymbol } from '@/src/components/legacy/ui/IconSymbol';
import TabBarBackground from '@/src/components/legacy/ui/TabBarBackground';
import { DesignTokens } from '@/src/design/tokens';
import { useTheme } from '@/src/context/ThemeContext';

export default function TabLayout() {
  const { colorScheme, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: DesignTokens.colors.primary,
        tabBarInactiveTintColor: isDark ? DesignTokens.colors.textSecondaryDark : DesignTokens.colors.textSecondary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? DesignTokens.spacing.lg : DesignTokens.spacing.sm,
          paddingTop: DesignTokens.spacing.sm,
          borderTopWidth: 0,
          elevation: 20,
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 20,
          backgroundColor: isDark ? `${DesignTokens.colors.surfaceDark}90` : `${DesignTokens.colors.surface}90`,
          ...Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        },
        tabBarLabelStyle: {
          fontSize: DesignTokens.typography.fontSizes.xs,
          fontWeight: '600',
          marginTop: DesignTokens.spacing.xs,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 30 : 26} 
              name="magnifyingglass" 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="publish"
        options={{
          title: 'Publish',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 30 : 26} 
              name="plus.circle.fill" 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="yourRides"
        options={{
          title: 'Your Rides',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 30 : 26} 
              name="car.fill" 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 30 : 26} 
              name="message.fill" 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 30 : 26} 
              name="person.fill" 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
