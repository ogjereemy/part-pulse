import { Event } from '../../types/events';
import { Avatar } from '@/components/Avatar';
import { ThemedText } from '@/components/themed-text';
import { useSocket } from '@/hooks/useSocket';
import { getEventById, getEventMedia, goLive, rsvpToEvent } from '@/services/eventsService';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Dimensions, Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { SOCKET_URL } from '@/lib/socket';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 300; // Adjust this value based on your design needs

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const { on } = useSocket(SOCKET_URL);

  const { data: event, isLoading: isLoadingEvent } = useQuery<Event>({
    queryKey: ['event', id],
    queryFn: () => getEventById(id as string),
    enabled: !!id,
    gcTime: 1000 * 60 * 2, // 2 minutes
  });

  const { data: media } = useQuery({
    queryKey: ['eventMedia', id],
    queryFn: () => getEventMedia(id as string),
    enabled: !!id,
  });

  const rsvpMutation = useMutation({
    mutationFn: () => rsvpToEvent(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
  });

  const goLiveMutation = useMutation({
    mutationFn: () => goLive(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
  });

  const pulse = useSharedValue(1);

  useEffect(() => {
    if (event?.is_live) {
      pulse.value = withRepeat(withTiming(1.1, { duration: 500, easing: Easing.inOut(Easing.ease) }), -1, true);
    }
  }, [event?.is_live, pulse]);

  const animatedRsvpStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse.value }],
    };
  });

  React.useEffect(() => {
    if (!id) return;
    on(`event:${id}`, (data: any) => {
      queryClient.setQueryData(['event', id], data);
    });
  }, [id, on, queryClient]);

  if (isLoadingEvent) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF2D95" />
        <ThemedText style={styles.loadingText}>Loading event details...</ThemedText>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedText style={styles.loadingText}>Event not found.</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          <Image source={{ uri: event.heroImageUrl }} style={styles.heroImage} />
          <LinearGradient
            colors={['transparent', '#0E0E0E']}
            style={styles.heroGradient}
          />
          <View style={styles.heroContent}>
            <ThemedText style={styles.eventTitle}>{event.title}</ThemedText>
            <View style={styles.hostInfo}>
              <Avatar uri={event.host.avatarUrl} size={30} />
              <ThemedText style={styles.hostUsername}>@{event.host.username}</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <ThemedText style={styles.sectionTitle}>About the Event</ThemedText>
          <ThemedText style={styles.description}>{event.description}</ThemedText>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#A0A0A0" />
            <ThemedText style={styles.infoText}>{event.date} at {event.time}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#A0A0A0" />
            <ThemedText style={styles.infoText}>{event.location}</ThemedText>
          </View>

          <ThemedText style={styles.sectionTitle}>Tags</ThemedText>
          <View style={styles.tagsContainer}>
            {event.tags.map((tag: string, index: number) => (
              <View key={index} style={styles.tagChip}>
                <ThemedText style={styles.tagText}>#{tag}</ThemedText>
              </View>
            ))}
          </View>

          <ThemedText style={styles.sectionTitle}>Attendees ({event.attendeesCount})</ThemedText>
          <View style={styles.attendeesPlaceholder} />

          <ThemedText style={styles.sectionTitle}>Media Gallery</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryContainer}>
            {media?.map((mediaItem: any, index: number) => (
              <Image key={index} source={{ uri: mediaItem.url }} style={styles.galleryImage} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.ctaBar}>
        {event.isHost ? (
          <TouchableOpacity style={styles.goLiveButton} onPress={() => goLiveMutation.mutate()}>
            <Ionicons name="videocam" size={24} color="white" />
            <ThemedText style={styles.ctaButtonText}>Go Live</ThemedText>
          </TouchableOpacity>
        ) : (
          <Animated.View style={animatedRsvpStyle}>
            <TouchableOpacity style={styles.rsvpButton} onPress={() => rsvpMutation.mutate()}>
              <ThemedText style={styles.ctaButtonText}>Join Event</ThemedText>
            </TouchableOpacity>
          </Animated.View>
        )}
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-social" size={24} color="#00D1FF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.directionsButton}>
          <Ionicons name="navigate" size={24} color="#00D1FF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E0E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0E0E0E',
  },
  loadingText: {
    marginTop: 10,
    color: '#A0A0A0',
  },
  heroContainer: {
    width: width,
    height: HEADER_HEIGHT,
    position: 'relative',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    top: '50%',
  },
  heroContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  eventTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostUsername: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#1A1A1A',
    margin: 16,
    borderRadius: 12,
    shadowColor: "#000", 
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 5
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 15,
  },
  description: {
    fontSize: 16,
    color: '#A0A0A0',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#A0A0A0',
    marginLeft: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tagChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    color: '#00D1FF',
    fontSize: 14,
  },
  attendeesPlaceholder: {
    height: 50,
    backgroundColor: '#111827',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  galleryContainer: {
    marginVertical: 10,
  },
  galleryImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    resizeMode: 'cover',
  },
  ctaBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#111827',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: { shadowColor: 'black', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.2, shadowRadius: 4 },
      android: { elevation: 20 },
    }),
  },
  rsvpButton: {
    flex: 2,
    backgroundColor: '#FF2D95',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  goLiveButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#FF5A5F',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  shareButton: {
    flex: 0.5,
    alignItems: 'center',
    paddingVertical: 12,
  },
  directionsButton: {
    flex: 0.5,
    alignItems: 'center',
    paddingVertical: 12,
  },
});