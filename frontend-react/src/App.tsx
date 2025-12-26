import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { initializeTheme } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';

// Pages
import Home from '@/pages/Home';
import Stats from '@/pages/Stats';
import Sessions from '@/pages/Sessions';
import Library from '@/pages/Library';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import Login from '@/pages/Login';
import AuthCallback from '@/pages/AuthCallback';

// Components
import Taskbar from '@/components/Taskbar';
import Footer from '@/components/Footer';

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
      <AppInitializer>
        <BrowserRouter>
          <Taskbar />
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
          <Footer />
        </BrowserRouter>
      </AppInitializer>
    </QueryClientProvider>
  );
}

export default App;
