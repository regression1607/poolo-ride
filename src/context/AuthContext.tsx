import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { registerUser, loginUser } from '../utils/customAuth';
import { getSession, removeSession, UserSession } from '../utils/sessionManager';

// Custom user type for our authentication system
interface CustomUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  session: UserSession | null;
  user: CustomUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (name: string, email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  clearSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true); // Start with true to check existing sessions

  useEffect(() => {
    // Check if there's a stored session
    const checkStoredSession = async () => {
      try {
        console.log('Custom Auth: Checking for existing session...');
        const storedSession = await getSession();
        
        if (storedSession) {
          console.log('Custom Auth: Found valid session for:', storedSession.email);
          setSession(storedSession);
          setUser({
            id: storedSession.id,
            name: storedSession.name,
            email: storedSession.email,
            created_at: storedSession.created_at
          });
        } else {
          console.log('Custom Auth: No valid session found');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking stored session:', error);
        setLoading(false);
      }
    };

    checkStoredSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Custom Auth: Attempting to sign in user:', email);
      
      const result = await loginUser(email, password);
      
      if (result.error) {
        console.error('Custom Auth: SignIn error:', result.error);
        setLoading(false);
        return { error: result.error };
      }

      if (result.user && result.session) {
        console.log('Custom Auth: SignIn successful');
        setSession(result.session);
        setUser(result.user);
        setLoading(false);
        return { error: null };
      }
      
      setLoading(false);
      return { error: { message: 'Login failed' } };
    } catch (error) {
      console.error('Custom Auth: SignIn exception:', error);
      setLoading(false);
      return { error: { message: 'An unexpected error occurred. Please try again.' } };
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Custom Auth: Starting registration for:', email);
      
      const result = await registerUser(name, email, password);
      
      if (result.error) {
        console.error('Custom Auth: Registration failed:', result.error);
        setLoading(false);
        return { error: result.error };
      }
      
      if (result.user && result.session) {
        console.log('Custom Auth: Registration successful, signing in user');
        // Automatically sign in the user after successful registration
        setSession(result.session);
        setUser(result.user);
        setLoading(false);
        return { error: null };
      }
      
      setLoading(false);
      return { error: { message: 'Registration completed but login failed' } };
      
    } catch (error) {
      console.error('Custom Auth: Registration exception:', error);
      setLoading(false);
      return { error: { message: 'An unexpected error occurred. Please try again.' } };
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      console.log('Custom Auth: User signing out');
      await removeSession();
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Custom Auth: Error signing out:', error);
    }
    setLoading(false);
  };

  const clearSession = async () => {
    console.log('Custom Auth: Clearing session for testing...');
    await removeSession();
    setSession(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
