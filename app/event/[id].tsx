import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();

  // Fetch event data based on id, for now we use mock data
  const event = {
    id: id,
    title: 'Sunset Beach Party',
    host: 'DJ Marina',
    image: require('@/assets/images/icon.png'),
    location: 'Sunny Beach, CA',
    time: 'Oct 25, 2025, 6:00 PM',
    capacity: '80% full',
    music: ['Deep House', 'Techno', 'Chillwave'],
  };

  return (
    <ThemedView style={styles.container}>
      <Image source={event.image} style={styles.heroImage} />
      <View style={styles.contentContainer}>
        <ThemedText type="title" style={styles.title}>{event.title}</ThemedText>
        <ThemedText style={styles.host}>Hosted by {event.host}</ThemedText>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color={Colors.dark.text} />
          <ThemedText style={styles.infoText}>{event.location}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={20} color={Colors.dark.text} />
          <ThemedText style={styles.infoText}>{event.time}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={20} color={Colors.dark.text} />
          <ThemedText style={styles.infoText}>{event.capacity}</ThemedText>
        </View>

        <View style={styles.tagsContainer}>
          {event.music.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <ThemedText style={styles.tagText}>{tag}</ThemedText>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.joinButton}>
        <ThemedText style={styles.joinButtonText}>Join Now</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  heroImage: {
    width: '100%',
    height: 300,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  host: {
    fontSize: 18,
    color: Colors.dark.tint,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#2C2C2E',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 14,
  },
  joinButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: Colors.dark.tint,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
