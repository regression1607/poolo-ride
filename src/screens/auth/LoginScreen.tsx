import React, { useState, useEffect } from 'react';
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
import { validateLoginData } from '../../utils/validation';
import { supabase } from '../../services/database/supabaseClient';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [dbStatus, setDbStatus] = useState<string>('checking');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Test database connection on component mount
  useEffect(() => {
    const testDatabase = async () => {
      try {
        console.log('Testing database connection...');
        const { data, error } = await supabase.from('users').select('count').limit(1);
        
        if (error) {
          console.error('Database test error:', error);
          if (error.code === '42P01') {
            setDbStatus('missing_tables');
            Alert.alert(
              'Database Setup Required',
              'The database tables have not been created yet. Please check the DATABASE_SCHEMA.md file for setup instructions.',
              [{ text: 'OK' }]
            );
          } else {
            setDbStatus('error');
            Alert.alert(
              'Database Connection Error',
              `Database error: ${error.message}`,
              [{ text: 'OK' }]
            );
          }
        } else {
          console.log('✅ Database connection successful!');
          setDbStatus('connected');
        }
      } catch (error) {
        console.error('Database connection test failed:', error);
        setDbStatus('error');
      }
    };

    testDatabase();
  }, []);

  const handleLogin = async () => {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email.trim());
    console.log('Password length:', password.length);
    
    // Clear previous messages
    setErrors({});
    setErrorMessage('');
    setSuccessMessage('');

    // Validate input data
    const validation = validateLoginData({ email: email.trim(), password });
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
      console.log('Calling login function...');
      await login(email.trim(), password);
      
      console.log('Login successful!');
      setSuccessMessage('Welcome back! Redirecting to your dashboard...');
      
      // Clear form
      setEmail('');
      setPassword('');
      
    } catch (error: any) {
      console.error('=== LOGIN ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      const errorMsg = error.message || 'An unexpected error occurred. Please try again.';
      console.log('Showing error message:', errorMsg);
      setErrorMessage(errorMsg);
      
    } finally {
      setIsLoading(false);
      console.log('Login attempt finished, loading:', false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password', 
      'Password reset feature will be available soon!',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
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
                <Text style={styles.welcomeText}>Welcome back!</Text>
                <Text style={styles.subtitleText}>
                  Login to find rides and share costs
                </Text>
              </View>

              {/* Login Form */}
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
                  label="Email"
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
                  label="Password"
                  placeholder="Enter your password"
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
                  error={errors.password}
                />

                <TouchableOpacity
                  style={styles.forgotPasswordContainer}
                  onPress={handleForgotPassword}
                >
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                <Button
                  title={isLoading ? "Signing in..." : "Sign In"}
                  onPress={handleLogin}
                  variant="primary"
                  size="large"
                  disabled={isLoading}
                  style={styles.loginButton}
                />

                {/* Divider */}
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Register Link */}
                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>
                    Don't have an account?{' '}
                  </Text>
                  <TouchableOpacity onPress={navigateToRegister}>
                    <Text style={styles.registerLink}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Features */}
              <View style={styles.featuresContainer}>
                <View style={styles.featureItem}>
                  <Ionicons name="people" size={20} color={colors.primary.main} />
                  <Text style={styles.featureText}>Share rides with others</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="wallet" size={20} color={colors.secondary.main} />
                  <Text style={styles.featureText}>Save money on fuel</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="leaf" size={20} color={colors.secondary.main} />
                  <Text style={styles.featureText}>Reduce carbon footprint</Text>
                </View>
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
    marginBottom: spacing['2xl'],
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

  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },

  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary.main,
    fontWeight: '500',
  },

  loginButton: {
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

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  registerText: {
    fontSize: 14,
    color: colors.neutral[600],
  },

  registerLink: {
    fontSize: 14,
    color: colors.primary.main,
    fontWeight: '600',
  },

  featuresContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.md,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  featureText: {
    fontSize: 14,
    color: colors.neutral[700],
    fontWeight: '500',
  },
});
