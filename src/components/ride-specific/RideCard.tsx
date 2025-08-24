import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme/colors';
import { Ride, VehicleType } from '../../types/ride';

interface RideCardProps {
  ride: Ride;
  onPress: () => void;
  showBookButton?: boolean;
  onBookPress?: () => void;
}

export const RideCard: React.FC<RideCardProps> = ({
  ride,
  onPress,
  showBookButton = false,
  onBookPress,
}) => {
  const getVehicleIcon = (type: VehicleType) => {
    switch (type) {
      case 'bike':
        return 'bicycle';
      case 'car':
        return 'car';
      case 'cab':
        return 'car-sport';
      default:
        return 'car';
    }
  };

  const getVehicleColor = (type: VehicleType) => {
    return colors.vehicle[type];
  };

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateTime: string) => {
    const date = new Date(dateTime);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      {/* Header with driver info and vehicle */}
      <View style={styles.header}>
        <View style={styles.driverInfo}>
          <View style={styles.avatarContainer}>
            {ride.driver?.profile_picture_url ? (
              <Image
                source={{ uri: ride.driver.profile_picture_url }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.defaultAvatar}>
                <Ionicons name="person" size={20} color={colors.neutral[600]} />
              </View>
            )}
            {ride.driver?.is_verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={8} color={colors.neutral.white} />
              </View>
            )}
          </View>
          
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{ride.driver?.name || 'Driver'}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color={colors.special.gold} />
              <Text style={styles.rating}>{ride.driver?.rating?.toFixed(1) || '5.0'}</Text>
              <Text style={styles.reviewCount}>
                ({ride.driver?.total_rides || 0} rides)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.vehicleInfo}>
          <View style={[styles.vehicleIcon, { backgroundColor: getVehicleColor(ride.vehicle_type) }]}>
            <Ionicons
              name={getVehicleIcon(ride.vehicle_type) as any}
              size={16}
              color={colors.neutral.white}
            />
          </View>
          <Text style={styles.vehicleType}>{ride.vehicle_type.toUpperCase()}</Text>
        </View>
      </View>

      {/* Route Information */}
      <View style={styles.routeContainer}>
        <View style={styles.routeInfo}>
          <View style={styles.locationRow}>
            <View style={[styles.locationDot, styles.pickupDot]} />
            <Text style={styles.locationText} numberOfLines={1}>
              {ride.pickup_address}
            </Text>
            <Text style={styles.timeText}>{formatTime(ride.pickup_time)}</Text>
          </View>
          
          <View style={styles.routeLine} />
          
          <View style={styles.locationRow}>
            <View style={[styles.locationDot, styles.dropDot]} />
            <Text style={styles.locationText} numberOfLines={1}>
              {ride.drop_address}
            </Text>
            <Text style={styles.timeText}>
              {ride.expected_drop_time ? formatTime(ride.expected_drop_time) : 'TBD'}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer with price and booking info */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{ride.price_per_seat}</Text>
          <Text style={styles.priceLabel}>per seat</Text>
        </View>

        <View style={styles.seatsInfo}>
          <Ionicons name="people" size={14} color={colors.neutral[600]} />
          <Text style={styles.seatsText}>
            {ride.available_seats} seat{ride.available_seats !== 1 ? 's' : ''} left
          </Text>
        </View>

        <Text style={styles.dateText}>{formatDate(ride.pickup_time)}</Text>

        {showBookButton && onBookPress && (
          <TouchableOpacity style={styles.bookButton} onPress={onBookPress}>
            <Text style={styles.bookButtonText}>Book</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  defaultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },

  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.secondary.main,
    borderRadius: 8,
    width: 16,
    height: 16,
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
    marginBottom: 2,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rating: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral[700],
    marginLeft: 2,
    marginRight: 4,
  },

  reviewCount: {
    fontSize: 12,
    color: colors.neutral[500],
  },

  vehicleInfo: {
    alignItems: 'center',
  },

  vehicleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  vehicleType: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.neutral[600],
  },

  routeContainer: {
    marginBottom: spacing.lg,
  },

  routeInfo: {
    paddingLeft: spacing.md,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },

  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.md,
  },

  pickupDot: {
    backgroundColor: colors.primary.main,
  },

  dropDot: {
    backgroundColor: colors.secondary.main,
  },

  locationText: {
    flex: 1,
    fontSize: 14,
    color: colors.neutral[800],
    marginRight: spacing.sm,
  },

  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral[600],
    minWidth: 60,
    textAlign: 'right',
  },

  routeLine: {
    width: 1,
    height: 20,
    backgroundColor: colors.neutral[300],
    marginLeft: 3,
    marginVertical: 2,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  priceContainer: {
    alignItems: 'flex-start',
  },

  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary.main,
  },

  priceLabel: {
    fontSize: 12,
    color: colors.neutral[600],
  },

  seatsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },

  seatsText: {
    fontSize: 12,
    color: colors.neutral[700],
    marginLeft: 4,
  },

  dateText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral[600],
  },

  bookButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },

  bookButtonText: {
    color: colors.neutral.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
