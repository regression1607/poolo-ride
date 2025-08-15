import { useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Mock data for messages
const MOCK_MESSAGES = [
  {
    id: '1',
    sender: 'John Doe',
    message: 'Hi, I am interested in your ride from Faridabad to Noida.',
    timestamp: '10:30 AM',
    date: 'Today',
    type: 'message',
    unread: true,
  },
  {
    id: '2',
    sender: 'System',
    message: 'Your ride request to Delhi has been accepted.',
    timestamp: '9:15 AM',
    date: 'Today',
    type: 'notification',
    unread: true,
  },
  {
    id: '3',
    sender: 'Jane Smith',
    message: 'Can we change the pickup time to 10:30 AM?',
    timestamp: '8:45 AM',
    date: 'Yesterday',
    type: 'message',
    unread: false,
  },
  {
    id: '4',
    sender: 'System',
    message: 'Your ride from Gurgaon to Delhi has been completed.',
    timestamp: '7:20 PM',
    date: 'Yesterday',
    type: 'notification',
    unread: false,
  },
];

type TabType = 'all' | 'messages' | 'notifications';

export default function InboxScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  
  const filteredMessages = activeTab === 'all' 
    ? MOCK_MESSAGES 
    : MOCK_MESSAGES.filter(msg => msg.type === activeTab.slice(0, -1)); // remove 's' from the end

  const renderMessageItem = ({ item }: { item: typeof MOCK_MESSAGES[0] }) => (
    <TouchableOpacity style={styles.messageCard}>
      {item.unread && <ThemedView style={styles.unreadIndicator} />}
      
      <ThemedView style={styles.messageContent}>
        <ThemedView style={styles.messageHeader}>
          <ThemedText type="subtitle">{item.sender}</ThemedText>
          <ThemedView style={styles.timeContainer}>
            <ThemedText style={styles.timeText}>{item.timestamp}</ThemedText>
            <ThemedText style={styles.dateText}>{item.date}</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedText numberOfLines={2} style={styles.messageText}>
          {item.message}
        </ThemedText>
        
        {item.type === 'message' ? (
          <TouchableOpacity style={styles.replyButton}>
            <ThemedText style={styles.replyButtonText}>Reply</ThemedText>
          </TouchableOpacity>
        ) : null}
      </ThemedView>
    </TouchableOpacity>
  );

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

        {filteredMessages.length > 0 ? (
          <FlatList
            data={filteredMessages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
          />
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText>No {activeTab} found.</ThemedText>
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
  messagesList: {
    paddingBottom: 20,
  },
  messageCard: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  unreadIndicator: {
    width: 6,
    backgroundColor: '#0a7ea4',
  },
  messageContent: {
    flex: 1,
    padding: 16,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 12,
  },
  dateText: {
    fontSize: 10,
    marginTop: 2,
  },
  messageText: {
    marginBottom: 10,
  },
  replyButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#0a7ea4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 5,
  },
  replyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
