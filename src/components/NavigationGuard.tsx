import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';

export function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    console.log('NavigationGuard: Auth state changed - loading:', loading, 'session:', !!session);
    console.log('NavigationGuard: Current segments:', segments);

    if (!loading) {
      const inAuthGroup = segments[0] === 'auth';
      const inTabsGroup = segments[0] === '(tabs)';

      if (session && inAuthGroup) {
        // User is authenticated but in auth screens, redirect to main app
        console.log('NavigationGuard: Authenticated user in auth screens, redirecting to tabs');
        router.replace('/(tabs)');
      } else if (!session && inTabsGroup) {
        // User is not authenticated but in main app, redirect to login
        console.log('NavigationGuard: Unauthenticated user in main app, redirecting to login');
        router.replace('/auth/login');
      } else if (!session && segments.length <= 1 && !inAuthGroup) {
        // User is not authenticated and on root or index, redirect to login
        console.log('NavigationGuard: Unauthenticated user on root, redirecting to login');
        router.replace('/auth/login');
      } else if (session && segments.length <= 1 && !inTabsGroup) {
        // User is authenticated and on root or index, redirect to main app
        console.log('NavigationGuard: Authenticated user on root, redirecting to tabs');
        router.replace('/(tabs)');
      }
    }
  }, [session, loading, segments, router]);

  return <>{children}</>;
}
