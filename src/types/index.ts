// Define types for ride data
export interface Ride {
  id: string;
  user_id: string;
  pickup_location: string;
  dropoff_location: string;
  mode: RideMode;
  price: number;
  pickup_time: Date;
  dropoff_time?: Date;
  person_count: number;
  status: RideStatus;
  created_at: Date;
}

export type RideMode = 'Bike' | 'Car' | 'Cab';
export type RideStatus = 'active' | 'completed' | 'cancelled';

// Define types for ride requests
export interface RideRequest {
  id: string;
  ride_id: string;
  requester_id: string;
  status: RequestStatus;
  created_at: Date;
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected';

// Define types for messages
export interface Message {
  id: string;
  ride_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: Date;
}

// Define types for user data
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profile_image?: string;
  created_at: Date;
}
