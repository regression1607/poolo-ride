import { useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type TabType = 'all' | 'messages' | 'notifications';

export default function InboxScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  
  // TODO: Replace with actual data from database
  const messages: any[] = [];
  const filteredMessages = messages;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Inbox</ThemedText>
        </ThemedView>

        <ThemedView style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}>
            <ThemedText
              style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              All
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'messages' && styles.activeTab]}
            onPress={() => setActiveTab('messages')}>
            <ThemedText
              style={[styles.tabText, activeTab === 'messages' && styles.activeTabText]}>
              Messages
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'notifications' && styles.activeTab]}
            onPress={() => setActiveTab('notifications')}>
            <ThemedText
              style={[styles.tabText, activeTab === 'notifications' && styles.activeTabText]}>
              Notifications
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.emptyContainer}>
          <ThemedText>No {activeTab} found.</ThemedText>
          <ThemedText style={styles.helpText}>
            {activeTab === 'all' 
              ? 'Your messages and notifications will appear here.'
              : activeTab === 'messages' 
                ? 'No messages yet. Start connecting with other riders!'
                : 'No notifications yet.'
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
