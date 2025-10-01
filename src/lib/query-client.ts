import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 120 * 1000,
      gcTime: 300 * 1000,   
      refetchOnWindowFocus: false, 
      retry: (failureCount) => {
        if (failureCount < 2) {
          return true;
        }
        return false;
      },
    },
  },
});