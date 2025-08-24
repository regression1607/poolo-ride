import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme/colors';

interface ChatConversation {
  id: string;
  rideId: string;
  partnerName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  route: string;
}

export const InboxScreen: React.FC = () => {
  // Mock chat conversations
  const conversations: ChatConversation[] = [
    {
      id: '1',
      rideId: 'ride1',
      partnerName: 'Priya Singh',
      lastMessage: 'Thanks for confirming! See you at 9 AM',
      lastMessageTime: '2 mins ago',
      unreadCount: 1,
      route: 'Delhi → Gurgaon',
    },
    {
      id: '2',
      rideId: 'ride2',
      partnerName: 'Amit Kumar',
      lastMessage: 'Can we meet at the metro station instead?',
      lastMessageTime: '1 hour ago',
      unreadCount: 0,
      route: 'Noida → Delhi',
    },
    {
      id: '3',
      rideId: 'ride3',
      partnerName: 'Sarah Wilson',
      lastMessage: 'Perfect! Looking forward to the ride',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
      route: 'Gurgaon → Noida',
    },
  ];

  const handleConversationPress = (conversation: ChatConversation) => {
    console.log('Open chat with:', conversation.partnerName);
  };

  const renderConversationItem = (conversation: ChatConversation) => (
    <TouchableOpacity
      key={conversation.id}
      style={styles.conversationItem}
      onPress={() => handleConversationPress(conversation)}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {conversation.partnerName.charAt(0).toUpperCase()}
          </Text>
        </View>
        {conversation.unreadCount > 0 && (
          <View style={styles.onlineIndicator} />
        )}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.partnerName}>{conversation.partnerName}</Text>
          <Text style={styles.timestamp}>{conversation.lastMessageTime}</Text>
        </View>
        
        <Text style={styles.route}>{conversation.route}</Text>
        
        <View style={styles.lastMessageContainer}>
          <Text
            style={[
              styles.lastMessage,
              conversation.unreadCount > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}
          >
            {conversation.lastMessage}
          </Text>
          {conversation.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{conversation.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={16}
        color={colors.neutral[400]}
      />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="chatbubbles-outline"
        size={64}
        color={colors.neutral[400]}
      />
      <Text style={styles.emptyStateTitle}>No messages yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        When you book or publish rides, you can chat with other riders here
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={colors.neutral[700]} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {conversations.length > 0 ? (
          <View style={styles.conversationsList}>
            {conversations.map(renderConversationItem)}
          </View>
        ) : (
          renderEmptyState()
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.lg,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.neutral[900],
  },

  searchButton: {
    padding: spacing.xs,
  },

  scrollView: {
    flex: 1,
  },

  conversationsList: {
    paddingVertical: spacing.sm,
  },

  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },

  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary.main,
  },

  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.secondary.main,
    borderWidth: 2,
    borderColor: colors.neutral.white,
  },

  conversationContent: {
    flex: 1,
  },

  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },

  partnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[900],
  },

  timestamp: {
    fontSize: 12,
    color: colors.neutral[500],
  },

  route: {
    fontSize: 12,
    color: colors.primary.main,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },

  lastMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  lastMessage: {
    fontSize: 14,
    color: colors.neutral[600],
    flex: 1,
    marginRight: spacing.sm,
  },

  unreadMessage: {
    color: colors.neutral[900],
    fontWeight: '500',
  },

  unreadBadge: {
    backgroundColor: colors.primary.main,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },

  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral.white,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['4xl'],
    paddingHorizontal: spacing.lg,
  },

  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral[700],
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },

  emptyStateSubtitle: {
    fontSize: 14,
    color: colors.neutral[500],
    textAlign: 'center',
    lineHeight: 20,
  },
});
