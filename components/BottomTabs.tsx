
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Fab } from './Fab';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '@/services/notificationsService';

export function BottomTabs({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { data: notifications } = useQuery({ queryKey: ['notifications'], queryFn: getNotifications });

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  return (
    <BlurView intensity={20} tint="dark" style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientOverlay}
      />
      <View style={styles.tabBarContent}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const getIconName = (routeName: string, focused: boolean) => {
            switch (routeName) {
              case 'home':
                return focused ? 'home' : 'home-outline';
              case 'discover':
                return focused ? 'compass' : 'compass-outline';
              case 'messages':
                return focused ? 'chatbubbles' : 'chatbubbles-outline';
              case 'profile':
                return focused ? 'person' : 'person-outline';
              default:
                return 'help-circle';
            }
          };

          if (route.name === 'camera') {
            return (
              <Fab key={route.key} onPress={onPress} />
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}

              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              <View>
                <Ionicons
                  name={getIconName(route.name, isFocused)}
                  size={28}
                  color={isFocused ? '#FF2D95' : '#9CA3AF'}
                />
                {route.name === 'messages' && unreadCount > 0 && (
                  <View style={styles.badge}>
                    <ThemedText style={styles.badgeText}>{unreadCount}</ThemedText>
                  </View>
                )}
              </View>
              {options.tabBarLabel && typeof options.tabBarLabel === 'string' && (
                <ThemedText style={{ color: isFocused ? '#FF2D95' : '#9CA3AF', fontSize: 12 }}>
                  {options.tabBarLabel}
                </ThemedText>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    marginHorizontal: 10,
    marginBottom: 5,
  },
  tabBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 20,
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: '#FF5A5F',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
