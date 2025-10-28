import React, { useState, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { getSignedUrl, createMedia } from '@/services/mediaService';
import { useQueryClient } from '@tanstack/react-query';
import { useNetInfo } from '@react-native-community/netinfo';
import { addToUploadQueue } from '@/services/offlineService';
import * as Progress from 'react-native-progress';
import LottieView from 'lottie-react-native';

export default function PostComposerScreen() {
  const { videoUri } = useLocalSearchParams();
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const netInfo = useNetInfo();
  const animation = useRef(null);

  const handlePost = async () => {
    if (!videoUri || typeof videoUri !== 'string') return;

    if (!netInfo.isConnected) {
      await addToUploadQueue({ id: Date.now().toString(), videoUri, caption });
      router.replace('/(tabs)/home');
      return;
    }

    setIsUploading(true);
    try {
      const { url, key } = await getSignedUrl({});
      const response = await fetch(videoUri);
      const blob = await response.blob();
      
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(e.loaded / e.total);
        }
      };
      xhr.onload = async () => {
        if (xhr.status < 300) {
          const newMedia = await createMedia({ storage_key: key, type: 'video' });
          queryClient.setQueryData(['feed', 'home'], (oldData: any) => {
            if (!oldData) return oldData;
            const newData = { ...oldData };
            newData.pages[0].data.unshift(newMedia);
            return newData;
          });
          setShowSuccess(true);
        }
      };
      xhr.send(blob);

    } catch (error) {
      console.error('Failed to post video:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (showSuccess) {
    return (
      <View style={styles.container}>
        <LottieView
          ref={animation}
          style={styles.lottie}
          source={require('@/assets/lottie/confetti.json')}
          autoPlay
          loop={false}
          onAnimationFinish={() => router.replace('/(tabs)/home')}
        />
        <ThemedText style={styles.successText}>Posted!</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>New Post</ThemedText>
      {typeof videoUri === 'string' && <Image source={{ uri: videoUri }} style={styles.thumbnail} />}
      <TextInput
        style={styles.input}
        placeholder="Write a caption..."
        placeholderTextColor="#9CA3AF"
        value={caption}
        onChangeText={setCaption}
      />
      {isUploading ? (
        <Progress.Bar progress={progress} width={null} color="#FF3CA6" />
      ) : (
        <Button title="Post" onPress={handlePost} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#050406',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#111827',
    color: 'white',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    position: 'absolute',
    alignSelf: 'center',
  },
});