/**
 * Auth Callback Page
 * Handles redirect from Steam OpenID login
 * URL: /auth/callback?token=xxx or /auth/callback?error=xxx
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
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        console.error('❌ Auth callback error:', error);
        setStatus('error');
        setMessage(decodeURIComponent(error));
        setError(error);
        
        // Redirect to login after delay
        setTimeout(() => navigate('/login', { replace: true }), 3000);
        return;
      }

      if (!token) {
        console.error('❌ No token in callback');
        setStatus('error');
        setMessage('No authentication token received');
        setError('No authentication token received');
        
        setTimeout(() => navigate('/login', { replace: true }), 3000);
        return;
      }

      try {
        console.log('🔄 Processing auth callback...');
        await handleAuthCallback(token);
        
        setStatus('success');
        setMessage('Login successful! Redirecting...');
        
        // Redirect to home
        setTimeout(() => navigate('/', { replace: true }), 1000);
        
      } catch (err) {
        console.error('❌ Failed to process callback:', err);
        setStatus('error');
        setMessage('Failed to complete login');
        
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    processCallback();
  }, [searchParams, handleAuthCallback, setError, navigate]);

  return (
    <main className="content-area flex items-center justify-center min-h-screen">
      <div className="text-center">
        {/* Status indicator */}
        <div className="mb-6">
          {status === 'processing' && (
            <div 
              className="w-12 h-12 border-4 rounded-full animate-spin mx-auto"
              style={{
                borderColor: 'var(--color-border)',
                borderTopColor: 'var(--color-accent)'
              }}
            />
          )}
          {status === 'success' && (
            <div 
              className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}
            >
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div 
              className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
            >
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>

        {/* Message */}
        <h1 
          className="text-xl font-semibold mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {status === 'processing' && 'Completing Login'}
          {status === 'success' && 'Welcome!'}
          {status === 'error' && 'Login Failed'}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {message}
        </p>
      </div>
    </main>
  );
}
