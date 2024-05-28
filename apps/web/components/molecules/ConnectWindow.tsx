import { useWeb3Modal } from '@web3modal/wagmi/react';
import clsx from 'clsx';
import { MouseEvent, useState } from 'react';
import { useAccount, useConfig } from 'wagmi';

import { ApplicationData, Applications } from '../../constants';
import { useUser } from '../../contexts';
import { useTouchDevice } from '../../hooks';
import { Button } from '../atoms';
import { Window } from '../elements';

type Props = {
  onClose?: (event?: MouseEvent<HTMLButtonElement>) => Promise<void>;
};

export function ConnectWindow({ onClose }: Props) {
  const { isConnected } = useAccount();
  const { isTouch } = useTouchDevice();
  const { open } = useWeb3Modal();
  const { isLoading } = useUser();
  const application = ApplicationData[Applications.CONNECT_WALLET];

  async function handleOnClose(event?: MouseEvent<HTMLButtonElement>) {
    await onClose?.(event);
  }

  return (
    <Window
      center
      application={application}
      className={clsx(isTouch ? 'w-[80vw]' : 'w-[360px]')}
    >
      <div className="flex flex-col p-3 gap-3 text-sm">
        <img alt="bear" className="w-8 h-auto" src="/images/warning-icon.svg" />
        <div className="text-[13px]">
          <p>This site is classified.</p>
          <p>Please connect wallet first. Make sure you are on Berachain.</p>
        </div>
        <div className="flex items-center flex-row-reverse gap-1">
          <Button
            className="flex px-5 py-2 justify-center"
            loading={isLoading}
            type="primary"
            onClick={() => open()}
          >
            Connect Now
          </Button>
          <Button
            className={clsx(
              'flex items-center justify-center gap-1 px-5 py-2',
              isConnected && 'w-full',
            )}
            type="primary"
            onClick={handleOnClose}
          >
            Bye
          </Button>
        </div>
      </div>
    </Window>
  );
}
