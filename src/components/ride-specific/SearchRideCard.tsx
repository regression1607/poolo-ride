import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme/colors';
import { VehicleType } from '../../types/ride';

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

interface SearchRideCardProps {
  ride: SearchRide;
  onPress: () => void;
  onBookPress?: () => void;
  isBookingInProgress?: boolean;
  isAlreadyBooked?: boolean;
}

export const SearchRideCard: React.FC<SearchRideCardProps> = ({
  ride,
  onPress,
  onBookPress,
  isBookingInProgress = false,
  isAlreadyBooked = false,
}) => {
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

  const getVehicleColor = (type: VehicleType) => {
    switch (type) {
      case 'bike':
        return colors.secondary.main;
      case 'car':
        return colors.primary.main;
      case 'cab':
        return colors.special.orange;
      case 'suv':
        return colors.neutral[800];
      default:
        return colors.primary.main;
    }
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={12} color={colors.special.gold} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={12} color={colors.special.gold} />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={12} color={colors.neutral[300]} />
      );
    }

    return stars;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        {/* Driver Info */}
        <View style={styles.driverInfo}>
          <View style={styles.driverImageContainer}>
            {ride.driverImage ? (
              <Image source={{ uri: ride.driverImage }} style={styles.driverImage} />
            ) : (
              <View style={styles.driverPlaceholder}>
                <Ionicons name="person" size={20} color={colors.neutral[600]} />
              </View>
            )}
          </View>
          
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{ride.driverName}</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {renderRatingStars(ride.driverRating)}
              </View>
              <Text style={styles.ratingText}>{ride.driverRating.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        {/* Vehicle Info */}
        <View style={styles.vehicleInfo}>
          <View style={[styles.vehicleIcon, { backgroundColor: getVehicleColor(ride.vehicleType) }]}>
            <Ionicons
              name={getVehicleIcon(ride.vehicleType) as any}
              size={16}
              color={colors.neutral.white}
            />
          </View>
          <Text style={styles.vehicleModel}>{ride.vehicleModel}</Text>
        </View>
      </View>

      {/* Trip Details */}
      <View style={styles.tripDetails}>
        <View style={styles.timeInfo}>
          <Text style={styles.departureTime}>{ride.departureTime}</Text>
          <Text style={styles.duration}>{ride.estimatedDuration}</Text>
        </View>
        
        <View style={styles.routeInfo}>
          <View style={styles.routePoint}>
            <Ionicons name="radio-button-on" size={12} color={colors.secondary.main} />
            <Text style={styles.routeText} numberOfLines={1}>{ride.pickupLocation}</Text>
          </View>
          
          <View style={styles.routeLine}>
            <View style={styles.dashedLine} />
          </View>
          
          <View style={styles.routePoint}>
            <Ionicons name="location" size={12} color={colors.status.error} />
            <Text style={styles.routeText} numberOfLines={1}>{ride.dropLocation}</Text>
          </View>
        </View>
      </View>

      {/* Bottom Info */}
      <View style={styles.bottomInfo}>
        <View style={styles.leftSection}>
          <View style={styles.seatsInfo}>
            <Ionicons 
              name="people" 
              size={16} 
              color={ride.availableSeats <= 1 ? colors.special.orange : colors.neutral[600]} 
            />
            <Text style={[
              styles.seatsText,
              ride.availableSeats <= 1 && styles.lowSeatsText
            ]}>
              {ride.availableSeats} seat{ride.availableSeats !== 1 ? 's' : ''} available
              {ride.availableSeats <= 1 && ' (Almost full!)'}
            </Text>
          </View>
          
          <View style={styles.priceInfo}>
            <Text style={styles.price}>₹{ride.pricePerSeat}</Text>
            <Text style={styles.priceLabel}>per seat</Text>
          </View>
        </View>
        
        <View style={styles.rightSection}>
          {isAlreadyBooked ? (
            <View style={styles.bookedIndicator}>
              <Ionicons name="checkmark-circle" size={16} color={colors.status.success} />
              <Text style={styles.bookedText}>Booked</Text>
            </View>
          ) : onBookPress && ride.availableSeats > 0 ? (
            <TouchableOpacity
              style={[
                styles.bookButton,
                isBookingInProgress && styles.bookButtonDisabled,
              ]}
              onPress={onBookPress}
              activeOpacity={0.8}
              disabled={isBookingInProgress}
            >
              <Text style={[
                styles.bookButtonText,
                isBookingInProgress && styles.bookButtonTextDisabled,
              ]}>
                {isBookingInProgress ? 'Booking...' : 'Book'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.unavailableButton}>
              <Text style={styles.unavailableText}>Full</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },

  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  driverImageContainer: {
    marginRight: spacing.sm,
  },

  driverImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  driverPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
  },

  driverDetails: {
    flex: 1,
  },

  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  stars: {
    flexDirection: 'row',
    gap: 1,
  },

  ratingText: {
    fontSize: 12,
    color: colors.neutral[600],
    fontWeight: '500',
  },

  vehicleInfo: {
    alignItems: 'center',
    gap: spacing.xs,
  },

  vehicleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  vehicleModel: {
    fontSize: 12,
    color: colors.neutral[600],
    fontWeight: '500',
    textAlign: 'center',
  },

  tripDetails: {
    marginBottom: spacing.md,
  },

  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },

  departureTime: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary.main,
  },

  duration: {
    fontSize: 14,
    color: colors.neutral[600],
    backgroundColor: colors.neutral[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },

  routeInfo: {
    gap: spacing.xs,
  },

  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  routeText: {
    fontSize: 14,
    color: colors.neutral[700],
    flex: 1,
  },

  routeLine: {
    marginLeft: 6,
    height: 20,
    justifyContent: 'center',
  },

  dashedLine: {
    width: 1,
    height: 16,
    backgroundColor: colors.neutral[300],
    marginLeft: 1,
  },

  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leftSection: {
    flex: 1,
    marginRight: spacing.md,
  },

  rightSection: {
    alignItems: 'flex-end',
  },

  seatsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },

  seatsText: {
    fontSize: 14,
    color: colors.neutral[600],
  },

  lowSeatsText: {
    color: colors.special.orange,
    fontWeight: '500',
  },

  priceInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },

  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral[900],
  },

  priceLabel: {
    fontSize: 12,
    color: colors.neutral[500],
  },

  bookedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.status.success + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.status.success,
  },

  bookedText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.status.success,
  },

  bookButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },

  bookButtonDisabled: {
    backgroundColor: colors.neutral[300],
    opacity: 0.7,
  },

  bookButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.white,
  },

  bookButtonTextDisabled: {
    color: colors.neutral[500],
  },

  unavailableButton: {
    backgroundColor: colors.neutral[200],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },

  unavailableText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[500],
  },
});
