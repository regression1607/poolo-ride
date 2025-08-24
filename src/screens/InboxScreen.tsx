import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/colors';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  isFromUser: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatConversation {
  id: string;
  participantName: string;
  participantAvatar?: string;
  participantRating: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  rideInfo: {
    from: string;
    to: string;
    date: string;
    time: string;
  };
  isOnline: boolean;
}

export const InboxScreen: React.FC = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    // TODO: Replace with actual API call to fetch user's conversations
    // For now, start with empty data - no mock data
    setConversations([]);
  };

  const handleSelectChat = (conversation: ChatConversation) => {
    setSelectedChat(conversation);
    // Load messages for the selected conversation
    // TODO: Replace with actual API call to fetch messages
    setMessages([]);
    
    // Mark messages as read
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      timestamp: new Date(),
      isFromUser: true,
      status: 'sent',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update last message in conversation
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedChat.id
          ? { ...conv, lastMessage: message.text, lastMessageTime: 'now' }
          : conv
      )
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getMessageStatusIcon = (status?: string) => {
    switch (status) {
      case 'sent':
        return <Ionicons name="checkmark" size={14} color={colors.neutral[400]} />;
      case 'delivered':
        return <Ionicons name="checkmark-done" size={14} color={colors.neutral[400]} />;
      case 'read':
        return <Ionicons name="checkmark-done" size={14} color={colors.primary.main} />;
      default:
        return null;
    }
  };

  const renderConversationItem = ({ item }: { item: ChatConversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleSelectChat(item)}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.participantName.charAt(0).toUpperCase()}
          </Text>
        </View>
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.participantName}>{item.participantName}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color={colors.special.gold} />
            <Text style={styles.ratingText}>{item.participantRating}</Text>
          </View>
          <Text style={styles.messageTime}>{item.lastMessageTime}</Text>
        </View>

        <View style={styles.rideInfo}>
          <Text style={styles.rideRoute}>
            {item.rideInfo.from} → {item.rideInfo.to}
          </Text>
          <Text style={styles.rideTime}>
            {item.rideInfo.date} at {item.rideInfo.time}
          </Text>
        </View>

        <View style={styles.lastMessageContainer}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.messageContainer,
        item.isFromUser ? styles.userMessage : styles.otherMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isFromUser ? styles.userBubble : styles.otherBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isFromUser ? styles.userMessageText : styles.otherMessageText,
          ]}
        >
          {item.text}
        </Text>
      </View>
      <View style={styles.messageInfo}>
        <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
        {item.isFromUser && getMessageStatusIcon(item.status)}
      </View>
    </View>
  );

  const renderChatView = () => (
    <View style={styles.chatContainer}>
      {/* Chat Header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedChat(null)}
        >
          <Ionicons name="arrow-back" size={24} color={colors.neutral[700]} />
        </TouchableOpacity>

        <View style={styles.chatHeaderInfo}>
          <View style={styles.chatAvatar}>
            <Text style={styles.chatAvatarText}>
              {selectedChat?.participantName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.chatParticipantName}>
              {selectedChat?.participantName}
            </Text>
            <Text style={styles.chatStatus}>
              {selectedChat?.isOnline ? 'Online' : 'Last seen recently'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.callButton}>
          <Ionicons name="call" size={20} color={colors.primary.main} />
        </TouchableOpacity>
      </View>

      {/* Ride Info Banner */}
      <View style={styles.rideInfoBanner}>
        <View style={styles.rideDetails}>
          <Text style={styles.rideRoute}>
            {selectedChat?.rideInfo.from} → {selectedChat?.rideInfo.to}
          </Text>
          <Text style={styles.rideDateTime}>
            {selectedChat?.rideInfo.date} at {selectedChat?.rideInfo.time}
          </Text>
        </View>
        <TouchableOpacity style={styles.viewRideButton}>
          <Text style={styles.viewRideText}>View Ride</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyMessages}>
            <Ionicons name="chatbubble-outline" size={48} color={colors.neutral[400]} />
            <Text style={styles.emptyMessagesText}>No messages yet</Text>
            <Text style={styles.emptyMessagesSubtext}>Start the conversation!</Text>
          </View>
        }
      />

      {/* Message Input */}
      <View style={styles.messageInputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            newMessage.trim() ? styles.sendButtonActive : {},
          ]}
          onPress={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={newMessage.trim() ? colors.neutral.white : colors.neutral[400]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConversationsList = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={colors.neutral[700]} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conversationsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color={colors.neutral[400]} />
            <Text style={styles.emptyStateTitle}>No conversations yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Start by booking a ride or publishing one to connect with other users
            </Text>
          </View>
        }
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {selectedChat ? renderChatView() : renderConversationsList()}
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
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
  conversationsList: {
    paddingBottom: spacing.xl,
  },
  conversationItem: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.sm,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary.light,
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
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[900],
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginRight: spacing.sm,
  },
  ratingText: {
    fontSize: 12,
    color: colors.neutral[600],
    fontWeight: '500',
  },
  messageTime: {
    fontSize: 12,
    color: colors.neutral[500],
  },
  rideInfo: {
    marginBottom: spacing.xs,
  },
  rideRoute: {
    fontSize: 13,
    color: colors.neutral[600],
    fontWeight: '500',
  },
  rideTime: {
    fontSize: 11,
    color: colors.neutral[500],
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
  },
  unreadBadge: {
    backgroundColor: colors.primary.main,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: spacing.sm,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral.white,
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  backButton: {
    marginRight: spacing.sm,
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  chatAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary.main,
  },
  chatParticipantName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[900],
  },
  chatStatus: {
    fontSize: 12,
    color: colors.neutral[500],
  },
  callButton: {
    padding: spacing.xs,
  },
  rideInfoBanner: {
    flexDirection: 'row',
    backgroundColor: colors.primary.light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  rideDetails: {
    flex: 1,
  },
  rideDateTime: {
    fontSize: 12,
    color: colors.neutral[600],
    marginTop: 2,
  },
  viewRideButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  viewRideText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary.main,
  },
  messagesList: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  messageContainer: {
    marginVertical: spacing.xs,
    alignItems: 'flex-end',
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: colors.primary.main,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: colors.neutral[200],
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: colors.neutral.white,
  },
  otherMessageText: {
    color: colors.neutral[900],
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
    paddingHorizontal: spacing.xs,
  },
  emptyMessages: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['4xl'],
  },
  emptyMessagesText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[600],
    marginTop: spacing.sm,
  },
  emptyMessagesSubtext: {
    fontSize: 14,
    color: colors.neutral[500],
    marginTop: spacing.xs,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.neutral.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  messageInput: {
    flex: 1,
    backgroundColor: colors.neutral[100],
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    fontSize: 14,
    color: colors.neutral[900],
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  sendButtonActive: {
    backgroundColor: colors.primary.main,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['5xl'],
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral[700],
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: colors.neutral[500],
    textAlign: 'center',
    lineHeight: 20,
  },
});
