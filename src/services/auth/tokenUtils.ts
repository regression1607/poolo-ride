import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

/**
 * Generate a JWT-like token for user authentication
 */
export const generateToken = (userId: string): string => {
  try {
    const header = {
      typ: 'JWT',
      alg: 'HS256'
    };

    const payload = {
      userId,
      iat: Math.floor(Date.now() / 1000), // Issued at
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // Expires in 7 days
    };

    // Create simple token (not cryptographically secure, but fine for demo)
    const headerBase64 = btoa(JSON.stringify(header));
    const payloadBase64 = btoa(JSON.stringify(payload));
    
    // Simple signature using timestamp and userId
    const signature = btoa(userId + Date.now().toString());

    return `${headerBase64}.${payloadBase64}.${signature}`;
  } catch (error) {
    throw new Error('Token generation failed');
  }
};

/**
 * Verify a token and return the payload if valid
 */
export const verifyToken = (token: string): boolean => {
  try {
    if (!token) {
      return false;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const [headerBase64, payloadBase64, signature] = parts;
    
    // Decode payload
    const payload = JSON.parse(atob(payloadBase64));
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && currentTime > payload.exp) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

/**
 * Decode token payload without verification
 */
export const decodeToken = (token: string): any | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

/**
 * Get user ID from token
 */
export const getUserIdFromToken = (token: string): string | null => {
  try {
    const payload = decodeToken(token);
    return payload?.userId || null;
  } catch (error) {
    console.error('Get user ID error:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeToken(token);
    if (!payload?.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime > payload.exp;
  } catch (error) {
    console.error('Token expiry check error:', error);
    return true;
  }
};

/**
 * Refresh token (generate new token with same user ID)
 */
export const refreshToken = async (oldToken: string): Promise<string | null> => {
  try {
    const payload = decodeToken(oldToken);
    if (!payload?.userId) {
      return null;
    }

    return generateToken(payload.userId);
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
};
