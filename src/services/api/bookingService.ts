import { db } from '../database/supabaseClient';

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
}

class BookingService {
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

      // Check if user already has a booking for this ride
      const { data: existingBooking, error: checkError } = await db.bookings.getByRide(bookingData.rideId);
      
      if (checkError) {
        console.warn('Error checking existing bookings:', checkError);
      }

      const userHasBooking = existingBooking?.some(
        (booking: any) => booking.passenger_id === bookingData.passengerId && 
        booking.booking_status !== 'cancelled'
      );

      if (userHasBooking) {
        throw new Error('You already have a booking for this ride');
      }

      // Create the booking with confirmed status
      const bookingRequest = {
        ride_id: bookingData.rideId,
        passenger_id: bookingData.passengerId,
        seats_booked: bookingData.seatsBooked,
        total_price: bookingData.totalPrice,
        booking_status: 'confirmed' as const,
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
