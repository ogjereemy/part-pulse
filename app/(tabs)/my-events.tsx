import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { Colors } from '@/constants/theme';

const joinedEvents = [
  { id: '1', title: 'Rooftop DJ Night', date: 'Oct 30, 2025' },
];

const hostedEvents = [
  { id: '2', title: 'Halloween Bash', date: 'Oct 31, 2025' },
];

export default function MyEventsScreen() {
  const [activeTab, setActiveTab] = useState('Joined');

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">My Events</ThemedText>

      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('Joined')} style={[styles.tab, activeTab === 'Joined' && styles.activeTab]}>
          <ThemedText>Joined</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Hosted')} style={[styles.tab, activeTab === 'Hosted' && styles.activeTab]}>
          <ThemedText>Hosted</ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'Joined' ? joinedEvents : hostedEvents}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <ThemedText style={styles.eventTitle}>{item.title}</ThemedText>
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginVertical: 20,
  },
  tab: {
    padding: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.dark.tint,
  },
  eventCard: {
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
