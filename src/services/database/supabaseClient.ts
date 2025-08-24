import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable Supabase Auth since we're using custom authentication
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

// Database helper functions
export const db = {
  // User operations
  users: {
    create: (userData: any) => supabase.from('users').insert(userData).select(),
    getById: (id: string) => supabase.from('users').select('*').eq('id', id).single(),
    getByEmail: (email: string) => supabase.from('users').select('*').eq('email', email).single(),
    update: (id: string, updates: any) => supabase.from('users').update(updates).eq('id', id).select(),
  },
  
  // Ride operations
  rides: {
    create: (rideData: any) => supabase.from('rides').insert(rideData).select(),
    getAll: () => supabase.from('rides').select('*'),
    getById: (id: string) => supabase.from('rides').select('*').eq('id', id).single(),
    getByDriver: (driverId: string) => supabase.from('rides').select('*').eq('driver_id', driverId),
    search: (filters: any) => {
      let query = supabase.from('rides').select('*');
      // Add search filters here based on pickup/drop locations, time, etc.
      return query;
    },
    update: (id: string, updates: any) => supabase.from('rides').update(updates).eq('id', id).select(),
    delete: (id: string) => supabase.from('rides').delete().eq('id', id),
  },
  
  // Booking operations
  bookings: {
    create: (bookingData: any) => supabase.from('ride_bookings').insert(bookingData).select(),
    getByRide: (rideId: string) => supabase.from('ride_bookings').select('*').eq('ride_id', rideId),
    getByPassenger: (passengerId: string) => supabase.from('ride_bookings').select('*').eq('passenger_id', passengerId),
    update: (id: string, updates: any) => supabase.from('ride_bookings').update(updates).eq('id', id).select(),
  },
  
  // Message operations
  messages: {
    create: (messageData: any) => supabase.from('ride_messages').insert(messageData).select(),
    getByRide: (rideId: string) => supabase.from('ride_messages').select('*').eq('ride_id', rideId).order('sent_at', { ascending: true }),
  },
};
