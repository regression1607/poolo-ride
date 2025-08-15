import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { ThemeProvider, useTheme } from '@/src/context/ThemeContext';
import { NavigationGuard } from '@/src/components/NavigationGuard';

// Prevent auto hide initially
SplashScreen.preventAutoHideAsync();

// Simple fallback component
function SimpleFallback() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#000' }}>Poolo-Ride</Text>
      <Text style={{ fontSize: 16, color: '#000' }}>Loading app...</Text>
    </View>
  );
}

// Themed fallback component that can use theme context
function ThemedFallback() {
  const { colorScheme } = useTheme();
  const backgroundColor = colorScheme === 'dark' ? '#000' : '#fff';
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: textColor }}>Poolo-Ride</Text>
      <Text style={{ fontSize: 16, color: textColor }}>Loading app...</Text>
    </View>
  );
}

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const { colorScheme } = useTheme();
  const [appReady, setAppReady] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts and auth to load
        if (loaded && !loading) {
          console.log('App ready - fonts loaded, auth state:', !!session);
          setAppReady(true);
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error('Error preparing app:', error);
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [loaded, loading]);

  // Show loading screen while preparing
  if (!appReady) {
    return <ThemedFallback />;
  }

  console.log('Navigation render - Session exists:', !!session);

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NavigationGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/register" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </NavigationGuard>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  try {
    console.log('Root layout mounting...');
    return (
      <ThemeProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </ThemeProvider>
    );
  } catch (error) {
    console.error('Root layout error:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ color: 'red' }}>App Error: {String(error)}</Text>
      </View>
    );
  }
}
