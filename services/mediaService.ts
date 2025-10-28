import api from '@/lib/api';

export const likeMedia = async (mediaId: string) => {
  const res = await api.post(`/media/${mediaId}/like`);
  return res.data;
};

export const reactToMedia = async (mediaId: string, reaction: string) => {
  const res = await api.post(`/media/${mediaId}/react`, { reaction });
  return res.data;
};

export const getSignedUrl = async ({ eventId }: { eventId?: string }) => {
  const res = await api.post('/media/upload', { eventId });
  return res.data;
};

export const createMedia = async ({ storage_key, type, event_id }: { storage_key: string, type: string, event_id?: string }) => {
  const res = await api.post('/media', { storage_key, type, event_id });
  return res.data;
};

export const getUserMedia = async (uploaderId: string) => {
  const res = await api.get('/media', { params: { uploaderId } });
  return res.data;
};