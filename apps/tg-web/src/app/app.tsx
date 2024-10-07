import { sepolia, mainnet } from '@starknet-react/chains';
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
} from '@starknet-react/core';
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

  const { connectors } = useInjectedConnectors({
    includeRecommended: 'onlyIfNoConnectors',
    order: 'random',
    recommended: [argent(), braavos()],
  });
  const chains =
    import.meta.env.VITE_IS_MAINNET !== 'true' ? [sepolia] : [mainnet];

  return (
    <StarknetConfig
      chains={chains}
      connectors={connectors}
      explorer={voyager}
      provider={publicProvider()}
    >
      <QueryClientProvider client={queryClient}>
        <UnityGameProvider>
          <UnityGame />
        </UnityGameProvider>
      </QueryClientProvider>
    </StarknetConfig>
  );
}

export default App;
