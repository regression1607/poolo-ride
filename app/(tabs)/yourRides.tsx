import { useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, ViewStyle, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText, ThemedView } from '@/src/components';
import { DesignTokens } from '@/src/design/tokens';

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
    padding: DesignTokens.spacing.md,
  } as ViewStyle,
  header: {
    marginTop: DesignTokens.spacing.lg,
    marginBottom: DesignTokens.spacing.lg,
    alignItems: 'center',
  } as ViewStyle,
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: DesignTokens.spacing.lg,
    borderRadius: DesignTokens.borderRadius.md,
    overflow: 'hidden',
  } as ViewStyle,
  tab: {
    flex: 1,
    paddingVertical: DesignTokens.spacing.sm + 4,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  } as ViewStyle,
  activeTab: {
    borderBottomColor: DesignTokens.colors.primary,
  } as ViewStyle,
  tabText: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    color: DesignTokens.colors.textSecondary,
  } as TextStyle,
  activeTabText: {
    color: DesignTokens.colors.primary,
    fontWeight: '700',
  } as TextStyle,
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: DesignTokens.spacing.lg,
  } as ViewStyle,
  helpText: {
    fontSize: DesignTokens.typography.fontSizes.sm,
    color: DesignTokens.colors.textMuted,
    textAlign: 'center',
    marginTop: DesignTokens.spacing.sm + 4,
    lineHeight: DesignTokens.typography.lineHeights.normal * DesignTokens.typography.fontSizes.sm,
  } as TextStyle,
});
