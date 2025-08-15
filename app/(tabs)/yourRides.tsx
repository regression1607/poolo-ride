import { useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Mock data for user's rides
const MOCK_RIDES = [
  {
    id: '1',
    from: 'Faridabad',
    to: 'Noida',
    date: '2023-08-15',
    time: '09:00 AM',
    price: '₹200',
    mode: 'Car',
    seats: 3,
    status: 'active',
    requests: 2,
  },
  {
    id: '2',
    from: 'Delhi',
    to: 'Gurgaon',
    date: '2023-08-17',
    time: '11:00 AM',
    price: '₹180',
    mode: 'Car',
    seats: 2,
    status: 'active',
    requests: 0,
  },
  {
    id: '3',
    from: 'Ghaziabad',
    to: 'Delhi',
    date: '2023-08-10',
    time: '08:30 AM',
    price: '₹150',
    mode: 'Bike',
    seats: 1,
    status: 'completed',
    requests: 0,
  },
];

type TabType = 'active' | 'completed' | 'cancelled';

export default function YourRidesScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  
  const filteredRides = MOCK_RIDES.filter(ride => ride.status === activeTab);

  const renderRideItem = ({ item }: { item: typeof MOCK_RIDES[0] }) => (
    <ThemedView style={styles.rideCard}>
      <ThemedView style={styles.rideHeader}>
        <ThemedText type="subtitle">
          {item.from} to {item.to}
        </ThemedText>
        <ThemedText style={styles.price}>{item.price}</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.rideDetails}>
        <ThemedText>Date: {item.date}</ThemedText>
        <ThemedText>Time: {item.time}</ThemedText>
        <ThemedText>Mode: {item.mode}</ThemedText>
        <ThemedText>Available Seats: {item.seats}</ThemedText>
      </ThemedView>
      
      {item.requests > 0 && (
        <ThemedView style={styles.requestsContainer}>
          <ThemedText style={styles.requestsText}>
            {item.requests} {item.requests === 1 ? 'Request' : 'Requests'}
          </ThemedText>
          <TouchableOpacity style={styles.viewRequestsButton}>
            <ThemedText style={styles.viewRequestsButtonText}>View</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
      
      <ThemedView style={styles.rideActions}>
        {activeTab === 'active' && (
          <>
            <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
              <ThemedText style={styles.actionButtonText}>Edit</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
              <ThemedText style={styles.actionButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
          </>
        )}
      </ThemedView>
    </ThemedView>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Your Rides</ThemedText>
        </ThemedView>

        <ThemedView style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'active' && styles.activeTab]}
            onPress={() => setActiveTab('active')}>
            <ThemedText
              style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
              Active
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}>
            <ThemedText
              style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
              Completed
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
            onPress={() => setActiveTab('cancelled')}>
            <ThemedText
              style={[styles.tabText, activeTab === 'cancelled' && styles.activeTabText]}>
              Cancelled
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {filteredRides.length > 0 ? (
          <FlatList
            data={filteredRides}
            renderItem={renderRideItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.ridesList}
          />
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText>No {activeTab} rides found.</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
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
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#0a7ea4',
  },
  tabText: {
    fontSize: 14,
  },
  activeTabText: {
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
  ridesList: {
    paddingBottom: 20,
  },
  rideCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
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
  requestsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
  requestsText: {
    fontWeight: 'bold',
  },
  viewRequestsButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  viewRequestsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  rideActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#0a7ea4',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
