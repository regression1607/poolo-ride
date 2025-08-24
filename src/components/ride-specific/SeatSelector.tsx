import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme/colors';

interface SeatSelectorProps {
  value: number;
  onChange: (seats: number) => void;
  maxSeats?: number;
  minSeats?: number;
  disabled?: boolean;
  label?: string;
}

export const SeatSelector: React.FC<SeatSelectorProps> = ({
  value,
  onChange,
  maxSeats = 5,
  minSeats = 1,
  disabled = false,
  label = 'Number of seats',
}) => {
  const handleDecrease = () => {
    if (value > minSeats && !disabled) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < maxSeats && !disabled) {
      onChange(value + 1);
    }
  };

  const renderSeatIcon = (index: number) => {
    const isSelected = index < value;
    return (
      <View
        key={index}
        style={[
          styles.seatIcon,
          isSelected ? styles.seatSelected : styles.seatUnselected,
          disabled && styles.seatDisabled,
        ]}
      >
        <Ionicons
          name="person"
          size={16}
          color={
            disabled
              ? colors.neutral[400]
              : isSelected
              ? colors.neutral.white
              : colors.neutral[600]
          }
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.selectorContainer}>
        {/* Decrease Button */}
        <TouchableOpacity
          style={[
            styles.controlButton,
            (value <= minSeats || disabled) && styles.controlButtonDisabled,
          ]}
          onPress={handleDecrease}
          disabled={value <= minSeats || disabled}
        >
          <Ionicons
            name="remove"
            size={20}
            color={
              value <= minSeats || disabled
                ? colors.neutral[400]
                : colors.neutral[700]
            }
          />
        </TouchableOpacity>

        {/* Seat Visualization */}
        <View style={styles.seatsVisualization}>
          <View style={styles.seatsRow}>
            {Array.from({ length: maxSeats }, (_, index) => renderSeatIcon(index))}
          </View>
          <Text style={[styles.seatsText, disabled && styles.textDisabled]}>
            {value} seat{value !== 1 ? 's' : ''} selected
          </Text>
        </View>

        {/* Increase Button */}
        <TouchableOpacity
          style={[
            styles.controlButton,
            (value >= maxSeats || disabled) && styles.controlButtonDisabled,
          ]}
          onPress={handleIncrease}
          disabled={value >= maxSeats || disabled}
        >
          <Ionicons
            name="add"
            size={20}
            color={
              value >= maxSeats || disabled
                ? colors.neutral[400]
                : colors.neutral[700]
            }
          />
        </TouchableOpacity>
      </View>

      {/* Alternative: Quick Select Buttons */}
      <View style={styles.quickSelectContainer}>
        <Text style={styles.quickSelectLabel}>Quick select:</Text>
        <View style={styles.quickSelectButtons}>
          {Array.from({ length: maxSeats }, (_, index) => {
            const seatCount = index + 1;
            return (
              <TouchableOpacity
                key={seatCount}
                style={[
                  styles.quickSelectButton,
                  value === seatCount && styles.quickSelectButtonActive,
                  disabled && styles.quickSelectButtonDisabled,
                ]}
                onPress={() => !disabled && onChange(seatCount)}
                disabled={disabled}
              >
                <Text
                  style={[
                    styles.quickSelectButtonText,
                    value === seatCount && styles.quickSelectButtonTextActive,
                    disabled && styles.quickSelectButtonTextDisabled,
                  ]}
                >
                  {seatCount}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.lg,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing.md,
  },

  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    marginBottom: spacing.md,
  },

  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },

  controlButtonDisabled: {
    backgroundColor: colors.neutral[50],
    borderColor: colors.neutral[100],
  },

  seatsVisualization: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.lg,
  },

  seatsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },

  seatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    borderWidth: 2,
  },

  seatSelected: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },

  seatUnselected: {
    backgroundColor: colors.neutral[100],
    borderColor: colors.neutral[300],
  },

  seatDisabled: {
    backgroundColor: colors.neutral[50],
    borderColor: colors.neutral[200],
  },

  seatsText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral[700],
    textAlign: 'center',
  },

  textDisabled: {
    color: colors.neutral[400],
  },

  quickSelectContainer: {
    marginTop: spacing.md,
  },

  quickSelectLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral[700],
    marginBottom: spacing.sm,
  },

  quickSelectButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  quickSelectButton: {
    flex: 1,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },

  quickSelectButtonActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },

  quickSelectButtonDisabled: {
    backgroundColor: colors.neutral[50],
    borderColor: colors.neutral[100],
  },

  quickSelectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[700],
  },

  quickSelectButtonTextActive: {
    color: colors.neutral.white,
  },

  quickSelectButtonTextDisabled: {
    color: colors.neutral[400],
  },
});
