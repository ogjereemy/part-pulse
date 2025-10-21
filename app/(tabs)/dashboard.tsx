import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { Colors } from '@/constants/theme';
import { Link } from 'expo-router';

const liveEvents = [
  { id: '1', title: 'Rooftop DJ Night', joins: 120 },
];

const scheduledEvents = [
  { id: '2', title: 'Halloween Bash', date: 'Oct 31, 2025' },
];

const pastEvents = [
    { id: '3', title: 'Sunset Beach Party', date: 'Oct 25, 2025' },
];

export default function HostDashboardScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Host Dashboard</ThemedText>

      <Link href="/host" asChild>
        <TouchableOpacity style={styles.createButton}>
          <ThemedText style={styles.createButtonText}>Create New Event</ThemedText>
        </TouchableOpacity>
      </Link>

      <ThemedText type="subtitle" style={styles.sectionTitle}>Live Events</ThemedText>
      <FlatList
        data={liveEvents}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
            <ThemedText>{item.joins} people joined</ThemedText>
            <TouchableOpacity style={styles.endButton}>
              <ThemedText style={styles.endButtonText}>End Party</ThemedText>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />

      <ThemedText type="subtitle" style={styles.sectionTitle}>Scheduled Events</ThemedText>
      <FlatList
        data={scheduledEvents}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
            <ThemedText>{item.date}</ThemedText>
          </View>
        )}
        keyExtractor={item => item.id}
      />

      <ThemedText type="subtitle" style={styles.sectionTitle}>Past Events</ThemedText>
      <FlatList
        data={pastEvents}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
            <ThemedText>{item.date}</ThemedText>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: Colors.dark.background,
  },
  createButton: {
    backgroundColor: Colors.dark.tint,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  endButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  endButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
