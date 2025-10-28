
import { MediaItem } from '@/types/media';

import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { VideoPlayer, VideoPlayerRef } from './VideoPlayer';
import { Avatar } from './Avatar';
import { ActionButton } from './ActionButton';
import { likeMedia } from '@/services/mediaService';
import { ThemedText } from './themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReportModal } from './ReportModal';
import { useSocket } from '@/hooks/useSocket';

import { SOCKET_URL } from '@/lib/socket';

const { height: screenHeight } = Dimensions.get('window');



interface VideoCardProps {
  media: MediaItem;
  shouldPlay: boolean;
}

export function VideoCard({ media, shouldPlay }: VideoCardProps) {
  const videoPlayerRef = useRef<VideoPlayerRef>(null);
  const queryClient = useQueryClient();
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const { on } = useSocket(SOCKET_URL);

  useEffect(() => {
    on(`media:${media.id}:reacted`, (reaction: string) => {
      queryClient.setQueryData(['feed', 'home'], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((item: MediaItem) =>
              item.id === media.id
                ? {
                    ...item,
                    reactions: {
                      ...item.reactions,
                      [reaction]: (item.reactions?.[reaction as keyof typeof item.reactions] || 0) + 1,
                    },
                  }
                : item
            ),
          })),
        };
      });
    });
  }, [on, queryClient, media.id]);

  const likeMutation = useMutation({
    mutationFn: () => likeMedia(media.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['feed', 'home'] });
      const previousFeed = queryClient.getQueryData(['feed', 'home']);

      queryClient.setQueryData(['feed', 'home'], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((item: MediaItem) =>
              item.id === media.id
                ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? (item.likes || 0) - 1 : (item.likes || 0) + 1 }
                : item
            ),
          })),
        };
      });

      return { previousFeed };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['feed', 'home'], context?.previousFeed);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed', 'home'] });
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleVideoPress = () => {
    console.log('Video pressed');
  };

  return (
    <View style={styles.container}>
      <VideoPlayer
        ref={videoPlayerRef}
        source={media.videoUrl || ''}
        poster={media.posterUrl}
        shouldPlay={shouldPlay}
        onPressOverlay={handleVideoPress}
      />

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.overlay}
      >
        <View style={styles.leftControls}>
            <Avatar uri={media.user?.avatarUrl} size={48} />
            <ThemedText style={styles.username}>@{media.user?.username}</ThemedText>
        </View>
        <View style={styles.rightControls}>
          <TouchableOpacity style={styles.menuButton} onPress={() => setIsReportModalVisible(true)}>
            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
          </TouchableOpacity>
          <ActionButton iconName="heart" label={media.likes || 0} onPress={handleLike} isActive={media.isLiked} />
          <ActionButton iconName="chatbubble-ellipses" label={media.comments || 0} onPress={() => console.log('Comments')} />
          <ActionButton iconName="share" label={media.shares || 0} onPress={() => console.log('Share')} />
        </View>

        <View style={styles.bottomContainer}>
          <ThemedText style={styles.description}>{media.description}</ThemedText>
          {media.event && (
            <TouchableOpacity style={styles.eventTag} onPress={() => console.log('Go to event', media.event?.id)}>
              <Ionicons name="calendar" size={16} color="white" />
              <ThemedText style={styles.eventTagText}>{media.event.name}</ThemedText>
              {media.event.tag && (
                <LinearGradient colors={['#FF3CA6', '#8A2BE2']} style={styles.hashtagBackground}>
                    <ThemedText style={styles.eventCategory}>#{media.event.tag}</ThemedText>
                </LinearGradient>
              )}
            </TouchableOpacity>
          )}
        </View>
        <ThemedText style={styles.logo}>R</ThemedText>
      </LinearGradient>
      <ReportModal 
        visible={isReportModalVisible} 
        onClose={() => setIsReportModalVisible(false)} 
        type="media" 
        id={media.id} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: screenHeight,
    backgroundColor: 'black',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 20,
  },
  leftControls: {
    position: 'absolute',
    left: 20,
    bottom: 120,
    alignItems: 'center',
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  rightControls: {
    position: 'absolute',
    right: 20,
    bottom: 120, 
    alignItems: 'center',
  },
  menuButton: {
    marginBottom: 20,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
  },
  description: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  eventTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  eventTagText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 12,
  },
  hashtagBackground: {
    borderRadius: 5,
    paddingHorizontal: 5,
    marginLeft: 5,
  },
  eventCategory: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    fontSize: 40,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.5)',
  }
});
