
import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassSheetProps extends ViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
}

export function GlassSheet({
  children,
  style,
  intensity = 80,
  tint = 'dark',
  ...rest
}: GlassSheetProps) {
  return (
    <View style={[styles.container, style]} {...rest}>
      <BlurView intensity={intensity} tint={tint} style={styles.blurView}>
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  blurView: {
    flex: 1,
  },
});
