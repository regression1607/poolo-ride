import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme/colors';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { SuccessMessage } from '../../components/common/SuccessMessage';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsItem {
  icon: string;
  title: string;
  description?: string;
  type: 'switch' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  dangerous?: boolean;
}

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    pushNotifications: true,
    rideNotifications: true,
    emailNotifications: false,
    smsNotifications: true,
    locationSharing: true,
    autoAcceptRides: false,
    darkMode: false,
    soundEffects: true,
  });

  // Change password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSettingToggle = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSuccessMessage('Settings updated successfully');
  };

  const handleChangePassword = async () => {
    setErrorMessage('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setErrorMessage('Please fill in all password fields');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      // In real app, call password change API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setSuccessMessage('Password changed successfully');
      setShowChangePassword(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'This will permanently delete your account. Type "DELETE" to confirm.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Confirm Delete',
                  style: 'destructive',
                  onPress: async () => {
                    // In real app, call delete account API
                    setSuccessMessage('Account deletion initiated. You will receive an email confirmation.');
                    setTimeout(() => logout(), 2000);
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Notifications',
      items: [
        {
          icon: 'notifications',
          title: 'Push Notifications',
          description: 'Receive push notifications for ride updates',
          type: 'switch' as const,
          value: settings.pushNotifications,
          onToggle: (value: boolean) => handleSettingToggle('pushNotifications', value),
        },
        {
          icon: 'car',
          title: 'Ride Notifications',
          description: 'Get notified about ride requests and updates',
          type: 'switch' as const,
          value: settings.rideNotifications,
          onToggle: (value: boolean) => handleSettingToggle('rideNotifications', value),
        },
        {
          icon: 'mail',
          title: 'Email Notifications',
          description: 'Receive important updates via email',
          type: 'switch' as const,
          value: settings.emailNotifications,
          onToggle: (value: boolean) => handleSettingToggle('emailNotifications', value),
        },
        {
          icon: 'chatbubble',
          title: 'SMS Notifications',
          description: 'Get SMS updates for critical information',
          type: 'switch' as const,
          value: settings.smsNotifications,
          onToggle: (value: boolean) => handleSettingToggle('smsNotifications', value),
        },
      ],
    },
    {
      title: 'Privacy & Safety',
      items: [
        {
          icon: 'location',
          title: 'Location Sharing',
          description: 'Share your location during rides for safety',
          type: 'switch' as const,
          value: settings.locationSharing,
          onToggle: (value: boolean) => handleSettingToggle('locationSharing', value),
        },
        {
          icon: 'shield-checkmark',
          title: 'Emergency Contacts',
          description: 'Manage emergency contacts for safety',
          type: 'navigation' as const,
          onPress: () => navigation.navigate('EmergencyContacts'),
        },
        {
          icon: 'document-text',
          title: 'Privacy Policy',
          description: 'Read our privacy policy',
          type: 'navigation' as const,
          onPress: () => navigation.navigate('PrivacyPolicy'),
        },
      ],
    },
    {
      title: 'Ride Preferences',
      items: [
        {
          icon: 'checkmark-circle',
          title: 'Auto Accept Rides',
          description: 'Automatically accept rides that match your preferences',
          type: 'switch' as const,
          value: settings.autoAcceptRides,
          onToggle: (value: boolean) => handleSettingToggle('autoAcceptRides', value),
        },
        {
          icon: 'car-sport',
          title: 'Vehicle Management',
          description: 'Manage your vehicles',
          type: 'navigation' as const,
          onPress: () => navigation.navigate('VehicleManagement'),
        },
        {
          icon: 'cash',
          title: 'Payment Methods',
          description: 'Manage payment options',
          type: 'navigation' as const,
          onPress: () => navigation.navigate('PaymentMethods'),
        },
      ],
    },
    {
      title: 'App Preferences',
      items: [
        {
          icon: 'moon',
          title: 'Dark Mode',
          description: 'Use dark theme for the app',
          type: 'switch' as const,
          value: settings.darkMode,
          onToggle: (value: boolean) => handleSettingToggle('darkMode', value),
        },
        {
          icon: 'volume-high',
          title: 'Sound Effects',
          description: 'Play sounds for app interactions',
          type: 'switch' as const,
          value: settings.soundEffects,
          onToggle: (value: boolean) => handleSettingToggle('soundEffects', value),
        },
        {
          icon: 'language',
          title: 'Language',
          description: 'English',
          type: 'navigation' as const,
          onPress: () => navigation.navigate('LanguageSettings'),
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: 'key',
          title: 'Change Password',
          description: 'Update your account password',
          type: 'action' as const,
          onPress: () => setShowChangePassword(true),
        },
        {
          icon: 'help-circle',
          title: 'Help & Support',
          description: 'Get help or contact support',
          type: 'navigation' as const,
          onPress: () => navigation.navigate('HelpSupport'),
        },
        {
          icon: 'information-circle',
          title: 'About',
          description: 'App version and information',
          type: 'navigation' as const,
          onPress: () => navigation.navigate('About'),
        },
        {
          icon: 'log-out',
          title: 'Logout',
          description: 'Sign out of your account',
          type: 'action' as const,
          onPress: handleLogout,
        },
        {
          icon: 'trash',
          title: 'Delete Account',
          description: 'Permanently delete your account',
          type: 'action' as const,
          onPress: handleDeleteAccount,
          dangerous: true,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingsItem) => (
    <TouchableOpacity
      key={item.title}
      style={[styles.settingItem, item.dangerous && styles.dangerousItem]}
      onPress={item.onPress}
      disabled={item.type === 'switch'}
    >
      <View style={styles.settingLeft}>
        <View style={[
          styles.settingIcon,
          item.dangerous && styles.dangerousIcon
        ]}>
          <Ionicons
            name={item.icon as any}
            size={20}
            color={item.dangerous ? colors.status.error : colors.primary.main}
          />
        </View>
        <View style={styles.settingContent}>
          <Text style={[
            styles.settingTitle,
            item.dangerous && styles.dangerousText
          ]}>
            {item.title}
          </Text>
          {item.description && (
            <Text style={styles.settingDescription}>{item.description}</Text>
          )}
        </View>
      </View>

      <View style={styles.settingRight}>
        {item.type === 'switch' && (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{
              false: colors.neutral[300],
              true: colors.primary.light,
            }}
            thumbColor={item.value ? colors.primary.main : colors.neutral.white}
          />
        )}
        {item.type === 'navigation' && (
          <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.neutral[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Messages */}
        <ErrorMessage
          message={errorMessage}
          visible={!!errorMessage}
          onDismiss={() => setErrorMessage('')}
        />

        <SuccessMessage
          message={successMessage}
          visible={!!successMessage}
          onDismiss={() => setSuccessMessage('')}
        />

        {/* Change Password Modal */}
        {showChangePassword && (
          <View style={styles.passwordModal}>
            <Text style={styles.modalTitle}>Change Password</Text>
            
            <Input
              label="Current Password"
              placeholder="Enter current password"
              value={passwordForm.currentPassword}
              onChangeText={(text) => setPasswordForm({ ...passwordForm, currentPassword: text })}
              secureTextEntry
            />

            <Input
              label="New Password"
              placeholder="Enter new password"
              value={passwordForm.newPassword}
              onChangeText={(text) => setPasswordForm({ ...passwordForm, newPassword: text })}
              secureTextEntry
            />

            <Input
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={passwordForm.confirmPassword}
              onChangeText={(text) => setPasswordForm({ ...passwordForm, confirmPassword: text })}
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowChangePassword(false);
                  setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                }}
                variant="secondary"
                size="medium"
                style={styles.modalCancelButton}
              />
              <Button
                title={isLoading ? "Changing..." : "Change Password"}
                onPress={handleChangePassword}
                variant="primary"
                size="medium"
                disabled={isLoading}
                style={styles.modalConfirmButton}
              />
            </View>
          </View>
        )}

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        {/* App Version */}
        <View style={styles.appVersion}>
          <Text style={styles.appVersionText}>Poolo v1.0.0</Text>
          <Text style={styles.appVersionSubtext}>Made with ❤️ in India</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },

  backButton: {
    padding: spacing.sm,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral[900],
  },

  placeholder: {
    width: 40,
  },

  content: {
    flex: 1,
    padding: spacing.lg,
  },

  section: {
    marginBottom: spacing.xl,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing.md,
  },

  sectionContent: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },

  dangerousItem: {
    backgroundColor: colors.neutral[50],
  },

  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  dangerousIcon: {
    backgroundColor: colors.neutral[100],
  },

  settingContent: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },

  dangerousText: {
    color: colors.status.error,
  },

  settingDescription: {
    fontSize: 14,
    color: colors.neutral[600],
  },

  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  passwordModal: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral[900],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },

  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },

  modalCancelButton: {
    flex: 1,
  },

  modalConfirmButton: {
    flex: 1,
  },

  appVersion: {
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.lg,
  },

  appVersionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },

  appVersionSubtext: {
    fontSize: 12,
    color: colors.neutral[500],
  },
});
