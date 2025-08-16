import { StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

import { ThemedText, ThemedView } from '@/src/components';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DesignTokens } from '@/src/design/tokens';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { themeMode, setThemeMode, isDark } = useTheme();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Use real user data from authentication
  const profile = {
    name: user?.name || 'User',
    email: user?.email || 'user@example.com',
    phone: '+91 9876543210', // This could be added to user registration
    totalRides: 0, // This would come from database
    rating: 0, // This would come from database
  };

  const handleThemeToggle = (value: boolean) => {
    // Toggle between light and dark mode (ignoring system for simplicity)
    setThemeMode(value ? 'dark' : 'light');
  };

  const handleSignOut = async () => {
    console.log('Profile: Starting sign out process');
    await signOut();
    console.log('Profile: Sign out complete, NavigationGuard will handle redirect');
    // NavigationGuard will automatically redirect to login
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.header}>
            <ThemedText type="title">Profile</ThemedText>
          </ThemedView>

          <ThemedView style={styles.profileCard}>
            <ThemedView style={styles.profileHeader}>
              <ThemedView style={styles.avatarContainer}>
                <Image
                  source={{ uri: DesignTokens.images.avatar }}
                  style={[
                    styles.avatar,
                    { backgroundColor: isDark ? DesignTokens.colors.backgroundDark : DesignTokens.colors.background }
                  ]}
                />
              </ThemedView>
              <ThemedView style={styles.profileInfo}>
                <ThemedText type="title">{profile.name}</ThemedText>
                <ThemedText>{profile.email}</ThemedText>
                <ThemedText>{profile.phone}</ThemedText>
                <ThemedView style={styles.statsRow}>
                  <ThemedView style={styles.stat}>
                    <ThemedText type="subtitle">{profile.totalRides}</ThemedText>
                    <ThemedText>Rides</ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.stat}>
                    <ThemedText type="subtitle">{profile.rating}</ThemedText>
                    <ThemedText>Rating</ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </ThemedView>
            <TouchableOpacity style={styles.editProfileButton}>
              <ThemedText style={styles.buttonText}>Edit Profile</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.sectionContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Settings</ThemedText>
            
            <ThemedView style={styles.settingItem}>
              <ThemedText>Dark Mode</ThemedText>
              <Switch
                value={isDark}
                onValueChange={handleThemeToggle}
                trackColor={{ false: '#767577', true: '#0a7ea4' }}
                thumbColor="#f4f3f4"
              />
            </ThemedView>
            
            <ThemedView style={styles.settingItem}>
              <ThemedText>Notifications</ThemedText>
              <Switch
                value={notificationsEnabled}
                onValueChange={(value) => setNotificationsEnabled(value)}
                trackColor={{ false: '#767577', true: '#0a7ea4' }}
                thumbColor="#f4f3f4"
              />
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.sectionContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>About</ThemedText>
            
            <TouchableOpacity style={styles.menuItem}>
              <ThemedText>Terms and Conditions</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <ThemedText>Privacy Policy</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <ThemedText>Help & Support</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.signOutContainer}>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          <ThemedView style={styles.versionContainer}>
            <ThemedText style={styles.versionText}>Poolo-Ride v1.0.0</ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: DesignTokens.spacing.md,
  },
  header: {
    marginTop: DesignTokens.spacing.lg,
    marginBottom: DesignTokens.spacing.lg,
    alignItems: 'center',
  },
  profileCard: {
    borderRadius: DesignTokens.borderRadius.lg,
    padding: DesignTokens.spacing.md,
    marginBottom: DesignTokens.spacing.lg,
    ...DesignTokens.shadows.md,
    backgroundColor: DesignTokens.colors.surface,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: DesignTokens.spacing.sm,
  },
  avatarContainer: {
    marginRight: DesignTokens.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: DesignTokens.borderRadius.round,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: DesignTokens.spacing.sm,
  },
  stat: {
    marginRight: DesignTokens.spacing.md,
  },
  editProfileButton: {
    backgroundColor: DesignTokens.colors.primary,
    paddingVertical: DesignTokens.spacing.sm + 4,
    borderRadius: DesignTokens.borderRadius.md,
    alignItems: 'center',
    marginTop: DesignTokens.spacing.sm,
  },
  buttonText: {
    color: DesignTokens.colors.textInverse,
    fontSize: DesignTokens.typography.fontSizes.base,
    fontWeight: 'bold',
  },
  sectionContainer: {
    borderRadius: DesignTokens.borderRadius.lg,
    padding: DesignTokens.spacing.md,
    marginBottom: DesignTokens.spacing.lg,
    ...DesignTokens.shadows.md,
    backgroundColor: DesignTokens.colors.surface,
  },
  sectionTitle: {
    marginBottom: DesignTokens.spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: DesignTokens.spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.border,
  },
  menuItem: {
    paddingVertical: DesignTokens.spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.border,
  },
  signOutContainer: {
    marginVertical: DesignTokens.spacing.lg,
  },
  signOutButton: {
    backgroundColor: DesignTokens.colors.error,
    paddingVertical: DesignTokens.spacing.md,
    borderRadius: DesignTokens.borderRadius.md,
    alignItems: 'center',
  },
  signOutText: {
    color: DesignTokens.colors.textInverse,
    fontSize: DesignTokens.typography.fontSizes.base,
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.lg,
  },
  versionText: {
    fontSize: DesignTokens.typography.fontSizes.xs,
    color: DesignTokens.colors.textMuted,
  },
});
