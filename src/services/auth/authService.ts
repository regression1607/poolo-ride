import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../database/supabaseClient';
import { hashPassword, verifyPassword } from './passwordUtils';
import { generateToken, verifyToken } from './tokenUtils';

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  phone_number?: string;
  profile_picture?: string;
  rating?: number;
  total_rides: number;
  is_verified: boolean;
  created_at: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  username: string;
  phone_number?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  private currentUser: User | null = null;
  private authToken: string | null = null;

    // Register new user
  async register(userData: RegisterData): Promise<{ user: User; token: string }> {
    try {
      console.log('=== AUTH SERVICE REGISTER ===');
      console.log('Register data:', { 
        email: userData.email, 
        username: userData.username,
        name: userData.name,
        hasPassword: !!userData.password 
      });
      
      // Check if user already exists by email
      const { data: existingUser, error: emailCheckError } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', userData.email)
        .maybeSingle();

      console.log('Email check result:', { 
        existingUser: existingUser ? 'found' : 'not found', 
        error: emailCheckError 
      });

      if (emailCheckError && emailCheckError.code !== 'PGRST116') {
        console.error('Email check error:', emailCheckError);
        throw new Error('Database error occurred. Please try again.');
      }

      if (existingUser) {
        console.log('Email already exists:', userData.email);
        throw new Error('An account with this email already exists. Please use a different email or try logging in.');
      }

      // Check if username already exists
      const { data: existingUsername, error: usernameCheckError } = await supabase
        .from('users')
        .select('id, username')
        .eq('username', userData.username)
        .maybeSingle();

      console.log('Username check result:', { 
        existingUsername: existingUsername ? 'found' : 'not found', 
        error: usernameCheckError 
      });

      if (usernameCheckError && usernameCheckError.code !== 'PGRST116') {
        console.error('Username check error:', usernameCheckError);
        throw new Error('Database error occurred. Please try again.');
      }

      if (existingUsername) {
        console.log('Username already exists:', userData.username);
        throw new Error('This username is already taken. Please choose a different username.');
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);

      // Create user record
      const newUser = {
        email: userData.email,
        password_hash: hashedPassword,
        name: userData.name,
        username: userData.username,
        phone_number: userData.phone_number,
        total_rides: 0,
        is_verified: false,
        rating: 0,
      };

      const { data: user, error } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .single();

      if (error) {
        throw new Error(`Registration failed: ${error.message}`);
      }

      // Generate JWT token
      const token = generateToken(user.id);

      // Save to local storage
      await this.saveAuthData(user, token);

      this.currentUser = user;
      this.authToken = token;

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  // Login user
  async login(loginData: LoginData): Promise<{ user: User; token: string }> {
    try {
      console.log('=== AUTH SERVICE LOGIN ===');
      console.log('Login data:', { email: loginData.email, hasPassword: !!loginData.password });
      
      // Get user by email
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', loginData.email)
        .maybeSingle();

      console.log('Database query result:', { user: user ? 'found' : 'not found', error });

      if (error && error.code !== 'PGRST116') {
        console.error('Database error:', error);
        throw new Error('Database error occurred. Please try again.');
      }

      if (!user) {
        console.log('User not found for email:', loginData.email);
        throw new Error('No account found with this email address. Please check your email or create a new account.');
      }

      console.log('User found, verifying password...');
      // Verify password
      const isValidPassword = await verifyPassword(
        loginData.password,
        user.password_hash
      );

      console.log('Password verification result:', isValidPassword);

      if (!isValidPassword) {
        console.log('Password verification failed');
        throw new Error('Incorrect password. Please check your password and try again.');
      }

      // Generate new token
      const token = generateToken(user.id);

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      // Save to local storage
      await this.saveAuthData(user, token);

      this.currentUser = user;
      this.authToken = token;

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      console.log('=== AUTH SERVICE LOGOUT ===');
      console.log('Clearing auth data...');
      
      await AsyncStorage.multiRemove(['authToken', 'currentUser']);
      
      this.currentUser = null;
      this.authToken = null;
      
      console.log('Logout successful - auth data cleared');
    } catch (error) {
      console.error('Logout error:', error);
      throw error; // Re-throw to let the UI handle it
    }
  }

  // Check if user is logged in
  async isLoggedIn(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        return false;
      }

      // Verify token
      const isValid = verifyToken(token);
      
      if (!isValid) {
        await this.logout();
        return false;
      }

      // Get current user data
      const userData = await AsyncStorage.getItem('currentUser');
      if (userData) {
        this.currentUser = JSON.parse(userData);
        this.authToken = token;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Get auth token
  getAuthToken(): string | null {
    return this.authToken;
  }

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Profile update failed: ${error.message}`);
      }

      // Update local storage
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUser = user;

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      // Get current user
      const { data: user, error } = await supabase
        .from('users')
        .select('password_hash')
        .eq('id', userId)
        .single();

      if (error || !user) {
        throw new Error('User not found');
      }

      // Verify old password
      const isValidPassword = await verifyPassword(
        oldPassword,
        user.password_hash
      );

      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password
      await supabase
        .from('users')
        .update({ password_hash: hashedPassword })
        .eq('id', userId);

    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Save auth data to local storage
  private async saveAuthData(user: User, token: string): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        ['authToken', token],
        ['currentUser', JSON.stringify(user)],
      ]);
    } catch (error) {
      console.error('Save auth data error:', error);
    }
  }

  // Initialize auth on app start
  async initializeAuth(): Promise<boolean> {
    try {
      const isLoggedIn = await this.isLoggedIn();
      return isLoggedIn;
    } catch (error) {
      console.error('Initialize auth error:', error);
      return false;
    }
  }
}

export const authService = new AuthService();
export default authService;
