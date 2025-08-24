import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme/colors';

interface SuccessMessageProps {
  message: string;
  visible: boolean;
  onDismiss?: () => void;
  style?: any;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  visible,
  onDismiss,
  style,
}) => {
  if (!visible || !message) return null;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <Ionicons name="checkmark-circle" size={20} color={colors.status.success} />
        <Text style={styles.message}>{message}</Text>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <Ionicons name="close" size={18} color={colors.status.success} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ECFDF5',
    borderColor: colors.status.success,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: spacing.sm,
    padding: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: colors.status.success,
    fontWeight: '500',
    lineHeight: 20,
  },
  dismissButton: {
    padding: spacing.xs,
  },
});
