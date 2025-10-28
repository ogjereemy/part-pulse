
import api from '@/lib/api';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export const getNotifications = async () => {
  const res = await api.get('/notifications');
  return res.data;
};

export const markNotificationsAsRead = async (notificationIds: string[]) => {
  const res = await api.post('/notifications/mark-read', { ids: notificationIds });
  return res.data;
};

export const registerForPushNotifications = async (userId: string) => {
  try {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return { success: false, message: 'Permission not granted' };
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo push token:', token);

      // const response = await api.post('/notifications/register-token', { userId, token });
      // return response.data;

      return { success: true, token, message: 'Token registered (simulated)' };
    } else {
      console.log('Must use physical device for Push Notifications');
      return { success: false, message: 'Not on physical device' };
    }
  } catch (error: any) {
    console.error('Error registering for push notifications:', error);
    return { success: false, message: error.message || 'Failed to register for push notifications' };
  }
};
