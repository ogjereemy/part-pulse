
import api from '@/lib/api';

export const getConversations = async () => {
  const res = await api.get('/rooms');
  return res.data;
};

export const createRoom = async (userIds: string[]) => {
  const res = await api.post('/rooms', { userIds });
  return res.data;
};

export const joinRoom = async (roomId: string) => {
  const res = await api.post(`/rooms/${roomId}/join`);
  return res.data;
};

export const getMessages = async (roomId: string) => {
  const res = await api.get(`/rooms/${roomId}/messages`);
  return res.data;
};
