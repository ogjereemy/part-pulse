import { Avatar } from '@/components/Avatar';
import { ThemedText } from '@/components/themed-text';
import { getConversations } from '@/services/roomsService';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function MessagesScreen() {
  const router = useRouter();
  const { data: conversations, isLoading } = useQuery({ 
    queryKey: ['conversations'], 
    queryFn: getConversations 
  });

  const renderChatRoom = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.chatRoomItem} onPress={() => router.push(`/chat/${item.id}`)}>
      <Avatar uri={item.avatarUrl} size={50} />
      <View style={styles.chatRoomInfo}>
        <ThemedText style={styles.chatRoomName}>{item.name}</ThemedText>
        <ThemedText style={styles.chatRoomLastMessage}>{item.lastMessage}</ThemedText>
      </View>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <ThemedText style={styles.unreadBadgeText}>{item.unreadCount}</ThemedText>
        </View>
      )}
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
      <ThemedText style={styles.screenTitle}>Messages</ThemedText>
      <FlatList
        data={conversations}
        renderItem={renderChatRoom}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatRoomList}
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
  chatRoomList: {
    paddingHorizontal: 10,
  },
  chatRoomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#111827',
    borderRadius: 10,
    marginBottom: 10,
  },
  chatRoomInfo: {
    marginLeft: 10,
    flex: 1,
  },
  chatRoomName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  chatRoomLastMessage: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  unreadBadge: {
    backgroundColor: '#FF2D95',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});