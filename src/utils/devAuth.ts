/**
 * Development Authentication Utilities
 * This file contains utilities to bypass email confirmation for development
 */

import { supabase } from '../services/supabase';

/**
 * Attempts to create a user and automatically sign them in
 * This is a development workaround for email confirmation
 */
export async function createAndSignInUser(name: string, email: string, password: string) {
  try {
    console.log('Dev Auth: Creating user without email confirmation');
    
    // Step 1: Try to create the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    
    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        // User already exists, try to sign them in
        return await signInExistingUser(email, password);
      }
      return { error: signUpError };
    }
    
    console.log('Dev Auth: User created, attempting sign in...');
    
    // Step 2: Wait a moment for user creation to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 3: Try to sign in the user
    return await signInExistingUser(email, password);
    
  } catch (error) {
    console.error('Dev Auth: Exception:', error);
    return { error: { message: 'Failed to create user account' } };
  }
}

/**
 * Signs in an existing user
 */
export async function signInExistingUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        // Return success anyway for development
        console.log('Dev Auth: Email not confirmed but allowing sign in for development');
        return { 
          error: null, 
          needsConfirmation: true,
          message: 'Account created! Please check email for confirmation link, then try logging in again.'
        };
      }
      return { error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Dev Auth: Sign in exception:', error);
    return { error: { message: 'Failed to sign in' } };
  }
}
