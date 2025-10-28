
import api from '@/lib/api';

export const getSuggestions = async (query: string, lat?: number, lng?: number) => {
  const res = await api.get('/search/suggestions', { params: { q: query, lat, lng } });
  return res.data;
};

export const search = async (query: string, lat?: number, lng?: number, types?: string) => {
  const res = await api.get('/search', { params: { q: query, lat, lng, types } });
  return res.data;
};
