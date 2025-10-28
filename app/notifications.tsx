
import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markNotificationsAsRead } from '@/services/notificationsService';
import { useSocket } from '@/hooks/useSocket';


import { SOCKET_URL } from '@/lib/socket';

export default function NotificationsScreen() {
  const queryClient = useQueryClient();
  // const router = useRouter();
  const { on } = useSocket(SOCKET_URL);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (ids: string[]) => markNotificationsAsRead(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  React.useEffect(() => {
    on('user:notifications', (notification: any) => {
      queryClient.setQueryData(['notifications'], (oldData: any) => {
        if (!oldData) return [notification];
        return [notification, ...oldData];
      });
    });
  }, [on, queryClient]);

  const handleNotificationPress = (notification: any) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate([notification.id]);
    }
    // Navigate to the relevant screen
    // router.push(notification.link);
  };

  const renderNotification = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !item.isRead && styles.unreadItem]}
      onPress={() => handleNotificationPress(item)}
    >
      <ThemedText style={styles.notificationText}>{item.message}</ThemedText>
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
      <ThemedText style={styles.screenTitle}>Notifications</ThemedText>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
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
  notificationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
  },
  unreadItem: {
    backgroundColor: '#111827',
  },
  notificationText: {
    color: 'white',
  },
});
