import { ImageSourcePropType } from 'react-native';

export interface Host {
  avatarUrl: string;
  username: string;
}

export interface Event {
  id: string;
  is_live: boolean;
  heroImageUrl: string;
  title: string;
  host: Host;
  description: string;
  date: string;
  time: string;
  location: string;
  lat: number;
  lng: number;
  tags: string[];
  attendeesCount: number;
  isHost: boolean;
  imageUrl: ImageSourcePropType;
}
