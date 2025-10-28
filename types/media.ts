export interface MediaItem {
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
  reactions?: {
    laugh?: number;
    sad?: number;
  };
}