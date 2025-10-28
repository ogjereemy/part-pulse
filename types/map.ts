export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Hotspot {
  id: string | number;
  coordinate: Coordinate;
  count: number;
}

export interface Friend {
  id: string | number;
  coordinate: Coordinate;
  avatarUrl: string;
}
