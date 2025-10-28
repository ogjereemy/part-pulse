
import api from '@/lib/api';

export const getHotspots = async ({ centerLat, centerLng, zoom }: { centerLat: number, centerLng: number, zoom: number }) => {
  const res = await api.get('/map/hotspots', { params: { center_lat: centerLat, center_lng: centerLng, zoom } });
  return res.data;
};

export const getFriendsOnMap = async ({ centerLat, centerLng, radius }: { centerLat: number, centerLng: number, radius: number }) => {
  const res = await api.get('/map/friends', { params: { center_lat: centerLat, center_lng: centerLng, radius } });
  return res.data;
};

export const getEventsNearby = async ({ lat, lng, radius }: { lat: number, lng: number, radius: number }) => {
  const res = await api.get('/map/events-nearby', { params: { lat, lng, radius } });
  return res.data;
};
