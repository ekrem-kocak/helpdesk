import axios from 'axios';
import type { ApiResponse, AuthResponse } from '@helpdesk/shared/interfaces';
import { useAuthStore } from './store/auth.store';

// ============================================
// AXIOS INSTANCE
// ============================================

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ============================================
// REQUEST INTERCEPTOR (Add token to every request)
// ============================================

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ============================================
// RESPONSE INTERCEPTOR (401 Capture and Refresh)
// ============================================

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Prevent infinite loop by using pure axios
        const response =
          await axios.post<ApiResponse<AuthResponse>>('/api/auth/refresh');

        const { accessToken } = response.data.data;

        useAuthStore.getState().setAccessToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Session expired:', refreshError);
        useAuthStore.getState().logout();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
