/**
 * Login Page - Dual auth: Steam + Google
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

// Steam icon SVG - Official Steam logo
const SteamIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/>
  </svg>
);

// Google icon SVG - Official Google "G" logo
const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5">
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
    <main id="main-content" className="content-area flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full mx-4">
        {/* Card */}
        <div 
          className="rounded-3xl p-8 shadow-lg"
          style={{ 
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)'
          }}
        >
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Welcome to Lutem
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Sign in to sync your game library and get personalized recommendations
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl text-center"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444'
              }}
            >
              {error}
            </div>
          )}

          {/* Login buttons */}
          <div className="space-y-4">
            {/* Steam Login - Primary for gamers */}
            <button
              onClick={loginWithSteam}
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#171a21',
                color: '#ffffff'
              }}
            >
              <SteamIcon />
              Continue with Steam
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
              <span 
                className="text-sm"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                or
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
            </div>

            {/* Google Login */}
            <button
              onClick={loginWithGoogle}
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)'
              }}
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="mt-6 text-center" role="status" aria-live="polite">
              <div
                className="inline-block w-6 h-6 border-2 rounded-full animate-spin"
                style={{
                  borderColor: 'var(--color-border)',
                  borderTopColor: 'var(--color-accent)'
                }}
                aria-hidden="true"
              />
              <p
                className="mt-2 text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Signing in...
              </p>
            </div>
          )}

          {/* Info text */}
          <p 
            className="mt-8 text-center text-sm"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            Steam login automatically imports your game library.
            <br />
            Google login lets you manually add your Steam ID later.
          </p>
        </div>

        {/* Skip login for browsing */}
        <button
          className="mt-6 w-full text-center text-sm cursor-pointer hover:underline bg-transparent border-none"
          style={{ color: 'var(--color-text-secondary)' }}
          onClick={() => navigate('/')}
        >
          Continue without signing in
        </button>
      </div>
    </main>
  );
}
