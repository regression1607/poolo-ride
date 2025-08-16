import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '../ThemedText';

interface CrossPlatformMapProps {
  style?: any;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onPress?: (coordinate: { latitude: number; longitude: number }) => void;
  markers?: Array<{
    coordinate: { latitude: number; longitude: number };
    title?: string;
  }>;
}

export function CrossPlatformMap({ 
  style, 
  initialRegion, 
  onPress, 
  markers = [] 
}: CrossPlatformMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ x: number; y: number } | null>(null);
  
  const handleMapPress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    
    setSelectedLocation({ x: locationX, y: locationY });
    
    // Convert screen coordinates to lat/lng (simplified simulation)
    const latitude = (initialRegion?.latitude || 37.78825) + (locationY - 100) * 0.001;
    const longitude = (initialRegion?.longitude || -122.4324) + (locationX - 150) * 0.001;
    
    if (onPress) {
      onPress({ latitude, longitude });
    }
  };

  const handleUseCurrentLocation = () => {
    if (onPress) {
      // Simulate getting current location
      onPress({ 
        latitude: initialRegion?.latitude || 37.78825, 
        longitude: initialRegion?.longitude || -122.4324 
      });
      Alert.alert('Location Selected', 'Using current location coordinates');
    }
  };

  return (
    <View style={[styles.mapContainer, style]}>
      <View style={styles.mapHeader}>
        <ThemedText style={styles.mapTitle}>🗺️ Map Selection</ThemedText>
        <TouchableOpacity 
          style={styles.currentLocationButton}
          onPress={handleUseCurrentLocation}
        >
          <ThemedText style={styles.currentLocationText}>📍 Use Current Location</ThemedText>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.mapArea}
        onPress={handleMapPress}
        activeOpacity={0.8}
      >
        <View style={styles.mapGrid}>
          {Array.from({ length: 100 }).map((_, i) => (
            <View key={i} style={styles.mapGridItem} />
          ))}
        </View>
        
        {selectedLocation && (
          <View 
            style={[
              styles.mapMarker, 
              { 
                left: selectedLocation.x - 10, 
                top: selectedLocation.y - 20 
              }
            ]} 
          >
            <ThemedText style={styles.mapMarkerText}>📍</ThemedText>
          </View>
        )}
        
        {/* Show existing markers */}
        {markers.map((marker, index) => (
          <View 
            key={index}
            style={[
              styles.mapMarker, 
              { 
                left: 150 + (marker.coordinate.longitude - (initialRegion?.longitude || -122.4324)) * 1000, 
                top: 100 + (marker.coordinate.latitude - (initialRegion?.latitude || 37.78825)) * 1000
              }
            ]} 
          >
            <ThemedText style={styles.mapMarkerText}>🚩</ThemedText>
          </View>
        ))}
        
        <View style={styles.mapOverlay}>
          <ThemedText style={styles.mapInstructions}>
            Tap anywhere to select location
          </ThemedText>
        </View>
      </TouchableOpacity>
      
      <ThemedText style={styles.mapFooter}>
        💡 This is a simplified map interface. In a production app, you'd use Google Maps or Apple Maps.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e1e5e9',
  },
  mapHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  currentLocationButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  currentLocationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  mapArea: {
    position: 'relative',
    height: 300,
    backgroundColor: '#e8f4fd',
  },
  mapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
  },
  mapGridItem: {
    width: 20,
    height: 15,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 0.5,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  mapMarker: {
    position: 'absolute',
    zIndex: 10,
  },
  mapMarkerText: {
    fontSize: 20,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 12,
  },
  mapInstructions: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  mapFooter: {
    padding: 16,
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  fallbackContainer: {
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    minHeight: 200,
  },
  fallbackText: {
    fontSize: 16,
    opacity: 0.7,
  },
});
