/**
 * Auth Store - Cookie-based authentication for Steam + Google login
 *
 * Flow:
 * - Steam: Redirect to backend /auth/steam/login → Steam → callback → httpOnly cookie set
 * - Google: Firebase popup → get idToken → send to backend → httpOnly cookie set
 * - Cookie sent automatically with credentials: 'include'
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { API_BASE } from '@/lib/config';
import { getCsrfToken, captureCsrfToken } from '@/api/csrf';

export interface LutemUser {
  id: number;
  displayName: string;
  email?: string;
  steamId?: string;
  googleId?: string;
  avatarUrl?: string;
  authProvider: 'steam' | 'google';
  createdAt?: string;
  lastLoginAt?: string;
}

interface AuthState {
  user: LutemUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  loginWithSteam: () => void;
  loginWithGoogle: () => Promise<void>;
  handleAuthCallback: () => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
  setError: (error: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Initiate Steam OpenID login
       * Redirects to backend which redirects to Steam
       */
      loginWithSteam: () => {
        // Redirect to Steam login
        window.location.href = `${API_BASE}/auth/steam/login`;
      },

      /**
       * Login with Google via Firebase
       * Gets Firebase idToken and exchanges it for our JWT (set as httpOnly cookie)
       */
      loginWithGoogle: async () => {
        try {
          set({ error: null, isLoading: true });

          const result = await signInWithPopup(auth, googleProvider);
          const idToken = await result.user.getIdToken();

          // Exchange Firebase token for our JWT (backend sets httpOnly cookie)
          const response = await fetch(`${API_BASE}/auth/google/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              idToken,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL
            })
          });
          captureCsrfToken(response);

          if (!response.ok) {
            throw new Error('Failed to authenticate with server');
          }

          const data = await response.json();

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Google login failed';
          console.error('Google login failed:', error);
          set({ error: message, isLoading: false });
        }
      },

      /**
       * Handle auth callback — validate session via cookie
       * Used after Steam redirect (cookie already set by backend)
       */
      handleAuthCallback: async () => {
        try {
          set({ isLoading: true, error: null });

          // Cookie was set by backend, just fetch user info
          const response = await fetch(`${API_BASE}/auth/me`, {
            credentials: 'include'
          });
          captureCsrfToken(response);

          if (!response.ok) {
            throw new Error('Failed to fetch user info');
          }

          const user = await response.json();

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Authentication failed';
          console.error('Auth callback failed:', error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: message
          });
        }
      },

      /**
       * Logout - clear local state and call backend to clear cookie
       */
      logout: async () => {
        try {
          // Clear Firebase auth state
          await firebaseSignOut(auth).catch(() => {});

          // Call backend logout (clears httpOnly cookie)
          const csrfToken = getCsrfToken();
          await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}
          }).catch(() => {});

        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      },

      /**
       * Fetch current user (validates session cookie)
       */
      fetchCurrentUser: async () => {
        try {
          set({ isLoading: true });

          const response = await fetch(`${API_BASE}/auth/me`, {
            credentials: 'include'
          });
          captureCsrfToken(response);

          if (!response.ok) {
            // Cookie invalid/expired
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false
            });
            return;
          }

          const user = await response.json();
          set({
            user,
            isAuthenticated: true,
            isLoading: false
          });

        } catch {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      },

      clearError: () => set({ error: null }),
      setError: (error: string) => set({ error }),
    }),
    {
      name: 'lutem-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Re-export for backwards compatibility with Firebase-based components
export type { LutemUser as User };
