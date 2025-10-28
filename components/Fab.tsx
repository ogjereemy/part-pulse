
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/theme';

interface FabProps {
  onPress: () => void;
}

export function Fab({ onPress }: FabProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={[colors['neon-1'], colors['neon-2']]}
        style={styles.gradient}
      >
        <Ionicons name="camera" size={32} color="white" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30, // Adjust as needed
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    elevation: 8,
    shadowColor: colors['neon-1'],
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
