import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActionSheetIOS,
  Platform,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme/colors';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { SuccessMessage } from '../../components/common/SuccessMessage';
import { useAuth } from '../../contexts/AuthContext';
import { ProfilePictureService } from '../../services/auth/profilePictureService';

export const EnhancedProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [isUpdatingPicture, setIsUpdatingPicture] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleProfilePictureUpdate = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            await takePhoto();
          } else if (buttonIndex === 2) {
            await pickFromGallery();
          }
        }
      );
    } else {
      Alert.alert(
        'Update Profile Picture',
        'Choose an option',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Take Photo', onPress: takePhoto },
          { text: 'Choose from Gallery', onPress: pickFromGallery },
        ]
      );
    }
  };

  const takePhoto = async () => {
    try {
      setIsUpdatingPicture(true);
      setErrorMessage('');
      
      const result = await ProfilePictureService.pickFromCamera();
      
      if (!result.canceled && result.assets && result.assets[0]) {
        await uploadProfilePicture(result.assets[0].uri);
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to take photo');
    } finally {
      setIsUpdatingPicture(false);
    }
  };

  const pickFromGallery = async () => {
    try {
      setIsUpdatingPicture(true);
      setErrorMessage('');
      
      const result = await ProfilePictureService.pickFromGallery();
      
      if (!result.canceled && result.assets && result.assets[0]) {
        await uploadProfilePicture(result.assets[0].uri);
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to pick image');
    } finally {
      setIsUpdatingPicture(false);
    }
  };

  const uploadProfilePicture = async (imageUri: string) => {
    if (!user) return;

    try {
      const result = await ProfilePictureService.updateProfilePictureComplete(
        user.id,
        imageUri,
        user.profile_picture
      );

      if (result.success) {
        setSuccessMessage('Profile picture updated successfully!');
        // Note: In a real app, you'd refresh the user data here
      } else {
        setErrorMessage(result.error || 'Failed to update profile picture');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Upload failed');
    }
  };

  const handleLogout = async () => {
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
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        }}
        style={styles.headerBackground}
      >
        <LinearGradient
          colors={['rgba(46, 124, 246, 0.8)', 'rgba(30, 91, 194, 0.9)']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            {/* Profile Picture Section */}
            <View style={styles.profilePictureContainer}>
              <TouchableOpacity
                style={styles.profilePictureWrapper}
                onPress={handleProfilePictureUpdate}
                disabled={isUpdatingPicture}
              >
                {user?.profile_picture ? (
                  <Image
                    source={{ uri: user.profile_picture }}
                    style={styles.profilePicture}
                  />
                ) : (
                  <View style={styles.defaultProfilePicture}>
                    <Ionicons
                      name="person"
                      size={50}
                      color={colors.neutral.white}
                    />
                  </View>
                )}
                
                {/* Camera Icon Overlay */}
                <View style={styles.cameraIconContainer}>
                  {isUpdatingPicture ? (
                    <Ionicons name="sync" size={16} color={colors.neutral.white} />
                  ) : (
                    <Ionicons name="camera" size={16} color={colors.neutral.white} />
                  )}
                </View>
              </TouchableOpacity>

              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userEmail}>@{user?.username || 'username'}</Text>
              
              {user?.rating && (
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color={colors.special.gold} />
                  <Text style={styles.ratingText}>{user.rating.toFixed(1)}</Text>
                  <Text style={styles.ratingCount}>({user.total_rides || 0} rides)</Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>

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

        {/* Profile Info Cards */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="mail" size={20} color={colors.primary.main} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || 'Not set'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="call" size={20} color={colors.secondary.main} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user?.phone_number || 'Not set'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="calendar" size={20} color={colors.special.orange} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>
                  {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsCard}>
            <Text style={styles.sectionTitle}>Your Stats</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="car" size={24} color={colors.primary.main} />
                </View>
                <Text style={styles.statNumber}>{user?.total_rides || 0}</Text>
                <Text style={styles.statLabel}>Total Rides</Text>
              </View>

              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="star" size={24} color={colors.special.gold} />
                </View>
                <Text style={styles.statNumber}>{user?.rating ? user.rating.toFixed(1) : '0.0'}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>

              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="shield-checkmark" size={24} color={colors.secondary.main} />
                </View>
                <Text style={styles.statNumber}>{user?.is_verified ? 'Yes' : 'No'}</Text>
                <Text style={styles.statLabel}>Verified</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="settings" size={20} color={colors.neutral[600]} />
            <Text style={styles.actionButtonText}>Settings</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.neutral[400]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="car" size={20} color={colors.neutral[600]} />
            <Text style={styles.actionButtonText}>My Vehicles</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.neutral[400]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="help-circle" size={20} color={colors.neutral[600]} />
            <Text style={styles.actionButtonText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.neutral[400]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="document-text" size={20} color={colors.neutral[600]} />
            <Text style={styles.actionButtonText}>Terms & Privacy</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.neutral[400]} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="primary"
            size="large"
            style={styles.logoutButton}
          />
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

  headerBackground: {
    height: 280,
  },

  headerGradient: {
    flex: 1,
    justifyContent: 'center',
  },

  headerContent: {
    alignItems: 'center',
    paddingTop: 50,
  },

  profilePictureContainer: {
    alignItems: 'center',
  },

  profilePictureWrapper: {
    position: 'relative',
    marginBottom: spacing.md,
  },

  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.neutral.white,
  },

  defaultProfilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.neutral.white,
  },

  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.neutral.white,
  },

  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.neutral.white,
    marginBottom: spacing.xs,
  },

  userEmail: {
    fontSize: 16,
    color: colors.neutral.white,
    opacity: 0.9,
    marginBottom: spacing.sm,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    gap: spacing.xs,
  },

  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.white,
  },

  ratingCount: {
    fontSize: 12,
    color: colors.neutral.white,
    opacity: 0.8,
  },

  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.neutral[50],
    paddingHorizontal: spacing.lg,
  },

  infoSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },

  infoCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },

  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },

  infoValue: {
    fontSize: 16,
    color: colors.neutral[900],
    fontWeight: '500',
  },

  statsSection: {
    marginBottom: spacing.lg,
  },

  statsCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing.lg,
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  statItem: {
    alignItems: 'center',
  },

  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },

  statLabel: {
    fontSize: 12,
    color: colors.neutral[600],
  },

  actionsSection: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },

  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: colors.neutral[900],
    marginLeft: spacing.md,
    fontWeight: '500',
  },

  logoutSection: {
    marginBottom: spacing['2xl'],
  },

  logoutButton: {
    backgroundColor: colors.status.error,
  },
});
