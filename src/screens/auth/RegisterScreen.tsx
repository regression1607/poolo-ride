import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme/colors';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { SuccessMessage } from '../../components/common/SuccessMessage';
import { useAuth } from '../../contexts/AuthContext';
import { validateRegistrationData } from '../../utils/validation';

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async () => {
    console.log('=== REGISTER ATTEMPT ===');
    console.log('Name:', name.trim());
    console.log('Username:', username.trim());
    console.log('Email:', email.trim());
    console.log('Phone:', phoneNumber.trim());
    console.log('Password length:', password.length);
    
    // Clear previous messages
    setErrors({});
    setErrorMessage('');
    setSuccessMessage('');

    // Comprehensive validation
    const validation = validateRegistrationData({
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      phone_number: phoneNumber.trim(),
      password,
      confirmPassword,
    });

    console.log('Validation result:', validation);

    if (!validation.isValid) {
      setErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      console.log('Validation failed:', firstError);
      setErrorMessage(firstError);
      return;
    }

    setIsLoading(true);
    try {
      console.log('Calling register function...');
      await register({
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        phone_number: phoneNumber.trim() || undefined,
      });

      console.log('Registration successful!');
      setSuccessMessage('Account created successfully! Welcome to Poolo!');
      
      // Clear form
      setName('');
      setUsername('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
      setConfirmPassword('');
      
    } catch (error: any) {
      console.error('=== REGISTER ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      const errorMsg = error.message || 'An unexpected error occurred. Please try again.';
      console.log('Showing error message:', errorMsg);
      setErrorMessage(errorMsg);
      
    } finally {
      setIsLoading(false);
      console.log('Register attempt finished, loading:', false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        }}
        style={styles.backgroundImage}
      >
        <LinearGradient
  colors={[
    'rgba(165, 214, 167, 0.6)',   // light mint green, ~60% opacity
    'rgba(200, 230, 201, 0.5)',   // softer mint, more transparent
    'rgba(255, 255, 255, 0.1)'    // near-white finish, retains depth
  ]}
  style={styles.gradient}
>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.logoContainer}>
                  <Ionicons name="car" size={48} color={colors.primary.main} />
                  <Text style={styles.appName}>Poolo</Text>
                </View>
                <Text style={styles.welcomeText}>Join Poolo</Text>
                <Text style={styles.subtitleText}>
                  Start sharing rides and saving money
                </Text>
              </View>

              {/* Register Form */}
              <View style={styles.formContainer}>
                {/* Error Message */}
                <ErrorMessage
                  message={errorMessage}
                  visible={!!errorMessage}
                  onDismiss={() => setErrorMessage('')}
                />

                {/* Success Message */}
                <SuccessMessage
                  message={successMessage}
                  visible={!!successMessage}
                  onDismiss={() => setSuccessMessage('')}
                />

                <Input
                  label="Full Name *"
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) {
                      setErrors(prev => ({ ...prev, name: '' }));
                    }
                    setErrorMessage(''); // Clear error when user types
                  }}
                  leftIcon="person"
                  error={errors.name}
                />

                <Input
                  label="Username *"
                  placeholder="Choose a username"
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (errors.username) {
                      setErrors(prev => ({ ...prev, username: '' }));
                    }
                    setErrorMessage(''); // Clear error when user types
                  }}
                  autoCapitalize="none"
                  leftIcon="at"
                  helperText="Letters, numbers, and underscores only"
                  error={errors.username}
                />

                <Input
                  label="Email Address *"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) {
                      setErrors(prev => ({ ...prev, email: '' }));
                    }
                    setErrorMessage(''); // Clear error when user types
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon="mail"
                  error={errors.email}
                />

                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    if (errors.phone_number) {
                      setErrors(prev => ({ ...prev, phone_number: '' }));
                    }
                    setErrorMessage(''); // Clear error when user types
                  }}
                  keyboardType="phone-pad"
                  leftIcon="call"
                  helperText="Optional - for better ride coordination"
                  error={errors.phone_number}
                />

                <Input
                  label="Password *"
                  placeholder="Create a password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors(prev => ({ ...prev, password: '' }));
                    }
                    setErrorMessage(''); // Clear error when user types
                  }}
                  secureTextEntry={!showPassword}
                  leftIcon="lock-closed"
                  rightIcon={showPassword ? "eye-off" : "eye"}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  helperText="Must be at least 8 characters with uppercase, lowercase, number, and symbol"
                  error={errors.password}
                />

                <Input
                  label="Confirm Password *"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }
                    setErrorMessage(''); // Clear error when user types
                  }}
                  secureTextEntry={!showConfirmPassword}
                  leftIcon="lock-closed"
                  rightIcon={showConfirmPassword ? "eye-off" : "eye"}
                  onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  error={errors.confirmPassword}
                />                <Button
                  title={isLoading ? "Creating Account..." : "Create Account"}
                  onPress={handleRegister}
                  variant="primary"
                  size="large"
                  disabled={isLoading}
                  style={styles.registerButton}
                />

                {/* Divider */}
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Login Link */}
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>
                    Already have an account?{' '}
                  </Text>
                  <TouchableOpacity onPress={navigateToLogin}>
                    <Text style={styles.loginLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Terms */}
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By creating an account, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },

  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  gradient: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%',
  },

  content: {
    padding: spacing.lg,
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary.main,
    marginTop: spacing.sm,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.neutral.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  subtitleText: {
    fontSize: 16,
    color: colors.neutral.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },

  registerButton: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral[300],
  },

  dividerText: {
    paddingHorizontal: spacing.md,
    fontSize: 14,
    color: colors.neutral[500],
    fontWeight: '500',
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginText: {
    fontSize: 14,
    color: colors.neutral[600],
  },

  loginLink: {
    fontSize: 14,
    color: colors.primary.main,
    fontWeight: '600',
  },

  termsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: spacing.md,
  },

  termsText: {
    fontSize: 12,
    color: colors.neutral[600],
    textAlign: 'center',
    lineHeight: 18,
  },

  termsLink: {
    color: colors.primary.main,
    fontWeight: '500',
  },
});
