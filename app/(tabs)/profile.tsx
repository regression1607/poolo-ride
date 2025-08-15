import { StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

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
                  source={{ uri: 'https://i.pravatar.cc/300' }}
                  style={styles.avatar}
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
    padding: 16,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  profileCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  stat: {
    marginRight: 20,
  },
  editProfileButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  signOutContainer: {
    marginVertical: 20,
  },
  signOutButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  versionText: {
    fontSize: 12,
  },
});
