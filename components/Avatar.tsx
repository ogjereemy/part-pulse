
import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { colors } from '@/styles/theme';

interface AvatarProps {
  uri?: string;
  size?: number;
  alt?: string;
}

export function Avatar({ uri, size = 40, alt = 'User Avatar' }: AvatarProps) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {uri ? (
        <Image source={{ uri }} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} accessibilityLabel={alt} />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]}>
          <ThemedText style={{ fontSize: size * 0.4, color: 'white' }}>{alt.charAt(0).toUpperCase()}</ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors['neon-1'],
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
