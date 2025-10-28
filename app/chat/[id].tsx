
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/hooks/useSocket';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMessages } from '@/services/roomsService';
import TypingIndicator from '@/components/TypingIndicator';
import { LinearGradient } from 'expo-linear-gradient';

import { SOCKET_URL } from '@/lib/socket';

export default function ChatScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { id: roomId } = useLocalSearchParams();
  const { isConnected, emit, on, off } = useSocket(SOCKET_URL);
  const queryClient = useQueryClient();
  const flatListRef = useRef<FlatList>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', roomId],
    queryFn: () => getMessages(roomId as string),
    enabled: !!roomId,
  });

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!roomId || !isConnected) return;

    emit('joinRoom', roomId);

    const handleNewMessage = (message: any) => {
      queryClient.setQueryData(['messages', roomId], (oldData: any) => {
        if (!oldData) return [message];
        return [...oldData, message];
      });
    };

    const handleTyping = () => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 1000);
    };

    on('message', handleNewMessage);
    on('typing', handleTyping);

    return () => {
      off('message', handleNewMessage);
      off('typing', handleTyping);
      emit('leaveRoom', roomId);
    };
  }, [roomId, isConnected, emit, on, off, queryClient]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !user || !roomId) return;

    const message = {
      text: newMessage.trim(),
      senderId: user.id,
    };

    emit('message', { roomId, ...message });
    setNewMessage('');
  };

  const handleTyping = () => {
      emit('typing', { roomId });
  }

  const renderMessage = ({ item }: { item: any }) => {
    const isMyMessage = item.senderId === user?.id;
    return (
        <View style={[styles.messageContainer, isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer]}>
            {isMyMessage ? (
                <LinearGradient colors={['#FF3CA6', '#8A2BE2']} style={styles.myMessage}>
                    <ThemedText style={styles.messageText}>{item.text}</ThemedText>
                    <ThemedText style={styles.messageTimestamp}>{new Date(item.timestamp).toLocaleTimeString()}</ThemedText>
                </LinearGradient>
            ) : (
                <View style={styles.otherMessage}>
                    <ThemedText style={styles.messageText}>{item.text}</ThemedText>
                    <ThemedText style={styles.messageTimestamp}>{new Date(item.timestamp).toLocaleTimeString()}</ThemedText>
                </View>
            )}
        </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF2D95" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        {/* Add room avatar and name here */}
        <ThemedText style={styles.chatHeaderTitle}>Chat</ThemedText>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        inverted
      />
        {isTyping && <TypingIndicator />}
      <View style={styles.messageInputContainer}>
        <TextInput
          style={styles.messageInput}
          value={newMessage}
          onChangeText={(text) => {
              setNewMessage(text);
              handleTyping();
          }}
          placeholder="Type a message..."
          placeholderTextColor="#A0A0A0"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.fab} onPress={() => flatListRef.current?.scrollToEnd()}>
        <Ionicons name="arrow-down" size={24} color="white" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
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
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
  },
  backButton: {
    marginRight: 10,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  messageList: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  messageContainer: {
      marginBottom: 10,
  },
  myMessageContainer: {
      alignSelf: 'flex-end',
  },
  otherMessageContainer: {
      alignSelf: 'flex-start',
  },
  myMessage: {
    padding: 10,
    borderRadius: 15,
    borderBottomRightRadius: 2,
  },
  otherMessage: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#A0A0A0',
    borderBottomLeftRadius: 2,
  },
  messageText: {
    color: 'white',
    fontSize: 15,
  },
  messageTimestamp: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  messageInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: 'white',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#FF3CA6',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#FF3CA6',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
