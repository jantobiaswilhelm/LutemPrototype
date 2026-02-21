import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAuthStore } from '../authStore';

// Mock firebase
vi.mock('@/lib/firebase', () => ({
  auth: {},
  googleProvider: {},
}));

vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
  signOut: vi.fn().mockResolvedValue(undefined),
}));

// Mock config
vi.mock('@/lib/config', () => ({
  API_BASE: 'http://test-api',
}));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function jsonResponse(data: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: 'OK',
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  };
}

beforeEach(() => {
  mockFetch.mockReset();
  // Reset the store to initial state
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: '',
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('authStore', () => {
  describe('initial state', () => {
    it('starts unauthenticated', () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchCurrentUser', () => {
    it('sets user on successful /auth/me response', async () => {
      const user = {
        id: 1,
        displayName: 'Test User',
        email: 'test@example.com',
        authProvider: 'google',
      };
      mockFetch.mockResolvedValueOnce(jsonResponse(user));

      await useAuthStore.getState().fetchCurrentUser();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('clears auth on 401 response', async () => {
      // Start as authenticated
      useAuthStore.setState({
        user: { id: 1, displayName: 'Old', authProvider: 'google' } as never,
        isAuthenticated: true,
      });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      });

      await useAuthStore.getState().fetchCurrentUser();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('clears auth on network error', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await useAuthStore.getState().fetchCurrentUser();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('handleAuthCallback', () => {
    it('fetches user info and sets authenticated state', async () => {
      const user = {
        id: 2,
        displayName: 'Steam User',
        steamId: '12345',
        authProvider: 'steam',
      };
      mockFetch.mockResolvedValueOnce(jsonResponse(user));

      await useAuthStore.getState().handleAuthCallback();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('sets error on failed callback', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Invalid' }),
      });

      await useAuthStore.getState().handleAuthCallback();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('Failed to fetch user info');
    });
  });

  describe('logout', () => {
    it('clears auth state and calls backend logout', async () => {
      useAuthStore.setState({
        user: { id: 1, displayName: 'User', authProvider: 'google' } as never,
        isAuthenticated: true,
      });

      mockFetch.mockResolvedValueOnce(jsonResponse({ message: 'Logged out' }));

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api/auth/logout',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        })
      );
    });

    it('clears state even if backend logout fails', async () => {
      useAuthStore.setState({
        user: { id: 1, displayName: 'User', authProvider: 'steam' } as never,
        isAuthenticated: true,
      });

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('loginWithSteam', () => {
    it('redirects to Steam login URL', () => {
      // Mock window.location
      const originalLocation = window.location;
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { ...originalLocation, href: '' },
      });

      useAuthStore.getState().loginWithSteam();

      expect(window.location.href).toBe('http://test-api/auth/steam/login');

      // Restore
      Object.defineProperty(window, 'location', {
        writable: true,
        value: originalLocation,
      });
    });
  });

  describe('error management', () => {
    it('clearError resets error to null', () => {
      useAuthStore.setState({ error: 'Some error' });

      useAuthStore.getState().clearError();

      expect(useAuthStore.getState().error).toBeNull();
    });

    it('setError sets the error message', () => {
      useAuthStore.getState().setError('Test error');

      expect(useAuthStore.getState().error).toBe('Test error');
    });
  });
});
