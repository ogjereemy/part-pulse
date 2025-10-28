
import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from './Avatar';
import { ThemedText } from './themed-text';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

let MapView: any;
let Marker: any;

if (Platform.OS !== 'web') {
  import('react-native-maps').then(module => {
    MapView = module.default;
    Marker = MapView.Marker;
  });
}

interface MapHotspotMarkerProps {
  coordinate: { latitude: number; longitude: number };
  type: 'hotspot' | 'friend' | 'event';
  count?: number; // For hotspot size
  avatarUrl?: string; // For friend avatar
  onPress?: () => void;
}

export function MapHotspotMarker({ coordinate, type, count = 1, avatarUrl, onPress }: MapHotspotMarkerProps) {
  const markerSize = Math.min(60, 30 + count * 5);

  const pulse = useSharedValue(1);

  useEffect(() => {
    if (type === 'hotspot') {
      pulse.value = withRepeat(withTiming(1.5, { duration: 1000, easing: Easing.inOut(Easing.ease) }), -1, true);
    }
  }, [type, pulse]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse.value }],
    };
  });

  if (Platform.OS === 'web') {
    // Fallback for web platform
    return (
      <View style={[styles.webFallbackMarker, { left: coordinate.longitude * 100, top: coordinate.latitude * 100 }]}>
        <ThemedText style={{ color: 'white', fontSize: 10 }}>{type.charAt(0).toUpperCase()}</ThemedText>
      </View>
    );
  }

  if (!Marker) {
    return null; // Should not happen if Platform.OS !== 'web'
  }

  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      {type === 'hotspot' && (
        <Animated.View style={[styles.hotspot, { width: markerSize, height: markerSize, borderRadius: markerSize / 2 }, animatedStyle]}>
            <LinearGradient
              colors={['#FF2D95', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hotspotGradient}
            />
        </Animated.View>
      )}
      {type === 'friend' && avatarUrl && (
        <View style={styles.friendPinContainer}>
            <LinearGradient
                colors={['#FF3CA6', '#8A2BE2']}
                style={styles.friendPinBorder}
            >
                <Avatar uri={avatarUrl} size={markerSize - 6} />
            </LinearGradient>
        </View>
      )}
      {type === 'event' && (
        <View style={styles.eventMarker}>
          <View style={styles.eventMarkerInner} />
        </View>
      )}
    </Marker>
  );
}

const styles = StyleSheet.create({
  hotspot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hotspotGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    opacity: 0.7,
  },
  friendPinContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  friendPinBorder: {
    borderRadius: 9999,
    padding: 3,
  },
  eventMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF2D95',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  eventMarkerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  webFallbackMarker: {
    position: 'absolute',
    backgroundColor: 'rgba(255,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
  },
});
