import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme/colors';
import { LocationPicker } from '../../components/ride-specific/LocationPicker';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { SeatSelector } from '../../components/ride-specific/SeatSelector';
import { VehicleTypeSelector } from '../../components/ride-specific/VehicleTypeSelector';
import { VehicleType } from '../../types/ride';
import { rideService } from '../../services/api/rideService';
import { useAuth } from '../../contexts/AuthContext';

interface RideData {
  fromLocation: string;
  toLocation: string;
  departureDate: Date;
  departureTime: string;
  availableSeats: number;
  vehicleType: VehicleType;
  pricePerSeat: string;
  description: string;
}

type DateSelection = 'today' | 'tomorrow' | 'custom';

export const PublishScreen: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedDateOption, setSelectedDateOption] = useState<DateSelection>('today');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Time picker states
  const [selectedHour, setSelectedHour] = useState('12');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('PM');
  const [rideData, setRideData] = useState<RideData>({
    fromLocation: '',
    toLocation: '',
    departureDate: new Date(),
    departureTime: '',
    availableSeats: 2,
    vehicleType: 'car',
    pricePerSeat: '',
    description: '',
  });

  const totalSteps = 4;

  // Generate hours array (1-12 for 12-hour format)
  const getHoursArray = () => {
    return Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  };

  // Generate minutes array (00-59 in 5-minute intervals for better UX)
  const getMinutesArray = () => {
    return Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));
  };

  // Check if selected time is valid (at least 30 minutes from now)
  const isTimeValid = (hour: string, minute: string, period: 'AM' | 'PM') => {
    const now = new Date();
    const selectedDateTime = new Date();
    
    // Set the selected date based on selectedDateOption
    if (selectedDateOption === 'tomorrow') {
      selectedDateTime.setDate(now.getDate() + 1);
    }
    
    // Convert selected time to 24-hour format
    const hour24 = convertTo24Hour(hour, period);
    selectedDateTime.setHours(parseInt(hour24), parseInt(minute), 0, 0);
    
    // If it's today, check if the time is at least 30 minutes from now
    if (selectedDateOption === 'today') {
      const minValidTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
      return selectedDateTime >= minValidTime;
    }
    
    // For tomorrow, any time is valid
    return true;
  };

  // Convert 12-hour format to 24-hour format
  const convertTo24Hour = (hour: string, period: 'AM' | 'PM') => {
    let hourNum = parseInt(hour);
    if (period === 'AM' && hourNum === 12) {
      hourNum = 0;
    } else if (period === 'PM' && hourNum !== 12) {
      hourNum += 12;
    }
    return hourNum.toString().padStart(2, '0');
  };

  // Get current selected time in 24-hour format
  const getSelectedTime24 = () => {
    const hour24 = convertTo24Hour(selectedHour, selectedPeriod);
    return `${hour24}:${selectedMinute}`;
  };

  // Update ride data with selected time (called when user finalizes selection)
  const updateRideDataTime = () => {
    const timeString = getSelectedTime24();
    updateRideData('departureTime', timeString);
    console.log('Selected time updated:', timeString);
  };

  // Validate selected time and show error if invalid
  const validateSelectedTime = () => {
    if (!isTimeValid(selectedHour, selectedMinute, selectedPeriod)) {
      Alert.alert(
        'Invalid Time',
        'Please select a time that is at least 30 minutes from now.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const calculateSuggestedPrice = () => {
    // Mock calculation based on route distance
    const basePrice = 100;
    const distanceMultiplier = Math.floor(Math.random() * 100) + 50;
    return basePrice + distanceMultiplier;
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      if (validateCurrentStep()) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      handlePublish();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!rideData.fromLocation || !rideData.toLocation) {
          Alert.alert('Missing Information', 'Please select both pickup and drop locations');
          return false;
        }
        break;
      case 2:
        // Validate time selection and update ride data
        if (!validateSelectedTime()) {
          return false;
        }
        updateRideDataTime();
        break;
      case 3:
        if (!rideData.pricePerSeat || isNaN(Number(rideData.pricePerSeat))) {
          Alert.alert('Invalid Price', 'Please enter a valid price per seat');
          return false;
        }
        break;
    }
    return true;
  };

  const handlePublish = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User not authenticated. Please login again.');
      return;
    }

    try {
      setIsPublishing(true);
      console.log('=== PUBLISH SCREEN: Starting ride creation ===');
      console.log('Ride data:', rideData);
      console.log('User ID:', user.id);

      // Create the ride using the ride service
      const createdRide = await rideService.createRide(rideData, user.id);
      
      console.log('Ride created successfully:', createdRide);

      Alert.alert(
        'Success! 🎉',
        'Your ride has been published successfully! Passengers can now book seats.',
        [
          {
            text: 'View My Rides',
            onPress: () => {
              // Reset form and navigate to rides screen
              resetForm();
              // TODO: Navigate to My Rides tab
            },
          },
          {
            text: 'Publish Another',
            onPress: () => {
              resetForm();
            },
            style: 'default',
          },
        ]
      );
    } catch (error) {
      console.error('Publish ride error:', error);
      
      let errorMessage = 'Failed to publish ride. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      Alert.alert('Publishing Failed', errorMessage);
    } finally {
      setIsPublishing(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedDateOption('today');
    setSelectedHour('12');
    setSelectedMinute('00');
    setSelectedPeriod('PM');
    setRideData({
      fromLocation: '',
      toLocation: '',
      departureDate: new Date(),
      departureTime: '',
      availableSeats: 2,
      vehicleType: 'car',
      pricePerSeat: '',
      description: '',
    });
  };

  const updateRideData = (key: keyof RideData, value: any) => {
    setRideData(prev => ({ ...prev, [key]: value }));
  };

  const handleDateSelection = (option: DateSelection) => {
    console.log('=== DATE SELECTION ===');
    console.log('Selected option:', option);
    
    setSelectedDateOption(option);
    
    const today = new Date();
    let selectedDate = new Date();
    
    switch (option) {
      case 'today':
        selectedDate = today;
        break;
      case 'tomorrow':
        selectedDate = new Date(today);
        selectedDate.setDate(today.getDate() + 1);
        break;
    }
    
    console.log('Selected date:', selectedDate.toDateString());
    updateRideData('departureDate', selectedDate);
    
    // Reset time selection when date changes and set sensible defaults
    if (option === 'today') {
      // For today, set time to at least 30 minutes from now
      const now = new Date();
      const minTime = new Date(now.getTime() + 30 * 60 * 1000);
      const hour = minTime.getHours();
      const minute = minTime.getMinutes();
      
      // Convert to 12-hour format
      let hour12 = hour;
      let period: 'AM' | 'PM' = 'AM';
      
      if (hour === 0) {
        hour12 = 12;
      } else if (hour === 12) {
        period = 'PM';
      } else if (hour > 12) {
        hour12 = hour - 12;
        period = 'PM';
      }
      
      setSelectedHour(hour12.toString().padStart(2, '0'));
      setSelectedMinute(Math.ceil(minute / 5) * 5 >= 60 ? '00' : (Math.ceil(minute / 5) * 5).toString().padStart(2, '0'));
      setSelectedPeriod(period);
    } else {
      // For tomorrow, set default time
      setSelectedHour('09');
      setSelectedMinute('00');
      setSelectedPeriod('AM');
    }
    
    console.log('Time reset for new date');
  };

  const showCustomDatePicker = () => {
    // This function is no longer needed since we removed custom date selection
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Where are you going? 🗺️</Text>
      <Text style={styles.stepDescription}>
        Select your pickup and drop-off locations
      </Text>

      <LocationPicker
        placeholder="From: Your starting point"
        value={rideData.fromLocation}
        onLocationSelect={(location) => updateRideData('fromLocation', location)}
        icon="radio-button-on"
      />

      <LocationPicker
        placeholder="To: Your destination"
        value={rideData.toLocation}
        onLocationSelect={(location) => updateRideData('toLocation', location)}
        icon="location"
      />

      {rideData.fromLocation && rideData.toLocation && (
        <View style={styles.routePreview}>
          <View style={styles.routeInfo}>
            <Ionicons name="map" size={20} color={colors.primary.main} />
            <Text style={styles.routeText}>
              {rideData.fromLocation} → {rideData.toLocation}
            </Text>
          </View>
          <Text style={styles.estimatedDistance}>
            Estimated: 25 km • 45 mins
          </Text>
        </View>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>When are you leaving? ⏰</Text>
      <Text style={styles.stepDescription}>
        Choose your departure date and time
      </Text>

      {/* Date Selection */}
      <View style={styles.dateSection}>
        <Text style={styles.sectionLabel}>Select Date</Text>
        <View style={styles.dateButtons}>
          <TouchableOpacity 
            style={[
              styles.dateButton, 
              selectedDateOption === 'today' && styles.selectedDateButton
            ]}
            onPress={() => handleDateSelection('today')}
          >
            <Text style={[
              styles.dateButtonText, 
              selectedDateOption === 'today' && styles.selectedDateText
            ]}>
              Today
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.dateButton,
              selectedDateOption === 'tomorrow' && styles.selectedDateButton
            ]}
            onPress={() => handleDateSelection('tomorrow')}
          >
            <Text style={[
              styles.dateButtonText,
              selectedDateOption === 'tomorrow' && styles.selectedDateText
            ]}>
              Tomorrow
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Time Selection */}
      <View style={styles.timeSection}>
        <Text style={styles.sectionLabel}>Select Time</Text>
        
        {selectedDateOption === 'today' && (
          <View style={styles.timeHelpContainer}>
            <Ionicons name="information-circle" size={16} color={colors.special.orange} />
            <Text style={styles.timeHelpText}>
              You can only select times that are at least 30 minutes from now
            </Text>
          </View>
        )}
        
        {/* Time Picker */}
        <View style={styles.timePickerContainer}>
          {/* Hours Picker */}
          <View style={styles.timePickerSection}>
            <Text style={styles.timePickerLabel}>Hour</Text>
            <ScrollView 
              style={styles.pickerScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.pickerContent}
              nestedScrollEnabled={true}
              scrollEnabled={true}
            >
              {getHoursArray().map((hour) => {
                return (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.timePickerOption,
                      selectedHour === hour && styles.selectedTimePickerOption,
                    ]}
                    onPress={() => setSelectedHour(hour)}
                  >
                    <Text
                      style={[
                        styles.timePickerOptionText,
                        selectedHour === hour && styles.selectedTimePickerOptionText,
                      ]}
                    >
                      {hour}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Minutes Picker */}
          <View style={styles.timePickerSection}>
            <Text style={styles.timePickerLabel}>Minute</Text>
            <ScrollView 
              style={styles.pickerScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.pickerContent}
              nestedScrollEnabled={true}
              scrollEnabled={true}
            >
              {getMinutesArray().map((minute) => {
                return (
                  <TouchableOpacity
                    key={minute}
                    style={[
                      styles.timePickerOption,
                      selectedMinute === minute && styles.selectedTimePickerOption,
                    ]}
                    onPress={() => setSelectedMinute(minute)}
                  >
                    <Text
                      style={[
                        styles.timePickerOptionText,
                        selectedMinute === minute && styles.selectedTimePickerOptionText,
                      ]}
                    >
                      {minute}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* AM/PM Picker */}
          <View style={styles.timePickerSection}>
            <Text style={styles.timePickerLabel}>Period</Text>
            <View style={styles.periodPickerWrapper}>
              {['AM', 'PM'].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodPickerOption,
                    selectedPeriod === period && styles.selectedPeriodPickerOption,
                  ]}
                  onPress={() => setSelectedPeriod(period as 'AM' | 'PM')}
                >
                  <Text
                    style={[
                      styles.periodPickerOptionText,
                      selectedPeriod === period && styles.selectedPeriodPickerOptionText,
                    ]}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Selected Time Display */}
        <View style={styles.selectedTimeDisplay}>
          <Text style={styles.selectedTimeLabel}>Selected Time:</Text>
          <Text style={[
            styles.selectedTimeValue,
            selectedDateOption === 'today' && !isTimeValid(selectedHour, selectedMinute, selectedPeriod) && styles.invalidTimeValue
          ]}>
            {selectedHour}:{selectedMinute} {selectedPeriod}
          </Text>
          {selectedDateOption === 'today' && !isTimeValid(selectedHour, selectedMinute, selectedPeriod) && (
            <Text style={styles.invalidTimeWarning}>
              ⚠️ This time is too soon. Please select a time at least 30 minutes from now.
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Ride Details 🚗</Text>
      <Text style={styles.stepDescription}>
        Set your vehicle type, seats, and pricing
      </Text>

      <VehicleTypeSelector
        value={rideData.vehicleType}
        onChange={(type) => updateRideData('vehicleType', type)}
        label="Your vehicle type"
      />

      <SeatSelector
        value={rideData.availableSeats}
        onChange={(seats) => updateRideData('availableSeats', seats)}
        label="Available seats"
        maxSeats={5}
        minSeats={1}
      />

      <View style={styles.priceSection}>
        <Input
          label="Price per seat (₹)"
          placeholder="e.g., 150"
          value={rideData.pricePerSeat}
          onChangeText={(text) => updateRideData('pricePerSeat', text)}
          keyboardType="numeric"
        />
        
        <TouchableOpacity
          style={styles.suggestedPriceButton}
          onPress={() => updateRideData('pricePerSeat', calculateSuggestedPrice().toString())}
        >
          <Ionicons name="bulb" size={16} color={colors.special.orange} />
          <Text style={styles.suggestedPriceText}>
            Suggested: ₹{calculateSuggestedPrice()}
          </Text>
        </TouchableOpacity>
      </View>

      <Input
        label="Ride description (optional)"
        placeholder="Any additional details about the ride..."
        value={rideData.description}
        onChangeText={(text) => updateRideData('description', text)}
        multiline
        numberOfLines={3}
        helperText="E.g., AC car, music allowed, no smoking"
      />
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Review & Publish 📝</Text>
      <Text style={styles.stepDescription}>
        Review your ride details before publishing
      </Text>

      <View style={styles.reviewCard}>
        <View style={styles.reviewSection}>
          <Text style={styles.reviewLabel}>Route</Text>
          <Text style={styles.reviewValue}>
            {rideData.fromLocation} → {rideData.toLocation}
          </Text>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewLabel}>Departure</Text>
          <Text style={styles.reviewValue}>
            {selectedDateOption === 'today' ? 'Today' : 'Tomorrow'} at {selectedHour}:{selectedMinute} {selectedPeriod}
          </Text>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewLabel}>Vehicle & Seats</Text>
          <Text style={styles.reviewValue}>
            {rideData.vehicleType.toUpperCase()} • {rideData.availableSeats} seats available
          </Text>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewLabel}>Price</Text>
          <Text style={[styles.reviewValue, styles.priceValue]}>
            ₹{rideData.pricePerSeat} per seat
          </Text>
        </View>

        {rideData.description && (
          <View style={styles.reviewSection}>
            <Text style={styles.reviewLabel}>Description</Text>
            <Text style={styles.reviewValue}>{rideData.description}</Text>
          </View>
        )}
      </View>

      <View style={styles.estimatedEarnings}>
        <Text style={styles.earningsLabel}>Estimated Earnings</Text>
        <Text style={styles.earningsValue}>
          ₹{(Number(rideData.pricePerSeat) * rideData.availableSeats).toLocaleString()}
        </Text>
        <Text style={styles.earningsSubtext}>
          if all {rideData.availableSeats} seats are booked
        </Text>
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        }}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(16, 185, 129, 0.8)', 'rgba(34, 197, 94, 0.6)', 'rgba(255, 255, 255, 0.95)']}
          style={styles.gradient}
        >
          {/* Progress Header */}
          <View style={styles.progressHeader}>
            <TouchableOpacity
              style={styles.backButtonHeader}
              onPress={currentStep === 1 ? undefined : handleBack}
              disabled={currentStep === 1}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={currentStep === 1 ? colors.neutral[400] : colors.neutral[900]}
              />
            </TouchableOpacity>
            
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>Publish Ride</Text>
              <Text style={styles.progressText}>Step {currentStep} of {totalSteps}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => Alert.alert('Cancel', 'Are you sure you want to cancel?')}
            >
              <Ionicons name="close" size={24} color={colors.neutral[900]} />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(currentStep / totalSteps) * 100}%` },
                ]}
              />
            </View>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              {renderStepContent()}
            </View>
          </ScrollView>

          {/* Bottom Navigation */}
          <View style={styles.bottomNavigation}>
            <Button
              title={currentStep === totalSteps ? "Publish Ride" : "Next"}
              onPress={handleNext}
              variant="primary"
              size="large"
              style={styles.nextButton}
              loading={isPublishing}
              disabled={isPublishing}
            />
          </View>
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

  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },

  backButtonHeader: {
    padding: spacing.sm,
  },

  progressInfo: {
    alignItems: 'center',
  },

  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral[900],
  },

  progressText: {
    fontSize: 14,
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },

  closeButton: {
    padding: spacing.sm,
  },

  progressBarContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },

  progressBar: {
    height: 4,
    backgroundColor: colors.neutral[300],
    borderRadius: 2,
  },

  progressFill: {
    height: 4,
    backgroundColor: colors.primary.main,
    borderRadius: 2,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    padding: spacing.lg,
  },

  stepContainer: {
    backgroundColor: colors.neutral.white,
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

  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.neutral[900],
    marginBottom: spacing.sm,
    textAlign: 'center',
  },

  stepDescription: {
    fontSize: 16,
    color: colors.neutral[600],
    textAlign: 'center',
    marginBottom: spacing.xl,
  },

  routePreview: {
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.lg,
  },

  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },

  routeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary.main,
    flex: 1,
  },

  estimatedDistance: {
    fontSize: 14,
    color: colors.neutral[600],
    textAlign: 'center',
  },

  dateSection: {
    marginBottom: spacing.lg,
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing.md,
  },

  dateButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    backgroundColor: colors.neutral.white,
    gap: spacing.xs,
  },

  selectedDateButton: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light,
  },

  dateButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral[700],
  },

  selectedDateText: {
    color: colors.primary.main,
  },

  timeSection: {
    marginBottom: spacing.lg,
  },

  timeHelpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.special.orange + '20',
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },

  timeHelpText: {
    fontSize: 12,
    color: colors.special.orange,
    fontWeight: '500',
    flex: 1,
  },

  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  timeSlot: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    backgroundColor: colors.neutral.white,
    minWidth: 70,
    alignItems: 'center',
  },

  selectedTimeSlot: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light,
  },

  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral[700],
  },

  selectedTimeSlotText: {
    color: colors.primary.main,
  },

  priceSection: {
    marginBottom: spacing.lg,
  },

  suggestedPriceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.special.orange + '20',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },

  suggestedPriceText: {
    fontSize: 14,
    color: colors.special.orange,
    fontWeight: '500',
  },

  reviewCard: {
    backgroundColor: colors.neutral[50],
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },

  reviewSection: {
    marginBottom: spacing.md,
  },

  reviewLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },

  reviewValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[900],
  },

  priceValue: {
    color: colors.primary.main,
    fontSize: 18,
  },

  estimatedEarnings: {
    backgroundColor: colors.secondary[50],
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
  },

  earningsLabel: {
    fontSize: 14,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },

  earningsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.secondary.main,
    marginBottom: spacing.xs,
  },

  earningsSubtext: {
    fontSize: 12,
    color: colors.neutral[500],
  },

  bottomNavigation: {
    padding: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },

  nextButton: {
    width: '100%',
  },

  noTimeSlotsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.neutral[50],
    borderRadius: 12,
    marginTop: spacing.md,
  },

  noTimeSlotsText: {
    fontSize: 14,
    color: colors.neutral[600],
    textAlign: 'center',
    lineHeight: 20,
  },

  // Time Picker Styles
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.md,
    height: 150, // Fixed height for consistent layout
  },

  timePickerSection: {
    flex: 1,
    alignItems: 'center',
  },

  timePickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[700],
    marginBottom: spacing.sm,
  },

  pickerWrapper: {
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    backgroundColor: colors.neutral.white,
  },

  pickerScrollView: {
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    backgroundColor: colors.neutral.white,
    overflow: 'hidden',
  },

  pickerContent: {
    paddingVertical: spacing.xs,
  },

  timePickerOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 60,
  },

  selectedTimePickerOption: {
    backgroundColor: colors.primary.light,
    borderBottomColor: colors.primary.main,
  },

  disabledTimePickerOption: {
    backgroundColor: colors.neutral[100],
    opacity: 0.5,
  },

  timePickerOptionText: {
    fontSize: 16,
    color: colors.neutral[700],
    fontWeight: '500',
    textAlign: 'center',
  },

  selectedTimePickerOptionText: {
    color: colors.primary.main,
    fontWeight: '600',
  },

  disabledTimePickerOptionText: {
    color: colors.neutral[400],
  },

  periodPickerWrapper: {
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    backgroundColor: colors.neutral.white,
    overflow: 'hidden',
    justifyContent: 'space-around',
  },

  periodPickerOption: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },

  selectedPeriodPickerOption: {
    backgroundColor: colors.primary.light,
    borderBottomColor: colors.primary.main,
  },

  periodPickerOptionText: {
    fontSize: 16,
    color: colors.neutral[700],
    fontWeight: '500',
  },

  selectedPeriodPickerOptionText: {
    color: colors.primary.main,
    fontWeight: '600',
  },

  selectedTimeDisplay: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.primary[50],
    borderRadius: 8,
    alignItems: 'center',
  },

  selectedTimeLabel: {
    fontSize: 14,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },

  selectedTimeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary.main,
  },

  invalidTimeValue: {
    color: colors.status.error,
  },

  invalidTimeWarning: {
    fontSize: 12,
    color: colors.status.error,
    marginTop: spacing.xs,
    textAlign: 'center',
    fontWeight: '500',
  },
});
