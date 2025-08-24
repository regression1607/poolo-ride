import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme/colors';

interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  variant?: 'outlined' | 'filled';
  size?: 'medium' | 'large';
  containerStyle?: ViewStyle;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  error,
  helperText,
  variant = 'outlined',
  size = 'medium',
  containerStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  ...textInputProps
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        styles[variant],
        styles[size],
        error && styles.inputError,
      ]}>
        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={20}
            color={colors.neutral[500]}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral[500]}
          {...textInputProps}
        />
        
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconContainer}
          >
            <Ionicons
              name={rightIcon as any}
              size={20}
              color={colors.neutral[500]}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral[700],
    marginBottom: spacing.xs,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.neutral[900],
  },
  
  inputWithLeftIcon: {
    marginLeft: spacing.sm,
  },
  
  inputWithRightIcon: {
    marginRight: spacing.sm,
  },
  
  leftIcon: {
    marginLeft: spacing.sm,
  },
  
  rightIconContainer: {
    padding: spacing.xs,
    marginRight: spacing.xs,
  },
  
  // Variants
  outlined: {
    borderWidth: 1,
    borderColor: colors.neutral[300],
    backgroundColor: colors.neutral.white,
  },
  
  filled: {
    backgroundColor: colors.neutral[100],
    borderWidth: 0,
  },
  
  // Sizes
  medium: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 44,
  },
  
  large: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 52,
  },
  
  // States
  inputError: {
    borderColor: colors.status.error,
  },
  
  errorText: {
    fontSize: 12,
    color: colors.status.error,
    marginTop: spacing.xs,
  },
  
  helperText: {
    fontSize: 12,
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },
});
