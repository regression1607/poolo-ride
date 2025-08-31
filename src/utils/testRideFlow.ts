// Test file to verify ride search and booking functionality
import { rideService } from '../services/api/rideService';
import { bookingService } from '../services/api/bookingService';

// This is a test function to verify the search and booking flow
export const testRideSearchAndBooking = async () => {
  try {
    console.log('=== Testing Ride Search and Booking ===');
    
    // Test 1: Fetch available rides
    console.log('1. Fetching available rides...');
    const rides = await rideService.getAvailableRides();
    console.log(`Found ${rides.length} available rides`);
    
    if (rides.length > 0) {
      const testRide = rides[0];
      console.log('Test ride:', {
        id: testRide.id,
        driver: testRide.driver?.name || 'Unknown',
        from: testRide.pickup_address,
        to: testRide.drop_address,
        seats: testRide.available_seats,
        price: testRide.price_per_seat,
      });
      
      // Test 2: Create a test booking (commented out to avoid actual booking)
      /*
      console.log('2. Creating test booking...');
      const booking = await bookingService.createBooking({
        rideId: testRide.id,
        passengerId: 'test-passenger-id',
        seatsBooked: 1,
        totalPrice: testRide.price_per_seat,
      });
      console.log('Booking created:', booking);
      */
    }
    
    console.log('=== Test completed successfully ===');
    return true;
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
};
