import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { Leaderboard } from '../components';

export function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: false } },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Leaderboard />
    </QueryClientProvider>
  );
}

export default App;
