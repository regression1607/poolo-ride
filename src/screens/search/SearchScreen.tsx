import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme/colors';
import { LocationPicker } from '../../components/ride-specific/LocationPicker';
import { Button } from '../../components/common/Button';
import { SeatSelector } from '../../components/ride-specific/SeatSelector';
import { VehicleTypeSelector } from '../../components/ride-specific/VehicleTypeSelector';
import { SearchRideCard } from '../../components/ride-specific/SearchRideCard';
import { VehicleType, Ride } from '../../types/ride';
import { rideService } from '../../services/api/rideService';
import { bookingService } from '../../services/api/bookingService';
import { useAuth } from '../../contexts/AuthContext';

interface SearchRide {
  id: string;
  driverName: string;
  driverRating: number;
  vehicleType: VehicleType;
  vehicleModel: string;
  departureTime: string;
  pickupLocation: string;
  dropLocation: string;
  availableSeats: number;
  pricePerSeat: number;
  estimatedDuration: string;
  driverImage?: string;
}

export const SearchScreen: React.FC = () => {
  const { user } = useAuth();
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [seatsNeeded, setSeatsNeeded] = useState(1);
  const [vehicleType, setVehicleType] = useState<VehicleType>('car');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchResults, setSearchResults] = useState<SearchRide[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [bookingRideId, setBookingRideId] = useState<string | null>(null);
  const [userBookings, setUserBookings] = useState<string[]>([]); // Array of ride IDs that user has booked

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-IN', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Convert Ride to SearchRide format for display
  const convertRideToSearchRide = (ride: Ride): SearchRide => {
    const departureDate = new Date(ride.pickup_time);
    
    return {
      id: ride.id,
      driverName: ride.driver?.name || 'Unknown Driver',
      driverRating: ride.driver?.rating || 5.0,
      vehicleType: ride.vehicle_type,
      vehicleModel: `${ride.vehicle_type.charAt(0).toUpperCase() + ride.vehicle_type.slice(1)}`,
      departureTime: departureDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      pickupLocation: ride.pickup_address,
      dropLocation: ride.drop_address,
      availableSeats: ride.available_seats,
      pricePerSeat: ride.price_per_seat,
      estimatedDuration: '45 mins', // Default duration - in real app, calculate from distance
      driverImage: ride.driver?.profile_picture_url,
    };
  };

  // Filter rides based on search criteria
  const filterRides = (rides: Ride[]): Ride[] => {
    return rides.filter(ride => {
      // Check if ride has enough available seats
      if (ride.available_seats < seatsNeeded) {
        return false;
      }

      // Check vehicle type preference (optional filter)
      if (vehicleType && vehicleType !== 'car' && ride.vehicle_type !== vehicleType) {
        return false;
      }

      // Check location matching (basic string matching)
      const pickupMatch = fromLocation === '' || 
        ride.pickup_address.toLowerCase().includes(fromLocation.toLowerCase()) ||
        fromLocation.toLowerCase().includes(ride.pickup_address.toLowerCase());
      
      const dropMatch = toLocation === '' || 
        ride.drop_address.toLowerCase().includes(toLocation.toLowerCase()) ||
        toLocation.toLowerCase().includes(ride.drop_address.toLowerCase());

      // Check date matching
      const rideDate = new Date(ride.pickup_time);
      const searchDate = selectedDate;
      
      // Compare dates (same day)
      const dateMatch = rideDate.toDateString() === searchDate.toDateString();

      return pickupMatch && dropMatch && dateMatch;
    });
  };

  const handleSearch = async () => {
    if (!fromLocation || !toLocation) {
      Alert.alert('Missing Information', 'Please select both pickup and drop locations');
      return;
    }

    try {
      setIsLoading(true);
      console.log('=== SEARCH SCREEN: Starting ride search ===');
      console.log('Search criteria:', {
        fromLocation,
        toLocation,
        seatsNeeded,
        vehicleType,
        selectedDate: selectedDate.toDateString(),
      });

      // Fetch all available rides from the service
      const availableRides = await rideService.getAvailableRides();
      console.log('Available rides fetched:', availableRides.length);

      // Fetch user's existing bookings if logged in
      let bookedRideIds: string[] = [];
      if (user?.id) {
        try {
          const userBookingsData = await bookingService.getBookingsByPassenger(user.id);
          bookedRideIds = userBookingsData
            .filter(booking => booking.booking_status === 'confirmed')
            .map(booking => booking.ride_id);
          console.log('User has booked rides:', bookedRideIds);
        } catch (error) {
          console.warn('Failed to fetch user bookings:', error);
        }
      }
      setUserBookings(bookedRideIds);

      // Filter rides based on search criteria
      const filteredRides = filterRides(availableRides);
      console.log('Filtered rides:', filteredRides.length);

      // Convert to SearchRide format for display
      const searchRideResults = filteredRides.map(convertRideToSearchRide);
      
      setSearchResults(searchRideResults);
      setShowResults(true);
      
      console.log('Search completed, showing', searchRideResults.length, 'results');

    } catch (error) {
      console.error('Search error:', error);
      
      let errorMessage = 'Failed to search for rides. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      Alert.alert('Search Failed', errorMessage);
      setSearchResults([]);
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle booking a ride
  const handleBookRide = async (rideId: string, driverName: string) => {
    if (!user?.id) {
      Alert.alert('Authentication Required', 'Please login to book a ride.');
      return;
    }

    try {
      setBookingRideId(rideId);
      
      // Find the ride to get pricing information
      const ride = searchResults.find(r => r.id === rideId);
      if (!ride) {
        throw new Error('Ride not found');
      }

      const totalPrice = ride.pricePerSeat * seatsNeeded;

      console.log('=== BOOKING: Starting ride booking ===');
      console.log('Booking details:', {
        rideId,
        passengerId: user.id,
        seatsNeeded,
        totalPrice,
      });

      // Create the booking
      await bookingService.createBooking({
        rideId,
        passengerId: user.id,
        seatsBooked: seatsNeeded,
        totalPrice,
      });

      // Update the search results to reflect the new available seats
      setSearchResults(prevResults => 
        prevResults.map(result => 
          result.id === rideId 
            ? { ...result, availableSeats: result.availableSeats - seatsNeeded }
            : result
        )
      );

      // Add this ride to user's bookings
      setUserBookings(prevBookings => [...prevBookings, rideId]);

      Alert.alert(
        'Booking Confirmed! 🎉',
        `You have successfully booked ${seatsNeeded} seat(s) with ${driverName} for ₹${totalPrice}. The driver will contact you soon.`,
        [
          {
            text: 'View My Bookings',
            onPress: () => {
              // TODO: Navigate to bookings screen
              console.log('Navigate to bookings');
            },
          },
          {
            text: 'OK',
            style: 'default',
          },
        ]
      );

    } catch (error) {
      console.error('Booking error:', error);
      
      let errorMessage = 'Failed to book ride. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      Alert.alert('Booking Failed', errorMessage);
    } finally {
      setBookingRideId(null);
    }
  };

  const handleDateSelect = (days: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const renderRideCard = ({ item }: { item: SearchRide }) => (
    <SearchRideCard
      ride={item}
      onPress={() => Alert.alert('Ride Selected', `Selected ride with ${item.driverName}`)}
      onBookPress={() => handleBookRide(item.id, item.driverName)}
      isBookingInProgress={bookingRideId === item.id}
      isAlreadyBooked={userBookings.includes(item.id)}
    />
  );

  if (showResults) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Search Results Header */}
        <View style={styles.resultsHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowResults(false)}
          >
            <Ionicons name="arrow-back" size={24} color={colors.neutral[900]} />
          </TouchableOpacity>
          
          <View style={styles.searchSummary}>
            <Text style={styles.searchRoute}>{fromLocation} → {toLocation}</Text>
            <Text style={styles.searchDetails}>
              {formatDate(selectedDate)} • {seatsNeeded} seat{seatsNeeded > 1 ? 's' : ''}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={20} color={colors.primary.main} />
          </TouchableOpacity>
        </View>

        {/* Search Results */}
        <FlatList
          data={searchResults}
          renderItem={renderRideCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyResults}>
              <Ionicons name="car" size={64} color={colors.neutral[300]} />
              <Text style={styles.emptyTitle}>No rides found</Text>
              <Text style={styles.emptyDescription}>
                Try adjusting your search criteria or check back later
              </Text>
              <Button
                title="Modify Search"
                onPress={() => setShowResults(false)}
                variant="secondary"
                size="medium"
                style={styles.modifyButton}
              />
            </View>
          }
          ListHeaderComponent={
            <View style={styles.resultsStats}>
              <Text style={styles.resultsCount}>
                {searchResults.length} ride{searchResults.length !== 1 ? 's' : ''} found
              </Text>
              <TouchableOpacity style={styles.sortButton}>
                <Text style={styles.sortText}>Sort by time</Text>
                <Ionicons name="chevron-down" size={16} color={colors.neutral[600]} />
              </TouchableOpacity>
            </View>
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        }}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(59, 130, 246, 0.8)', 'rgba(99, 102, 241, 0.6)', 'rgba(255, 255, 255, 0.95)']}
          style={styles.gradient}
        >
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              {/* Welcome Message */}
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>Find your perfect ride</Text>
                <Text style={styles.welcomeSubtitle}>
                  Share costs, reduce traffic, make friends!
                </Text>
              </View>

              {/* Search Form */}
              <View style={styles.searchForm}>
                <LocationPicker
                  placeholder="From: Pickup location"
                  value={fromLocation}
                  onLocationSelect={setFromLocation}
                  icon="radio-button-on"
                />

                <LocationPicker
                  placeholder="To: Drop location"
                  value={toLocation}
                  onLocationSelect={setToLocation}
                  icon="location"
                />

                {/* Date Selection */}
                <View style={styles.dateSection}>
                  <Text style={styles.sectionLabel}>When are you traveling?</Text>
                  <View style={styles.dateButtons}>
                    <TouchableOpacity
                      style={[
                        styles.dateButton,
                        selectedDate.toDateString() === new Date().toDateString() && styles.selectedDateButton
                      ]}
                      onPress={() => handleDateSelect(0)}
                    >
                      <Text style={[
                        styles.dateButtonText,
                        selectedDate.toDateString() === new Date().toDateString() && styles.selectedDateText
                      ]}>
                        Today
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.dateButton,
                        selectedDate.toDateString() === new Date(Date.now() + 86400000).toDateString() && styles.selectedDateButton
                      ]}
                      onPress={() => handleDateSelect(1)}
                    >
                      <Text style={[
                        styles.dateButtonText,
                        selectedDate.toDateString() === new Date(Date.now() + 86400000).toDateString() && styles.selectedDateText
                      ]}>
                        Tomorrow
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <SeatSelector
                  value={seatsNeeded}
                  onChange={setSeatsNeeded}
                  label="Seats needed"
                  maxSeats={4}
                />

                <VehicleTypeSelector
                  value={vehicleType}
                  onChange={setVehicleType}
                  label="Preferred vehicle type"
                />

                <Button
                  title={isLoading ? "Searching..." : "🔍 Search Rides"}
                  onPress={handleSearch}
                  variant="primary"
                  size="large"
                  style={styles.searchButton}
                  disabled={isLoading}
                />
              </View>

              {/* Quick Options */}
              <View style={styles.quickOptions}>
                <Text style={styles.quickOptionsTitle}>Popular routes</Text>
                <View style={styles.routeChips}>
                  <TouchableOpacity 
                    style={styles.routeChip}
                    onPress={() => {
                      setFromLocation('Connaught Place, New Delhi');
                      setToLocation('Cyber City, Gurgaon');
                    }}
                  >
                    <Text style={styles.routeChipText}>Delhi → Gurgaon</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.routeChip}
                    onPress={() => {
                      setFromLocation('Noida Sector 18');
                      setToLocation('Connaught Place, New Delhi');
                    }}
                  >
                    <Text style={styles.routeChipText}>Noida → Delhi</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.routeChip}
                    onPress={() => {
                      setFromLocation('DLF Phase 1, Gurgaon');
                      setToLocation('Noida Sector 62');
                    }}
                  >
                    <Text style={styles.routeChipText}>Gurgaon → Noida</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        }}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(59, 130, 246, 0.8)', 'rgba(99, 102, 241, 0.6)', 'rgba(255, 255, 255, 0.95)']}
          style={styles.gradient}
        >
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              {/* Welcome Message */}
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>Find your perfect ride</Text>
                <Text style={styles.welcomeSubtitle}>
                  Share costs, reduce traffic, make friends!
                </Text>
              </View>

              {/* Search Form */}
              <View style={styles.searchForm}>
                <LocationPicker
                  placeholder="From: Pickup location"
                  value={fromLocation}
                  onLocationSelect={setFromLocation}
                  icon="radio-button-on"
                />

                <LocationPicker
                  placeholder="To: Drop location"
                  value={toLocation}
                  onLocationSelect={setToLocation}
                  icon="location"
                />

                <SeatSelector
                  value={seatsNeeded}
                  onChange={setSeatsNeeded}
                  label="Seats needed"
                  maxSeats={4}
                />

                <VehicleTypeSelector
                  value={vehicleType}
                  onChange={setVehicleType}
                  label="Preferred vehicle type"
                />

                <Button
                  title="🔍 Search Rides"
                  onPress={handleSearch}
                  variant="primary"
                  size="large"
                  style={styles.searchButton}
                />
              </View>

              {/* Quick Options */}
              <View style={styles.quickOptions}>
                <Text style={styles.quickOptionsTitle}>Popular routes</Text>
                <View style={styles.routeChips}>
                  <TouchableOpacity 
                    style={styles.routeChip}
                    onPress={() => {
                      setFromLocation('Connaught Place, New Delhi');
                      setToLocation('Cyber City, Gurgaon');
                    }}
                  >
                    <Text style={styles.routeChipText}>Delhi → Gurgaon</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.routeChip}
                    onPress={() => {
                      setFromLocation('Noida Sector 18');
                      setToLocation('Connaught Place, New Delhi');
                    }}
                  >
                    <Text style={styles.routeChipText}>Noida → Delhi</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.routeChip}
                    onPress={() => {
                      setFromLocation('DLF Phase 1, Gurgaon');
                      setToLocation('Noida Sector 62');
                    }}
                  >
                    <Text style={styles.routeChipText}>Gurgaon → Noida</Text>
                  </TouchableOpacity>
                </View>
              </View>
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

  content: {
    padding: spacing.lg,
  },

  welcomeSection: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
    paddingTop: spacing.lg,
  },

  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.neutral.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  welcomeSubtitle: {
    fontSize: 16,
    color: colors.neutral.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  searchForm: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
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

  dateSection: {
    marginBottom: spacing.lg,
  },

  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral[700],
    marginBottom: spacing.sm,
  },

  dateButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },

  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    backgroundColor: colors.neutral.white,
    gap: spacing.xs,
  },

  selectedDateButton: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light,
  },

  dateButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral[700],
  },

  selectedDateText: {
    color: colors.primary.main,
  },

  searchButton: {
    marginTop: spacing.lg,
  },

  quickOptions: {
    marginTop: spacing.lg,
  },

  quickOptionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing.md,
  },

  routeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  routeChip: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },

  routeChipText: {
    color: colors.primary.main,
    fontSize: 14,
    fontWeight: '500',
  },

  // Results Screen Styles
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },

  backButton: {
    padding: spacing.sm,
    marginRight: spacing.md,
  },

  searchSummary: {
    flex: 1,
  },

  searchRoute: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[900],
  },

  searchDetails: {
    fontSize: 14,
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },

  filterButton: {
    padding: spacing.sm,
  },

  resultsList: {
    padding: spacing.lg,
  },

  resultsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[900],
  },

  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  sortText: {
    fontSize: 14,
    color: colors.neutral[600],
  },

  emptyResults: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral[900],
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  emptyDescription: {
    fontSize: 14,
    color: colors.neutral[600],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },

  modifyButton: {
    marginTop: spacing.lg,
  },
});
