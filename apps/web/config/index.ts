import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage } from 'wagmi';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
  description: 'Farty Bera',
  icons: ['/images/farty-logo.svg'],
  name: 'FartyBera',
  url: 'https://www.fartybera.xyz',
};

export const config = defaultWagmiConfig({
  chains: [
    {
      blockExplorers: {
        default: {
          name: 'Bartio Testnet Explorer',
          url: 'https://bartio.beratrail.io/',
        },
      },
      id: 80084,
      name: 'Berachain bArtio',
      nativeCurrency: {
        decimals: 18,
        name: 'Bera',
        symbol: 'BERA',
      },
      rpcUrls: {
        default: {
          http: ['https://bartio.rpc.berachain.com/'],
        },
      },
    },
  ],
  metadata,
  projectId,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

export const GlobalConfig = {
  AUTH_TOKEN_KEY: 'FARTYBERA_AUTH_TOKEN',
  WELCOME_SIGNATURE_STATEMENT: 'Welcome to FartyBera!',
  WELCOME_SIGNATURE_VERSION: '1',
};
