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
                  👥 How many passengers?
                </ThemedText>
                <View style={styles.passengerSelector}>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => setPersonCount(Math.max(1, personCount - 1))}
                  >
                    <ThemedText style={styles.counterButtonText}>−</ThemedText>
                  </TouchableOpacity>
                  
                  <View style={styles.passengerDisplay}>
                    <ThemedText style={styles.passengerCount}>{personCount}</ThemedText>
                    <ThemedText style={styles.passengerLabel}>
                      {personCount === 1 ? 'passenger' : 'passengers'}
                    </ThemedText>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => setPersonCount(Math.min(6, personCount + 1))}
                  >
                    <ThemedText style={styles.counterButtonText}>+</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Ride Mode */}
              <View style={styles.selectionSection}>
                <ThemedText style={styles.sectionLabel}>
                  🚗 Choose your ride
                </ThemedText>
                <View style={styles.compactVehicleRow}>
                  {RIDE_MODES.map((mode) => (
                    <TouchableOpacity
                      key={mode.id}
                      style={[
                        styles.compactVehicleButton,
                        rideMode === mode.id && [styles.selectedCompactVehicle, { borderColor: mode.color }]
                      ]}
                      onPress={() => setRideMode(mode.id)}
                      activeOpacity={0.7}
                    >
                      <ThemedText style={styles.compactVehicleIcon}>
                        {mode.icon}
                      </ThemedText>
                      <ThemedText style={[
                        styles.compactVehicleText,
                        rideMode === mode.id && { color: mode.color, fontWeight: '700' }
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
    gap: DesignTokens.spacing.md,
  },
  sectionLabel: {
    fontSize: DesignTokens.typography.fontSizes.lg,
    fontWeight: '700',
    color: DesignTokens.colors.textPrimary,
    marginBottom: DesignTokens.spacing.sm,
  },

  // Passenger Count Selector
  passengerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DesignTokens.colors.backgroundSecondary,
    borderRadius: DesignTokens.borderRadius.xl,
    padding: DesignTokens.spacing.lg,
    ...DesignTokens.shadows.sm,
  },
  counterButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: DesignTokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...DesignTokens.shadows.sm,
  },
  counterButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: DesignTokens.colors.textInverse,
  },
  passengerDisplay: {
    alignItems: 'center',
    marginHorizontal: DesignTokens.spacing.lg,
    minWidth: 80,
  },
  passengerCount: {
    fontSize: 28,
    fontWeight: '800',
    color: DesignTokens.colors.primary,
    marginBottom: 2,
  },
  passengerLabel: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    color: DesignTokens.colors.textSecondary,
    fontWeight: '600',
  },

  // Vehicle Selection Grid
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DesignTokens.spacing.md,
  },
  vehicleCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: DesignTokens.colors.surface,
    borderRadius: DesignTokens.borderRadius.xl,
    padding: DesignTokens.spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: DesignTokens.colors.border,
    position: 'relative',
    ...DesignTokens.shadows.sm,
  },
  selectedVehicleCard: {
    borderWidth: 3,
    ...DesignTokens.shadows.md,
  },
  vehicleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: DesignTokens.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: DesignTokens.spacing.md,
  },
  vehicleEmoji: {
    fontSize: 32,
  },
  selectedVehicleEmoji: {
    transform: [{ scale: 1.1 }],
  },
  vehicleName: {
    fontSize: DesignTokens.typography.fontSizes.base,
    fontWeight: '600',
    color: DesignTokens.colors.textPrimary,
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheck: {
    fontSize: 14,
    color: DesignTokens.colors.textInverse,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.sm,
  },
  countButton: {
    flex: 1,
    backgroundColor: DesignTokens.colors.surface,
    borderRadius: DesignTokens.borderRadius.lg,
    paddingVertical: DesignTokens.spacing.md,
    paddingHorizontal: DesignTokens.spacing.sm,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: DesignTokens.colors.border,
    ...DesignTokens.shadows.sm,
  },
  selectedCountButton: {
    backgroundColor: DesignTokens.colors.primary,
    borderColor: DesignTokens.colors.primary,
    transform: [{ scale: 1.02 }],
  },
  countButtonContent: {
    alignItems: 'center',
    gap: DesignTokens.spacing.xs,
  },
  countIcon: {
    fontSize: 20,
  },
  countButtonText: {
    fontSize: DesignTokens.typography.fontSizes.lg,
    fontWeight: '700',
    color: DesignTokens.colors.textPrimary,
  },
  selectedCountButtonText: {
    color: DesignTokens.colors.textInverse,
  },
  countLabel: {
    fontSize: DesignTokens.typography.fontSizes.xs,
    color: DesignTokens.colors.textMuted,
    fontWeight: '500',
  },
  selectedCountLabel: {
    color: DesignTokens.colors.textInverse,
    opacity: 0.9,
  },

  // Mode Selection
  modeRow: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.sm,
  },
  modeButton: {
    flex: 1,
    backgroundColor: DesignTokens.colors.surface,
    borderRadius: DesignTokens.borderRadius.lg,
    paddingVertical: DesignTokens.spacing.md + 4,
    paddingHorizontal: DesignTokens.spacing.sm,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: DesignTokens.colors.border,
    ...DesignTokens.shadows.sm,
    position: 'relative',
  },
  selectedModeButton: {
    borderWidth: 3,
    transform: [{ scale: 1.02 }],
    ...DesignTokens.shadows.md,
  },
  modeButtonContent: {
    alignItems: 'center',
    gap: DesignTokens.spacing.xs,
    width: '100%',
  },
  modeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: DesignTokens.borderRadius.round,
    backgroundColor: DesignTokens.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedModeIconContainer: {
    backgroundColor: DesignTokens.colors.textInverse,
  },
  modeIcon: {
    fontSize: 20,
  },
  modeButtonText: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    fontWeight: '600',
    color: DesignTokens.colors.textPrimary,
  },
  selectedModeButtonText: {
    color: DesignTokens.colors.textInverse,
    fontWeight: '700',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: DesignTokens.borderRadius.round,
    backgroundColor: DesignTokens.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 12,
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

  // Compact Vehicle Selection
  compactVehicleRow: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.sm,
  },
  compactVehicleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DesignTokens.colors.backgroundSecondary,
    borderRadius: DesignTokens.borderRadius.md,
    paddingVertical: DesignTokens.spacing.sm + 2,
    paddingHorizontal: DesignTokens.spacing.xs,
    borderWidth: 2,
    borderColor: DesignTokens.colors.border,
    gap: DesignTokens.spacing.xs,
  },
  selectedCompactVehicle: {
    backgroundColor: `${DesignTokens.colors.backgroundSecondary}80`,
    borderWidth: 2,
    ...DesignTokens.shadows.sm,
  },
  compactVehicleIcon: {
    fontSize: 16,
  },
  compactVehicleText: {
    fontSize: DesignTokens.typography.fontSizes.xs,
    fontWeight: '600',
    color: DesignTokens.colors.textPrimary,
  },
});
