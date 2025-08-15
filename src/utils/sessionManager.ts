/**
 * Session Management for Custom Authentication
 * Handles storing and retrieving user sessions
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const SESSION_KEY = 'pooloride_user_session';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  created_at: string;
  token: string;
  expiresAt: string;
}

/**
 * Generate a simple session token
 */
function generateSessionToken(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  return `pooloride_${timestamp}_${random}`;
}

/**
 * Create a user session
 */
export function createSession(user: { id: string; name: string; email: string; created_at: string }): UserSession {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
  
  return {
    ...user,
    token,
    expiresAt
  };
}

/**
 * Save session to storage
 */
export async function saveSession(session: UserSession): Promise<void> {
  try {
    const sessionString = JSON.stringify(session);
    
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(SESSION_KEY, sessionString);
      }
    } else {
      await AsyncStorage.setItem(SESSION_KEY, sessionString);
    }
    
    console.log('Session saved successfully');
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

/**
 * Get session from storage
 */
export async function getSession(): Promise<UserSession | null> {
  try {
    let sessionString: string | null = null;
    
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        sessionString = window.localStorage.getItem(SESSION_KEY);
      }
    } else {
      sessionString = await AsyncStorage.getItem(SESSION_KEY);
    }
    
    if (!sessionString) {
      return null;
    }
    
    const session = JSON.parse(sessionString) as UserSession;
    
    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      console.log('Session expired, removing...');
      await removeSession();
      return null;
    }
    
    console.log('Valid session found');
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Remove session from storage
 */
export async function removeSession(): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(SESSION_KEY);
      }
    } else {
      await AsyncStorage.removeItem(SESSION_KEY);
    }
    
    console.log('Session removed successfully');
  } catch (error) {
    console.error('Error removing session:', error);
  }
}

/**
 * Check if session is valid
 */
export function isSessionValid(session: UserSession | null): boolean {
  if (!session) return false;
  
  const now = new Date();
  const expiresAt = new Date(session.expiresAt);
  
  return expiresAt > now;
}
