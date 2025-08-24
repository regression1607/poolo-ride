import { db } from '../database/supabaseClient';
import { Ride, VehicleType } from '../../types/ride';

export interface CreateRideData {
  fromLocation: string;
  toLocation: string;
  departureDate: Date;
  departureTime: string;
  availableSeats: number;
  vehicleType: VehicleType;
  pricePerSeat: string;
  description?: string;
}

export interface CreateRideRequest {
  driver_id: string;
  pickup_address: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  drop_address: string;
  drop_latitude?: number;
  drop_longitude?: number;
  pickup_time: string;
  total_seats: number;
  available_seats: number;
  vehicle_type: VehicleType;
  price_per_seat: number;
  description?: string;
  status: 'available';
}

class RideService {
  /**
   * Check for time conflicts with existing rides
   */
  async checkTimeConflict(driverId: string, proposedStartTime: string, estimatedDurationHours: number = 2): Promise<{ hasConflict: boolean; conflictingRide?: Ride }> {
    try {
      console.log('=== RIDE SERVICE: Checking time conflicts ===');
      console.log('Driver ID:', driverId);
      console.log('Proposed start time:', proposedStartTime);
      console.log('Estimated duration:', estimatedDurationHours, 'hours');

      // Get all active rides for the driver
      const driverRides = await this.getRidesByDriver(driverId);
      
      // Filter only active/available rides (not cancelled or completed)
      const activeRides = driverRides.filter(ride => 
        ride.status === 'available' || ride.status === 'active'
      );

      const proposedStart = new Date(proposedStartTime);
      const proposedEnd = new Date(proposedStart.getTime() + (estimatedDurationHours * 60 * 60 * 1000));

      console.log('Proposed ride window:', proposedStart.toISOString(), 'to', proposedEnd.toISOString());
      console.log('Checking against', activeRides.length, 'active rides');

      for (const existingRide of activeRides) {
        const existingStart = new Date(existingRide.pickup_time);
        
        // Estimate existing ride duration (default 2 hours if not specified)
        let existingEnd: Date;
        if (existingRide.expected_drop_time) {
          existingEnd = new Date(existingRide.expected_drop_time);
        } else {
          // Default 2-hour duration if no drop time specified
          existingEnd = new Date(existingStart.getTime() + (2 * 60 * 60 * 1000));
        }

        console.log('Existing ride window:', existingStart.toISOString(), 'to', existingEnd.toISOString());

        // Check for overlap
        const hasOverlap = (
          (proposedStart >= existingStart && proposedStart < existingEnd) || // Proposed starts during existing
          (proposedEnd > existingStart && proposedEnd <= existingEnd) || // Proposed ends during existing
          (proposedStart <= existingStart && proposedEnd >= existingEnd) // Proposed completely contains existing
        );

        if (hasOverlap) {
          console.log('TIME CONFLICT DETECTED with ride:', existingRide.id);
          return {
            hasConflict: true,
            conflictingRide: existingRide
          };
        }
      }

      console.log('No time conflicts found');
      return { hasConflict: false };
    } catch (error) {
      console.error('RideService.checkTimeConflict error:', error);
      // If we can't check for conflicts, don't block the user - log and continue
      console.warn('Continuing without conflict check due to error');
      return { hasConflict: false };
    }
  }

  /**
   * Create a new ride
   */
  async createRide(rideData: CreateRideData, driverId: string): Promise<Ride> {
    try {
      console.log('=== RIDE SERVICE: Creating ride ===');
      console.log('Input data:', rideData);
      console.log('Driver ID:', driverId);

      // Convert the form data to database format
      const departureDateTime = this.combineDateAndTime(rideData.departureDate, rideData.departureTime);
      
      // Check for time conflicts before creating the ride
      const conflictCheck = await this.checkTimeConflict(driverId, departureDateTime);
      
      if (conflictCheck.hasConflict && conflictCheck.conflictingRide) {
        const conflictRide = conflictCheck.conflictingRide;
        const conflictTime = new Date(conflictRide.pickup_time).toLocaleString();
        
        throw new Error(
          `You already have a ride scheduled at ${conflictTime} from ${conflictRide.pickup_address} to ${conflictRide.drop_address}. Please cancel that ride first or choose a different time.`
        );
      }
      
      const createRideRequest: CreateRideRequest = {
        driver_id: driverId,
        pickup_address: rideData.fromLocation,
        drop_address: rideData.toLocation,
        pickup_time: departureDateTime,
        total_seats: rideData.availableSeats,
        available_seats: rideData.availableSeats,
        vehicle_type: rideData.vehicleType,
        price_per_seat: parseFloat(rideData.pricePerSeat),
        description: rideData.description,
        status: 'available',
      };

      console.log('Database request payload:', createRideRequest);

      const { data, error } = await db.rides.create(createRideRequest);

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to create ride: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from ride creation');
      }

      const createdRide = Array.isArray(data) ? data[0] : data;
      console.log('Ride created successfully:', createdRide);

      return createdRide as Ride;
    } catch (error) {
      console.error('RideService.createRide error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create ride. Please try again.');
    }
  }

  /**
   * Get rides by driver ID
   */
  async getRidesByDriver(driverId: string): Promise<Ride[]> {
    try {
      console.log('=== RIDE SERVICE: Fetching rides for driver ===');
      console.log('Driver ID:', driverId);

      const { data, error } = await db.rides.getByDriver(driverId);

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to fetch rides: ${error.message}`);
      }

      console.log('Fetched rides:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('RideService.getRidesByDriver error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch rides. Please try again.');
    }
  }

  /**
   * Get all available rides for search
   */
  async getAvailableRides(): Promise<Ride[]> {
    try {
      console.log('=== RIDE SERVICE: Fetching available rides ===');

      const { data, error } = await db.rides.getAll();

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to fetch rides: ${error.message}`);
      }

      // Filter only available rides with seats
      const availableRides = (data || []).filter(
        (ride: any) => ride.status === 'available' && ride.available_seats > 0
      );

      console.log('Available rides found:', availableRides.length);
      return availableRides;
    } catch (error) {
      console.error('RideService.getAvailableRides error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch available rides. Please try again.');
    }
  }

  /**
   * Update ride status
   */
  async updateRideStatus(rideId: string, status: string): Promise<void> {
    try {
      console.log('=== RIDE SERVICE: Updating ride status ===');
      console.log('Ride ID:', rideId, 'New status:', status);

      const { error } = await db.rides.update(rideId, { status });

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to update ride status: ${error.message}`);
      }

      console.log('Ride status updated successfully');
    } catch (error) {
      console.error('RideService.updateRideStatus error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update ride status. Please try again.');
    }
  }

  /**
   * Delete a ride
   */
  async deleteRide(rideId: string): Promise<void> {
    try {
      console.log('=== RIDE SERVICE: Deleting ride ===');
      console.log('Ride ID:', rideId);

      const { error } = await db.rides.delete(rideId);

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to delete ride: ${error.message}`);
      }

      console.log('Ride deleted successfully');
    } catch (error) {
      console.error('RideService.deleteRide error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to delete ride. Please try again.');
    }
  }

  /**
   * Helper function to combine date and time into ISO string
   */
  private combineDateAndTime(date: Date, time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes, 0, 0);
    return combinedDate.toISOString();
  }

  /**
   * Format ride data for display
   */
  formatRideForDisplay(ride: Ride) {
    return {
      ...ride,
      pickup_time_formatted: new Date(ride.pickup_time).toLocaleString(),
      price_formatted: `₹${ride.price_per_seat}`,
      total_price: ride.price_per_seat * ride.available_seats,
    };
  }
}

export const rideService = new RideService();
