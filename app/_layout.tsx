import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { NavigationGuard } from '@/src/components/NavigationGuard';

// Prevent auto hide initially
SplashScreen.preventAutoHideAsync();

// Simple fallback component
function SimpleFallback() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Poolo-Ride</Text>
      <Text style={{ fontSize: 16 }}>Loading app...</Text>
    </View>
  );
}

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const colorScheme = useColorScheme();
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
    return <SimpleFallback />;
  }

  console.log('Navigation render - Session exists:', !!session);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NavigationGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/register" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </NavigationGuard>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  try {
    console.log('Root layout mounting...');
    return (
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
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
