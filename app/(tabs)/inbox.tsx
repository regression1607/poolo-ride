import { useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, ViewStyle, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText, ThemedView } from '@/src/components';
import { DesignTokens } from '@/src/design/tokens';

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
