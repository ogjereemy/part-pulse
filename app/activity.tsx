
import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useQuery } from '@tanstack/react-query';
import { getFriendsActivity } from '@/services/activityService';


export default function ActivityScreen() {
  // const router = useRouter();
  const { data: activities, isLoading } = useQuery({ 
    queryKey: ['friendsActivity'], 
    queryFn: getFriendsActivity 
  });

  const renderActivity = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.activityItem}
      onPress={() => {
        // Navigate to the relevant screen based on activity type
        // if (item.type === 'liked_media') router.push(`/media/${item.mediaId}`);
        // if (item.type === 'joined_event') router.push(`/event/${item.eventId}`);
      }}
    >
      <ThemedText style={styles.activityText}>{item.message}</ThemedText>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF2D95" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.screenTitle}>Friends Activity</ThemedText>
      <FlatList
        data={activities}
        renderItem={renderActivity}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050406',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050406',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    padding: 20,
  },
  activityItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
  },
  activityText: {
    color: 'white',
  },
});
