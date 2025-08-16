import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';

interface MapLocation {
  latitude: number;
  longitude: number;
  address: string;
}

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
  
  const handleWebMapPress = (event: any) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setSelectedLocation({ x, y });
    
    // Convert screen coordinates to lat/lng (simplified simulation)
    const latitude = 37.78825 + (y - 100) * 0.001;
    const longitude = -122.4324 + (x - 150) * 0.001;
    
    if (onPress) {
      onPress({ latitude, longitude });
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.webMapContainer, style]} 
      onPress={handleWebMapPress}
      activeOpacity={0.8}
    >
      <View style={styles.webMapContent}>
        <ThemedText style={styles.webMapTitle}>🗺️ Interactive Map</ThemedText>
        <ThemedText style={styles.webMapSubtitle}>
          Tap anywhere to select a location
        </ThemedText>
        <View style={styles.webMapArea}>
          <View style={styles.webMapGrid}>
            {Array.from({ length: 100 }).map((_, i) => (
              <View key={i} style={styles.webMapGridItem} />
            ))}
          </View>
          {selectedLocation && (
            <View 
              style={[
                styles.webMapMarker, 
                { 
                  left: selectedLocation.x - 10, 
                  top: selectedLocation.y - 20 
                }
              ]} 
            >
              <ThemedText style={styles.webMapMarkerText}>📍</ThemedText>
            </View>
          )}
          {/* Show existing markers */}
          {markers.map((marker, index) => (
            <View 
              key={index}
              style={[
                styles.webMapMarker, 
                { 
                  left: 150 + (marker.coordinate.longitude + 122.4324) * 100, 
                  top: 100 + (marker.coordinate.latitude - 37.78825) * 100
                }
              ]} 
            >
              <ThemedText style={styles.webMapMarkerText}>🚩</ThemedText>
            </View>
          ))}
        </View>
        <ThemedText style={styles.webMapInstructions}>
          💡 This simulates map interaction. On mobile, you'll see a real map.
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  webMapContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e1e5e9',
  },
  webMapContent: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  webMapTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  webMapSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 20,
  },
  webMapArea: {
    position: 'relative',
    width: 300,
    height: 200,
    marginBottom: 20,
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  webMapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
    height: 200,
  },
  webMapGridItem: {
    width: 15,
    height: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 0.5,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  webMapMarker: {
    position: 'absolute',
    zIndex: 10,
  },
  webMapMarkerText: {
    fontSize: 20,
  },
  webMapInstructions: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
