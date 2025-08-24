import { User } from './auth';

// Ride-related types for the ride-sharing app
export interface Ride {
  id: string;
  driver_id: string;
  pickup_address: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  drop_address: string;
  drop_latitude?: number;
  drop_longitude?: number;
  pickup_time: string;
  expected_drop_time?: string;
  total_seats: number;
  available_seats: number;
  vehicle_type: VehicleType;
  price_per_seat: number;
  ride_description?: string;
  status: RideStatus;
  created_at: string;
  updated_at: string;
  driver?: User; // Populated when fetching with join
}

export type VehicleType = 'bike' | 'car' | 'cab' | 'suv';
export type RideStatus = 'available' | 'active' | 'completed' | 'cancelled';

// Booking-related types
export interface RideBooking {
  id: string;
  ride_id: string;
  passenger_id: string;
  seats_booked: number;
  booking_status: BookingStatus;
  total_amount: number;
  payment_status: PaymentStatus;
  booked_at: string;
  updated_at: string;
  ride?: Ride; // Populated when fetching with join
  passenger?: User; // Populated when fetching with join
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

// Search filters
export interface RideSearchFilters {
  pickup_location?: string;
  drop_location?: string;
  pickup_date?: string;
  seats_needed?: number;
  vehicle_type?: VehicleType;
  max_price?: number;
}

// Message types for chat
export interface RideMessage {
  id: string;
  ride_id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  message_type: MessageType;
  is_read: boolean;
  sent_at: string;
  sender?: User; // Populated when fetching with join
}

export type MessageType = 'text' | 'image' | 'location';

// Rating and review types
export interface RideRating {
  id: string;
  ride_id: string;
  rated_by: string;
  rated_user: string;
  rating: number;
  review_text?: string;
  created_at: string;
}

// Vehicle information
export interface UserVehicle {
  id: string;
  user_id: string;
  vehicle_type: VehicleType;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_number?: string;
  vehicle_color?: string;
  is_primary: boolean;
  created_at: string;
}
