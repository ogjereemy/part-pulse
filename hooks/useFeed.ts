
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';

// Simulate an API call to fetch feed data
const fetchFeedPage = async ({ pageParam = 0, userId }: { pageParam?: number; userId: string }) => {
  console.log(`Fetching feed for user ${userId}, page: ${pageParam}`);
  // In a real application, this would be an API call, e.g.:
  // const response = await api.get(`/feed/home?cursor=${pageParam}&userId=${userId}`);
  // return response.data;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const itemsPerPage = 5;
  const allItems = Array.from({ length: 20 }, (_, i) => ({
    id: `media-${i + 1}`,
    videoUrl: `https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4`,
    posterUrl: `https://picsum.photos/seed/${i}/700/1000`,
    description: `This is video ${i + 1} for user ${userId}`,
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    shares: Math.floor(Math.random() * 50),
    isLiked: i % 2 === 0,
    user: {
      id: `user-${i}`,
      username: `user${i}`,
      avatarUrl: `https://i.pravatar.cc/150?img=${i}`,
    },
    event: {
      id: `event-${i}`,
      name: `Event ${i}`,
      is_live: i === 0 || i === 5,
      tag: i % 3 === 0 ? 'music' : i % 3 === 1 ? 'party' : 'art',
    },
  }));

  const start = pageParam * itemsPerPage;
  const end = start + itemsPerPage;
  const data = allItems.slice(start, end);

  return {
    data,
    nextCursor: end < allItems.length ? pageParam + 1 : undefined,
  };
};

export function useFeed(userId: string) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, refetch } = useInfiniteQuery(
    {
      queryKey: ['feed', userId],
      queryFn: ({ pageParam }) => fetchFeedPage({ pageParam, userId }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const feedItems = data?.pages.flatMap(page => page.data) || [];

  // Placeholder for socket event handling to prepend new media
  // useEffect(() => {
  //   const handleNewMedia = (newMedia: any) => {
  //     // Logic to prepend newMedia to feedItems if uploader is followed
  //   };
  //   socket.on('media:created', handleNewMedia);
  //   return () => socket.off('media:created', handleNewMedia);
  // }, [userId]);

  // Placeholder for invalidating query on follow/unfollow
  // const invalidateFeed = () => refetch();

  return {
    feedItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  };
}
