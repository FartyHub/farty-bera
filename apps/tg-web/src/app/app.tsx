import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { UnityGame } from '../components';
import { UnityGameProvider } from '../contexts';

import './app.css';

function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: false } },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <UnityGameProvider>
        <UnityGame />
      </UnityGameProvider>
    </QueryClientProvider>
  );
}

export default App;
