import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/Avatar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMe, getUserById, followUser, unfollowUser } from '@/services/usersService';
import { getUserMedia } from '@/services/mediaService';
import { User } from '../../types/user';
import { MediaItem } from '../../types/media';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();
  const userId = params.id as string || user?.id;

  const { data: profile, isLoading: isLoadingProfile } = useQuery<User>({
    queryKey: ['profile', userId],
    queryFn: () => userId === user?.id ? getMe() : getUserById(userId as string),
    enabled: !!userId,
    gcTime: 1000 * 60 * 10, // 10 minutes
    staleTime: 1000 * 30, // 30 seconds
  });

  const { data: media, isLoading: isLoadingMedia } = useQuery<MediaItem[]>({
    queryKey: ['userMedia', userId],
    queryFn: () => getUserMedia(userId as string),
    enabled: !!userId,
  });

    const followMutation = useMutation({
      mutationFn: (userId: string) => profile?.isFollowing ? unfollowUser(userId) : followUser(userId),
      onMutate: async (userId: string) => {
        await queryClient.cancelQueries({ queryKey: ['profile', userId] });
        const previousProfile = queryClient.getQueryData(['profile', userId]);
        queryClient.setQueryData(['profile', userId], (old: User | undefined) => ({
          ...old,
          isFollowing: !old?.isFollowing,
          followers: (old?.isFollowing ? (old?.followers ? old.followers - 1 : 0) : (old?.followers ? old.followers + 1 : 1))
        }));
        return { previousProfile };
      },
      onError: (error, variables, context) => {
        queryClient.setQueryData(['profile', variables], context?.previousProfile);
      },
      onSettled: (data, error, variables) => {
        queryClient.invalidateQueries({ queryKey: ['profile', variables] });
      },
    });
  
    const [activeTab, setActiveTab] = useState('media');
  
    const renderTabContent = () => {
      if (isLoadingMedia) return <ActivityIndicator />;
  
      switch (activeTab) {
        case 'media':
          return (
            <FlatList
              data={media}
              numColumns={3}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/media/[id]' as any, params: { id: item.id } })}> 
                  <ImageBackground source={{ uri: item.posterUrl }} style={styles.gridImage} />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          );
        case 'events':
          return <View style={styles.tabContent}><ThemedText>Events coming soon</ThemedText></View>;
        case 'about':
          return <View style={styles.tabContent}><ThemedText>{profile?.bio}</ThemedText></View>;
        default:
          return null;
      }
    };
  
    if (isLoadingProfile) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF2D95" />
          <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
        </View>
      );
    }
  
    if (!profile) {
      return (
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Profile not found.</ThemedText>
        </View>
      );
    }
  
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <ImageBackground source={{ uri: profile.bannerUrl }} style={styles.banner}>
              <LinearGradient
              colors={['transparent', '#0E0E0E']}
              style={styles.bannerGradient}
              />
              <View style={styles.headerContent}>
                  {profile.isVerified ? (
                      <LinearGradient
                          colors={['#FF3CA6', '#8A2BE2']}
                          style={styles.avatarBorder}
                      >
                          <Avatar uri={profile.avatarUrl} size={94} />
                      </LinearGradient>
                  ) : (
                      <Avatar uri={profile.avatarUrl} size={100} />
                  )}
                  <ThemedText style={styles.username}>@{profile.username}</ThemedText>
                  <ThemedText style={styles.name}>{profile.name}</ThemedText>
  
                  <View style={styles.statsContainer}>
                      <View style={styles.statItem}>
                          <ThemedText style={styles.statNumber}>{profile.followers}</ThemedText>
                          <ThemedText style={styles.statLabel}>Followers</ThemedText>
                      </View>
                      <View style={styles.statItem}>
                          <ThemedText style={styles.statNumber}>{profile.following}</ThemedText>
                          <ThemedText style={styles.statLabel}>Following</ThemedText>
                      </View>
                  </View>
  
                  <View style={styles.actionButtons}>
                      {user?.id === userId ? (
                      <TouchableOpacity style={styles.editProfileButton} onPress={() => console.log('Edit Profile')}>
                          <ThemedText style={styles.editProfileButtonText}>Edit Profile</ThemedText>
                      </TouchableOpacity>
                      ) : (
                      <TouchableOpacity
                          style={[styles.followButton, profile.isFollowing && styles.followingButton]}
                          onPress={() => followMutation.mutate(userId as string)}
                      >
                          <ThemedText style={styles.followButtonText}>
                          {profile.isFollowing ? 'Following' : 'Follow'}
                          </ThemedText>
                      </TouchableOpacity>
                      )}
                      {profile.isHost && (
                      <TouchableOpacity style={styles.createEventButton} onPress={() => router.push({ pathname: '/(tabs)/create-event' as any })}> 
                          <Ionicons name="add-circle" size={20} color="white" />
                          <ThemedText style={styles.createEventButtonText}>Create Event</ThemedText>
                      </TouchableOpacity>
                      )}
                  </View>
              </View>
          </ImageBackground>
          <View style={styles.profileContent}>
              <View style={styles.tabsContainer}>
                  <TouchableOpacity style={[styles.tab, activeTab === 'media' && styles.activeTab]} onPress={() => setActiveTab('media')}>
                  <ThemedText style={[styles.tabText, activeTab === 'media' && styles.activeTabText]}>Media</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.tab, activeTab === 'events' && styles.activeTab]} onPress={() => setActiveTab('events')}>
                  <ThemedText style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>Events</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.tab, activeTab === 'about' && styles.activeTab]} onPress={() => setActiveTab('about')}>
                  <ThemedText style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>About</ThemedText>
                  </TouchableOpacity>
              </View>
  
              {renderTabContent()}
          </View>
      </ScrollView>
    );
  }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E0E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0E0E0E',
  },
  loadingText: {
    marginTop: 10,
    color: '#A0A0A0',
  },
  banner: {
    width: '100%',
    height: 300,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bannerGradient: {
    ...StyleSheet.absoluteFillObject,
    top: '50%',
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarBorder: {
    borderRadius: 50,
    padding: 3,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  name: {
    fontSize: 16,
    color: '#A0A0A0',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '80%',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3CA6',
  },
  statLabel: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  editProfileButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  editProfileButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  followButton: {
    backgroundColor: '#FF3CA6',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  followingButton: {
    backgroundColor: '#A0A0A0',
  },
  followButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  createEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00D1FF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  createEventButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  profileContent: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#FF3CA6',
    margin: 16,
    borderRadius: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tab: {
    paddingVertical: 15,
    width: width / 3,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF3CA6',
  },
  tabText: {
    color: '#A0A0A0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: 'white',
  },
  tabContent: {
    padding: 20,
  },
  gridImage: {
    width: width / 3 - 12,
    height: width / 3 - 12,
    margin: 1,
  },
});