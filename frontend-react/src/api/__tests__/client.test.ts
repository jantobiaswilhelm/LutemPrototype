import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiError, gamesApi, recommendationsApi, feedbackApi } from '../client';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Mock config
vi.mock('@/lib/config', () => ({
  API_BASE: 'http://test-api',
}));

function jsonResponse(data: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  };
}

function errorResponse(status: number, body = 'error') {
  return {
    ok: false,
    status,
    statusText: 'Error',
    json: () => Promise.resolve({ error: body }),
    text: () => Promise.resolve(body),
  };
}

beforeEach(() => {
  mockFetch.mockReset();
  // Mock document.cookie for CSRF
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: '',
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ApiError', () => {
  it('creates error with status and message', () => {
    const err = new ApiError(404, 'Not Found', 'resource missing');
    expect(err.status).toBe(404);
    expect(err.statusText).toBe('Not Found');
    expect(err.body).toBe('resource missing');
    expect(err.message).toBe('API Error: 404 Not Found');
  });

  it('identifies retryable errors', () => {
    expect(new ApiError(500, 'Server Error').isRetryable).toBe(true);
    expect(new ApiError(503, 'Unavailable').isRetryable).toBe(true);
    expect(new ApiError(429, 'Rate Limited').isRetryable).toBe(true);
    expect(new ApiError(0, 'Network Error').isRetryable).toBe(true);
  });

  it('identifies non-retryable errors', () => {
    expect(new ApiError(400, 'Bad Request').isRetryable).toBe(false);
    expect(new ApiError(401, 'Unauthorized').isRetryable).toBe(false);
    expect(new ApiError(403, 'Forbidden').isRetryable).toBe(false);
    expect(new ApiError(404, 'Not Found').isRetryable).toBe(false);
  });
});

describe('gamesApi', () => {
  it('getAll fetches games with credentials', async () => {
    const games = [{ id: 1, name: 'Test Game' }];
    mockFetch.mockResolvedValueOnce(jsonResponse(games));

    const result = await gamesApi.getAll();

    expect(result).toEqual(games);
    expect(mockFetch).toHaveBeenCalledWith(
      'http://test-api/games',
      expect.objectContaining({
        credentials: 'include',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('getById fetches a single game', async () => {
    const game = { id: 42, name: 'Specific Game' };
    mockFetch.mockResolvedValueOnce(jsonResponse(game));

    const result = await gamesApi.getById(42);

    expect(result).toEqual(game);
    expect(mockFetch).toHaveBeenCalledWith(
      'http://test-api/games/42',
      expect.anything()
    );
  });
});

describe('recommendationsApi', () => {
  it('sends POST with recommendation request body', async () => {
    const response = { topRecommendation: { id: 1, name: 'Game' } };
    mockFetch.mockResolvedValueOnce(jsonResponse(response));

    const request = {
      availableMinutes: 60,
      desiredEmotionalGoals: ['RELAXATION'],
      energyLevel: 'LOW',
    };

    const result = await recommendationsApi.getRecommendation(request as never);

    expect(result).toEqual(response);
    expect(mockFetch).toHaveBeenCalledWith(
      'http://test-api/recommendations',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request),
      })
    );
  });
});

describe('fetchApi retry logic', () => {
  it('throws immediately on 4xx errors (non-retryable)', async () => {
    mockFetch.mockResolvedValue(errorResponse(401, 'Unauthorized'));

    await expect(gamesApi.getAll()).rejects.toThrow(ApiError);
    // Should NOT retry on 401
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries on 500 errors', async () => {
    mockFetch
      .mockResolvedValueOnce(errorResponse(500, 'Internal Server Error'))
      .mockResolvedValueOnce(jsonResponse([{ id: 1 }]));

    const result = await gamesApi.getAll();
    expect(result).toEqual([{ id: 1 }]);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('throws after max retries on persistent 500', async () => {
    mockFetch.mockResolvedValue(errorResponse(500, 'Server Error'));

    await expect(gamesApi.getAll()).rejects.toThrow(ApiError);
    // 1 initial + 3 retries = 4 calls
    expect(mockFetch).toHaveBeenCalledTimes(4);
  }, 30000); // Extended timeout for retry delays
});

describe('CSRF token handling', () => {
  it('attaches CSRF token on POST requests', async () => {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'XSRF-TOKEN=test-csrf-token',
    });

    mockFetch.mockResolvedValueOnce(jsonResponse({ success: true }));

    await feedbackApi.submitFeedback({ sessionId: 1, satisfactionScore: 5 } as never);

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test-api/sessions/feedback',
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-XSRF-TOKEN': 'test-csrf-token',
        }),
      })
    );
  });

  it('does not attach CSRF token on GET requests', async () => {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'XSRF-TOKEN=test-csrf-token',
    });

    mockFetch.mockResolvedValueOnce(jsonResponse([]));

    await gamesApi.getAll();

    const callHeaders = mockFetch.mock.calls[0][1].headers;
    expect(callHeaders['X-XSRF-TOKEN']).toBeUndefined();
  });
});
