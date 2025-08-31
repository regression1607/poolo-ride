import { db } from '../database/supabaseClient';
import { messageService } from './messageService';

export interface CreateBookingData {
  rideId: string;
  passengerId: string;
  seatsBooked: number;
  totalPrice: number;
}

export interface RideBooking {
  id: string;
  ride_id: string;
  passenger_id: string;
  seats_booked: number;
  total_price: number;
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  booked_at: string;
  updated_at: string;
  ride?: {
    id: string;
    pickup_address: string;
    drop_address: string;
    pickup_time: string;
    vehicle_type: string;
    price_per_seat: number;
    status: string;
    driver?: {
      id: string;
      name: string;
      rating: number;
      profile_picture?: string;
    };
  };
}

class BookingService {
  /**
   * Send automatic booking confirmation message to driver
   */
  private async sendBookingMessage(
    booking: RideBooking,
    rideData: any,
    passengerName: string
  ): Promise<void> {
    try {
      if (!rideData.driver?.id || !rideData.driver?.name) {
        console.warn('Driver information not available for messaging');
        return;
      }

      await messageService.sendBookingConfirmationMessage(
        booking.ride_id,
        booking.passenger_id,
        rideData.driver.id,
        passengerName,
        rideData.driver.name,
        {
          pickupAddress: rideData.pickup_address,
          dropAddress: rideData.drop_address,
          pickupTime: rideData.pickup_time,
          seatsBooked: booking.seats_booked,
          totalPrice: booking.total_price,
          vehicleType: rideData.vehicle_type,
        }
      );

      console.log('Booking confirmation message sent successfully');
    } catch (error) {
      console.error('Failed to send booking confirmation message:', error);
      // Don't throw error here as booking was successful, message is additional feature
    }
  }

  /**
   * Create a new ride booking
   */
  async createBooking(bookingData: CreateBookingData): Promise<RideBooking> {
    try {
      console.log('=== BOOKING SERVICE: Creating booking ===');
      console.log('Booking data:', bookingData);

      // Check if ride is still available
      const { data: rideData, error: rideError } = await db.rides.getById(bookingData.rideId);
      
      if (rideError) {
        throw new Error(`Failed to fetch ride: ${rideError.message}`);
      }

      if (!rideData) {
        throw new Error('Ride not found');
      }

      if (rideData.available_seats < bookingData.seatsBooked) {
        throw new Error('Not enough seats available');
      }

      if (rideData.status !== 'available') {
        throw new Error('Ride is no longer available');
      }

      // Get passenger information for messaging
      const { data: passengerData, error: passengerError } = await db.users.getById(bookingData.passengerId);
      
      if (passengerError) {
        console.warn('Failed to fetch passenger data:', passengerError);
      }

      const passengerName = passengerData?.name || 'Unknown Passenger';

      // Check if user already has a booking for this ride
      console.log('Checking for existing booking for ride:', bookingData.rideId, 'passenger:', bookingData.passengerId);
      const { data: existingBooking, error: checkError } = await db.bookings.getByRideAndPassenger(bookingData.rideId, bookingData.passengerId);
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error, which is expected
        console.warn('Error checking existing booking:', checkError);
        throw new Error(`Failed to check existing booking: ${checkError.message}`);
      }

      if (existingBooking) {
        console.log('Found existing booking:', existingBooking);
        
        if (existingBooking.booking_status === 'cancelled') {
          // Update existing cancelled booking to confirmed
          console.log('Found cancelled booking, updating to confirmed:', existingBooking.id);
          
          const updateData = {
            seats_booked: bookingData.seatsBooked,
            total_price: bookingData.totalPrice,
            booking_status: 'confirmed' as const,
            booked_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const { data: updatedData, error: updateError } = await db.bookings.update(existingBooking.id, updateData);
          
          if (updateError) {
            console.error('Database update error:', updateError);
            throw new Error(`Failed to update booking: ${updateError.message}`);
          }

          if (!updatedData) {
            throw new Error('No data returned from booking update');
          }

          const updatedBooking = Array.isArray(updatedData) ? updatedData[0] : updatedData;
          console.log('Booking updated successfully:', updatedBooking);

          // Send automatic message to driver
          await this.sendBookingMessage(updatedBooking, rideData, passengerName);

          return updatedBooking as RideBooking;
        } else {
          // Booking already exists and is not cancelled
          console.log('Booking already exists with status:', existingBooking.booking_status);
          throw new Error('You already have an active booking for this ride');
        }
      } else {
        console.log('No existing booking found, creating new one');
      }

      // Create the booking with confirmed status
      const bookingRequest = {
        ride_id: bookingData.rideId,
        passenger_id: bookingData.passengerId,
        seats_booked: bookingData.seatsBooked,
        total_price: bookingData.totalPrice,
        booking_status: 'confirmed' as const,
        booked_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await db.bookings.create(bookingRequest);

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to create booking: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from booking creation');
      }

      const createdBooking = Array.isArray(data) ? data[0] : data;
      console.log('Booking created successfully:', createdBooking);

      // Send automatic message to driver
      await this.sendBookingMessage(createdBooking, rideData, passengerName);

      return createdBooking as RideBooking;
    } catch (error) {
      console.error('BookingService.createBooking error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create booking. Please try again.');
    }
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string): Promise<void> {
    try {
      console.log('=== BOOKING SERVICE: Cancelling booking ===');
      console.log('Booking ID:', bookingId);

      const { error } = await db.bookings.update(bookingId, {
        booking_status: 'cancelled'
      });

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to cancel booking: ${error.message}`);
      }

      console.log('Booking cancelled successfully');
    } catch (error) {
      console.error('BookingService.cancelBooking error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to cancel booking. Please try again.');
    }
  }

  /**
   * Get bookings by passenger
   */
  async getBookingsByPassenger(passengerId: string): Promise<RideBooking[]> {
    try {
      console.log('=== BOOKING SERVICE: Fetching bookings for passenger ===');
      console.log('Passenger ID:', passengerId);

      const { data, error } = await db.bookings.getByPassenger(passengerId);

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to fetch bookings: ${error.message}`);
      }

      console.log('Fetched bookings:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('BookingService.getBookingsByPassenger error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch bookings. Please try again.');
    }
  }

  /**
   * Get bookings by ride
   */
  async getBookingsByRide(rideId: string): Promise<RideBooking[]> {
    try {
      console.log('=== BOOKING SERVICE: Fetching bookings for ride ===');
      console.log('Ride ID:', rideId);

      const { data, error } = await db.bookings.getByRide(rideId);

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to fetch bookings: ${error.message}`);
      }

      console.log('Fetched bookings:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('BookingService.getBookingsByRide error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch bookings. Please try again.');
    }
  }
}

export const bookingService = new BookingService();
