import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme/colors';

interface LocationSuggestion {
  id: string;
  description: string;
  main_text: string;
  secondary_text: string;
}

interface LocationPickerProps {
  placeholder: string;
  value?: string;
  onLocationSelect: (location: string, coordinates?: { lat: number; lng: number }) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  placeholder,
  value,
  onLocationSelect,
  icon = 'location',
  error,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock suggestions for demo - in real app, integrate with Google Places API
  const mockSuggestions: LocationSuggestion[] = [
    {
      id: '1',
      description: 'Connaught Place, New Delhi, Delhi, India',
      main_text: 'Connaught Place',
      secondary_text: 'New Delhi, Delhi, India',
    },
    {
      id: '2',
      description: 'Cyber City, Gurugram, Haryana, India',
      main_text: 'Cyber City',
      secondary_text: 'Gurugram, Haryana, India',
    },
    {
      id: '3',
      description: 'Sector 18, Noida, Uttar Pradesh, India',
      main_text: 'Sector 18',
      secondary_text: 'Noida, Uttar Pradesh, India',
    },
    {
      id: '4',
      description: 'Karol Bagh, New Delhi, Delhi, India',
      main_text: 'Karol Bagh',
      secondary_text: 'New Delhi, Delhi, India',
    },
    {
      id: '5',
      description: 'Lajpat Nagar, New Delhi, Delhi, India',
      main_text: 'Lajpat Nagar',
      secondary_text: 'New Delhi, Delhi, India',
    },
  ];

  const handleSearch = (text: string) => {
    setSearchText(text);
    
    if (text.length > 2) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const filtered = mockSuggestions.filter(
          suggestion =>
            suggestion.description.toLowerCase().includes(text.toLowerCase()) ||
            suggestion.main_text.toLowerCase().includes(text.toLowerCase())
        );
        setSuggestions(filtered);
        setIsLoading(false);
      }, 300);
    } else {
      setSuggestions([]);
    }
  };

  const handleLocationSelect = (location: LocationSuggestion) => {
    onLocationSelect(location.description);
    setIsModalVisible(false);
    setSearchText('');
    setSuggestions([]);
  };

  const openModal = () => {
    setIsModalVisible(true);
    setSearchText(value || '');
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSearchText('');
    setSuggestions([]);
  };

  const renderSuggestionItem = ({ item }: { item: LocationSuggestion }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleLocationSelect(item)}
    >
      <View style={styles.suggestionIcon}>
        <Ionicons name="location" size={16} color={colors.neutral[600]} />
      </View>
      <View style={styles.suggestionText}>
        <Text style={styles.suggestionMain}>{item.main_text}</Text>
        <Text style={styles.suggestionSecondary}>{item.secondary_text}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.inputContainer, error && styles.inputError]}
        onPress={openModal}
      >
        <Ionicons
          name={icon as any}
          size={20}
          color={error ? colors.status.error : colors.neutral[600]}
          style={styles.icon}
        />
        <Text
          style={[
            styles.inputText,
            !value && styles.placeholder,
            error && styles.errorText,
          ]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={16}
          color={colors.neutral[600]}
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorMessage}>{error}</Text>}

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.neutral[600]} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Location</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={colors.neutral[600]}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a location..."
              value={searchText}
              onChangeText={handleSearch}
              autoFocus
              placeholderTextColor={colors.neutral[500]}
            />
          </View>

          {/* Current Location Option */}
          <TouchableOpacity style={styles.currentLocationButton}>
            <View style={styles.currentLocationIcon}>
              <Ionicons name="locate" size={20} color={colors.primary.main} />
            </View>
            <View style={styles.currentLocationText}>
              <Text style={styles.currentLocationTitle}>Use current location</Text>
              <Text style={styles.currentLocationSubtitle}>
                We'll detect your location automatically
              </Text>
            </View>
          </TouchableOpacity>

          {/* Suggestions List */}
          <FlatList
            data={suggestions}
            renderItem={renderSuggestionItem}
            keyExtractor={item => item.id}
            style={styles.suggestionsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              searchText.length > 2 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="search" size={32} color={colors.neutral[400]} />
                  <Text style={styles.emptyStateText}>
                    {isLoading ? 'Searching...' : 'No locations found'}
                  </Text>
                </View>
              ) : null
            }
          />

          {/* Recent Searches */}
          {suggestions.length === 0 && searchText.length <= 2 && (
            <View style={styles.recentSection}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity style={styles.suggestionItem}>
                <View style={styles.suggestionIcon}>
                  <Ionicons name="time" size={16} color={colors.neutral[600]} />
                </View>
                <View style={styles.suggestionText}>
                  <Text style={styles.suggestionMain}>Connaught Place</Text>
                  <Text style={styles.suggestionSecondary}>New Delhi, Delhi</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 52,
  },

  inputError: {
    borderColor: colors.status.error,
  },

  icon: {
    marginRight: spacing.md,
  },

  inputText: {
    flex: 1,
    fontSize: 16,
    color: colors.neutral[900],
  },

  placeholder: {
    color: colors.neutral[500],
  },

  errorText: {
    color: colors.status.error,
  },

  errorMessage: {
    fontSize: 12,
    color: colors.status.error,
    marginTop: spacing.xs,
    marginLeft: spacing.md,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },

  closeButton: {
    padding: spacing.xs,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral[900],
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    margin: spacing.lg,
    paddingHorizontal: spacing.md,
  },

  searchIcon: {
    marginRight: spacing.md,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.neutral[900],
    paddingVertical: spacing.md,
  },

  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },

  currentLocationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  currentLocationText: {
    flex: 1,
  },

  currentLocationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.neutral[900],
    marginBottom: 2,
  },

  currentLocationSubtitle: {
    fontSize: 14,
    color: colors.neutral[600],
  },

  suggestionsList: {
    flex: 1,
  },

  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },

  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  suggestionText: {
    flex: 1,
  },

  suggestionMain: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.neutral[900],
    marginBottom: 2,
  },

  suggestionSecondary: {
    fontSize: 14,
    color: colors.neutral[600],
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['4xl'],
  },

  emptyStateText: {
    fontSize: 16,
    color: colors.neutral[600],
    marginTop: spacing.md,
  },

  recentSection: {
    padding: spacing.lg,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[700],
    marginBottom: spacing.md,
  },

  headerPlaceholder: {
    width: 24, // Same width as close button for balance
  },
});
