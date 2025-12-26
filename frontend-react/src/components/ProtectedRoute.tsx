/**
 * Protected Route Component
 * Redirects unauthenticated users to login page
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true 
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading, fetchCurrentUser } = useAuthStore();

  // Validate token on mount
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <main className="content-area flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div 
            className="w-8 h-8 border-2 rounded-full animate-spin mx-auto"
            style={{
              borderColor: 'var(--color-border)',
              borderTopColor: 'var(--color-accent)'
            }}
          />
          <p 
            className="mt-4 text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Loading...
          </p>
        </div>
      </main>
    );
  }

  // Redirect to login if not authenticated and auth is required
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
