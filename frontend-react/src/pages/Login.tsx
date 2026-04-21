/**
 * Login Page - Dual auth: Steam + Google
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

// Steam icon SVG - Official Steam logo
const SteamIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/>
  </svg>
);

// Google icon SVG - Official Google "G" logo
const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="w-4 h-4" aria-hidden="true">
    <clipPath id="g">
      <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
    </clipPath>
    <g clipPath="url(#g)">
      <path fill="#FBBC05" d="M0 37V11l17 13z"/>
      <path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z"/>
      <path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z"/>
      <path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z"/>
    </g>
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isLoading,
    error,
    loginWithSteam,
    loginWithGoogle,
    clearError
  } = useAuthStore();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear error on unmount
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  return (
    <main
      id="main-content"
      className="content-area flex items-center justify-center min-h-screen px-6 py-12"
    >
      <div className="w-full max-w-[32rem]">
        {/* ─── wordmark ─────────────────────────────────── */}
        <div className="text-center mb-10">
          <div
            className="flex items-center justify-center gap-3 font-mono text-[0.68rem] tracking-[0.32em] uppercase mb-7"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span
              className="inline-block w-8 h-px"
              style={{ background: 'var(--color-accent)' }}
              aria-hidden="true"
            />
            <span>§ Sign in</span>
            <span
              className="inline-block w-8 h-px"
              style={{ background: 'var(--color-accent)' }}
              aria-hidden="true"
            />
          </div>

          <h1
            className="font-serif font-semibold text-[clamp(2.6rem,5.2vw,3.8rem)] leading-[1] tracking-[-0.02em] mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Lutem
            <span style={{ color: 'var(--color-accent)', fontStyle: 'normal' }}>.</span>
          </h1>

          <p
            className="font-serif italic text-[clamp(1rem,1.5vw,1.15rem)] leading-snug max-w-[28ch] mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            A quiet companion for play.
          </p>
        </div>

        {/* ─── error ─────────────────────────────────────── */}
        {error && (
          <div
            role="alert"
            className="mb-10 py-4 flex flex-col items-center text-center gap-1"
            style={{
              borderTop: '1px solid var(--color-error)',
              borderBottom: '1px solid var(--color-error)',
            }}
          >
            <span
              className="font-mono text-[0.62rem] tracking-[0.3em] uppercase"
              style={{ color: 'var(--color-error)' }}
            >
              &mdash; notice &mdash;
            </span>
            <p
              className="font-serif italic text-[0.95rem]"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {error}
            </p>
          </div>
        )}

        {/* ─── auth options ─────────────────────────────── */}
        <div
          className="flex flex-col items-center gap-6 py-8"
          style={{
            borderTop: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <button
            onClick={loginWithSteam}
            disabled={isLoading}
            className="login-cta relative font-serif italic font-medium text-[1.25rem] inline-flex items-baseline gap-2.5 bg-transparent border-0 p-0 pb-1.5 cursor-pointer transition-[letter-spacing] duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: '#171a21' }}
            aria-label="Sign in with Steam"
          >
            <span className="self-center"><SteamIcon /></span>
            <span>Sign in with Steam</span>
            <span aria-hidden="true" className="login-arrow font-sans not-italic transition-transform duration-500">&rarr;</span>
            <span
              aria-hidden="true"
              className="login-underline absolute left-0 bottom-0 h-px transition-[right] duration-[600ms]"
              style={{ background: '#171a21', right: '30%' }}
            />
          </button>

          <button
            onClick={loginWithGoogle}
            disabled={isLoading}
            className="login-cta relative font-serif italic font-medium text-[1.25rem] inline-flex items-baseline gap-2.5 bg-transparent border-0 p-0 pb-1.5 cursor-pointer transition-[letter-spacing] duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: 'var(--color-accent)' }}
            aria-label="Sign in with Google"
          >
            <span className="self-center"><GoogleIcon /></span>
            <span>Sign in with Google</span>
            <span aria-hidden="true" className="login-arrow font-sans not-italic transition-transform duration-500">&rarr;</span>
            <span
              aria-hidden="true"
              className="login-underline absolute left-0 bottom-0 h-px transition-[right] duration-[600ms]"
              style={{ background: 'var(--color-accent)', right: '30%' }}
            />
          </button>
        </div>

        {/* ─── loading ──────────────────────────────────── */}
        {isLoading && (
          <div
            className="mt-8 flex flex-col items-center gap-3"
            role="status"
            aria-live="polite"
          >
            <span
              className="inline-block w-2 h-2 rounded-full login-pulse"
              style={{ background: 'var(--color-accent)' }}
              aria-hidden="true"
            />
            <span
              className="font-mono text-[0.62rem] tracking-[0.28em] uppercase"
              style={{ color: 'var(--color-text-muted)' }}
            >
              signing in
            </span>
          </div>
        )}

        {/* ─── footnote ─────────────────────────────────── */}
        <p
          className="mt-10 text-center font-serif italic text-[0.85rem] leading-snug max-w-[40ch] mx-auto"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Steam imports your library automatically. With Google you may link a Steam profile later.
        </p>

        {/* ─── skip ─────────────────────────────────────── */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="login-skip font-mono text-[0.68rem] tracking-[0.22em] uppercase bg-transparent border-0 p-0 pb-0.5 cursor-pointer transition-colors duration-300"
            style={{
              color: 'var(--color-text-muted)',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            Continue without signing in
          </button>
        </div>
      </div>

      <style>{`
        .login-cta:hover:not(:disabled) { letter-spacing: 0.03em; }
        .login-cta:hover:not(:disabled) .login-underline { right: 0 !important; }
        .login-cta:hover:not(:disabled) .login-arrow { transform: translateX(0.35rem); }
        .login-skip:hover {
          color: var(--color-accent);
          border-bottom-color: var(--color-accent);
        }
        @keyframes login-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .login-pulse { animation: login-pulse 1.4s ease-in-out infinite; }
      `}</style>
    </main>
  );
}
