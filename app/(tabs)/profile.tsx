// Fallback ThemedView component used when '@/components/ThemedView' can't be resolved
import { Colors } from '@/constants/theme';
import { Alert, FlatList, StyleSheet, Text, TextInput, TextProps, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';

const ThemedView = (props: any) => {
  const { children, style, ...rest } = props;
  return <View style={style} {...rest}>{children}</View>;
};

// Fallback ThemedText component used when '@/components/ThemedText' can't be resolved
const ThemedText = (props: TextProps & { type?: string }) => {
  const { children, style, ...rest } = props;
  return <Text style={style} {...rest}>{children}</Text>;
};

const upcomingEvents = [
  { id: '1', title: 'Rooftop DJ Night', date: 'Oct 30, 2025' },
];

const pastEvents = [
  { id: '2', title: 'Sunset Beach Party', date: 'Oct 25, 2025' },
];

export default function ProfileScreen() {
  const { user, signOut, updatePhoneNumber } = useAuth();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');

  useEffect(() => {
    setPhoneNumber(user?.phone || '');
  }, [user]);

  const handleSavePhoneNumber = async () => {
    try {
      await updatePhoneNumber(phoneNumber);
      Alert.alert('Success', 'Phone number updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user?.avatar_url }} style={styles.avatar} />
        <ThemedText type="title" style={styles.name}>{user?.name || 'Anonymous'}</ThemedText>
        <ThemedText style={styles.bio}>Your bio goes here. Click to edit.</ThemedText>
        <View style={styles.interestsContainer}>
          <ThemedText style={styles.interest}>#techno</ThemedText>
          <ThemedText style={styles.interest}>#rooftop</ThemedText>
        </View>

        <ThemedText style={styles.sectionTitle}>Contact Information</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSavePhoneNumber}>
          <ThemedText style={styles.buttonText}>Save Phone Number</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('Upcoming')} style={[styles.tab, activeTab === 'Upcoming' && styles.activeTab]}>
          <ThemedText>Upcoming</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Past')} style={[styles.tab, activeTab === 'Past' && styles.activeTab]}>
          <ThemedText>Past</ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'Upcoming' ? upcomingEvents : pastEvents}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <ThemedText style={styles.eventTitle}>{item.title}</ThemedText>
            <ThemedText>{item.date}</ThemedText>
          </View>
        )}
        keyExtractor={item => item.id}
      />

      <Link href="/dashboard" asChild>
        <TouchableOpacity style={styles.hostButton}>
          <ThemedText style={styles.hostButtonText}>Host Dashboard</ThemedText>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={24} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: Colors.dark.background,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bio: {
    color: '#888',
    marginTop: 5,
  },
  interestsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  interest: {
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
    margin: 20,
    marginBottom: 0,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  hostButton: {
    backgroundColor: Colors.dark.tint,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  hostButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: '100%',
  },
  saveButton: {
    backgroundColor: Colors.dark.tint,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
