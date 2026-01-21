import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, Suspense, lazy } from 'react';
import { initializeTheme } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';

// Components (always loaded)
import Taskbar from '@/components/Taskbar';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';

// Lazy-loaded pages for code splitting
const Home = lazy(() => import('@/pages/Home'));
const Stats = lazy(() => import('@/pages/Stats'));
const Sessions = lazy(() => import('@/pages/Sessions'));
const Library = lazy(() => import('@/pages/Library'));
const Settings = lazy(() => import('@/pages/Settings'));
const Profile = lazy(() => import('@/pages/Profile'));
const Login = lazy(() => import('@/pages/Login'));
const AuthCallback = lazy(() => import('@/pages/AuthCallback'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
        <span className="text-[var(--text-secondary)] text-sm">Loading...</span>
      </div>
    </div>
  );
}

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000, // 30 seconds
    },
  },
});

// Initialize theme and validate auth on app load
function AppInitializer({ children }: { children: React.ReactNode }) {
  const { fetchCurrentUser } = useAuthStore();
  
  useEffect(() => {
    initializeTheme();
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AppInitializer>
          <BrowserRouter>
            <Taskbar />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* All routes are public - pages handle their own auth state */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/library" element={<Library />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Suspense>
            <Footer />
          </BrowserRouter>
        </AppInitializer>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
