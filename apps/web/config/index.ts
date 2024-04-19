import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
  description: 'Farty Bera',
  icons: ['/images/farty-logo.svg'],
  name: 'FartyBera',
  url: 'https://www.fartybera.xyz',
};

const chains = [mainnet, sepolia] as const;
export const config = defaultWagmiConfig({
  chains,
  metadata,
  projectId,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
