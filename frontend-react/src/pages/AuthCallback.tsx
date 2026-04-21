/**
 * Auth Callback Page
 * Handles redirect from Steam OpenID login
 * URL: /auth/callback?success=true or /auth/callback?error=xxx
 *
 * The JWT is set as an httpOnly cookie by the backend.
 * This page just validates the session and redirects.
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleAuthCallback, setError } = useAuthStore();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing login...');

  useEffect(() => {
    const processCallback = async () => {
      const error = searchParams.get('error');
      const success = searchParams.get('success');

      if (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage(decodeURIComponent(error));
        setError(error);

        setTimeout(() => navigate('/login', { replace: true }), 3000);
        return;
      }

      if (!success) {
        setStatus('error');
        setMessage('No authentication response received');
        setError('No authentication response received');

        setTimeout(() => navigate('/login', { replace: true }), 3000);
        return;
      }

      try {
        // Cookie was set by the backend redirect — validate session
        await handleAuthCallback();

        setStatus('success');
        setMessage('Login successful. Redirecting…');

        setTimeout(() => navigate('/', { replace: true }), 1000);

      } catch (err) {
        console.error('Failed to process callback:', err);
        setStatus('error');
        setMessage('Failed to complete login');

        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    processCallback();
  }, [searchParams, handleAuthCallback, setError, navigate]);

  const eyebrow =
    status === 'processing' ? '§ Connecting' :
    status === 'success' ? '§ Welcome' :
    '§ Something went wrong';

  const heading =
    status === 'processing' ? 'One moment.' :
    status === 'success' ? 'You are in.' :
    'We could not complete that.';

  const markColor =
    status === 'error' ? 'var(--color-error)' : 'var(--color-accent)';

  return (
    <main className="content-area flex items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-[32rem] text-center" role="status" aria-live="polite">
        {/* Eyebrow */}
        <div
          className="flex items-center justify-center gap-3 font-mono text-[0.7rem] tracking-[0.28em] uppercase mb-8"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <span
            className="inline-block w-6 h-px"
            style={{ background: markColor }}
            aria-hidden="true"
          />
          <span>{eyebrow}</span>
          <span
            className="inline-block w-6 h-px"
            style={{ background: markColor }}
            aria-hidden="true"
          />
        </div>

        {/* Status mark */}
        <div className="mb-6 flex items-center justify-center" aria-hidden="true">
          {status === 'processing' ? (
            <span
              className="inline-block w-2.5 h-2.5 rounded-full authcb-pulse"
              style={{ background: markColor }}
            />
          ) : (
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: markColor }}
            />
          )}
        </div>

        {/* Heading */}
        <h1
          className="font-serif italic text-[clamp(1.4rem,2.6vw,1.9rem)] leading-[1.1] tracking-[-0.01em] mb-3"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {heading}
        </h1>

        {/* Message */}
        <p
          className="font-serif italic text-[1rem] leading-snug"
          style={{ color: status === 'error' ? 'var(--color-error)' : 'var(--color-text-secondary)' }}
        >
          {message}
        </p>
      </div>

      <style>{`
        @keyframes authcb-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .authcb-pulse { animation: authcb-pulse 1.4s ease-in-out infinite; }
      `}</style>
    </main>
  );
}
