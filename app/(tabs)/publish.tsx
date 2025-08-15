import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TextInput } from '@/components/ui/TextInput';

const RIDE_MODES = ['Bike', 'Car', 'Cab'];

export default function PublishScreen() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [rideMode, setRideMode] = useState('Car');
  const [price, setPrice] = useState('');
  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState(new Date());
  const [showPickupDatePicker, setShowPickupDatePicker] = useState(false);
  const [showPickupTimePicker, setShowPickupTimePicker] = useState(false);
  const [dropoffDate, setDropoffDate] = useState(new Date());
  const [dropoffTime, setDropoffTime] = useState(new Date());
  const [showDropoffDatePicker, setShowDropoffDatePicker] = useState(false);
  const [showDropoffTimePicker, setShowDropoffTimePicker] = useState(false);
  const [personCount, setPersonCount] = useState(1);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePublish = () => {
    console.log('Publishing ride:', {
      pickupLocation,
      dropoffLocation,
      rideMode,
      price,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
      personCount,
    });
    // Implement publish ride functionality with Supabase
  };

  const handleMapPickup = () => {
    console.log('Opening map for pickup location selection');
    // Implement map integration for pickup location
  };

  const handleMapDropoff = () => {
    console.log('Opening map for dropoff location selection');
    // Implement map integration for dropoff location
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.header}>
            <ThemedText type="title">Publish a Ride</ThemedText>
          </ThemedView>

          <ThemedView style={styles.formContainer}>
            {/* Pickup Location */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText type="subtitle">Pickup Location:</ThemedText>
              <View style={styles.locationInputContainer}>
                <TextInput
                  placeholder="Enter pickup address"
                  value={pickupLocation}
                  onChangeText={setPickupLocation}
                  style={styles.locationInput}
                />
                <TouchableOpacity style={styles.mapButton} onPress={handleMapPickup}>
                  <ThemedText style={styles.mapButtonText}>Map</ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedView>

            {/* Dropoff Location */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText type="subtitle">Dropoff Location:</ThemedText>
              <View style={styles.locationInputContainer}>
                <TextInput
                  placeholder="Enter destination address"
                  value={dropoffLocation}
                  onChangeText={setDropoffLocation}
                  style={styles.locationInput}
                />
                <TouchableOpacity style={styles.mapButton} onPress={handleMapDropoff}>
                  <ThemedText style={styles.mapButtonText}>Map</ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedView>

            {/* Ride Mode Selection */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText type="subtitle">Ride Mode:</ThemedText>
              <View style={styles.optionsRow}>
                {RIDE_MODES.map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    style={[
                      styles.optionButton,
                      rideMode === mode && styles.selectedOption,
                    ]}
                    onPress={() => setRideMode(mode)}>
                    <ThemedText
                      style={[
                        styles.optionText,
                        rideMode === mode && styles.selectedOptionText,
                      ]}>
                      {mode}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>

            {/* Person Count */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText type="subtitle">Available Seats:</ThemedText>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setPersonCount(Math.max(1, personCount - 1))}>
                  <ThemedText style={styles.counterButtonText}>-</ThemedText>
                </TouchableOpacity>
                <ThemedText style={styles.counterText}>{personCount}</ThemedText>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setPersonCount(Math.min(4, personCount + 1))}>
                  <ThemedText style={styles.counterButtonText}>+</ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedView>

            {/* Price */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText type="subtitle">Price (₹):</ThemedText>
              <TextInput
                placeholder="Enter ride price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </ThemedView>

            {/* Pickup Date & Time */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText type="subtitle">Pickup Date & Time:</ThemedText>
              <View style={styles.dateTimeContainer}>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowPickupDatePicker(true)}>
                  <ThemedText>{formatDate(pickupDate)}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowPickupTimePicker(true)}>
                  <ThemedText>{formatTime(pickupTime)}</ThemedText>
                </TouchableOpacity>
              </View>
              
              {showPickupDatePicker && (
                <DateTimePicker
                  value={pickupDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowPickupDatePicker(false);
                    if (selectedDate) {
                      setPickupDate(selectedDate);
                    }
                  }}
                />
              )}
              
              {showPickupTimePicker && (
                <DateTimePicker
                  value={pickupTime}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => {
                    setShowPickupTimePicker(false);
                    if (selectedTime) {
                      setPickupTime(selectedTime);
                    }
                  }}
                />
              )}
            </ThemedView>

            {/* Dropoff Date & Time (Optional) */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText type="subtitle">Dropoff Date & Time (Optional):</ThemedText>
              <View style={styles.dateTimeContainer}>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowDropoffDatePicker(true)}>
                  <ThemedText>{formatDate(dropoffDate)}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowDropoffTimePicker(true)}>
                  <ThemedText>{formatTime(dropoffTime)}</ThemedText>
                </TouchableOpacity>
              </View>
              
              {showDropoffDatePicker && (
                <DateTimePicker
                  value={dropoffDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDropoffDatePicker(false);
                    if (selectedDate) {
                      setDropoffDate(selectedDate);
                    }
                  }}
                />
              )}
              
              {showDropoffTimePicker && (
                <DateTimePicker
                  value={dropoffTime}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => {
                    setShowDropoffTimePicker(false);
                    if (selectedTime) {
                      setDropoffTime(selectedTime);
                    }
                  }}
                />
              )}
            </ThemedView>

            {/* Publish Button */}
            <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
              <ThemedText style={styles.publishButtonText}>Publish Ride</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  formContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationInput: {
    flex: 1,
  },
  mapButton: {
    backgroundColor: '#0a7ea4',
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  mapButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  optionsRow: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedOption: {
    backgroundColor: '#0a7ea4',
  },
  optionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    color: 'white',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  counterButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 5,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  counterText: {
    fontSize: 18,
    marginHorizontal: 20,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 8,
    padding: 12,
    flex: 0.48,
    alignItems: 'center',
  },
  publishButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  publishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
