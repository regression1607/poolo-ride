import { TextInput as RNTextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';

export function TextInput(props: TextInputProps) {
  const { isDark } = useTheme();

  return (
    <RNTextInput
      style={[
        styles.input,
        { 
          backgroundColor: isDark ? '#2c2c2e' : '#f8f9fa',
          color: isDark ? '#ffffff' : '#1c1c1e',
          borderColor: isDark ? '#3c3c3e' : '#e1e5e9',
        },
      ]}
      placeholderTextColor={isDark ? '#8e8e93' : '#6c7b7f'}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '500',
  },
});
