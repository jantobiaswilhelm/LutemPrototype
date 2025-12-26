/**
 * Auth API client
 */
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    displayName: string;
    email?: string;
    steamId?: string;
    googleId?: string;
    avatarUrl?: string;
    authProvider: 'steam' | 'google';
  };
}

/**
 * Exchange Firebase token for our JWT
 */
export async function loginWithGoogle(params: {
  idToken: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/google/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Login failed' }));
    throw new Error(error.error || 'Login failed');
  }
  
  return response.json();
}

/**
 * Get current user info
 */
export async function getCurrentUser(token: string) {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) {
    throw new Error('Not authenticated');
  }
  
  return response.json();
}

/**
 * Logout
 */
export async function logout(token: string) {
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
