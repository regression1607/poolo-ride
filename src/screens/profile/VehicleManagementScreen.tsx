import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme/colors';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { SuccessMessage } from '../../components/common/SuccessMessage';
import { useAuth } from '../../contexts/AuthContext';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  vehicle_type: 'car' | 'bike' | 'suv' | 'hatchback';
  seats: number;
  is_default: boolean;
}

export const VehicleManagementScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Add vehicle form state
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    license_plate: '',
    vehicle_type: 'car' as 'car' | 'bike' | 'suv' | 'hatchback',
    seats: '4',
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    // Mock data for now - in real app, fetch from database
    setVehicles([
      {
        id: '1',
        make: 'Honda',
        model: 'City',
        year: 2022,
        color: 'White',
        license_plate: 'MH 12 AB 1234',
        vehicle_type: 'car',
        seats: 5,
        is_default: true,
      },
    ]);
  };

  const vehicleTypes = [
    { key: 'car', label: 'Car', icon: 'car', seats: 4 },
    { key: 'suv', label: 'SUV', icon: 'car-sport', seats: 7 },
    { key: 'hatchback', label: 'Hatchback', icon: 'car', seats: 4 },
    { key: 'bike', label: 'Bike', icon: 'bicycle', seats: 1 },
  ];

  const handleAddVehicle = async () => {
    setErrorMessage('');
    
    if (!newVehicle.make || !newVehicle.model || !newVehicle.year || !newVehicle.license_plate) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    const year = parseInt(newVehicle.year);
    if (isNaN(year) || year < 1990 || year > new Date().getFullYear() + 1) {
      setErrorMessage('Please enter a valid year');
      return;
    }

    setIsLoading(true);
    try {
      // In real app, save to database
      const vehicle: Vehicle = {
        id: Date.now().toString(),
        make: newVehicle.make,
        model: newVehicle.model,
        year: year,
        color: newVehicle.color,
        license_plate: newVehicle.license_plate.toUpperCase(),
        vehicle_type: newVehicle.vehicle_type,
        seats: parseInt(newVehicle.seats),
        is_default: vehicles.length === 0,
      };

      setVehicles([...vehicles, vehicle]);
      setSuccessMessage('Vehicle added successfully!');
      setShowAddForm(false);
      resetForm();
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to add vehicle');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewVehicle({
      make: '',
      model: '',
      year: '',
      color: '',
      license_plate: '',
      vehicle_type: 'car',
      seats: '4',
    });
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    
    Alert.alert(
      'Delete Vehicle',
      `Are you sure you want to delete ${vehicle?.make} ${vehicle?.model}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setVehicles(vehicles.filter(v => v.id !== vehicleId));
            setSuccessMessage('Vehicle deleted successfully');
          },
        },
      ]
    );
  };

  const handleSetDefault = (vehicleId: string) => {
    setVehicles(vehicles.map(v => ({
      ...v,
      is_default: v.id === vehicleId,
    })));
    setSuccessMessage('Default vehicle updated');
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bike': return 'bicycle';
      case 'suv': return 'car-sport';
      default: return 'car';
    }
  };

  const getVehicleColor = (type: string) => {
    switch (type) {
      case 'bike': return colors.vehicle.bike;
      case 'suv': return colors.special.orange;
      default: return colors.vehicle.car;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.neutral[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Vehicles</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Ionicons name="add" size={24} color={colors.primary.main} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Messages */}
        <ErrorMessage
          message={errorMessage}
          visible={!!errorMessage}
          onDismiss={() => setErrorMessage('')}
        />

        <SuccessMessage
          message={successMessage}
          visible={!!successMessage}
          onDismiss={() => setSuccessMessage('')}
        />

        {/* Add Vehicle Form */}
        {showAddForm && (
          <View style={styles.addFormContainer}>
            <Text style={styles.formTitle}>Add New Vehicle</Text>
            
            <Input
              label="Make *"
              placeholder="e.g., Honda, Toyota, BMW"
              value={newVehicle.make}
              onChangeText={(text) => setNewVehicle({ ...newVehicle, make: text })}
            />

            <Input
              label="Model *"
              placeholder="e.g., City, Camry, X1"
              value={newVehicle.model}
              onChangeText={(text) => setNewVehicle({ ...newVehicle, model: text })}
            />

            <Input
              label="Year *"
              placeholder="e.g., 2022"
              value={newVehicle.year}
              onChangeText={(text) => setNewVehicle({ ...newVehicle, year: text })}
              keyboardType="numeric"
            />

            <Input
              label="Color"
              placeholder="e.g., White, Black, Red"
              value={newVehicle.color}
              onChangeText={(text) => setNewVehicle({ ...newVehicle, color: text })}
            />

            <Input
              label="License Plate *"
              placeholder="e.g., MH 12 AB 1234"
              value={newVehicle.license_plate}
              onChangeText={(text) => setNewVehicle({ ...newVehicle, license_plate: text })}
              autoCapitalize="characters"
            />

            {/* Vehicle Type Selection */}
            <Text style={styles.inputLabel}>Vehicle Type *</Text>
            <View style={styles.vehicleTypeContainer}>
              {vehicleTypes.map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.vehicleTypeButton,
                    newVehicle.vehicle_type === type.key && styles.vehicleTypeButtonActive,
                  ]}
                  onPress={() => setNewVehicle({ 
                    ...newVehicle, 
                    vehicle_type: type.key as any,
                    seats: type.seats.toString()
                  })}
                >
                  <Ionicons
                    name={type.icon as any}
                    size={24}
                    color={newVehicle.vehicle_type === type.key ? colors.neutral.white : colors.neutral[600]}
                  />
                  <Text style={[
                    styles.vehicleTypeText,
                    newVehicle.vehicle_type === type.key && styles.vehicleTypeTextActive,
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="Number of Seats"
              value={newVehicle.seats}
              onChangeText={(text) => setNewVehicle({ ...newVehicle, seats: text })}
              keyboardType="numeric"
            />

            <View style={styles.formButtons}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                variant="secondary"
                size="medium"
                style={styles.cancelButton}
              />
              <Button
                title={isLoading ? "Adding..." : "Add Vehicle"}
                onPress={handleAddVehicle}
                variant="primary"
                size="medium"
                disabled={isLoading}
                style={styles.addVehicleButton}
              />
            </View>
          </View>
        )}

        {/* Vehicles List */}
        <View style={styles.vehiclesSection}>
          <Text style={styles.sectionTitle}>Your Vehicles ({vehicles.length})</Text>
          
          {vehicles.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="car" size={64} color={colors.neutral[300]} />
              <Text style={styles.emptyStateTitle}>No vehicles added</Text>
              <Text style={styles.emptyStateDescription}>
                Add your vehicle to start offering rides
              </Text>
              <Button
                title="Add Your First Vehicle"
                onPress={() => setShowAddForm(true)}
                variant="primary"
                size="medium"
                style={styles.emptyStateButton}
              />
            </View>
          ) : (
            vehicles.map((vehicle) => (
              <View key={vehicle.id} style={styles.vehicleCard}>
                <View style={styles.vehicleCardHeader}>
                  <View style={styles.vehicleInfo}>
                    <View style={[
                      styles.vehicleIconContainer,
                      { backgroundColor: getVehicleColor(vehicle.vehicle_type) }
                    ]}>
                      <Ionicons
                        name={getVehicleIcon(vehicle.vehicle_type) as any}
                        size={24}
                        color={colors.neutral.white}
                      />
                    </View>
                    <View style={styles.vehicleDetails}>
                      <Text style={styles.vehicleName}>
                        {vehicle.make} {vehicle.model}
                      </Text>
                      <Text style={styles.vehicleSpecs}>
                        {vehicle.year} • {vehicle.color} • {vehicle.seats} seats
                      </Text>
                      <Text style={styles.vehiclePlate}>{vehicle.license_plate}</Text>
                    </View>
                  </View>

                  {vehicle.is_default && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                </View>

                <View style={styles.vehicleActions}>
                  {!vehicle.is_default && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleSetDefault(vehicle.id)}
                    >
                      <Text style={styles.actionButtonText}>Set as Default</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteVehicle(vehicle.id)}
                  >
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },

  backButton: {
    padding: spacing.sm,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral[900],
  },

  addButton: {
    padding: spacing.sm,
  },

  content: {
    flex: 1,
    padding: spacing.lg,
  },

  addFormContainer: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing.lg,
    textAlign: 'center',
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral[700],
    marginBottom: spacing.sm,
  },

  vehicleTypeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    flexWrap: 'wrap',
  },

  vehicleTypeButton: {
    flex: 1,
    minWidth: 80,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    alignItems: 'center',
    gap: spacing.xs,
  },

  vehicleTypeButtonActive: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.main,
  },

  vehicleTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral[600],
  },

  vehicleTypeTextActive: {
    color: colors.neutral.white,
  },

  formButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },

  cancelButton: {
    flex: 1,
  },

  addVehicleButton: {
    flex: 1,
  },

  vehiclesSection: {
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing.lg,
  },

  emptyState: {
    alignItems: 'center',
    padding: spacing['3xl'],
  },

  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral[900],
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  emptyStateDescription: {
    fontSize: 14,
    color: colors.neutral[600],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },

  emptyStateButton: {
    marginTop: spacing.lg,
  },

  vehicleCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  vehicleCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  vehicleInfo: {
    flexDirection: 'row',
    flex: 1,
  },

  vehicleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  vehicleDetails: {
    flex: 1,
  },

  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },

  vehicleSpecs: {
    fontSize: 14,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },

  vehiclePlate: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary.main,
  },

  defaultBadge: {
    backgroundColor: colors.secondary.main,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },

  defaultBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral.white,
  },

  vehicleActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  actionButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    alignItems: 'center',
  },

  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral[600],
  },

  deleteButton: {
    borderColor: colors.status.error,
  },

  deleteButtonText: {
    color: colors.status.error,
  },
});
