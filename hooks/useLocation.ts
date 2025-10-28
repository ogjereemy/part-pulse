
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { useSocket } from './useSocket';

import { SOCKET_URL } from '@/lib/socket';

export function useLocation({ shouldTrack }: { shouldTrack: boolean }) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { emit } = useSocket(SOCKET_URL);

  useEffect(() => {
    let subscriber: Location.LocationSubscription | undefined;

    const startTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // 10 seconds
          distanceInterval: 10, // 10 meters
        },
        (newLocation) => {
          setLocation(newLocation);
          emit('presence:update', { lat: newLocation.coords.latitude, lng: newLocation.coords.longitude });
        }
      );
    };

    if (shouldTrack) {
      startTracking();
    }

    return () => {
      if (subscriber) {
        subscriber.remove();
      }
    };
  }, [shouldTrack, emit]);

  return { location, errorMsg };
}
