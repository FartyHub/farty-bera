import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { StarknetWalletConnectors } from '@dynamic-labs/starknet';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { http } from 'viem';
import { mainnet, sepolia, kakarotStarknetSepolia } from 'viem/chains';
import { createConfig, WagmiProvider } from 'wagmi';

import { useUnityGame } from './unityGameProvider';

const config = createConfig({
  chains: [mainnet, sepolia, kakarotStarknetSepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [kakarotStarknetSepolia.id]: http(),
  },
});

export function StarknetProvider({ children }: { children: ReactNode }) {
  const { savedData, sendMessage } = useUnityGame();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: false } },
      }),
  );

  return (
    <DynamicContextProvider
      settings={{
        deepLinkPreference: 'universal',
        environmentId: import.meta.env.VITE_DYNAMIC_ENV_ID,
        events: {
          onAuthFailure: (method, reason) => {
            console.log('onAuthFailure was called', method, reason);
            sendMessage(
              'UnityWebReceiver',
              'PaymentCallBack',
              JSON.stringify({
                ...savedData,
                cancelled: true,
                isTestnet: import.meta.env.VITE_IS_MAINNET !== 'true',
                tx: '',
              }),
            );
          },
          onAuthFlowCancel: () => {
            console.log('Authentication was cancelled');
            sendMessage(
              'UnityWebReceiver',
              'PaymentCallBack',
              JSON.stringify({
                ...savedData,
                cancelled: true,
                isTestnet: import.meta.env.VITE_IS_MAINNET !== 'true',
                tx: '',
              }),
            );
          },
        },
        initialAuthenticationMode: 'connect-and-sign',
        mobileExperience: 'in-app-browser',
        walletConnectors: [StarknetWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
