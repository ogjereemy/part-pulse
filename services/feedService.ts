
import api from '@/lib/api';

export interface FeedItem {
  id: string;
  videoUrl: string;
  posterUrl?: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  event?: {
    id: string;
    name: string;
    is_live: boolean;
    tag?: string;
  };
}

export interface FeedPage {
  data: FeedItem[];
  nextCursor?: string;
}

export const getHomeFeed = async ({ cursor, limit = 10 }: { cursor?: string, limit?: number }): Promise<FeedPage> => {
  try {
    const response = await api.get('/feed/home', {
      params: { cursor, limit },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching home feed:', error);
    throw new Error(error.message || 'Failed to fetch home feed');
  }
};
