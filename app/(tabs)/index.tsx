import { useState } from 'react';
import { StyleSheet, View, ScrollView, ImageBackground, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { Button, Card, Input } from '@/src/components';
import { ThemedText } from '@/src/components/legacy/ThemedText';
import { useTheme } from '@/src/context/ThemeContext';
import { DesignTokens } from '@/src/design/tokens';

const { width, height } = Dimensions.get('window');
const PERSON_COUNTS = [1, 2, 3, 4];
const RIDE_MODES = [
  { id: 'Any', name: 'Any', icon: '🚗', color: DesignTokens.colors.secondary },
  { id: 'Bike', name: 'Bike', icon: '🏍️', color: DesignTokens.colors.error },
  { id: 'Car', name: 'Car', icon: '🚗', color: DesignTokens.colors.success },
  { id: 'Cab', name: 'Cab', icon: '🚕', color: DesignTokens.colors.primary }
];

export default function SearchScreen() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [personCount, setPersonCount] = useState(1);
  const [rideMode, setRideMode] = useState('Any');
  const { theme, isDark } = useTheme();

  const handleSearch = () => {
    console.log('Searching for rides:', { fromLocation, toLocation, personCount, rideMode });
    // TODO: Implement actual search functionality with database
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false} // Disable bouncing for better UX
      >
        {/* Hero Section with Background Image */}
        <View style={styles.heroSection}>
          <ImageBackground
            source={{ uri: DesignTokens.images.hero }}
            style={styles.heroBackground}
            resizeMode="cover"
          >
            <LinearGradient
              colors={isDark 
                ? ['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)'] 
                : ['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']
              }
              style={styles.heroGradient}
            >
              <SafeAreaView style={styles.heroContent}>
                <View style={styles.heroTextContainer}>
                  <ThemedText style={styles.heroTitle}>
                    Find Your Perfect Ride
                  </ThemedText>
                  <ThemedText style={styles.heroSubtitle}>
                    Connect with travelers going your way
                  </ThemedText>
                  <View style={styles.heroStats}>
                    <View style={styles.statItem}>
                      <ThemedText style={styles.statNumber}>1000+</ThemedText>
                      <ThemedText style={styles.statLabel}>Active Riders</ThemedText>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <ThemedText style={styles.statNumber}>500+</ThemedText>
                      <ThemedText style={styles.statLabel}>Daily Rides</ThemedText>
                    </View>
                  </View>
                </View>
              </SafeAreaView>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Search Form */}
        <View style={styles.searchSection}>
          <BlurView intensity={80} style={styles.searchCard}>
            <View style={styles.searchForm}>
              <View style={styles.locationInputs}>
                <View style={styles.inputWithIcon}>
                  <View style={[styles.locationDot, { backgroundColor: DesignTokens.colors.success }]} />
                  <View style={styles.locationInput}>
                    <Input
                      placeholder="Leaving from..."
                      value={fromLocation}
                      onChangeText={setFromLocation}
                      size="lg"
                    />
                  </View>
                </View>

                <View style={styles.inputWithIcon}>
                  <View style={[styles.locationDot, { backgroundColor: DesignTokens.colors.error }]} />
                  <View style={styles.locationInput}>
                    <Input
                      placeholder="Going to..."
                      value={toLocation}
                      onChangeText={setToLocation}
                      size="lg"
                    />
                  </View>
                </View>
              </View>

              {/* Person Count */}
              <View style={styles.selectionSection}>
                <ThemedText style={styles.sectionLabel}>
                  👥 Passengers
                </ThemedText>
                <View style={styles.buttonRow}>
                  {PERSON_COUNTS.map((count) => (
                    <TouchableOpacity
                      key={count}
                      style={[
                        styles.countButton,
                        personCount === count && styles.selectedCountButton
                      ]}
                      onPress={() => setPersonCount(count)}
                    >
                      <ThemedText style={[
                        styles.countButtonText,
                        personCount === count && styles.selectedCountButtonText
                      ]}>
                        {count}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Ride Mode */}
              <View style={styles.selectionSection}>
                <ThemedText style={styles.sectionLabel}>
                  🚗 Vehicle Type
                </ThemedText>
                <View style={styles.modeRow}>
                  {RIDE_MODES.map((mode) => (
                    <TouchableOpacity
                      key={mode.id}
                      style={[
                        styles.modeButton,
                        rideMode === mode.id && [styles.selectedModeButton, { backgroundColor: mode.color }]
                      ]}
                      onPress={() => setRideMode(mode.id)}
                    >
                      <ThemedText style={styles.modeIcon}>{mode.icon}</ThemedText>
                      <ThemedText style={[
                        styles.modeButtonText,
                        rideMode === mode.id && styles.selectedModeButtonText
                      ]}>
                        {mode.name}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <LinearGradient
                  colors={[DesignTokens.colors.primary, DesignTokens.colors.primaryDark]}
                  style={styles.searchButtonGradient}
                >
                  <ThemedText style={styles.searchButtonText}>
                    🔍 Search Rides
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>

        {/* Results Section */}
        <View style={styles.resultsSection}>
          <Card variant="elevated" style={styles.resultsCard}>
            <View style={styles.resultsHeader}>
              <ThemedText style={styles.resultsTitle}>
                Available Rides
              </ThemedText>
              <View style={styles.resultsFilter}>
                <ThemedText style={styles.filterText}>Filter</ThemedText>
                <ThemedText style={styles.filterIcon}>⚙️</ThemedText>
              </View>
            </View>
            
            <View style={styles.emptyState}>
              <View style={styles.emptyIllustration}>
                <ThemedText style={styles.emptyEmoji}>🚗</ThemedText>
                <ThemedText style={styles.emptyEmoji}>🔍</ThemedText>
              </View>
              <ThemedText style={styles.emptyTitle}>
                Ready to find your ride?
              </ThemedText>
              <ThemedText style={styles.emptyText}>
                Enter your pickup and destination locations above to discover available rides in your area.
              </ThemedText>
              <View style={styles.emptyFeatures}>
                <View style={styles.featureItem}>
                  <ThemedText style={styles.featureIcon}>💸</ThemedText>
                  <ThemedText style={styles.featureText}>Save money</ThemedText>
                </View>
                <View style={styles.featureItem}>
                  <ThemedText style={styles.featureIcon}>🌱</ThemedText>
                  <ThemedText style={styles.featureText}>Go green</ThemedText>
                </View>
                <View style={styles.featureItem}>
                  <ThemedText style={styles.featureIcon}>👥</ThemedText>
                  <ThemedText style={styles.featureText}>Meet people</ThemedText>
                </View>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignTokens.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: DesignTokens.spacing.xxl, // Add bottom padding to ensure content is accessible
  },

  // Hero Section
  heroSection: {
    height: height * 0.4, // Reduced from 0.45 to give more space for content
    position: 'relative',
  },
  heroBackground: {
    flex: 1,
    width: '100%',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'center',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
  },
  heroTextContainer: {
    paddingHorizontal: DesignTokens.spacing.xl,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: DesignTokens.typography.fontSizes['3xl'],
    fontWeight: '800',
    color: DesignTokens.colors.textInverse,
    textAlign: 'center',
    marginBottom: DesignTokens.spacing.sm,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: DesignTokens.typography.fontSizes.lg,
    color: DesignTokens.colors.textInverse,
    textAlign: 'center',
    marginBottom: DesignTokens.spacing.xl,
    opacity: 0.9,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: DesignTokens.borderRadius.lg,
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingVertical: DesignTokens.spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: DesignTokens.typography.fontSizes.xl,
    fontWeight: '700',
    color: DesignTokens.colors.textInverse,
  },
  statLabel: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    color: DesignTokens.colors.textInverse,
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: DesignTokens.spacing.lg,
  },

  // Search Section
  searchSection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: -30, // Reduced from -40 to prevent overlap issues
    zIndex: 10,
    marginBottom: DesignTokens.spacing.lg, // Added margin to ensure spacing
  },
  searchCard: {
    borderRadius: DesignTokens.borderRadius.xl,
    overflow: 'hidden',
    ...DesignTokens.shadows.lg,
  },
  searchForm: {
    padding: DesignTokens.spacing.lg,
    gap: DesignTokens.spacing.md, // Reduced from lg to md for better spacing
  },
  locationInputs: {
    gap: DesignTokens.spacing.sm, // Reduced from md
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.sm + 4,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  locationInput: {
    flex: 1,
  },

  // Selection Sections
  selectionSection: {
    gap: DesignTokens.spacing.xs, // Reduced from sm
  },
  sectionLabel: {
    fontSize: DesignTokens.typography.fontSizes.base,
    fontWeight: '600',
    color: DesignTokens.colors.textPrimary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.sm,
  },
  countButton: {
    flex: 1,
    backgroundColor: DesignTokens.colors.backgroundSecondary,
    borderRadius: DesignTokens.borderRadius.md,
    paddingVertical: DesignTokens.spacing.sm + 2, // Reduced padding
    alignItems: 'center',
    borderWidth: 2,
    borderColor: DesignTokens.colors.border,
    minWidth: 50, // Ensure minimum width
  },
  selectedCountButton: {
    backgroundColor: DesignTokens.colors.primary,
    borderColor: DesignTokens.colors.primary,
  },
  countButtonText: {
    fontSize: DesignTokens.typography.fontSizes.base,
    fontWeight: '600',
    color: DesignTokens.colors.textPrimary,
  },
  selectedCountButtonText: {
    color: DesignTokens.colors.textInverse,
  },

  // Mode Selection
  modeRow: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.xs, // Reduced gap for better fit
    flexWrap: 'wrap', // Allow wrapping on smaller screens
  },
  modeButton: {
    flex: 1,
    minWidth: 70, // Ensure minimum width for proper display
    backgroundColor: DesignTokens.colors.backgroundSecondary,
    borderRadius: DesignTokens.borderRadius.md,
    paddingVertical: DesignTokens.spacing.sm + 2, // Slightly reduced padding
    alignItems: 'center',
    borderWidth: 2,
    borderColor: DesignTokens.colors.border,
    gap: DesignTokens.spacing.xs - 2, // Reduced gap
  },
  selectedModeButton: {
    borderWidth: 3,
    ...DesignTokens.shadows.sm,
  },
  modeIcon: {
    fontSize: 20, // Reduced from 24
  },
  modeButtonText: {
    fontSize: DesignTokens.typography.fontSizes.xs, // Reduced from sm
    fontWeight: '600',
    color: DesignTokens.colors.textPrimary,
  },
  selectedModeButtonText: {
    color: DesignTokens.colors.textInverse,
    fontWeight: '700',
  },

  // Search Button
  searchButton: {
    borderRadius: DesignTokens.borderRadius.lg,
    overflow: 'hidden',
    marginTop: DesignTokens.spacing.sm, // Reduced from md
  },
  searchButtonGradient: {
    paddingVertical: DesignTokens.spacing.md,
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: DesignTokens.typography.fontSizes.lg,
    fontWeight: '700',
    color: DesignTokens.colors.textInverse,
  },

  // Results Section
  resultsSection: {
    padding: DesignTokens.spacing.lg,
    paddingTop: DesignTokens.spacing.sm, // Reduced from xl to save space
  },
  resultsCard: {
    padding: DesignTokens.spacing.lg,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.lg,
  },
  resultsTitle: {
    fontSize: DesignTokens.typography.fontSizes.xl,
    fontWeight: '700',
    color: DesignTokens.colors.textPrimary,
  },
  resultsFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.xs,
    backgroundColor: DesignTokens.colors.backgroundSecondary,
    paddingHorizontal: DesignTokens.spacing.sm + 4,
    paddingVertical: DesignTokens.spacing.xs,
    borderRadius: DesignTokens.borderRadius.md,
  },
  filterText: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    color: DesignTokens.colors.textSecondary,
  },
  filterIcon: {
    fontSize: 14,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: DesignTokens.spacing.xxl,
    gap: DesignTokens.spacing.md,
  },
  emptyIllustration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.sm,
    marginBottom: DesignTokens.spacing.md,
  },
  emptyEmoji: {
    fontSize: 48,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: DesignTokens.typography.fontSizes.xl,
    fontWeight: '700',
    color: DesignTokens.colors.textPrimary,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: DesignTokens.typography.fontSizes.base,
    color: DesignTokens.colors.textSecondary,
    textAlign: 'center',
    lineHeight: DesignTokens.typography.lineHeights.relaxed * DesignTokens.typography.fontSizes.base,
    paddingHorizontal: DesignTokens.spacing.lg,
  },
  emptyFeatures: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.xl,
    marginTop: DesignTokens.spacing.lg,
  },
  featureItem: {
    alignItems: 'center',
    gap: DesignTokens.spacing.xs,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    color: DesignTokens.colors.textMuted,
    fontWeight: '600',
  },
});
