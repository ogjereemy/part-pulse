
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { getUploadQueue, removeFromUploadQueue } from '@/services/offlineService';
import { getSignedUrl, createMedia } from '@/services/mediaService';

const UPLOAD_TASK_NAME = 'upload-task';

TaskManager.defineTask(UPLOAD_TASK_NAME, async () => {
  const queue = await getUploadQueue();
  if (queue.length === 0) {
    return BackgroundFetch.BackgroundFetchResult.NoData;
  }

  for (const item of queue) {
    try {
      const { url, key } = await getSignedUrl({});
      const response = await fetch(item.videoUri);
      const blob = await response.blob();
      await fetch(url, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': blob.type,
        },
      });
      await createMedia({ storage_key: key, type: 'video' });
      await removeFromUploadQueue(item.id);
    } catch (error) {
      console.error('Failed to upload item from queue:', error);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  }

  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export const registerUploadTask = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(UPLOAD_TASK_NAME, {
      minimumInterval: 60 * 15, // 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log('Upload task registered');
  } catch (error) {
    console.error('Failed to register upload task:', error);
  }
};
