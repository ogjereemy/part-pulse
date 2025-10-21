import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { StyleSheet, View, TouchableOpacity, FlatList, TextInput, Modal, Button } from 'react-native';

const events = [
  { id: '1', title: 'Cyberpunk Rave', image: require('@/assets/images/icon.png') },
  { id: '2', title: 'Jazz Night', image: require('@/assets/images/icon.png') },
  { id: '3', title: 'Beach Bonfire', image: require('@/assets/images/icon.png') },
];

export default function ExploreScreen() {
  const [filterVisible, setFilterVisible] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color={Colors.dark.text} style={styles.searchIcon} />
          <TextInput
            placeholder="Search events, venues, or vibes"
            style={styles.searchBar}
            placeholderTextColor={Colors.dark.text}
          />
        </View>
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <Ionicons name="options-outline" size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />
            <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={filterVisible}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ThemedText type="title">Filters</ThemedText>
            {/* Add filter options here */}
            <Button title="Apply" onPress={() => setFilterVisible(false)} />
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    color: Colors.dark.text,
  },
  card: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#1C1C1E',
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardTitle: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});