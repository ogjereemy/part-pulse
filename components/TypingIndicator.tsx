
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';

const TypingIndicator = () => {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    dot1.value = withRepeat(withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }), -1, true);
    dot2.value = withDelay(100, withRepeat(withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }), -1, true));
    dot3.value = withDelay(200, withRepeat(withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }), -1, true));
  }, [dot1, dot2, dot3]);

  const animatedStyle1 = useAnimatedStyle(() => ({ transform: [{ scale: dot1.value }] }));
  const animatedStyle2 = useAnimatedStyle(() => ({ transform: [{ scale: dot2.value }] }));
  const animatedStyle3 = useAnimatedStyle(() => ({ transform: [{ scale: dot3.value }] }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, animatedStyle1]} />
      <Animated.View style={[styles.dot, animatedStyle2]} />
      <Animated.View style={[styles.dot, animatedStyle3]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3CA6',
    marginHorizontal: 2,
  },
});

export default TypingIndicator;
