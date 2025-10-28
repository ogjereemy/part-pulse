
import api from '@/lib/api';

export const getMe = async () => {
  const res = await api.get('/users/me');
  return res.data;
};

export const getUserById = async (userId: string) => {
  const res = await api.get(`/users/${userId}`);
  return res.data;
};

export const followUser = async (userId: string) => {
  const res = await api.post(`/users/${userId}/follow`);
  return res.data;
};

export const unfollowUser = async (userId: string) => {
  const res = await api.delete(`/users/${userId}/follow`);
  return res.data;
};
