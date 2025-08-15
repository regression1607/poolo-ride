import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TextInput } from '@/components/ui/TextInput';

const PERSON_COUNTS = [1, 2, 3, 4];
const RIDE_MODES = ['Any', 'Bike', 'Car', 'Cab'];

export default function SearchScreen() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [personCount, setPersonCount] = useState(1);
  const [rideMode, setRideMode] = useState('Any');

  const handleSearch = () => {
    console.log('Searching for rides:', { fromLocation, toLocation, personCount, rideMode });
    // Implement search functionality
  };

  // Mock data for available rides
  const availableRides = [
    {
      id: '1',
      driver: 'John Doe',
      from: 'Faridabad',
      to: 'Noida',
      date: '2023-08-15',
      time: '09:00 AM',
      price: '₹200',
      mode: 'Car',
      seats: 3,
    },
    {
      id: '2',
      driver: 'Jane Smith',
      from: 'Gurgaon',
      to: 'Delhi',
      date: '2023-08-15',
      time: '10:30 AM',
      price: '₹180',
      mode: 'Cab',
      seats: 4,
    },
    {
      id: '3',
      driver: 'Mike Johnson',
      from: 'Faridabad',
      to: 'Noida',
      date: '2023-08-15',
      time: '12:00 PM',
      price: '₹50',
      mode: 'Bike',
      seats: 1,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.header}>
            <ThemedText type="title">Find a Ride</ThemedText>
          </ThemedView>

          <ThemedView style={styles.searchContainer}>
            <ThemedView style={styles.inputContainer}>
              <ThemedText type="subtitle">Leaving From:</ThemedText>
              <TextInput
                placeholder="Current location or enter address"
                value={fromLocation}
                onChangeText={setFromLocation}
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText type="subtitle">Going To:</ThemedText>
              <TextInput
                placeholder="Enter destination"
                value={toLocation}
                onChangeText={setToLocation}
              />
            </ThemedView>

            <ThemedView style={styles.selectionContainer}>
              <ThemedView style={styles.selectionGroup}>
                <ThemedText type="subtitle">Person Count:</ThemedText>
                <View style={styles.optionsRow}>
                  {PERSON_COUNTS.map((count) => (
                    <TouchableOpacity
                      key={count}
                      style={[
                        styles.optionButton,
                        personCount === count && styles.selectedOption,
                      ]}
                      onPress={() => setPersonCount(count)}>
                      <ThemedText
                        style={[
                          styles.optionText,
                          personCount === count && styles.selectedOptionText,
                        ]}>
                        {count}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </ThemedView>

              <ThemedView style={styles.selectionGroup}>
                <ThemedText type="subtitle">Ride Mode:</ThemedText>
                <View style={styles.optionsRow}>
                  {RIDE_MODES.map((mode) => (
                    <TouchableOpacity
                      key={mode}
                      style={[
                        styles.optionButton,
                        styles.modeButton,
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
            </ThemedView>

            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <ThemedText style={styles.searchButtonText}>Search Rides</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.resultsContainer}>
            <ThemedText type="title">Available Rides</ThemedText>

            {availableRides.length > 0 ? (
              availableRides.map((ride) => (
                <TouchableOpacity key={ride.id} style={styles.rideCard}>
                  <View style={styles.rideHeader}>
                    <ThemedText type="subtitle">{ride.from} to {ride.to}</ThemedText>
                    <ThemedText style={styles.price}>{ride.price}</ThemedText>
                  </View>
                  
                  <View style={styles.rideDetails}>
                    <ThemedText>Date: {ride.date}</ThemedText>
                    <ThemedText>Time: {ride.time}</ThemedText>
                    <ThemedText>Mode: {ride.mode}</ThemedText>
                    <ThemedText>Available Seats: {ride.seats}</ThemedText>
                  </View>
                  
                  <View style={styles.rideFooter}>
                    <ThemedText>Driver: {ride.driver}</ThemedText>
                    <TouchableOpacity style={styles.requestButton}>
                      <ThemedText style={styles.requestButtonText}>Request</ThemedText>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <ThemedView style={styles.noRidesContainer}>
                <ThemedText>No rides found for your search criteria.</ThemedText>
              </ThemedView>
            )}
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
  searchContainer: {
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
    marginBottom: 16,
  },
  selectionContainer: {
    marginTop: 8,
  },
  selectionGroup: {
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 50,
    alignItems: 'center',
  },
  modeButton: {
    flex: 1,
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
  searchButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    gap: 16,
  },
  rideCard: {
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  rideDetails: {
    marginBottom: 12,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  requestButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  requestButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noRidesContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});
