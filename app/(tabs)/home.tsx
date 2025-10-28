import React, { useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import { VideoCard } from '../../components/VideoCard';
import { useInfiniteReels } from '../../hooks/useInfiniteReels';
import { ThemedText } from '../../components/themed-text';

const { height: screenHeight } = Dimensions.get('window');

const viewabilityConfig = {
  itemVisiblePercentThreshold: 50,
};

export default function HomeScreen() {
  const { 
    feedItems, 
    currentIndex, 
    isLoading, 
    error, 
    onEndReached, 
    onViewableItemsChanged, 
    isFetchingNextPage 
  } = useInfiniteReels();

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <VideoCard media={item} shouldPlay={index === currentIndex} />
    ),
    [currentIndex]
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF2D95" />
        <ThemedText style={styles.loadingText}>Loading your feed...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedText style={styles.errorText}>Failed to load feed.</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={feedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_data, index) => ({
          length: screenHeight,
          offset: screenHeight * index,
          index,
        })}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="large" color="#FF2D95" style={{ marginVertical: 20 }} /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    marginTop: 10,
    color: '#9CA3AF',
  },
  errorText: {
    marginTop: 10,
    color: '#FF5A5F',
  },
});