import { useWeb3Modal } from '@web3modal/wagmi/react';
import clsx from 'clsx';
import { useAccount } from 'wagmi';

import { User } from '@farty-bera/api-lib';

import { ApplicationData, Applications, X_URL } from '../../constants';
import { useApplications, useUser } from '../../contexts';
import { useCreateProjectInvite } from '../../hooks';
import { truncateMiddle } from '../../utils';
import { Button } from '../atoms';
import { Window } from '../elements';

const SCORE_THRESHOLD = 35;

// const CODES = [];

export function StatsWindow() {
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const { applications } = useApplications();
  const {
    user = {
      honeyScore: 0,
      inviteCode: '',
    } as User,
  } = useUser();
  const application =
    applications.find((app) => app.id === Applications.STATS) ||
    ApplicationData[Applications.STATS];

  // const { isPending, mutate } = useCreateProjectInvite();
  // const open = () => {
  //   CODES.forEach(async (code) => {
  //     try {
  //       mutate({ inviteCode: code });
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   });
  // };

  function handleClickFollow() {
    window.open(X_URL, '_blank');
  }

  function handleCopyAddress() {
    navigator.clipboard.writeText(address ?? '');
  }

  return (
    <Window application={application} className="w-[320px] top-2 right-2">
      <div className="flex flex-col p-[13.6px] gap-3 text-sm">
        {isConnected ? (
          <>
            <div className="flex gap-1 items-center ">
              <img
                alt="bera"
                className="w-[28px] mr-1"
                role="button"
                src="/images/bera-logo.png"
                onClick={() => open()}
              />
              <span className="text-base font-bold">
                {truncateMiddle(address ?? '')}
              </span>
              <img
                alt="copy"
                className="size-4 cursor-pointer"
                role="button"
                src="/images/copy-icon.svg"
                onClick={handleCopyAddress}
              />
            </div>
            <div className="flex gap-1 text-xs items-center">
              <img
                alt="honey"
                className="size-[15px]"
                src="/images/honey-icon.svg"
              />
              <span className="font-bold">Score: </span>
              {user?.honeyScore ?? 0}
            </div>
            {user?.honeyScore >= SCORE_THRESHOLD && (
              <div className="flex gap-1 text-xs items-center">
                <img
                  alt="invite"
                  className="size-[15px]"
                  src="/images/invite-icon.svg"
                />
                <span className="font-bold">Invite Code: </span>
                {user?.inviteCode ?? ''}
              </div>
            )}
            <p className="text-[13px]">
              You are one of the earliest! Thanks for testing us out. Ooga
              booga. Keep playing.
            </p>
          </>
        ) : (
          <>
            <img
              alt="bear"
              className="w-[60px] h-auto"
              src="/images/not-connected-bear.png"
            />
            <div className="flex flex-col gap-3">
              <p>Welcome to Farty Bera.</p>
              <p>
                Farty is a new gaming platform on Bera. Not just any game, but
                the casual fun quirky little games.
              </p>
              <p>
                We are all about bringing the fun of casual games like Miniclips
                to Berachain.
              </p>
            </div>
          </>
        )}
        <div className="flex items-center justify-center gap-1">
          <Button
            className={clsx(
              'flex items-center justify-center gap-1 px-5 py-2',
              isConnected && 'w-full',
            )}
            type="primary"
            onClick={handleClickFollow}
          >
            Follow us on{' '}
            <img
              alt="twitter"
              className="size-[14.7px]"
              src="/images/x-icon.svg"
            />
          </Button>
          {!isConnected && (
            <Button
              className="flex px-5 py-2 justify-center"
              // loading={isPending}
              type="primary"
              onClick={() => open()}
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </Window>
  );
}
