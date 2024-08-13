import { useWeb3Modal } from '@web3modal/wagmi/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { User } from '@farty-bera/api-lib';

import { ApplicationData, Applications, X_URL } from '../../constants';
import { useApplications, useUser } from '../../contexts';
import {
  useCreateProjectInvite,
  useGetUserRank,
  useTouchDevice,
} from '../../hooks';
import { truncateMiddle } from '../../utils';
import { Button, TextInput } from '../atoms';
import { Window } from '../elements';

const SCORE_THRESHOLD = 35;

// const CODES = [];

export function StatsWindow() {
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const { applications, setApplications } = useApplications();
  const {
    error,
    isLoading,
    setUser,
    user = {
      honeyScore: 0,
      inviteCode: '',
    } as User,
  } = useUser();
  const { data: userRank = 0, isLoading: isGettingUserRank } = useGetUserRank(
    address ?? '',
  );
  const { isTouch } = useTouchDevice();
  const [name, setName] = useState<string>(user?.displayName ?? '');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
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

  useEffect(() => {
    if (user?.displayName) {
      setName(user.displayName);
    }

    if (user?.address) {
      setApplications([...applications, ApplicationData[Applications.TASKS]]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function handleClickFollow() {
    window.open(X_URL, '_blank');
  }

  function handleCopyAddress() {
    navigator.clipboard.writeText(address ?? '');
  }

  function handleToggleEditName() {
    if (isLoading) {
      return;
    }

    if (isEditingName) {
      setUser({ displayName: name });
    } else {
      setIsEditingName(true);
    }
  }

  function handleOnSubmit() {
    if (isEditingName) {
      setUser({ displayName: name });
    }

    setIsEditingName(false);
  }

  return (
    <Window
      application={application}
      className={clsx('w-[400px] top-2 right-2', isTouch && 'hidden')}
    >
      <div className="flex flex-col p-[13.6px] gap-3 text-sm">
        {user.address ? (
          <>
            <div className="flex gap-1 items-center ">
              <img
                alt="bera"
                className="w-[28px] mr-1"
                role="button"
                src="/images/bera-logo.png"
                onClick={() => open()}
              />
              <div className="flex flex-col">
                <span className="flex flex-nowrap whitespace-nowrap items-top gap-1">
                  {isEditingName ? (
                    <>
                      <TextInput
                        className="!p-0 text-[11px] h-[15px]"
                        error={error}
                        errorClassName="text-[9px]"
                        max={20}
                        setValue={setName}
                        value={name}
                        onBlur={handleOnSubmit}
                        onSubmit={handleOnSubmit}
                      />
                    </>
                  ) : (
                    <button
                      className={clsx(
                        'flex flex-nowrap underline text-[11px] text-[#020202] gap-1 cursor-pointer',
                      )}
                      role="button"
                      onClick={handleToggleEditName}
                    >
                      {name && name !== 'Farty Bera' ? name : 'Set Name here'}
                    </button>
                  )}
                </span>
                <div className="flex items-center">
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
              </div>
            </div>
            <div className="flex items-center gap-6">
              {/* <div className="flex flex-col gap-2 text-[11px] items-center">
                <span className="font-bold">Honey Drop Points:</span>
                <div className="flex items-center gap-1">
                  <img
                    alt="honey"
                    className="size-[15px]"
                    src="/images/honey-icon.svg"
                  />
                  {user?.honeyScore ?? 0}
                </div>
              </div> */}
              <div className="flex flex-col gap-2 text-[11px] items-center">
                <span className="font-bold">My Rank</span>
                <div className="flex items-center gap-[6px]">
                  <img
                    alt="honey-crown"
                    className="size-6"
                    src="/images/crown.png"
                  />
                  {isGettingUserRank ? '...' : `#${userRank ?? '-'}`}
                </div>
              </div>
            </div>
            <p className="text-[13px]">
              You are one of the earliest! <br />
              Farty Bera is still in Beta. Thanks for testing us out. Ooga
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
        {!isConnected && (
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
            <Button
              className="flex px-5 py-2 justify-center"
              loading={isLoading}
              type="primary"
              onClick={() => open()}
            >
              Connect Wallet
            </Button>
          </div>
        )}
      </div>
    </Window>
  );
}
