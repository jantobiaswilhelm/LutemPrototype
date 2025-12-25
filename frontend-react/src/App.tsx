import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { initializeTheme } from '@/stores/themeStore';

// Pages
import Home from '@/pages/Home';
import Stats from '@/pages/Stats';
import Sessions from '@/pages/Sessions';
import Library from '@/pages/Library';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';

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

// Initialize theme on app load
function ThemeInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeTheme();
  }, []);

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeInitializer>
        <BrowserRouter>
          <Taskbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/library" element={<Library />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </ThemeInitializer>
    </QueryClientProvider>
  );
}

export default App;
