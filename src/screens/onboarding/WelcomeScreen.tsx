import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme/colors';
import { Button } from '../../components/common/Button';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation: any;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        }}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(46, 124, 246, 0.8)', 'rgba(30, 91, 194, 0.9)', 'rgba(0, 0, 0, 0.3)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {/* Header with Logo */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Ionicons name="car" size={48} color={colors.neutral.white} />
                </View>
                <Text style={styles.appName}>Poolo</Text>
                <Text style={styles.tagline}>Share Rides, Split Costs</Text>
              </View>
            </View>

            {/* Features Section */}
            <View style={styles.featuresSection}>
              <Text style={styles.welcomeTitle}>Welcome to the Future of Ride Sharing</Text>
              {/* <Text style={styles.welcomeSubtitle}>
                Join thousands of riders saving money and reducing carbon footprint
              </Text> */}

              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="people" size={24} color={colors.secondary.main} />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>Share Rides</Text>
                    <Text style={styles.featureDescription}>
                      Connect with verified riders going your way
                    </Text>
                  </View>
                </View>

                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="wallet" size={24} color={colors.special.gold} />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>Save Money</Text>
                    <Text style={styles.featureDescription}>
                      Cut your travel costs by up to 70%
                    </Text>
                  </View>
                </View>

                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="leaf" size={24} color={colors.secondary.main} />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>Go Green</Text>
                    <Text style={styles.featureDescription}>
                      Reduce carbon emissions together
                    </Text>
                  </View>
                </View>

                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="shield-checkmark" size={24} color={colors.primary.main} />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>Safe & Secure</Text>
                    <Text style={styles.featureDescription}>
                      Verified profiles and secure payments
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionSection}>
              <Button
                title="Get Started"
                onPress={navigateToRegister}
                variant="primary"
                size="large"
                style={styles.primaryButton}
              />

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={navigateToLogin}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>

              {/* Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>10K+</Text>
                  <Text style={styles.statLabel}>Active Riders</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>₹50L+</Text>
                  <Text style={styles.statLabel}>Money Saved</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>5K+</Text>
                  <Text style={styles.statLabel}>Cities</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.main,
  },

  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  gradient: {
    flex: 1,
  },

  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },

  header: {
    alignItems: 'center',
    paddingTop: spacing['3xl'],
  },

  logoContainer: {
    alignItems: 'center',
  },

  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.neutral.white,
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  tagline: {
    fontSize: 18,
    color: colors.neutral.white,
    fontWeight: '500',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  featuresSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing['2xl'],
  },

  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.neutral.white,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 36,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  welcomeSubtitle: {
    fontSize: 16,
    color: colors.neutral.white,
    textAlign: 'center',
    marginBottom: spacing['3xl'],
    opacity: 0.9,
    lineHeight: 24,
    paddingHorizontal: spacing.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  featuresList: {
    gap: spacing.lg,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  featureContent: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral.white,
    marginBottom: spacing.xs,
  },

  featureDescription: {
    fontSize: 14,
    color: colors.neutral.white,
    opacity: 0.8,
    lineHeight: 20,
  },

  actionSection: {
    paddingBottom: spacing.xl,
  },

  primaryButton: {
    marginBottom: spacing.lg,
    //backgroundColor: colors.neutral.white,
    borderRadius: 16,
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },

  loginText: {
    fontSize: 16,
    color: colors.neutral.white,
    opacity: 0.9,
  },

  loginLink: {
    fontSize: 16,
    color: colors.neutral.white,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  statItem: {
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.neutral.white,
    marginBottom: spacing.xs,
  },

  statLabel: {
    fontSize: 12,
    color: colors.neutral.white,
    opacity: 0.8,
    fontWeight: '500',
  },

  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
