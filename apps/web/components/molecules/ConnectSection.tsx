import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';

import { X_URL } from '../../constants';
import { Button } from '../atoms';

export function ConnectSection() {
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();

  if (isConnected) {
    return null;
  }

  return (
    <div className="font-fredoka text-xl flex flex-col items-center p-4 bg-[#FFF9F2] rounded-lg gap-4 border border-[#843E2F]">
      <img
        alt="Farty Bera"
        className="h-[74px] w-auto"
        src="/images/farty-bera-logo.svg"
      />
      <p className="text-#[585858] text-center">
        Make sure to connect wallet to be the first ones to try out the
        addictive Farty Bera. Check our{' '}
        <a
          className="text-[#E5821E]"
          href={X_URL}
          rel="noreferrer"
          target="_blank"
        >
          X account
        </a>{' '}
        for additional information and updates.
      </p>
      <Button type="primary" onClick={open}>
        Connect Wallet
      </Button>
    </div>
  );
}
