import { useRouter } from 'expo-router';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/src/context/AuthContext';
import { TextInput } from '@/components/ui/TextInput';
import { PasswordInput } from '@/components/ui/PasswordInput';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signUp, loading } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    setErrorMessage(''); // Clear previous errors
    const { error } = await signUp(name, email, password);
    
    if (error) {
      setErrorMessage(error.message);
      
      // If registration was successful but needs login, show success message
      if (error.message.includes('Please try logging in')) {
        setErrorMessage('Registration successful! You can now login with your credentials.');
      }
    }
    // If no error, the AuthContext will handle the automatic redirect
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.logoContainer}>
        <ThemedText type="title">Poolo-Ride</ThemedText>
        <ThemedText style={styles.tagline}>Create your account</ThemedText>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
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
        
        <PasswordInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        
        {errorMessage ? (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
            {errorMessage.includes('confirm your email') && (
              <ThemedText style={styles.helpText}>
                Check your email inbox and click the confirmation link, then try logging in.
              </ThemedText>
            )}
          </ThemedView>
        ) : null}

        <TouchableOpacity 
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Create Account</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToLogin}>
          <ThemedText style={styles.loginText}>
            Already have an account? Login here
          </ThemedText>
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
    marginBottom: 40,
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
  registerButton: {
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
  loginText: {
    marginTop: 20,
    textAlign: 'center',
  },
});
