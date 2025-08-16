import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, lightTheme, darkTheme } from '../design/tokens';

type ThemeMode = 'light' | 'dark' | 'system';
type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  colorScheme: ColorScheme;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@poolo_ride_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useNativeColorScheme() ?? 'light';
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  
  // Determine the actual color scheme based on theme mode
  const colorScheme: ColorScheme = 
    themeMode === 'system' ? systemColorScheme : themeMode;
  
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  // Load saved theme preference on app start
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      console.log('Theme updated to:', mode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ themeMode, colorScheme, setThemeMode, isDark, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
