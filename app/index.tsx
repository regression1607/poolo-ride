import { useAuth } from '@/src/context/AuthContext';
import { View, Text } from 'react-native';

export default function Index() {
  const { session, loading } = useAuth();

  console.log('Index route - Loading:', loading, 'Session exists:', !!session);

  // Show loading screen while checking auth
  // NavigationGuard will handle the navigation
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
        {loading ? 'Checking authentication...' : session ? 'Entering app...' : 'Redirecting to login...'}
      </Text>
    </View>
  );
}
