import { useState, useRef } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  ScrollView, 
  Animated, 
  Dimensions,
  Platform,
  Alert,
  Modal,
  StatusBar,
  ViewStyle,
  TextStyle
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { ThemedText, ThemedView, Button, Card, Input } from '@/src/components';
import { useTheme } from '@/src/context/ThemeContext';
import { DesignTokens } from '@/src/design/tokens';

// Placeholder for map component
const CrossPlatformMap = ({ style, onPress, markers, initialRegion }: any) => (
  <View style={[style, { backgroundColor: DesignTokens.colors.backgroundSecondary, justifyContent: 'center', alignItems: 'center' }]}>
    <ThemedText>Map View Placeholder</ThemedText>
    <ThemedText style={{ fontSize: 12, marginTop: 8, textAlign: 'center' }}>
      Tap anywhere to select location
    </ThemedText>
  </View>
);

const { width, height } = Dimensions.get('window');
const RIDE_MODES = [
  { id: 'bike', name: 'Bike', icon: '🏍️', color: DesignTokens.colors.error },
  { id: 'car', name: 'Car', icon: '🚗', color: DesignTokens.colors.success },
  { id: 'cab', name: 'Cab', icon: '🚕', color: DesignTokens.colors.primary }
];

interface MapLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export default function PublishScreen() {
  const { isDark } = useTheme();
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupCoords, setPickupCoords] = useState<MapLocation | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<MapLocation | null>(null);
  const [rideMode, setRideMode] = useState('car');
  const [price, setPrice] = useState('');
  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState(new Date());
  const [showPickupDatePicker, setShowPickupDatePicker] = useState(false);
  const [showPickupTimePicker, setShowPickupTimePicker] = useState(false);
  const [personCount, setPersonCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapSelectionType, setMapSelectionType] = useState<'pickup' | 'dropoff'>('pickup');
  const [tempLocation, setTempLocation] = useState<MapLocation | null>(null);

  // Animation values
  const slideAnimation = useRef(new Animated.Value(50)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.9)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const cardAnimations = useRef(Array.from({ length: 6 }, () => new Animated.Value(0))).current;

  // Start animations when component mounts
  useState(() => {
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Stagger card animations
    cardAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePublish = () => {
    animateButton();
    if (!pickupLocation || !dropoffLocation || !price) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    
    setIsLoading(true);
    console.log('Publishing ride:', {
      pickupLocation,
      dropoffLocation,
      pickupCoords,
      dropoffCoords,
      rideMode,
      price,
      pickupDate,
      pickupTime,
      personCount,
    });
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Your ride has been published successfully! 🎉');
      // Reset form
      setPickupLocation('');
      setDropoffLocation('');
      setPickupCoords(null);
      setDropoffCoords(null);
      setPrice('');
      setPersonCount(1);
    }, 2000);
  };

  const getCurrentLocation = async (): Promise<MapLocation | null> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location access is needed to use this feature.');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address[0]) {
        const currentLocation: MapLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: `${address[0].street || ''}, ${address[0].city || ''}`.trim(),
        };
        return currentLocation;
      }
      return null;
    } catch (error) {
      Alert.alert('Error', 'Unable to get current location.');
      return null;
    }
  };

  const openMapPicker = async (type: 'pickup' | 'dropoff') => {
    setMapSelectionType(type);
    
    // Get current location for initial map position
    const currentLoc = await getCurrentLocation();
    if (currentLoc) {
      setTempLocation(currentLoc);
    }
    
    setShowMapModal(true);
  };

  const handleMapLocationSelect = (coordinate: any) => {
    const newLocation: MapLocation = {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      address: `${coordinate.latitude.toFixed(6)}, ${coordinate.longitude.toFixed(6)}`,
    };
    setTempLocation(newLocation);
  };

  const confirmMapSelection = async () => {
    if (tempLocation) {
      // Reverse geocode to get address
      try {
        const address = await Location.reverseGeocodeAsync({
          latitude: tempLocation.latitude,
          longitude: tempLocation.longitude,
        });
        
        const formattedAddress = address[0] ? 
          `${address[0].street || ''}, ${address[0].city || ''}`.trim() : 
          tempLocation.address;

        const locationWithAddress = {
          ...tempLocation,
          address: formattedAddress,
        };

        if (mapSelectionType === 'pickup') {
          setPickupLocation(locationWithAddress.address);
          setPickupCoords(locationWithAddress);
        } else {
          setDropoffLocation(locationWithAddress.address);
          setDropoffCoords(locationWithAddress);
        }
      } catch (error) {
        // Fallback to coordinates if reverse geocoding fails
        if (mapSelectionType === 'pickup') {
          setPickupLocation(tempLocation.address);
          setPickupCoords(tempLocation);
        } else {
          setDropoffLocation(tempLocation.address);
          setDropoffCoords(tempLocation);
        }
      }
    }
    setShowMapModal(false);
  };

  const dynamicStyles = {
    background: {
      backgroundColor: isDark ? DesignTokens.colors.backgroundDark : DesignTokens.colors.background,
    },
    cardBackground: {
      backgroundColor: isDark ? DesignTokens.colors.surfaceDark : DesignTokens.colors.surface,
    },
    glassCard: {
      backgroundColor: isDark ? DesignTokens.colors.surfaceDark : DesignTokens.colors.surface,
    },
    mapButton: {
      backgroundColor: DesignTokens.colors.primary,
    },
    gradient: isDark ? [DesignTokens.colors.backgroundDark, DesignTokens.colors.backgroundSecondaryDark] : [DesignTokens.colors.background, DesignTokens.colors.backgroundSecondary],
  };

  const MapModal = () => (
    <Modal visible={showMapModal} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.mapModalContainer}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <CrossPlatformMap
          style={styles.map}
          initialRegion={{
            latitude: tempLocation?.latitude || 37.78825,
            longitude: tempLocation?.longitude || -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleMapLocationSelect}
          markers={tempLocation ? [{
            coordinate: {
              latitude: tempLocation.latitude,
              longitude: tempLocation.longitude,
            },
            title: mapSelectionType === 'pickup' ? 'Pickup Location' : 'Dropoff Location'
          }] : []}
        />
        
        <BlurView intensity={80} style={styles.mapModalHeader}>
          <ThemedText type="subtitle" style={styles.mapModalTitle}>
            Select {mapSelectionType === 'pickup' ? 'Pickup' : 'Dropoff'} Location
          </ThemedText>
          <View style={styles.mapModalButtons}>
            <TouchableOpacity
              style={[styles.mapModalButton, { backgroundColor: DesignTokens.colors.secondary }]}
              onPress={() => setShowMapModal(false)}
            >
              <ThemedText style={styles.mapModalButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.mapModalButton, dynamicStyles.mapButton]}
              onPress={confirmMapSelection}
              disabled={!tempLocation}
            >
              <ThemedText style={styles.mapModalButtonText}>Confirm</ThemedText>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.background]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <MapModal />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnimation,
            transform: [{ translateY: slideAnimation }],
          },
        ]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <Animated.View
            style={[
              styles.headerCard,
              dynamicStyles.glassCard,
              {
                transform: [{ scale: scaleAnimation }],
                opacity: cardAnimations[0],
              },
            ]}>
            <BlurView intensity={isDark ? 50 : 80} style={styles.headerBlur}>
              <View style={styles.headerContent}>
                <View style={styles.iconContainer}>
                  <ThemedText style={styles.headerIcon}>🚗</ThemedText>
                </View>
                <ThemedText type="title" style={styles.headerTitle}>
                  Publish Your Ride
                </ThemedText>
                <ThemedText style={styles.headerSubtitle}>
                  Share your journey with fellow travelers
                </ThemedText>
              </View>
            </BlurView>
          </Animated.View>

          {/* Location Cards */}
          <Animated.View
            style={[
              styles.locationCard,
              dynamicStyles.glassCard,
              {
                opacity: cardAnimations[1],
                transform: [{ scale: cardAnimations[1] }],
              },
            ]}>
            <BlurView intensity={isDark ? 50 : 80} style={styles.cardBlur}>
              <View style={styles.locationSection}>
                <View style={styles.locationHeader}>
                  <View style={[styles.locationDot, { backgroundColor: DesignTokens.colors.success }]} />
                  <ThemedText type="subtitle" style={styles.locationLabel}>
                    From
                  </ThemedText>
                </View>
                <View style={styles.locationInputRow}>
                  <Input
                    placeholder="Pickup location"
                    value={pickupLocation}
                    onChangeText={setPickupLocation}
                    containerStyle={styles.modernInput}
                  />
                  <TouchableOpacity 
                    style={[styles.modernMapButton, dynamicStyles.mapButton]} 
                    onPress={() => openMapPicker('pickup')}
                    activeOpacity={0.7}>
                    <ThemedText style={styles.mapButtonText}>📍</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.locationDivider} />

              <View style={styles.locationSection}>
                <View style={styles.locationHeader}>
                  <View style={[styles.locationDot, { backgroundColor: DesignTokens.colors.error }]} />
                  <ThemedText type="subtitle" style={styles.locationLabel}>
                    To
                  </ThemedText>
                </View>
                <View style={styles.locationInputRow}>
                  <Input
                    placeholder="Destination"
                    value={dropoffLocation}
                    onChangeText={setDropoffLocation}
                    variant="filled"
                    size="lg"
                  />
                  <TouchableOpacity 
                    style={[styles.modernMapButton, dynamicStyles.mapButton]} 
                    onPress={() => openMapPicker('dropoff')}
                    activeOpacity={0.7}>
                    <ThemedText style={styles.mapButtonText}>📍</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Vehicle Mode Selection */}
          <Animated.View
            style={[
              styles.vehicleCard,
              dynamicStyles.glassCard,
              {
                opacity: cardAnimations[2],
                transform: [{ scale: cardAnimations[2] }],
              },
            ]}>
            <BlurView intensity={isDark ? 50 : 80} style={styles.cardBlur}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                🚙 Choose Vehicle
              </ThemedText>
              <View style={styles.vehicleOptions}>
                {RIDE_MODES.map((mode, index) => (
                  <TouchableOpacity
                    key={mode.id}
                    style={[
                      styles.vehicleOption,
                      rideMode === mode.id && [
                        styles.selectedVehicle,
                        { backgroundColor: mode.color, borderColor: mode.color }
                      ],
                    ]}
                    onPress={() => setRideMode(mode.id)}
                    activeOpacity={0.7}>
                    <ThemedText style={styles.vehicleIcon}>{mode.icon}</ThemedText>
                    <ThemedText
                      style={[
                        styles.vehicleText,
                        rideMode === mode.id && styles.selectedVehicleText,
                      ]}>
                      {mode.name}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </BlurView>
          </Animated.View>

          {/* Details Card */}
          <Animated.View
            style={[
              styles.detailsCard,
              dynamicStyles.glassCard,
              {
                opacity: cardAnimations[3],
                transform: [{ scale: cardAnimations[3] }],
              },
            ]}>
            <BlurView intensity={isDark ? 50 : 80} style={styles.cardBlur}>
              {/* Person Count */}
              <View style={styles.detailSection}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  👥 Available Seats
                </ThemedText>
                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => setPersonCount(Math.max(1, personCount - 1))}
                    activeOpacity={0.7}>
                    <ThemedText style={styles.counterButtonText}>−</ThemedText>
                  </TouchableOpacity>
                  <View style={styles.counterDisplay}>
                    <ThemedText style={styles.counterText}>{personCount}</ThemedText>
                    <ThemedText style={styles.counterLabel}>
                      {personCount === 1 ? 'seat' : 'seats'}
                    </ThemedText>
                  </View>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => setPersonCount(Math.min(6, personCount + 1))}
                    activeOpacity={0.7}>
                    <ThemedText style={styles.counterButtonText}>+</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Price */}
              <View style={styles.detailSection}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  💰 Price per Seat
                </ThemedText>
                <View style={styles.priceContainer}>
                  <ThemedText style={styles.currencySymbol}>₹</ThemedText>
                  <Input
                    placeholder="0"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    variant="filled"
                    size="lg"
                    containerStyle={{ flex: 1 }}
                  />
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Date & Time Card */}
          <Animated.View
            style={[
              styles.dateTimeCard,
              dynamicStyles.glassCard,
              {
                opacity: cardAnimations[4],
                transform: [{ scale: cardAnimations[4] }],
              },
            ]}>
            <BlurView intensity={isDark ? 50 : 80} style={styles.cardBlur}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                🕐 Departure
              </ThemedText>
              <View style={styles.dateTimeRow}>
                <TouchableOpacity
                  style={styles.dateTimeSelector}
                  onPress={() => setShowPickupDatePicker(true)}
                  activeOpacity={0.7}>
                  <ThemedText style={styles.dateTimeIcon}>📅</ThemedText>
                  <View>
                    <ThemedText style={styles.dateTimeLabel}>Date</ThemedText>
                    <ThemedText style={styles.dateTimeValue}>{formatDate(pickupDate)}</ThemedText>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.dateTimeSelector}
                  onPress={() => setShowPickupTimePicker(true)}
                  activeOpacity={0.7}>
                  <ThemedText style={styles.dateTimeIcon}>🕐</ThemedText>
                  <View>
                    <ThemedText style={styles.dateTimeLabel}>Time</ThemedText>
                    <ThemedText style={styles.dateTimeValue}>{formatTime(pickupTime)}</ThemedText>
                  </View>
                </TouchableOpacity>
              </View>
              
              {showPickupDatePicker && (
                <DateTimePicker
                  value={pickupDate}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowPickupDatePicker(false);
                    if (selectedDate) {
                      setPickupDate(selectedDate);
                    }
                  }}
                />
              )}
              
              {showPickupTimePicker && (
                <DateTimePicker
                  value={pickupTime}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => {
                    setShowPickupTimePicker(false);
                    if (selectedTime) {
                      setPickupTime(selectedTime);
                    }
                  }}
                />
              )}
            </BlurView>
          </Animated.View>

          {/* Publish Button */}
          <Animated.View
            style={[
              styles.publishCard,
              {
                opacity: cardAnimations[5],
                transform: [
                  { scale: cardAnimations[5] },
                  { scale: buttonScale }
                ],
              },
            ]}>
            <TouchableOpacity 
              onPress={handlePublish}
              disabled={isLoading}
              activeOpacity={0.8}>
              <LinearGradient
                colors={[DesignTokens.colors.primary, DesignTokens.colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.publishButton,
                  isLoading && styles.publishButtonLoading
                ]}
              >
                <ThemedText style={styles.publishButtonText}>
                  {isLoading ? '🔄 Publishing...' : '🚀 Publish Ride'}
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <ThemedText style={styles.footerText}>
              💡 Your ride will be visible to travelers immediately
            </ThemedText>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
  content: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    padding: DesignTokens.spacing.lg,
    paddingBottom: DesignTokens.spacing.xxl,
  } as ViewStyle,
  
  // Map Modal Styles
  mapModalContainer: {
    flex: 1,
    backgroundColor: DesignTokens.colors.backgroundDark,
  } as ViewStyle,
  map: {
    flex: 1,
  } as ViewStyle,
  mapModalHeader: {
    position: 'absolute',
    top: 60,
    left: DesignTokens.spacing.lg,
    right: DesignTokens.spacing.lg,
    borderRadius: DesignTokens.borderRadius.lg,
    padding: DesignTokens.spacing.lg,
  } as ViewStyle,
  mapModalTitle: {
    fontSize: DesignTokens.typography.fontSizes.lg,
    fontWeight: DesignTokens.typography.fontWeights.semibold,
    marginBottom: DesignTokens.spacing.sm,
    textAlign: 'center',
  } as TextStyle,
  mapModalButtons: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.sm + 4,
  } as ViewStyle,
  mapModalButton: {
    flex: 1,
    paddingVertical: DesignTokens.spacing.sm + 4,
    borderRadius: DesignTokens.borderRadius.lg,
    alignItems: 'center',
  } as ViewStyle,
  mapModalButtonText: {
    color: DesignTokens.colors.textInverse,
    fontSize: DesignTokens.typography.fontSizes.base,
    fontWeight: DesignTokens.typography.fontWeights.semibold,
  } as TextStyle,

  // Header Card
  headerCard: {
    marginBottom: DesignTokens.spacing.lg,
    borderRadius: DesignTokens.borderRadius.xl,
    overflow: 'hidden',
    ...DesignTokens.shadows.lg,
  } as ViewStyle,
  headerBlur: {
    borderRadius: DesignTokens.borderRadius.xl,
    overflow: 'hidden',
  } as ViewStyle,
  headerContent: {
    padding: DesignTokens.spacing.xl,
    alignItems: 'center',
  } as ViewStyle,
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: DesignTokens.borderRadius.round,
    backgroundColor: `${DesignTokens.colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: DesignTokens.spacing.md,
  } as ViewStyle,
  headerIcon: {
    fontSize: 36,
  } as TextStyle,
  headerTitle: {
    fontSize: DesignTokens.typography.fontSizes['3xl'],
    fontWeight: DesignTokens.typography.fontWeights.bold,
    marginBottom: DesignTokens.spacing.sm,
    textAlign: 'center',
  } as TextStyle,
  headerSubtitle: {
    fontSize: DesignTokens.typography.fontSizes.base,
    color: DesignTokens.colors.textSecondary,
    textAlign: 'center',
    lineHeight: DesignTokens.typography.lineHeights.relaxed * DesignTokens.typography.fontSizes.base,
  } as TextStyle,

  // Location Card
  locationCard: {
    marginBottom: DesignTokens.spacing.lg,
    borderRadius: DesignTokens.borderRadius.xl,
    overflow: 'hidden',
    ...DesignTokens.shadows.md,
  } as ViewStyle,
  cardBlur: {
    borderRadius: DesignTokens.borderRadius.xl,
    overflow: 'hidden',
  } as ViewStyle,
  locationSection: {
    padding: DesignTokens.spacing.lg,
  } as ViewStyle,
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.md,
  } as ViewStyle,
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: DesignTokens.borderRadius.round,
    marginRight: DesignTokens.spacing.sm + 4,
  } as ViewStyle,
  locationLabel: {
    fontSize: DesignTokens.typography.fontSizes.lg,
    fontWeight: DesignTokens.typography.fontWeights.semibold,
  } as TextStyle,
  locationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.sm + 4,
  } as ViewStyle,
  modernInput: {
    flex: 1,
  } as ViewStyle,
  modernMapButton: {
    width: 48,
    height: 48,
    borderRadius: DesignTokens.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    ...DesignTokens.shadows.sm,
  } as ViewStyle,
  mapButtonText: {
    color: DesignTokens.colors.textInverse,
    fontSize: DesignTokens.typography.fontSizes.lg,
  } as TextStyle,
  locationDivider: {
    height: 1,
    backgroundColor: DesignTokens.colors.border,
    marginHorizontal: DesignTokens.spacing.lg,
  } as ViewStyle,

  // Vehicle Card
  vehicleCard: {
    marginBottom: DesignTokens.spacing.lg,
    borderRadius: DesignTokens.borderRadius.xl,
    overflow: 'hidden',
    ...DesignTokens.shadows.md,
  } as ViewStyle,
  sectionTitle: {
    fontSize: DesignTokens.typography.fontSizes.lg,
    fontWeight: DesignTokens.typography.fontWeights.semibold,
    marginBottom: DesignTokens.spacing.md,
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingTop: DesignTokens.spacing.lg,
  } as TextStyle,
  vehicleOptions: {
    flexDirection: 'row',
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingBottom: DesignTokens.spacing.lg,
    gap: DesignTokens.spacing.sm + 4,
  } as ViewStyle,
  vehicleOption: {
    flex: 1,
    borderWidth: 2,
    borderColor: DesignTokens.colors.border,
    borderRadius: DesignTokens.borderRadius.lg,
    paddingVertical: DesignTokens.spacing.lg,
    paddingHorizontal: DesignTokens.spacing.sm + 4,
    alignItems: 'center',
    backgroundColor: `${DesignTokens.colors.surface}05`,
  } as ViewStyle,
  selectedVehicle: {
    borderWidth: 3,
    ...DesignTokens.shadows.sm,
  } as ViewStyle,
  vehicleIcon: {
    fontSize: 28,
    marginBottom: DesignTokens.spacing.sm,
  } as TextStyle,
  vehicleText: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    fontWeight: DesignTokens.typography.fontWeights.semibold,
  } as TextStyle,
  selectedVehicleText: {
    color: DesignTokens.colors.textInverse,
    fontWeight: DesignTokens.typography.fontWeights.bold,
  } as TextStyle,

  // Details Card
  detailsCard: {
    marginBottom: DesignTokens.spacing.lg,
    borderRadius: DesignTokens.borderRadius.xl,
    overflow: 'hidden',
    ...DesignTokens.shadows.md,
  } as ViewStyle,
  detailSection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingVertical: DesignTokens.spacing.md,
  } as ViewStyle,
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${DesignTokens.colors.primary}10`,
    borderRadius: DesignTokens.borderRadius.lg,
    padding: DesignTokens.spacing.lg,
  } as ViewStyle,
  counterButton: {
    width: 48,
    height: 48,
    borderRadius: DesignTokens.borderRadius.round,
    backgroundColor: DesignTokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...DesignTokens.shadows.sm,
  } as ViewStyle,
  counterButtonText: {
    color: DesignTokens.colors.textInverse,
    fontSize: DesignTokens.typography.fontSizes.xl,
    fontWeight: DesignTokens.typography.fontWeights.semibold,
  } as TextStyle,
  counterDisplay: {
    alignItems: 'center',
    marginHorizontal: DesignTokens.spacing.xl,
  } as ViewStyle,
  counterText: {
    fontSize: DesignTokens.typography.fontSizes['3xl'],
    fontWeight: DesignTokens.typography.fontWeights.bold,
  } as TextStyle,
  counterLabel: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    color: DesignTokens.colors.textMuted,
    marginTop: DesignTokens.spacing.xs,
  } as TextStyle,
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${DesignTokens.colors.success}10`,
    borderRadius: DesignTokens.borderRadius.md,
    paddingLeft: DesignTokens.spacing.lg,
    borderWidth: 2,
    borderColor: `${DesignTokens.colors.success}30`,
  } as ViewStyle,
  currencySymbol: {
    fontSize: DesignTokens.typography.fontSizes.lg,
    fontWeight: DesignTokens.typography.fontWeights.bold,
    marginRight: DesignTokens.spacing.sm,
    color: DesignTokens.colors.success,
  } as TextStyle,
  priceInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
  } as ViewStyle,

  // Date Time Card
  dateTimeCard: {
    marginBottom: DesignTokens.spacing.lg,
    borderRadius: DesignTokens.borderRadius.xl,
    overflow: 'hidden',
    ...DesignTokens.shadows.md,
  } as ViewStyle,
  dateTimeRow: {
    flexDirection: 'row',
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingBottom: DesignTokens.spacing.lg,
    gap: DesignTokens.spacing.md,
  } as ViewStyle,
  dateTimeSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${DesignTokens.colors.secondary}10`,
    borderRadius: DesignTokens.borderRadius.md,
    padding: DesignTokens.spacing.md,
    borderWidth: 2,
    borderColor: `${DesignTokens.colors.secondary}30`,
  } as ViewStyle,
  dateTimeIcon: {
    fontSize: DesignTokens.typography.fontSizes.xl,
    marginRight: DesignTokens.spacing.sm + 4,
  } as TextStyle,
  dateTimeLabel: {
    fontSize: DesignTokens.typography.fontSizes.xs,
    color: DesignTokens.colors.textMuted,
    marginBottom: 2,
  } as TextStyle,
  dateTimeValue: {
    fontSize: DesignTokens.typography.fontSizes.base,
    fontWeight: DesignTokens.typography.fontWeights.semibold,
  } as TextStyle,

  // Publish Button
  publishCard: {
    marginBottom: DesignTokens.spacing.lg,
  } as ViewStyle,
  publishButton: {
    backgroundColor: DesignTokens.colors.primary,
    paddingVertical: DesignTokens.spacing.lg,
    borderRadius: DesignTokens.borderRadius.lg,
    alignItems: 'center',
    ...DesignTokens.shadows.lg,
    borderWidth: 1,
    borderColor: `${DesignTokens.colors.textInverse}10`,
  } as ViewStyle,
  publishButtonLoading: {
    opacity: 0.7,
  } as ViewStyle,
  publishButtonText: {
    color: DesignTokens.colors.textInverse,
    fontSize: DesignTokens.typography.fontSizes.lg,
    fontWeight: DesignTokens.typography.fontWeights.bold,
  } as TextStyle,

  // Footer
  footerContainer: {
    paddingTop: DesignTokens.spacing.lg,
    alignItems: 'center',
  } as ViewStyle,
  footerText: {
    textAlign: 'center',
    fontSize: DesignTokens.typography.fontSizes.sm,
    color: DesignTokens.colors.textMuted,
    lineHeight: DesignTokens.typography.lineHeights.normal * DesignTokens.typography.fontSizes.sm,
    paddingHorizontal: DesignTokens.spacing.lg,
  } as TextStyle,

  // Legacy styles for compatibility
  headerContainer: {
    marginTop: DesignTokens.spacing.sm,
    marginBottom: DesignTokens.spacing.xl,
    alignItems: 'center',
  } as ViewStyle,
  inputContainer: {
    marginBottom: DesignTokens.spacing.xl,
  } as ViewStyle,
  sectionLabel: {
    marginBottom: DesignTokens.spacing.sm + 4,
    fontSize: DesignTokens.typography.fontSizes.lg,
  } as TextStyle,
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  locationInput: {
    flex: 1,
    marginRight: DesignTokens.spacing.sm + 4,
  } as ViewStyle,
  mapButton: {
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.sm + 4,
    borderRadius: DesignTokens.borderRadius.lg,
    minWidth: 80,
    alignItems: 'center',
    ...DesignTokens.shadows.sm,
  } as ViewStyle,
});