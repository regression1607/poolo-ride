import React, { useState } from 'react';
import { Platform, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
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

const { width, height } = Dimensions.get('window');

export function CrossPlatformMap({ 
  style, 
  initialRegion, 
  onPress, 
  markers = [] 
}: CrossPlatformMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ x: number; y: number } | null>(null);
  
  if (Platform.OS === 'web') {
    const handleWebMapPress = (event: any) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      setSelectedLocation({ x, y });
      
      // Convert screen coordinates to lat/lng (simplified simulation)
      const latitude = 37.78825 + (y - 150) * 0.001;
      const longitude = -122.4324 + (x - 200) * 0.001;
      
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
          </View>
          <ThemedText style={styles.webMapInstructions}>
            💡 This simulates map interaction. On mobile, you'll see a real map.
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  }

  // For mobile platforms, use react-native-maps
  try {
    // Only import on native platforms
    if (Platform.OS !== 'web') {
      const MapView = require('react-native-maps').default;
      const Marker = require('react-native-maps').Marker;
      
      return (
        <MapView
          style={style}
          provider="google"
          initialRegion={initialRegion || {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={onPress ? (event: any) => onPress(event.nativeEvent.coordinate) : undefined}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.coordinate}
              title={marker.title}
            />
          ))}
        </MapView>
      );
    }
  } catch (error) {
    // Fallback if react-native-maps is not properly installed
    return (
      <View style={[styles.fallbackContainer, style]}>
        <ThemedText style={styles.fallbackText}>
          🗺️ Map component loading...
        </ThemedText>
      </View>
    );
  }

  // This should never be reached since we handle web platform above
  return (
    <View style={[styles.fallbackContainer, style]}>
      <ThemedText style={styles.fallbackText}>
        🗺️ Platform not supported
      </ThemedText>
    </View>
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
  fallbackContainer: {
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e1e5e9',
  },
  fallbackText: {
    fontSize: 16,
    opacity: 0.7,
  },
});
