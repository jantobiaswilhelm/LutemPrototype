import type { Game, RecommendationRequest, RecommendationResponse, SessionFeedback } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  console.log(`[API] Calling ${endpoint}`, options?.body);
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  console.log(`[API] Response status: ${response.status}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[API] Error response:`, errorText);
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`[API] Response data:`, data);
  return data;
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
