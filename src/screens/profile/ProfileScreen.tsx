import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();

  // Use real user data from authentication
  const userData = {
    name: user?.name || 'Guest User',
    email: user?.email || 'guest@example.com',
    username: user?.username || 'guest',
    phone: user?.phone_number || '',
    rating: user?.rating || 0,
    totalRides: user?.total_rides || 0,
    isVerified: user?.is_verified || false,
    joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    }) : 'Recently',
  };

  const stats = [
    {
      label: 'Rides Completed',
      value: userData.totalRides.toString(),
      icon: 'car',
      color: colors.primary.main,
    },
    {
      label: 'Rating',
      value: `${userData.rating} ⭐`,
      icon: 'star',
      color: colors.special.gold,
    },
    {
      label: 'Money Saved',
      value: '₹0',
      icon: 'wallet',
      color: colors.secondary.main,
    },
    {
      label: 'CO₂ Saved',
      value: '0 kg',
      icon: 'leaf',
      color: colors.secondary.main,
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Starting logout process...');
              await logout();
              console.log('Logout completed successfully');
            } catch (error) {
              console.error('Logout error in ProfileScreen:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      title: 'Edit Profile',
      icon: 'person-outline',
      onPress: () => console.log('Edit Profile'),
    },
    {
      title: 'My Vehicles',
      icon: 'car-outline',
      onPress: () => console.log('My Vehicles'),
    },
    {
      title: 'Ride History',
      icon: 'time-outline',
      onPress: () => console.log('Ride History'),
    },
    {
      title: 'Payment Methods',
      icon: 'card-outline',
      onPress: () => console.log('Payment Methods'),
    },
    {
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => console.log('Notifications'),
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => console.log('Help & Support'),
    },
    {
      title: 'Privacy Policy',
      icon: 'shield-outline',
      onPress: () => console.log('Privacy Policy'),
    },
    {
      title: 'Logout',
      icon: 'log-out-outline',
      onPress: handleLogout,
      isDestructive: true,
    },
  ];

  const renderStatCard = (stat: typeof stats[0]) => (
    <View key={stat.label} style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
        <Ionicons name={stat.icon as any} size={20} color={stat.color} />
      </View>
      <Text style={styles.statValue}>{stat.value}</Text>
      <Text style={styles.statLabel}>{stat.label}</Text>
    </View>
  );

  const renderMenuItem = (item: typeof menuItems[0]) => (
    <TouchableOpacity
      key={item.title}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons
          name={item.icon as any}
          size={20}
          color={item.isDestructive ? colors.status.error : colors.neutral[600]}
        />
        <Text
          style={[
            styles.menuItemText,
            item.isDestructive && styles.menuItemTextDestructive,
          ]}
        >
          {item.title}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={16}
        color={colors.neutral[400]}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        }}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(99, 102, 241, 0.8)', 'rgba(139, 92, 246, 0.6)', 'rgba(255, 255, 255, 0.95)']}
          style={styles.gradient}
        >
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {userData.name.split(' ').map(n => n.charAt(0)).join('')}
                  </Text>
                </View>
                {userData.isVerified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark" size={12} color={colors.neutral.white} />
                  </View>
                )}
              </View>
              
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userEmail}>{userData.email}</Text>
              <Text style={styles.joinDate}>Member since {userData.joinDate}</Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsContainer}>
              <View style={styles.statsGrid}>
                {stats.map(renderStatCard)}
              </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
              {menuItems.map(renderMenuItem)}
            </View>

            {/* App Version */}
            <View style={styles.footer}>
              <Text style={styles.appVersion}>Poolo v1.0.0</Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },

  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  gradient: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  profileHeader: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.neutral.white,
  },

  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary.main,
  },

  verifiedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: colors.secondary.main,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.neutral.white,
  },

  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.neutral[900],
    marginBottom: 4,
  },

  userEmail: {
    fontSize: 16,
    color: colors.neutral[600],
    marginBottom: 4,
  },

  joinDate: {
    fontSize: 14,
    color: colors.neutral[500],
  },

  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  statCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },

  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },

  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral[900],
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: colors.neutral[600],
    textAlign: 'center',
  },

  menuContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },

  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuItemText: {
    fontSize: 16,
    color: colors.neutral[900],
    marginLeft: spacing.md,
  },

  menuItemTextDestructive: {
    color: colors.status.error,
  },

  footer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },

  appVersion: {
    fontSize: 12,
    color: colors.neutral.white,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
