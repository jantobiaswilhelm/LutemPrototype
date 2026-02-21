/**
 * Read CSRF token from cookie (set by backend as non-httpOnly).
 * Shared across all API modules.
 */
export function getCsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}
