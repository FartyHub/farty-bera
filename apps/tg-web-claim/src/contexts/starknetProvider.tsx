/* eslint-disable @typescript-eslint/no-explicit-any */
import { sepolia, mainnet } from '@starknet-react/chains';
import { StarknetConfig, publicProvider, voyager } from '@starknet-react/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import {
  ArgentMobileConnector,
  isInArgentMobileAppBrowser,
} from 'starknetkit/argentMobile';
import { InjectedConnector } from 'starknetkit/injected';
import { WebWalletConnector } from 'starknetkit/webwallet';

export function StarknetProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: false } },
      }),
  );
  const connectors = isInArgentMobileAppBrowser()
    ? [
        ArgentMobileConnector.init({
          inAppBrowserOptions: {},
          options: {
            dappName: 'Farty Bera',
            url: 'https://fartybera.xyz',
          },
        }),
      ]
    : ([
        new InjectedConnector({ options: { id: 'braavos', name: 'Braavos' } }),
        new InjectedConnector({ options: { id: 'argentX', name: 'Argent X' } }),
        new WebWalletConnector({ url: 'https://web.argent.xyz' }),
        ArgentMobileConnector.init({
          inAppBrowserOptions: {},
          options: {
            dappName: 'Farty Bera',
            url: 'https://fartybera.xyz',
          },
        }),
      ] as any);

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      connectors={connectors}
      explorer={voyager}
      provider={publicProvider()}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </StarknetConfig>
  );
}
