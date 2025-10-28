
import AsyncStorage from '@react-native-async-storage/async-storage';

const UPLOAD_QUEUE_KEY = 'uploadQueue';

export interface QueuedUpload {
  id: string;
  videoUri: string;
  caption: string;
}

export const getUploadQueue = async (): Promise<QueuedUpload[]> => {
  try {
    const queue = await AsyncStorage.getItem(UPLOAD_QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch (error) {
    console.error('Error getting upload queue:', error);
    return [];
  }
};

export const addToUploadQueue = async (item: QueuedUpload) => {
  try {
    const queue = await getUploadQueue();
    queue.push(item);
    await AsyncStorage.setItem(UPLOAD_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Error adding to upload queue:', error);
  }
};

export const removeFromUploadQueue = async (id: string) => {
  try {
    const queue = await getUploadQueue();
    const newQueue = queue.filter((item) => item.id !== id);
    await AsyncStorage.setItem(UPLOAD_QUEUE_KEY, JSON.stringify(newQueue));
  } catch (error) {
    console.error('Error removing from upload queue:', error);
  }
};

export const clearUploadQueue = async () => {
  try {
    await AsyncStorage.removeItem(UPLOAD_QUEUE_KEY);
  } catch (error) {
    console.error('Error clearing upload queue:', error);
  }
};
