import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppRoutes from './00-app/AppRoutes.jsx';

// Instantiate QueryClient for React Query cache management
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents refetching data when user switches tabs
      retry: 1, // Retries once upon failure before showing error
      staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
    },
  },
});

/**
 * Root Application component providing React Query context
 */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
      {/* React Query Devtools for inspection during development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
