import clsx from 'clsx';
import { MouseEvent, useState } from 'react';
import { useAccount } from 'wagmi';

import { ApplicationData, Applications } from '../../constants';
import { useUser } from '../../contexts';
import { useCheckInviteCode } from '../../hooks';
import { Button, TextInput } from '../atoms';
import { Window } from '../elements';

type Props = {
  isGameLoaded: boolean;
  onClose?: (event?: MouseEvent<HTMLButtonElement>) => Promise<void>;
  onSuccess?: () => void;
};

export function InviteCodeWindow({ isGameLoaded, onClose, onSuccess }: Props) {
  const { address = '', isConnected } = useAccount();
  const { setUser } = useUser();
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const application = ApplicationData[Applications.INVITE_CODE];
  const { isPending: isChecking, mutate: checkInviteCode } = useCheckInviteCode(
    {
      onError: (checkError) => {
        setError(checkError.message);
      },
      onSuccess: (data) => {
        setUser(data);
        setError('');
        onSuccess?.();
      },
    },
  );

  async function handleOnClose(event?: MouseEvent<HTMLButtonElement>) {
    await onClose?.(event);
  }

  function handleConfirmCode() {
    checkInviteCode({
      address,
      inviteCode: code,
    });
  }

  return (
    <Window center application={application} className="w-[360px]">
      <div className="flex flex-col p-3 gap-3 text-sm">
        <img alt="bear" className="w-8 h-auto" src="/images/warning-icon.svg" />
        <div className="text-[13px]">
          <p>This site is classified.</p>
          <p>
            Please input the invite code and we will see if you are cool enough
            to play. Make sure you are on Berachain.
          </p>
        </div>
        <TextInput
          error={error}
          label="Invite Code"
          loading={isChecking}
          placeholder="Invite code goes here"
          setValue={setCode}
          shouldUseKeyDown={isGameLoaded}
          value={code}
          onSubmit={handleConfirmCode}
        />
        <div className="flex items-center gap-1">
          <Button
            className={clsx(
              'flex flex-1 items-center justify-center gap-1 px-5 py-2',
              isConnected && 'w-full',
            )}
            type="primary"
            onClick={handleOnClose}
          >
            I don&apos;t have it, bye
          </Button>
          <Button
            className="flex flex-1 px-5 py-2 justify-center"
            loading={isChecking}
            type="primary"
            onClick={handleConfirmCode}
          >
            Confirm Code
          </Button>
        </div>
      </div>
    </Window>
  );
}
