
import api from '@/lib/api';

export const getEventById = async (eventId: string) => {
  const res = await api.get(`/events/${eventId}`);
  return res.data;
};

export const getEventMedia = async (eventId: string) => {
  const res = await api.get(`/events/${eventId}/media`);
  return res.data;
};

export const rsvpToEvent = async (eventId: string) => {
  const res = await api.post(`/events/${eventId}/rsvps`);
  return res.data;
};

export const goLive = async (eventId: string) => {
  const res = await api.post(`/events/${eventId}/live`);
  return res.data;
};
