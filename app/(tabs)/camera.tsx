import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CameraScreen() {
  const [type, setType] = useState<'back' | 'front'>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF2D95" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <ThemedText style={{ textAlign: 'center' }}>
          We need your permission to show the camera
        </ThemedText>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <ThemedText style={styles.permissionButtonText}>Grant Permission</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraType = () => {
    setType(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleRecordButtonPress = async () => {
    if (cameraRef.current) {
      if (!isRecording) {
        setIsRecording(true);
        try {
          const video = await cameraRef.current.recordAsync();
          if (video) {
            router.push({ pathname: '/post-composer', params: { videoUri: video.uri } });
          }
        } catch (error) {
          console.error('Error recording video:', error);
        } finally {
          setIsRecording(false);
        }
      } else {
        cameraRef.current.stopRecording();
        setIsRecording(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleCameraType}>
            <Ionicons name="camera-reverse" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.recordButton}
            onPress={handleRecordButtonPress}
          >
            <LinearGradient
                colors={isRecording ? ['#FF5A5F', '#FF2D95'] : ['#FF3CA6', '#8A2BE2']}
                style={styles.recordButtonGradient}
            >
                {isRecording && <View style={styles.recordingDot} />}
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="close" size={36} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    padding: 15,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  permissionButton: {
    marginTop: 20,
    backgroundColor: '#FF3CA6',
    padding: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});