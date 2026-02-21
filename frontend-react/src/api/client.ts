import type { Game, RecommendationRequest, RecommendationResponse, SessionFeedback, SessionHistory, UserSummary, FriendRequest, Friendship, CalendarEvent, CalendarInvitation, CreateEventRequest, EventParticipant } from '@/types';

import { API_BASE } from '@/lib/config';

// Configuration for retry logic
const DEFAULT_RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

// Custom error class for API errors
export class ApiError extends Error {
  status: number;
  statusText: string;
  body?: string;

  constructor(status: number, statusText: string, body?: string) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }

  get isRetryable(): boolean {
    // Retry on network errors, 429 (rate limit), and 5xx server errors
    return this.status === 0 || this.status === 429 || this.status >= 500;
  }
}

// Calculate delay with exponential backoff and jitter
function calculateRetryDelay(attempt: number, config = DEFAULT_RETRY_CONFIG): number {
  const exponentialDelay = config.baseDelayMs * Math.pow(2, attempt);
  const jitter = Math.random() * 0.3 * exponentialDelay; // 30% jitter
  return Math.min(exponentialDelay + jitter, config.maxDelayMs);
}

// Sleep helper
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Read CSRF token from cookie (set by backend as non-httpOnly)
function getCsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

interface FetchOptions extends RequestInit {
  retries?: number;
  skipRetry?: boolean;
}

async function fetchApi<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  const { retries = DEFAULT_RETRY_CONFIG.maxRetries, skipRetry = false, ...fetchOptions } = options || {};

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = calculateRetryDelay(attempt - 1);
        console.log(`[API] Retry attempt ${attempt}/${retries} after ${Math.round(delay)}ms`);
        await sleep(delay);
      }

      // Attach CSRF token on mutating requests
      const method = (fetchOptions?.method || 'GET').toUpperCase();
      const csrfHeaders: Record<string, string> = {};
      if (method !== 'GET' && method !== 'HEAD') {
        const csrfToken = getCsrfToken();
        if (csrfToken) {
          csrfHeaders['X-XSRF-TOKEN'] = csrfToken;
        }
      }

      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...fetchOptions,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...csrfHeaders,
          ...fetchOptions?.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        const error = new ApiError(response.status, response.statusText, errorText);

        // Don't retry if skipRetry is true or error is not retryable
        if (skipRetry || !error.isRetryable || attempt >= retries) {
          throw error;
        }

        lastError = error;
        continue;
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return undefined as T;
      }

      const data = await response.json();
      return data;

    } catch (error) {
      // Network error (fetch failed)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const networkError = new ApiError(0, 'Network Error', 'Failed to connect to server');
        if (skipRetry || attempt >= retries) {
          throw networkError;
        }
        lastError = networkError;
        continue;
      }

      // Re-throw ApiError and other errors
      throw error;
    }
  }

  throw lastError || new Error('Request failed after retries');
}

// Games API
export const gamesApi = {
  getAll: () => fetchApi<Game[]>('/games'),
  getById: (id: number) => fetchApi<Game>(`/games/${id}`),
};

// Recommendations API
export const recommendationsApi = {
  getRecommendation: (request: RecommendationRequest) =>
    fetchApi<RecommendationResponse>('/recommendations', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
};

// Feedback API
export const feedbackApi = {
  submitFeedback: (feedback: SessionFeedback) =>
    fetchApi<void>('/sessions/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback),
    }),
};

// Sessions API
export const sessionsApi = {
  getHistory: (limit = 20) =>
    fetchApi<SessionHistory[]>(`/sessions/history?limit=${limit}`),
};

// Friends API
export const friendsApi = {
  getFriends: () =>
    fetchApi<UserSummary[]>('/friends'),

  getIncomingRequests: () =>
    fetchApi<FriendRequest[]>('/friends/requests'),

  getOutgoingRequests: () =>
    fetchApi<FriendRequest[]>('/friends/requests/sent'),

  searchUsers: (query: string) =>
    fetchApi<UserSummary[]>(`/friends/search?q=${encodeURIComponent(query)}`),

  sendRequest: (userId: number) =>
    fetchApi<Friendship>(`/friends/request/${userId}`, { method: 'POST' }),

  acceptRequest: (requesterId: number) =>
    fetchApi<Friendship>(`/friends/accept/${requesterId}`, { method: 'POST' }),

  declineRequest: (requesterId: number) =>
    fetchApi<void>(`/friends/decline/${requesterId}`, { method: 'POST' }),

  removeFriend: (friendId: number) =>
    fetchApi<void>(`/friends/${friendId}`, { method: 'DELETE' }),

  cancelRequest: (addresseeId: number) =>
    fetchApi<void>(`/friends/request/${addresseeId}`, { method: 'DELETE' }),
};

// Calendar API
export const calendarApi = {
  getEvents: (start?: string, end?: string, friendsOnly = false) => {
    const params = new URLSearchParams();
    if (start) params.set('start', start);
    if (end) params.set('end', end);
    if (friendsOnly) params.set('friendsOnly', 'true');
    const query = params.toString();
    return fetchApi<CalendarEvent[]>(`/calendar/events${query ? `?${query}` : ''}`);
  },

  getMyEvents: (start?: string, end?: string) => {
    const params = new URLSearchParams();
    if (start) params.set('start', start);
    if (end) params.set('end', end);
    const query = params.toString();
    return fetchApi<CalendarEvent[]>(`/calendar/events/mine${query ? `?${query}` : ''}`);
  },

  getEvent: (id: number) =>
    fetchApi<CalendarEvent>(`/calendar/events/${id}`),

  createEvent: (event: CreateEventRequest) =>
    fetchApi<CalendarEvent>('/calendar/events', {
      method: 'POST',
      body: JSON.stringify(event),
    }),

  updateEvent: (id: number, event: Partial<CreateEventRequest>) =>
    fetchApi<CalendarEvent>(`/calendar/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
    }),

  deleteEvent: (id: number) =>
    fetchApi<void>(`/calendar/events/${id}`, { method: 'DELETE' }),

  joinEvent: (id: number) =>
    fetchApi<{ message: string; participant: EventParticipant }>(`/calendar/events/${id}/join`, {
      method: 'POST',
    }),

  leaveEvent: (id: number) =>
    fetchApi<{ message: string }>(`/calendar/events/${id}/leave`, { method: 'POST' }),

  getParticipants: (id: number) =>
    fetchApi<EventParticipant[]>(`/calendar/events/${id}/participants`),

  getInvitations: () =>
    fetchApi<CalendarInvitation[]>('/calendar/invitations'),

  respondToInvitation: (id: number, accept: boolean) =>
    fetchApi<{ message: string; status: string }>(`/calendar/invitations/${id}/respond?accept=${accept}`, {
      method: 'POST',
    }),

  inviteToEvent: (eventId: number, userId: number) =>
    fetchApi<{ message: string; invitation: EventParticipant }>(`/calendar/events/${eventId}/invite/${userId}`, {
      method: 'POST',
    }),
};
