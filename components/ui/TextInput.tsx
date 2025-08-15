import { TextInput as RNTextInput, TextInputProps, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export function TextInput(props: TextInputProps) {
  const colorScheme = useColorScheme();

  return (
    <RNTextInput
      style={[
        styles.input,
        { 
          backgroundColor: colorScheme === 'dark' ? '#2A2D2E' : '#F1F3F5',
          color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
          borderColor: colorScheme === 'dark' ? '#3E4042' : '#E4E7EB',
        },
      ]}
      placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
});
