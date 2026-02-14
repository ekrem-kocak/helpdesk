import axios from 'axios';
import type { ApiResponse, AuthResponse } from '@helpdesk/shared/interfaces';
import { useAuthStore } from '../store/auth.store';

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

// Auth endpoints that should NOT trigger token refresh
const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/refresh'];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';

    // Skip refresh logic for auth endpoints
    const isAuthRoute = AUTH_ROUTES.some((route) => requestUrl.includes(route));

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
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
