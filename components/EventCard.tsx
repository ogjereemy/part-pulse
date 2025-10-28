
import React from 'react';
import { View, StyleSheet, ImageSourcePropType, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { colors } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    imageUrl: ImageSourcePropType;
    isLive?: boolean;
    category?: string;
  };
  onPress?: (eventId: string) => void;
}

export function EventCard({ event, onPress }: EventCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(event.id)} activeOpacity={0.8}>
      <Image source={event.imageUrl} style={styles.image} />
      <View style={styles.infoContainer}>
        <ThemedText style={styles.title}>{event.title}</ThemedText>
        <View style={styles.detailsRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.muted} />
          <ThemedText style={styles.detailText}>{event.date}</ThemedText>
        </View>
        <View style={styles.detailsRow}>
          <Ionicons name="location-outline" size={14} color={colors.muted} />
          <ThemedText style={styles.detailText}>{event.location}</ThemedText>
        </View>
        {event.category && (
          <View style={styles.categoryContainer}>
            <ThemedText style={styles.categoryText}>#{event.category}</ThemedText>
          </View>
        )}
        {event.isLive && (
          <View style={styles.liveBadge}>
            <ThemedText style={styles.liveBadgeText}>LIVE</ThemedText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors['surface-800'],
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 5,
    shadowColor: colors['bg-900'],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  detailText: {
    fontSize: 14,
    color: colors.muted,
    marginLeft: 5,
  },
  categoryContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  categoryText: {
    fontSize: 12,
    color: colors['neon-3'],
  },
  liveBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.danger,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  liveBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
