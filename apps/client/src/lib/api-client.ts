import axios from 'axios';
import type { ApiResponse, AuthResponse } from '@helpdesk/shared/interfaces';
import { useAuthStore } from '@client/store/auth.store';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

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

const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';
    const isAuthRoute = AUTH_ROUTES.some((route) => requestUrl.includes(route));

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      try {
        const response =
          await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh');

        const { accessToken } = response.data.data;

        useAuthStore.getState().setAccessToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
