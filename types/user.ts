export interface User {
  id: string;
  bannerUrl?: string;
  isVerified: boolean;
  avatarUrl: string;
  username: string;
  name: string;
  followers: number;
  following: number;
  isFollowing: boolean;
  isHost: boolean;
  bio?: string;
}
