
import React, { useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useSocket } from '@/hooks/useSocket';

import { SOCKET_URL } from '@/lib/socket';

export interface VideoPlayerRef {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seek: (positionMillis: number) => Promise<void>;
}

interface VideoPlayerProps {
  source: string;
  poster?: string;
  shouldPlay: boolean;
  isLooping?: boolean;
  onPressOverlay?: () => void;
}

export const VideoPlayer = React.forwardRef<VideoPlayerRef, VideoPlayerProps>(({ source, poster, shouldPlay, isLooping, onPressOverlay }, ref) => {
  const video = useRef<Video>(null);
  const { emit } = useSocket(SOCKET_URL);

  useEffect(() => {
    if (shouldPlay) {
      video.current?.playAsync();
      emit('video:played', { videoUrl: source });
    } else {
      video.current?.pauseAsync();
    }
  }, [shouldPlay, source, emit]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPressOverlay} activeOpacity={1}>
      <Video
        ref={video}
        style={styles.video}
        source={{ uri: source }}
        posterSource={poster ? { uri: poster } : undefined}
        usePoster={!!poster}
        resizeMode={ResizeMode.COVER}
        isLooping={isLooping}
        shouldPlay={shouldPlay}
        useNativeControls={false}
      />
    </TouchableOpacity>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

