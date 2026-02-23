import { apiClient } from '@client/lib/api-client';
import { useAuthStore } from '@client/store/auth.store';
import type { ApiResponse, AuthResponse } from '@helpdesk/shared/interfaces';

export async function tryRefresh(): Promise<string | null> {
  try {
    const res =
      await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh');
    return res.data.data.accessToken ?? null;
  } catch {
    return null;
  }
}

export async function logoutAndRedirect(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    useAuthStore.getState().logout();
    window.location.href = '/auth/login';
  }
}
