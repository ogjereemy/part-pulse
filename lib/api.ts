
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { supabase } from './supabase';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://[::1]:4000/api'; // Replace with your backend API base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('supabase.auth.token'); // Assuming token is stored here
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          throw refreshError;
        }
        const newToken = data.session?.access_token;
        if (newToken) {
          await SecureStore.setItemAsync('supabase.auth.token', newToken);
          api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Redirect to login
        // router.replace('/auth'); // Assuming you have access to router
      }
    }
    // Centralized error handling
    const errorMessage = error.response?.data?.message || error.message;
    console.error('API Error:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
