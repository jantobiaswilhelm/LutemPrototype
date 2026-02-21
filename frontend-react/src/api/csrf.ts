/**
 * CSRF token management.
 *
 * In same-origin setups the token comes from the XSRF-TOKEN cookie.
 * In cross-origin deployments (e.g. Netlify ↔ Railway) `document.cookie`
 * cannot read cookies set by another domain, so we also store the token
 * from the `X-XSRF-TOKEN` response header that the backend sends.
 */

let storedToken: string | null = null;

/** Return the best available CSRF token. */
export function getCsrfToken(): string | null {
  // Prefer the header-sourced token (works cross-origin)
  if (storedToken) return storedToken;
  // Fallback: same-origin cookie
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/** Call after every fetch response to capture the CSRF token header. */
export function captureCsrfToken(response: Response): void {
  const token = response.headers.get('X-XSRF-TOKEN');
  if (token) {
    storedToken = token;
  }
}
