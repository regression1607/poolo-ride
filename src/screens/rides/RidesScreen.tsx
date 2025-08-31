import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme/colors';
import { Button } from '../../components/common/Button';
import { VehicleType, RideStatus, BookingStatus, Ride } from '../../types/ride';
import { rideService } from '../../services/api/rideService';
import { bookingService, RideBooking } from '../../services/api/bookingService';
import { useAuth } from '../../contexts/AuthContext';
import { TabParamList } from '../../types/navigation';

type RidesScreenRouteProp = RouteProp<TabParamList, 'RidesTab'>;

interface RideData {
  id: string;
  type: 'published' | 'booked';
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  availableSeats?: number;
  price: number;
  vehicleType: VehicleType;
  status: RideStatus | BookingStatus;
  driverName?: string;
  driverRating?: number;
  passengerName?: string;
  passengerRating?: number;
  bookingRequests?: BookingRequest[];
  canCancel: boolean;
  pickupDateTime: Date; // Add for sorting
}

interface BookingRequest {
  id: string;
  passengerName: string;
  passengerRating: number;
  seatsRequested: number;
  requestTime: string;
  message?: string;
}

export const RidesScreen: React.FC = () => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const route = useRoute<RidesScreenRouteProp>();
  
  // Get initial tab from navigation params or default to 'published'
  const initialTab = route.params?.initialTab || 'published';
  const [activeTab, setActiveTab] = useState<'published' | 'booked'>(initialTab);
  const [rides, setRides] = useState<RideData[]>([]);
  const [publishedRides, setPublishedRides] = useState<Ride[]>([]);
  const [bookedRides, setBookedRides] = useState<RideBooking[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRides();
  }, [user]);

  // Update active tab when navigation params change
  useEffect(() => {
    if (route.params?.initialTab) {
      setActiveTab(route.params.initialTab);
    }
  }, [route.params?.initialTab]);

  const loadRides = async () => {
    if (!user?.id) {
      console.log('No user found, skipping ride loading');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('=== RIDES SCREEN: Loading rides and bookings ===');
      console.log('User ID:', user.id);

      // Fetch published rides by the current user
      const userPublishedRides = await rideService.getRidesByDriver(user.id);
      console.log('Published rides fetched:', userPublishedRides.length);
      
      setPublishedRides(userPublishedRides);

      // Fetch booked rides (rides where user is a passenger)
      const userBookings = await bookingService.getBookingsByPassenger(user.id);
      console.log('User bookings fetched:', userBookings.length);
      
      setBookedRides(userBookings);

      // Convert published rides to RideData format for display
      const formattedPublishedRides: RideData[] = userPublishedRides.map(ride => ({
        id: ride.id,
        type: 'published' as const,
        from: ride.pickup_address,
        to: ride.drop_address,
        date: new Date(ride.pickup_time).toLocaleDateString(),
        time: new Date(ride.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        seats: ride.total_seats,
        availableSeats: ride.available_seats,
        price: ride.price_per_seat,
        vehicleType: ride.vehicle_type,
        status: ride.status,
        canCancel: ride.status === 'available',
        pickupDateTime: new Date(ride.pickup_time), // Add for sorting
      }));

      // Convert booked rides to RideData format for display
      const formattedBookedRides: RideData[] = userBookings
        .filter(booking => booking.ride) // Ensure ride data exists
        .map(booking => ({
          id: booking.id, // Use booking ID as the card ID
          type: 'booked' as const,
          from: booking.ride!.pickup_address,
          to: booking.ride!.drop_address,
          date: new Date(booking.ride!.pickup_time).toLocaleDateString(),
          time: new Date(booking.ride!.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          seats: booking.seats_booked,
          price: booking.total_price,
          vehicleType: booking.ride!.vehicle_type as VehicleType,
          status: booking.booking_status as BookingStatus,
          driverName: booking.ride!.driver?.name || 'Unknown Driver',
          driverRating: booking.ride!.driver?.rating || 5.0,
          canCancel: booking.booking_status === 'confirmed' || booking.booking_status === 'pending',
          pickupDateTime: new Date(booking.ride!.pickup_time), // Add for sorting
        }));

      // Sort both arrays by pickup date (most recent first)
      formattedPublishedRides.sort((a, b) => b.pickupDateTime.getTime() - a.pickupDateTime.getTime());
      formattedBookedRides.sort((a, b) => b.pickupDateTime.getTime() - a.pickupDateTime.getTime());

      setRides([...formattedPublishedRides, ...formattedBookedRides]);
      
    } catch (error) {
      console.error('Error loading rides:', error);
      Alert.alert('Error', 'Failed to load rides. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadRides();
    setIsRefreshing(false);
  };

  const filteredRides = rides.filter(ride => ride.type === activeTab);

  // Calculate notification counts
  const availablePublishedRides = rides.filter(ride => ride.type === 'published' && ride.status === 'available').length;
  const confirmedBookedRides = rides.filter(ride => ride.type === 'booked' && ride.status === 'confirmed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.secondary.main;
      case 'confirmed':
        return colors.primary.main;
      case 'completed':
        return colors.neutral[600];
      case 'cancelled':
        return colors.status.error;
      case 'pending':
        return colors.special.orange;
      default:
        return colors.neutral[500];
    }
  };

  const getVehicleIcon = (type: VehicleType) => {
    switch (type) {
      case 'bike':
        return 'bicycle';
      case 'car':
        return 'car';
      case 'cab':
      case 'suv':
        return 'car-sport';
      default:
        return 'car';
    }
  };

  const handleAcceptBooking = (rideId: string, bookingId: string) => {
    Alert.alert(
      'Accept Booking',
      'Are you sure you want to accept this booking request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            // Update ride data
            setRides(prev => prev.map(ride => {
              if (ride.id === rideId && ride.bookingRequests) {
                const updatedRequests = ride.bookingRequests.filter(req => req.id !== bookingId);
                const acceptedRequest = ride.bookingRequests.find(req => req.id === bookingId);
                return {
                  ...ride,
                  availableSeats: ride.availableSeats! - (acceptedRequest?.seatsRequested || 1),
                  bookingRequests: updatedRequests,
                };
              }
              return ride;
            }));
            Alert.alert('Success', 'Booking request accepted successfully!');
          },
        },
      ]
    );
  };

  const handleRejectBooking = (rideId: string, bookingId: string) => {
    Alert.alert(
      'Reject Booking',
      'Are you sure you want to reject this booking request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            setRides(prev => prev.map(ride => {
              if (ride.id === rideId && ride.bookingRequests) {
                const updatedRequests = ride.bookingRequests.filter(req => req.id !== bookingId);
                return { ...ride, bookingRequests: updatedRequests };
              }
              return ride;
            }));
            Alert.alert('Success', 'Booking request rejected.');
          },
        },
      ]
    );
  };

  const handleCancelRide = async (rideId: string, rideType: 'published' | 'booked') => {
    const title = rideType === 'published' ? 'Cancel Published Ride' : 'Cancel Booking';
    const message = rideType === 'published' 
      ? 'Are you sure you want to cancel this ride? All passengers will be notified.'
      : 'Are you sure you want to cancel this booking?';
    
    Alert.alert(title, message, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          try {
            if (rideType === 'published') {
              // Update ride status in database
              await rideService.updateRideStatus(rideId, 'cancelled');
            } else {
              // Cancel booking - update booking status
              await bookingService.cancelBooking(rideId); // rideId here is actually bookingId for booked rides
            }
            
            // Update local state
            setRides(prev => prev.map(ride => 
              ride.id === rideId ? { ...ride, status: 'cancelled' as any, canCancel: false } : ride
            ));
            
            Alert.alert('Success', `${rideType === 'published' ? 'Ride' : 'Booking'} cancelled successfully.`);
          } catch (error) {
            console.error('Error cancelling ride:', error);
            Alert.alert('Error', `Failed to cancel ${rideType === 'published' ? 'ride' : 'booking'}. Please try again.`);
          }
        },
      },
    ]);
  };

  const renderBookingRequest = (request: BookingRequest, rideId: string) => (
    <View key={request.id} style={styles.bookingRequest}>
      <View style={styles.requestHeader}>
        <View style={styles.passengerInfo}>
          <Text style={styles.passengerName}>{request.passengerName}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color={colors.special.gold} />
            <Text style={styles.ratingText}>{request.passengerRating}</Text>
          </View>
        </View>
        <Text style={styles.requestTime}>{request.requestTime}</Text>
      </View>
      
      <Text style={styles.requestDetails}>
        Wants {request.seatsRequested} seat{request.seatsRequested > 1 ? 's' : ''}
      </Text>
      
      {request.message && (
        <Text style={styles.requestMessage}>"{request.message}"</Text>
      )}
      
      <View style={styles.requestActions}>
        <Button
          title="Reject"
          onPress={() => handleRejectBooking(rideId, request.id)}
          variant="secondary"
          size="small"
          style={styles.rejectButton}
        />
        <Button
          title="Accept"
          onPress={() => handleAcceptBooking(rideId, request.id)}
          variant="primary"
          size="small"
          style={styles.acceptButton}
        />
      </View>
    </View>
  );

  const renderRideCard = ({ item }: { item: RideData }) => (
    <View style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <View style={styles.routeInfo}>
          <View style={styles.vehicleInfo}>
            <Ionicons
              name={getVehicleIcon(item.vehicleType) as any}
              size={20}
              color={colors.primary.main}
            />
            <Text style={styles.vehicleType}>{item.vehicleType.toUpperCase()}</Text>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.neutral[600]} />
        </TouchableOpacity>
      </View>

      <View style={styles.routeDetails}>
        <View style={styles.routePoint}>
          <Ionicons name="radio-button-on" size={12} color={colors.secondary.main} />
          <Text style={styles.routeText}>{item.from}</Text>
        </View>
        
        <View style={styles.routeLine}>
          <View style={styles.dashedLine} />
        </View>
        
        <View style={styles.routePoint}>
          <Ionicons name="location" size={12} color={colors.status.error} />
          <Text style={styles.routeText}>{item.to}</Text>
        </View>
      </View>

      <View style={styles.rideInfo}>
        <View style={styles.timeInfo}>
          <Ionicons name="time" size={16} color={colors.neutral[600]} />
          <Text style={styles.timeText}>{item.date} at {item.time}</Text>
        </View>
        
        <View style={styles.priceInfo}>
          <Text style={styles.priceText}>₹{item.price}</Text>
          <Text style={styles.priceLabel}>
            {item.type === 'published' ? 'per seat' : 'total cost'}
          </Text>
        </View>
      </View>

      {item.type === 'published' && item.availableSeats !== undefined && (
        <View style={styles.seatsInfo}>
          <Text style={styles.seatsText}>
            {item.availableSeats} of {item.seats} seats available
          </Text>
        </View>
      )}

      {item.type === 'booked' && (
        <View style={styles.seatsInfo}>
          <Text style={styles.seatsText}>
            {item.seats} seat{item.seats > 1 ? 's' : ''} booked
          </Text>
        </View>
      )}

      {item.type === 'booked' && item.driverName && (
        <View style={styles.driverInfo}>
          <Text style={styles.driverLabel}>Driver:</Text>
          <Text style={styles.driverName}>{item.driverName}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color={colors.special.gold} />
            <Text style={styles.ratingText}>{item.driverRating}</Text>
          </View>
        </View>
      )}

      {item.bookingRequests && item.bookingRequests.length > 0 && (
        <View style={styles.bookingRequestsSection}>
          <Text style={styles.requestsTitle}>
            Booking Requests ({item.bookingRequests.length})
          </Text>
          {item.bookingRequests.map(request => renderBookingRequest(request, item.id))}
        </View>
      )}

      <View style={styles.cardActions}>
        {item.status === 'confirmed' && item.type === 'booked' && (
          <Button
            title="Contact Driver"
            onPress={() => Alert.alert('Contact', 'Opening chat with driver...')}
            variant="secondary"
            size="medium"
            style={styles.contactButton}
          />
        )}
        
        {item.canCancel && (
          <Button
            title={item.type === 'published' ? 'Cancel Ride' : 'Cancel Booking'}
            onPress={() => handleCancelRide(item.id, item.type)}
            variant="secondary"
            size="medium"
            style={styles.cancelButton}
          />
        )}
        
        {item.status === 'completed' && (
          <Button
            title="Rate & Review"
            onPress={() => Alert.alert('Rating', 'Opening rating screen...')}
            variant="primary"
            size="medium"
            style={styles.rateButton}
          />
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Tab Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Rides</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color={colors.neutral[700]} />
          {(availablePublishedRides > 0 || confirmedBookedRides > 0) && (
            <View style={styles.notificationDot} />
          )}
        </TouchableOpacity>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'published' && styles.tabButtonActive]}
          onPress={() => setActiveTab('published')}
        >
          <Ionicons
            name="car"
            size={20}
            color={activeTab === 'published' ? colors.primary.main : colors.neutral[600]}
          />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'published' && styles.tabButtonTextActive,
            ]}
          >
            Published
          </Text>
          {availablePublishedRides > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>
                {availablePublishedRides}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'booked' && styles.tabButtonActive]}
          onPress={() => setActiveTab('booked')}
        >
          <Ionicons
            name="ticket"
            size={20}
            color={activeTab === 'booked' ? colors.primary.main : colors.neutral[600]}
          />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'booked' && styles.tabButtonTextActive,
            ]}
          >
            Booked
          </Text>
          {confirmedBookedRides > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>
                {confirmedBookedRides}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Rides List */}
      <FlatList
        data={filteredRides}
        renderItem={renderRideCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ridesList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name={activeTab === 'published' ? 'car-outline' : 'ticket-outline'}
              size={64}
              color={colors.neutral[400]}
            />
            <Text style={styles.emptyStateTitle}>
              {activeTab === 'published' ? 'No published rides' : 'No booked rides'}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {activeTab === 'published'
                ? 'Start by publishing your first ride using the Publish tab'
                : 'Search for rides and book your first trip'}
            </Text>
            {!isLoading && activeTab === 'published' && (
              <Text style={styles.emptyStateNote}>
                Rides you publish will appear here automatically
              </Text>
            )}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.neutral[900],
  },
  notificationButton: {
    position: 'relative',
    padding: spacing.xs,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.status.error,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.white,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: 12,
    padding: spacing.xs,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    gap: spacing.xs,
    position: 'relative',
  },
  tabButtonActive: {
    backgroundColor: colors.primary.light,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[600],
  },
  tabButtonTextActive: {
    color: colors.primary.main,
  },
  tabBadge: {
    position: 'absolute',
    top: -2,
    right: 8,
    backgroundColor: colors.status.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral.white,
  },
  ridesList: {
    padding: spacing.md,
    paddingBottom: spacing['5xl'],
  },
  rideCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  routeInfo: {
    flex: 1,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  vehicleType: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary.main,
    letterSpacing: 0.5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  menuButton: {
    padding: spacing.xs,
  },
  routeDetails: {
    marginBottom: spacing.md,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  routeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral[700],
    flex: 1,
  },
  routeLine: {
    marginLeft: 6,
    paddingVertical: spacing.xs,
  },
  dashedLine: {
    width: 1,
    height: 20,
    borderLeftWidth: 1,
    borderLeftColor: colors.neutral[300],
    borderStyle: 'dashed',
  },
  rideInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timeText: {
    fontSize: 14,
    color: colors.neutral[600],
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral[900],
  },
  priceLabel: {
    fontSize: 12,
    color: colors.neutral[500],
  },
  seatsInfo: {
    marginBottom: spacing.sm,
  },
  seatsText: {
    fontSize: 14,
    color: colors.secondary.main,
    fontWeight: '500',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  driverLabel: {
    fontSize: 14,
    color: colors.neutral[600],
  },
  driverName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[900],
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: colors.neutral[700],
    fontWeight: '500',
  },
  bookingRequestsSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  requestsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing.sm,
  },
  bookingRequest: {
    backgroundColor: colors.neutral[50],
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: 2,
  },
  requestTime: {
    fontSize: 12,
    color: colors.neutral[500],
  },
  requestDetails: {
    fontSize: 13,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  requestMessage: {
    fontSize: 13,
    color: colors.neutral[700],
    fontStyle: 'italic',
    marginBottom: spacing.sm,
    paddingLeft: spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: colors.primary.light,
  },
  requestActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  rejectButton: {
    flex: 1,
  },
  acceptButton: {
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  contactButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  rateButton: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['5xl'],
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral[700],
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: colors.neutral[500],
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyStateNote: {
    fontSize: 12,
    color: colors.neutral[400],
    textAlign: 'center',
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
});
