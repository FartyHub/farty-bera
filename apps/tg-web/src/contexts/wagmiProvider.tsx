import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { berachainTestnetbArtio } from '@wagmi/core/chains';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import React, { ReactNode } from 'react';
import {
  cookieStorage,
  createStorage,
  http,
  State,
  WagmiProvider as WagmiProviderComponent,
} from 'wagmi';

export const projectId = import.meta.env.VITE_PUBLIC_PROJECT_ID ?? '';

const metadata = {
  description: 'Farty Bera',
  icons: ['/images/farty-logo.svg'],
  name: 'FartyBera',
  url: 'https://www.fartybera.xyz',
};

export const config = defaultWagmiConfig({
  chains: [berachainTestnetbArtio],
  metadata,
  multiInjectedProviderDiscovery: false,
  projectId,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    80084: http(),
  },
});

const queryClient = new QueryClient();

createWeb3Modal({
  enableAnalytics: true,
  enableOnramp: true,
  projectId,
  wagmiConfig: config,
});

export function WagmiProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProviderComponent config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProviderComponent>
  );
}
