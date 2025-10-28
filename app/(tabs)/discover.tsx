import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { ThemedText } from '../../components/themed-text';
import { EventCard } from '../../components/EventCard';
import { MapHotspotMarker } from '../../components/MapHotspotMarker';
import { useLocation } from '../../hooks/useLocation';
import { Ionicons } from '@expo/vector-icons';
import { getHotspots, getFriendsOnMap, getEventsNearby } from '@/services/mapService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { useSocket } from '@/hooks/useSocket';
import { SOCKET_URL } from '../../lib/socket';
import { mapStyle } from '../../styles/mapStyle';
import { Hotspot, Friend } from '../../types/map';
import { Event } from '../../types/events';

const { width, height } = Dimensions.get('window');

const INITIAL_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;

export default function DiscoverScreen() {
  const [mapMode, setMapMode] = useState(true);
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const { location } = useLocation({ shouldTrack: true });
  const queryClient = useQueryClient();
  const { on } = useSocket(SOCKET_URL);

  useEffect(() => {
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  }, [location]);

  useEffect(() => {
    on('presence:update', (data: Friend) => {
      queryClient.setQueryData(['friends', region.latitude, region.longitude], (oldData: Friend[] | undefined) => {
        if (!oldData) return oldData;
        const newFriends = oldData.map((friend) => friend.id === data.id ? data : friend);
        if (!newFriends.some((friend) => friend.id === data.id)) {
          newFriends.push(data);
        }
        return newFriends;
      });
    });

    on('event:hotspot_update', (data: Hotspot) => {
      queryClient.setQueryData(['hotspots', region.latitude, region.longitude, region.latitudeDelta], (oldData: Hotspot[] | undefined) => {
        if (!oldData) return oldData;
        const newHotspots = oldData.map((hotspot) => hotspot.id === data.id ? data : hotspot);
        if (!newHotspots.some((hotspot) => hotspot.id === data.id)) {
          newHotspots.push(data);
        }
        return newHotspots;
      });
    });
  }, [on, queryClient, region]);

  const { data: hotspots, isLoading: isLoadingHotspots } = useQuery<Hotspot[]>({
    queryKey: ['hotspots', region.latitude, region.longitude, region.latitudeDelta],
    queryFn: () => getHotspots({ centerLat: region.latitude, centerLng: region.longitude, zoom: Math.log2(360 / region.longitudeDelta) }),
    enabled: !!region,
    gcTime: 1000 * 10, // 10 seconds
  });

  const { data: friends, isLoading: isLoadingFriends } = useQuery<Friend[]>({
    queryKey: ['friends', region.latitude, region.longitude],
    queryFn: () => getFriendsOnMap({ centerLat: region.latitude, centerLng: region.longitude, radius: 5000 }), // 5km radius
    enabled: !!region,
  });

  const { data: events, isLoading: isLoadingEvents } = useQuery<Event[]>({
    queryKey: ['events', region.latitude, region.longitude],
    queryFn: () => getEventsNearby({ lat: region.latitude, lng: region.longitude, radius: 5000 }), // 5km radius
    enabled: !!region,
  });

  const debouncedSetRegion = useCallback(() => debounce(setRegion, 500), [setRegion]);

  const handleMapPress = (e: any) => {
    console.log('Map pressed at:', e.nativeEvent.coordinate);
  };

  const isLoading = isLoadingHotspots || isLoadingFriends || isLoadingEvents;

  return (
    <View style={styles.container}>
      {mapMode && Platform.OS !== 'web' ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={INITIAL_REGION}
          region={region}
          onRegionChangeComplete={debouncedSetRegion}
          onPress={handleMapPress}
          showsUserLocation
          showsMyLocationButton={false}
          customMapStyle={mapStyle}
        >
          {hotspots?.map((hotspot: Hotspot) => (
            <MapHotspotMarker
              key={hotspot.id}
              coordinate={hotspot.coordinate}
              count={hotspot.count}
              type="hotspot"
              onPress={() => console.log('Hotspot pressed', hotspot.id)}
            />
          ))}
          {friends?.map((friend: Friend) => (
            <MapHotspotMarker
              key={friend.id}
              coordinate={friend.coordinate}
              avatarUrl={friend.avatarUrl}
              type="friend"
              onPress={() => console.log('Friend pressed', friend.id)}
            />
          ))}
          {events?.map((event: Event) => (
            <MapHotspotMarker
              key={event.id}
              coordinate={{ latitude: event.lat, longitude: event.lng }}
              type="event"
              onPress={() => console.log('Event pressed', event.id)}
            />
          ))}
        </MapView>
      ) : mapMode && Platform.OS === 'web' ? (
        <View style={styles.webMapFallback}>
          <ThemedText style={styles.webMapFallbackText}>Map is not available on web. Showing list view.</ThemedText>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <ThemedText style={styles.listTitle}>Nearby Events</ThemedText>
          {events?.map((event: Event) => (
            <EventCard key={event.id} event={event} onPress={(id) => console.log('Event card pressed', id)} />
          ))}
        </View>
      )}

      {isLoading && <ActivityIndicator style={StyleSheet.absoluteFill} size="large" color="#FF2D95" />}

      <View style={styles.mapControls}>
        <TouchableOpacity
          style={[styles.controlButton, mapMode && styles.activeControlButton]}
          onPress={() => setMapMode(true)}
        >
          <Ionicons name="map" size={24} color={mapMode ? '#FF2D95' : '#9CA3AF'} />
          <ThemedText style={{ color: mapMode ? '#FF2D95' : '#9CA3AF', fontSize: 12 }}>Map</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, !mapMode && styles.activeControlButton]}
          onPress={() => setMapMode(false)}
        >
          <Ionicons name="list" size={24} color={!mapMode ? '#FF2D95' : '#9CA3AF'} />
          <ThemedText style={{ color: !mapMode ? '#FF2D95' : '#9CA3AF', fontSize: 12 }}>List</ThemedText>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.filterButton} onPress={() => console.log('Open Filter Sheet')}>
        <Ionicons name="options" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050406',
  },
  map: {
    width: width,
    height: height,
  },
  webMapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F1724',
  },
  webMapFallbackText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    paddingTop: 20,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 16,
    marginBottom: 10,
  },
  mapControls: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 36, 0.8)',
    borderRadius: 25,
    padding: 5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
  },
  controlButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeControlButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  filterButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(15, 23, 36, 0.8)',
    borderRadius: 25,
    padding: 10,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
  },
});