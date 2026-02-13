import type { JwtPayload, Role } from '@helpdesk/shared/interfaces';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  // Actions
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,

      setAccessToken: (token: string) => {
        try {
          const decoded = jwtDecode<JwtPayload>(token);

          set({
            accessToken: token,
            isAuthenticated: true,
            user: {
              id: decoded.sub,
              email: decoded.email,
              role: decoded.role,
            },
          });
        } catch (error) {
          console.error('Token decode failed:', error);
          set({ accessToken: null, user: null, isAuthenticated: false });
        }
      },

      logout: () => {
        set({ accessToken: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);
