// User-related types
export interface User {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  profile_picture_url?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  rating: number;
  total_rides: number;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone_number?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
