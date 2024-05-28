import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage } from 'wagmi';
import { berachainTestnet } from 'wagmi/chains';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
  description: 'Farty Bera',
  icons: ['/images/farty-logo.svg'],
  name: 'FartyBera',
  url: 'https://www.fartybera.xyz',
};

const chains = [berachainTestnet] as const;
export const config = defaultWagmiConfig({
  chains,
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
