
import api from '@/lib/api';

export const report = async (type: 'user' | 'media' | 'event', id: string, reason: string, comments?: string) => {
  const res = await api.post('/report', { type, id, reason, comments });
  return res.data;
};
