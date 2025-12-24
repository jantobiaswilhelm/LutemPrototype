import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { initializeTheme } from '@/stores/themeStore';

// Pages
import Home from '@/pages/Home';

// Components
import WizardModal from '@/components/wizard/WizardModal';

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
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          <WizardModal />
        </BrowserRouter>
      </ThemeInitializer>
    </QueryClientProvider>
  );
}

export default App;
 
