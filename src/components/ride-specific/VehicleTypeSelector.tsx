import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme/colors';
import { VehicleType } from '../../types/ride';

interface VehicleOption {
  type: VehicleType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  color: string;
}

interface VehicleTypeSelectorProps {
  value: VehicleType;
  onChange: (vehicleType: VehicleType) => void;
  disabled?: boolean;
  label?: string;
}

export const VehicleTypeSelector: React.FC<VehicleTypeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  label = 'Vehicle type',
}) => {
  const vehicleOptions: VehicleOption[] = [
    {
      type: 'bike',
      label: 'Bike/Scooter',
      icon: 'bicycle',
      description: 'Perfect for solo rides',
      color: colors.vehicle.bike,
    },
    {
      type: 'car',
      label: 'Personal Car',
      icon: 'car',
      description: 'Comfortable seating',
      color: colors.vehicle.car,
    },
    {
      type: 'cab',
      label: 'Commercial Cab',
      icon: 'car-sport',
      description: 'Professional service',
      color: colors.vehicle.cab,
    },
  ];

  const handleSelect = (vehicleType: VehicleType) => {
    if (!disabled) {
      onChange(vehicleType);
    }
  };

  const renderVehicleOption = (option: VehicleOption) => {
    const isSelected = value === option.type;
    
    return (
      <TouchableOpacity
        key={option.type}
        style={[
          styles.optionContainer,
          isSelected && styles.optionSelected,
          disabled && styles.optionDisabled,
        ]}
        onPress={() => handleSelect(option.type)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View style={styles.optionContent}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: isSelected ? option.color : colors.neutral[100] },
              disabled && styles.iconContainerDisabled,
            ]}
          >
            <Ionicons
              name={option.icon}
              size={24}
              color={
                disabled
                  ? colors.neutral[400]
                  : isSelected
                  ? colors.neutral.white
                  : colors.neutral[600]
              }
            />
          </View>
          
          <View style={styles.optionText}>
            <Text
              style={[
                styles.optionLabel,
                isSelected && styles.optionLabelSelected,
                disabled && styles.optionLabelDisabled,
              ]}
            >
              {option.label}
            </Text>
            <Text
              style={[
                styles.optionDescription,
                disabled && styles.optionDescriptionDisabled,
              ]}
            >
              {option.description}
            </Text>
          </View>
          
          {isSelected && !disabled && (
            <View style={styles.checkIcon}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={option.color}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, disabled && styles.labelDisabled]}>
          {label}
        </Text>
      )}
      
      <View style={styles.optionsContainer}>
        {vehicleOptions.map(renderVehicleOption)}
      </View>
      
      {/* Selected Vehicle Info */}
      {value && (
        <View style={styles.selectedInfo}>
          <View style={styles.selectedIndicator}>
            <Ionicons name="checkmark" size={16} color={colors.secondary.main} />
          </View>
          <Text style={styles.selectedText}>
            {vehicleOptions.find(option => option.type === value)?.label} selected
          </Text>
        </View>
      )}
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

  labelDisabled: {
    color: colors.neutral[400],
  },

  optionsContainer: {
    gap: spacing.md,
  },

  optionContainer: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.neutral[200],
    padding: spacing.lg,
  },

  optionSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary[50],
  },

  optionDisabled: {
    backgroundColor: colors.neutral[50],
    borderColor: colors.neutral[100],
  },

  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  iconContainerDisabled: {
    backgroundColor: colors.neutral[100],
  },

  optionText: {
    flex: 1,
  },

  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: 2,
  },

  optionLabelSelected: {
    color: colors.primary.main,
  },

  optionLabelDisabled: {
    color: colors.neutral[400],
  },

  optionDescription: {
    fontSize: 14,
    color: colors.neutral[600],
  },

  optionDescriptionDisabled: {
    color: colors.neutral[400],
  },

  checkIcon: {
    marginLeft: spacing.md,
  },

  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary[50],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },

  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.secondary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },

  selectedText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondary.dark,
  },
});
