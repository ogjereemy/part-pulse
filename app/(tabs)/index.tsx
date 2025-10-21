import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StyleSheet, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';

const liveEvents = [
  { id: '1', title: 'Live Techno', image: require('@/assets/images/icon.png') },
  { id: '2', title: 'Rooftop Bar', image: require('@/assets/images/icon.png') },
];

const categories = ['Rooftop', 'Afro', 'Rave', 'Luxury', 'University', 'VIP'];

const featuredEvents = [
  { id: '1', title: 'Masquerade Ball', image: require('@/assets/images/icon.png') },
  { id: '2', title: '90s Throwback Night', image: require('@/assets/images/icon.png') },
];

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>Welcome, {user?.name || 'Explorer'}</ThemedText>

        <View style={styles.aiSuggestion}>
          <ThemedText style={styles.aiTitle}>Your Vibe Match</ThemedText>
          <ThemedText>Deep House rooftop party &lt;3km away</ThemedText>
        </View>

        <ThemedText type="subtitle" style={styles.sectionTitle}>Live Now Near You</ThemedText>
        <FlatList
          data={liveEvents}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.liveCard}>
              <Image source={item.image} style={styles.liveCardImage} />
              <View style={styles.liveIndicator} />
              <ThemedText style={styles.liveCardTitle}>{item.title}</ThemedText>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
        />

        <ThemedText type="subtitle" style={styles.sectionTitle}>Categories</ThemedText>
        <FlatList
          data={categories}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.categoryChip}>
              <ThemedText>{item}</ThemedText>
            </TouchableOpacity>
          )}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
        />

        <ThemedText type="subtitle" style={styles.sectionTitle}>Featured</ThemedText>
        {featuredEvents.map(event => (
          <Link key={event.id} href={`/event/${event.id}`} asChild>
            <TouchableOpacity style={styles.featuredCard}>
              <Image source={event.image} style={styles.featuredCardImage} />
              <ThemedText style={styles.featuredCardTitle}>{event.title}</ThemedText>
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>

      <Link href="/host" asChild>
        <TouchableOpacity style={styles.hostButton}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: Colors.dark.background,
  },
  title: {
    paddingHorizontal: 20,
  },
  aiSuggestion: {
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.tint,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  liveCard: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginLeft: 20,
    overflow: 'hidden',
  },
  liveCardImage: {
    width: '100%',
    height: '100%',
  },
  liveIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: 'white',
  },
  liveCardTitle: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  categoryChip: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 20,
  },
  featuredCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#1C1C1E',
  },
  featuredCardImage: {
    width: '100%',
    height: 200,
  },
  featuredCardTitle: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  hostButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.dark.tint,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
