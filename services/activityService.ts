
import api from '@/lib/api';

export const getFriendsActivity = async () => {
  const res = await api.get('/activity/friends');
  return res.data;
};
