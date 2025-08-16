import { useRouter } from 'expo-router';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';

import { ThemedText } from '@/src/components/legacy/ThemedText';
import { ThemedView } from '@/src/components/legacy/ThemedView';
import { useAuth } from '@/src/context/AuthContext';
import { Input } from '@/src/components';
import { PasswordInput } from '@/src/components/legacy/ui/PasswordInput';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn, loading, session, clearSession } = useAuth();
  const router = useRouter();

  // If user is already logged in, let NavigationGuard handle the redirect
  useEffect(() => {
    if (session) {
      console.log('Login screen: User already authenticated, NavigationGuard will handle redirect');
    }
  }, [session]);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    setErrorMessage(''); // Clear previous errors
    console.log('Logging in user:', email);
    
    const { error } = await signIn(email, password);
    if (error) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'Login failed. Please try again.');
    } else {
      console.log('Login successful! NavigationGuard will handle redirect.');
      // NavigationGuard will automatically redirect to the main app
    }
  };

  const navigateToRegister = () => {
    router.push('/auth/register');
  };

  // Don't render login form if user is already authenticated - let NavigationGuard handle redirect
  if (session) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.logoContainer}>
          <ThemedText type="title">Redirecting...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.logoContainer}>
        {/* App Logo */}
        <ThemedText type="title">Poolo-Ride</ThemedText>
        <ThemedText style={styles.tagline}>Share your rides, save the environment</ThemedText>
      </View>

      <View style={styles.formContainer}>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <PasswordInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />
        
        {errorMessage ? (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
            {errorMessage.includes('confirm your email') && (
              <ThemedText style={styles.helpText}>
                Please check your email and click the confirmation link first.
              </ThemedText>
            )}
          </ThemedView>
        ) : null}

        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Login</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToRegister}>
          <ThemedText style={styles.registerText}>
            Don't have an account? Register here
          </ThemedText>
        </TouchableOpacity>

        {/* Debug button to clear session for testing */}
        <TouchableOpacity 
          style={[styles.loginButton, { backgroundColor: '#ff4444', marginTop: 10 }]}
          onPress={clearSession}
        >
          <ThemedText style={styles.buttonText}>Clear Session (Debug)</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  tagline: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    gap: 15,
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
  },
  errorContainer: {
    marginVertical: 10,
  },
  helpText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
  loginButton: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    marginTop: 20,
    textAlign: 'center',
  },
});
