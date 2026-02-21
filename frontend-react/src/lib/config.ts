/**
 * Shared application configuration.
 * Single source of truth for API base URL and other env-based settings.
 */
export const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
