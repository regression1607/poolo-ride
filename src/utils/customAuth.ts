/**
 * Custom Authentication System
 * Uses the users table directly for authentication instead of Supabase Auth
 */

import { supabase } from '../services/supabase';
import { createSession, saveSession, UserSession } from './sessionManager';

/**
 * Simple hash function for passwords (for development)
 * In production, use a proper hashing library like bcrypt
 */
function hashPassword(password: string): string {
  // Simple hash for development - in production use bcrypt or similar
  let hash = 0;
  const salt = 'pooloride_salt_2024';
  const combined = password + salt;
  
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Register a new user directly in the users table
 */
export async function registerUser(name: string, email: string, password: string) {
  try {
    console.log('Custom Auth: Registering user:', email);
    
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking existing user:', checkError);
      return { error: { message: 'Failed to check user existence' } };
    }
    
    if (existingUser) {
      return { error: { message: 'An account with this email already exists' } };
    }
    
    // Hash the password
    const hashedPassword = hashPassword(password);
    
    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating user:', insertError);
      return { error: { message: 'Failed to create user account' } };
    }
    
    console.log('Custom Auth: User registered successfully');
    
    // Create and save session
    const session = createSession({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      created_at: newUser.created_at
    });
    
    await saveSession(session);
    
    return { 
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        created_at: newUser.created_at
      },
      session,
      error: null 
    };
    
  } catch (error) {
    console.error('Custom Auth: Registration exception:', error);
    return { error: { message: 'An unexpected error occurred during registration' } };
  }
}

/**
 * Login user by checking credentials against users table
 */
export async function loginUser(email: string, password: string) {
  try {
    console.log('Custom Auth: Logging in user:', email);
    
    // Hash the provided password to compare
    const hashedPassword = hashPassword(password);
    
    // Find user with matching email and password
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('email', email.toLowerCase().trim())
      .eq('password', hashedPassword)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return { error: { message: 'Invalid email or password' } };
      }
      console.error('Login error:', error);
      return { error: { message: 'Login failed' } };
    }
    
    if (!user) {
      return { error: { message: 'Invalid email or password' } };
    }
    
    console.log('Custom Auth: Login successful');
    
    // Create and save session
    const session = createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at
    });
    
    await saveSession(session);
    
    return { 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
      },
      session,
      error: null 
    };
    
  } catch (error) {
    console.error('Custom Auth: Login exception:', error);
    return { error: { message: 'An unexpected error occurred during login' } };
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('id', userId)
      .single();
    
    if (error) {
      return { user: null, error };
    }
    
    return { user, error: null };
  } catch (error) {
    console.error('Get user error:', error);
    return { user: null, error: { message: 'Failed to get user' } };
  }
}
