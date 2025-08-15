import { useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type TabType = 'active' | 'completed' | 'cancelled';

export default function YourRidesScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  
  // TODO: Replace with actual data from database
  const rides: any[] = [];
  const filteredRides = rides.filter((ride: any) => ride.status === activeTab);

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

        <ThemedView style={styles.emptyContainer}>
          <ThemedText>No {activeTab} rides found.</ThemedText>
          <ThemedText style={styles.helpText}>
            {activeTab === 'active' 
              ? 'You haven\'t published any rides yet. Use the Publish tab to create your first ride!'
              : `You don't have any ${activeTab} rides.`
            }
          </ThemedText>
        </ThemedView>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  helpText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.7,
    lineHeight: 20,
  },
});
