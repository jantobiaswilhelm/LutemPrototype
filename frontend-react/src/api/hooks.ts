import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamesApi, recommendationsApi, feedbackApi } from './client';
import type { RecommendationRequest, SessionFeedback } from '@/types';

// Query keys
export const queryKeys = {
  games: ['games'] as const,
  game: (id: number) => ['games', id] as const,
  recommendation: ['recommendation'] as const,
};

// Games hooks
export function useGames() {
  return useQuery({
    queryKey: queryKeys.games,
    queryFn: gamesApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGame(id: number) {
  return useQuery({
    queryKey: queryKeys.game(id),
    queryFn: () => gamesApi.getById(id),
    enabled: !!id,
  });
}

// Recommendation hooks
export function useRecommendation() {
  return useMutation({
    mutationFn: (request: RecommendationRequest) =>
      recommendationsApi.getRecommendation(request),
  });
}

// Feedback hooks
export function useSubmitFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (feedback: SessionFeedback) =>
      feedbackApi.submitFeedback(feedback),
    onSuccess: () => {
      // Invalidate games to refresh satisfaction scores
      queryClient.invalidateQueries({ queryKey: queryKeys.games });
    },
  });
}
