/**
 * Auth Store - JWT-based authentication for Steam + Google login
 * 
 * Flow:
 * - Steam: Redirect to backend /auth/steam/login → Steam → callback → JWT in URL
 * - Google: Firebase popup → get idToken → send to backend → JWT
 * - Token stored in localStorage and sent as Bearer header
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loginWithSteam: () => void;
  loginWithGoogle: () => Promise<void>;
  handleAuthCallback: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
  setError: (error: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Initiate Steam OpenID login
       * Redirects to backend which redirects to Steam
       */
      loginWithSteam: () => {
        console.log('🎮 Initiating Steam login...');
        window.location.href = `${API_URL}/auth/steam/login`;
      },

      /**
       * Login with Google via Firebase
       * Gets Firebase idToken and exchanges it for our JWT
       */
      loginWithGoogle: async () => {
        try {
          set({ error: null, isLoading: true });
          console.log('🔵 Initiating Google login...');
          
          const result = await signInWithPopup(auth, googleProvider);
          const idToken = await result.user.getIdToken();
          
          console.log('📧 Firebase auth successful:', result.user.email);
          
          // Exchange Firebase token for our JWT
          const response = await fetch(`${API_URL}/auth/google/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              idToken,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL
            })
          });
          
          if (!response.ok) {
            throw new Error('Failed to authenticate with server');
          }
          
          const data = await response.json();
          await get().handleAuthCallback(data.token);
          
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Google login failed';
          console.error('❌ Google login failed:', error);
          set({ error: message, isLoading: false });
        }
      },

      /**
       * Handle auth callback - save token and fetch user
       */
      handleAuthCallback: async (token: string) => {
        try {
          set({ token, isLoading: true, error: null });
          console.log('🔑 Token received, fetching user...');
          
          // Fetch user info
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch user info');
          }
          
          const user = await response.json();
          console.log('✅ User authenticated:', user.displayName);
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Authentication failed';
          console.error('❌ Auth callback failed:', error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: message
          });
        }
      },

      /**
       * Logout - clear local state and call backend
       */
      logout: async () => {
        try {
          const { token } = get();
          console.log('👋 Logging out...');
          
          // Clear Firebase auth state
          await firebaseSignOut(auth).catch(() => {});
          
          // Call backend logout
          if (token) {
            await fetch(`${API_URL}/auth/logout`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
            }).catch(() => {});
          }
          
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
          console.log('✅ Logged out');
        }
      },

      /**
       * Fetch current user (used to validate stored token)
       */
      fetchCurrentUser: async () => {
        const { token } = get();
        if (!token) {
          set({ isLoading: false });
          return;
        }
        
        try {
          set({ isLoading: true });
          
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (!response.ok) {
            // Token invalid/expired
            set({
              user: null,
              token: null,
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
            token: null,
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
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Re-export for backwards compatibility with Firebase-based components
export type { LutemUser as User };
