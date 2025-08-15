import { TextInput as RNTextInput, TextInputProps, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';

interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function PasswordInput({ value, onChangeText, placeholder, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const colorScheme = useColorScheme();

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: colorScheme === 'dark' ? '#2A2D2E' : '#F1F3F5',
        borderColor: colorScheme === 'dark' ? '#3E4042' : '#E4E7EB',
      },
    ]}>
      <RNTextInput
        style={[
          styles.input,
          { 
            color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
          },
        ]}
        placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
        secureTextEntry={!showPassword}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        {...props}
      />
      <TouchableOpacity
        style={styles.eyeButton}
        onPress={() => setShowPassword(!showPassword)}
      >
        <ThemedText style={styles.eyeText}>
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  eyeButton: {
    padding: 5,
  },
  eyeText: {
    fontSize: 18,
  },
});
