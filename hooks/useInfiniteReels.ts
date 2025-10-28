import { useState, useCallback, useMemo, useEffect } from 'react';
import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { getHomeFeed, FeedItem, FeedPage } from '@/services/feedService';
import { useVideoPreload } from './useVideoPreload';
import { ViewToken } from 'react-native';

import { useSocket } from './useSocket';
import { useQueryClient } from '@tanstack/react-query';

import { SOCKET_URL } from '@/lib/socket';

export function useInfiniteReels(preloadCount: number = 2) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const queryClient = useQueryClient();
  const { on } = useSocket(SOCKET_URL);

  useEffect(() => {
    on('media:created', (newMedia: FeedItem) => {
      queryClient.setQueryData(['feed', 'home'], (oldData: any) => {
        if (!oldData) return oldData;
        const newData = { ...oldData };
        newData.pages[0].data.unshift(newMedia);
        return newData;
      });
    });
  }, [on, queryClient]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<FeedPage, Error, InfiniteData<FeedPage, string[]>, string[], string | undefined>({
    queryKey: ['feed', 'home'],
    queryFn: async ({ pageParam }) => getHomeFeed({ cursor: pageParam as string | undefined }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined
  });

  const feedItems = useMemo(() => data?.pages.flatMap((page: FeedPage) => page.data) ?? [], [data]);

  const onEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      if (newIndex !== null && newIndex !== undefined) {
        setCurrentIndex(newIndex);
      }
    }
  }, []);

  // Preload videos around the current index
  const videosToPreload = useMemo(() => {
    const urls: string[] = [];
    if (feedItems.length > 0) {
      for (let i = -preloadCount; i <= preloadCount; i++) {
        const indexToPreload = currentIndex + i;
        if (indexToPreload >= 0 && indexToPreload < feedItems.length) {
          const item = feedItems[indexToPreload];
          if (item?.videoUrl) {
            urls.push(item.videoUrl);
          }
        }
      }
    }
    return urls;
  }, [currentIndex, feedItems, preloadCount]);

  useVideoPreload(videosToPreload);

  return {
    feedItems,
    currentIndex,
    isLoading,
    error,
    onEndReached,
    onViewableItemsChanged,
    isFetchingNextPage,
    refetch: () => {}, // Placeholder for now
  };
}