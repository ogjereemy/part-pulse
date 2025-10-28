
import { colors } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';

interface ActionButtonProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string | number;
  onPress: () => void;
  isActive?: boolean;
}

export function ActionButton({ iconName, label, onPress, isActive = false }: ActionButtonProps) {
  const iconColor = isActive ? 'white' : colors.muted;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {isActive ? (
        <LinearGradient
          colors={[colors['neon-1' as keyof typeof colors], colors['neon-2' as keyof typeof colors]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconGradient}
        >
          <Ionicons name={iconName} size={28} color="white" />
        </LinearGradient>
      ) : (
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={28} color={iconColor} />
        </View>
      )}
      <ThemedText style={styles.label}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 5,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    color: colors.muted,
  },
});
