import type { Game, RecommendationRequest, RecommendationResponse, SessionFeedback } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// Configuration for retry logic
const DEFAULT_RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body?: string
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
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

      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
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
