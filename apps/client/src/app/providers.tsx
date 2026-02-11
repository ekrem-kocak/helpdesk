'use client'; // 👈 This is very important! Providers work on the client side.

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // We keep QueryClient inside useState so that a new client is not created (and cache is not reset)
  // every time the page is rendered.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // Data will be considered "fresh" for 1 minute (won't refetch)
            refetchOnWindowFocus: false, // Don't automatically refetch when switching back to the tab
            retry: 1, // If an error occurs, retry once
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
