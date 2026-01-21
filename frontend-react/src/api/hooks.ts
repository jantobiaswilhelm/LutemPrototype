import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamesApi, recommendationsApi, feedbackApi, sessionsApi, friendsApi, calendarApi } from './client';
import type { RecommendationRequest, SessionFeedback, CreateEventRequest } from '@/types';

// Query keys
export const queryKeys = {
  games: ['games'] as const,
  game: (id: number) => ['games', id] as const,
  recommendation: ['recommendation'] as const,
  sessionHistory: ['sessions', 'history'] as const,
  friends: ['friends'] as const,
  incomingRequests: ['friends', 'requests', 'incoming'] as const,
  outgoingRequests: ['friends', 'requests', 'outgoing'] as const,
  userSearch: (query: string) => ['users', 'search', query] as const,
  calendarEvents: (start?: string, end?: string, friendsOnly?: boolean) =>
    ['calendar', 'events', start, end, friendsOnly] as const,
  myCalendarEvents: (start?: string, end?: string) =>
    ['calendar', 'events', 'mine', start, end] as const,
  calendarEvent: (id: number) => ['calendar', 'event', id] as const,
  calendarInvitations: ['calendar', 'invitations'] as const,
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
      // Invalidate session history to show the new rating
      queryClient.invalidateQueries({ queryKey: queryKeys.sessionHistory });
    },
  });
}

// Session history hooks
export function useSessionHistory(limit = 20) {
  return useQuery({
    queryKey: queryKeys.sessionHistory,
    queryFn: () => sessionsApi.getHistory(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Friends hooks
export function useFriends() {
  return useQuery({
    queryKey: queryKeys.friends,
    queryFn: friendsApi.getFriends,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useIncomingRequests() {
  return useQuery({
    queryKey: queryKeys.incomingRequests,
    queryFn: friendsApi.getIncomingRequests,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useOutgoingRequests() {
  return useQuery({
    queryKey: queryKeys.outgoingRequests,
    queryFn: friendsApi.getOutgoingRequests,
    staleTime: 30 * 1000,
  });
}

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: queryKeys.userSearch(query),
    queryFn: () => friendsApi.searchUsers(query),
    enabled: query.length >= 2,
    staleTime: 60 * 1000,
  });
}

export function useSendFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => friendsApi.sendRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.outgoingRequests });
      queryClient.invalidateQueries({ queryKey: queryKeys.friends });
    },
  });
}

export function useAcceptFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requesterId: number) => friendsApi.acceptRequest(requesterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incomingRequests });
      queryClient.invalidateQueries({ queryKey: queryKeys.friends });
    },
  });
}

export function useDeclineFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requesterId: number) => friendsApi.declineRequest(requesterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incomingRequests });
    },
  });
}

export function useRemoveFriend() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (friendId: number) => friendsApi.removeFriend(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friends });
    },
  });
}

export function useCancelFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addresseeId: number) => friendsApi.cancelRequest(addresseeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.outgoingRequests });
    },
  });
}

// Calendar hooks
export function useCalendarEvents(start?: string, end?: string, friendsOnly = false) {
  return useQuery({
    queryKey: queryKeys.calendarEvents(start, end, friendsOnly),
    queryFn: () => calendarApi.getEvents(start, end, friendsOnly),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useMyCalendarEvents(start?: string, end?: string) {
  return useQuery({
    queryKey: queryKeys.myCalendarEvents(start, end),
    queryFn: () => calendarApi.getMyEvents(start, end),
    staleTime: 60 * 1000,
  });
}

export function useCalendarEvent(id: number) {
  return useQuery({
    queryKey: queryKeys.calendarEvent(id),
    queryFn: () => calendarApi.getEvent(id),
    enabled: !!id,
  });
}

export function useCalendarInvitations() {
  return useQuery({
    queryKey: queryKeys.calendarInvitations,
    queryFn: calendarApi.getInvitations,
    staleTime: 30 * 1000,
  });
}

export function useCreateCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (event: CreateEventRequest) => calendarApi.createEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar', 'events'] });
    },
  });
}

export function useUpdateCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, event }: { id: number; event: Partial<CreateEventRequest> }) =>
      calendarApi.updateEvent(id, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar', 'events'] });
    },
  });
}

export function useDeleteCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => calendarApi.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar', 'events'] });
    },
  });
}

export function useJoinCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => calendarApi.joinEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar', 'events'] });
    },
  });
}

export function useLeaveCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => calendarApi.leaveEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar', 'events'] });
    },
  });
}

export function useRespondToCalendarInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, accept }: { id: number; accept: boolean }) =>
      calendarApi.respondToInvitation(id, accept),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.calendarInvitations });
      queryClient.invalidateQueries({ queryKey: ['calendar', 'events'] });
    },
  });
}
