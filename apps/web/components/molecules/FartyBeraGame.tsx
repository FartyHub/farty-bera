/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWeb3Modal } from '@web3modal/wagmi/react';
import clsx from 'clsx';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { Unity } from 'react-unity-webgl';
import { useAccount } from 'wagmi';

import { User } from '@farty-bera/api-lib';

import { ApplicationData, Applications } from '../../constants';
import { useApplications, useFartyBera, useUser } from '../../contexts';
import { useCreateScore, useSign, useTouchDevice } from '../../hooks';
import { hashSHA256, truncateMiddle } from '../../utils';
import { Button, Spinner } from '../atoms';
import { Window } from '../elements';

import { ConnectWindow } from './ConnectWindow';
import { InviteCodeWindow } from './InviteCodeWindow';

type Props = {
  // no props
};

export function FartyBeraGame(_props: Props) {
  const {
    addEventListener,
    isLoaded,
    removeEventListener,
    sendMessage,
    unityProvider,
  } = useFartyBera();
  const { open } = useWeb3Modal();
  const { applications, setApplications } = useApplications();
  const { address = '', isConnected } = useAccount();
  const { fetchUser, isLoading, user = {} as User } = useUser();
  const { handleSignMessage } = useSign();
  const { mutate: addScore } = useCreateScore({
    onSuccess: () => fetchUser(),
  });
  const { isTouch } = useTouchDevice();
  const application =
    applications.find((app) => app.id === Applications.FARTY_BERA) ||
    ApplicationData[Applications.FARTY_BERA];

  const [isInvited, setIsInvited] = useState<boolean>(!!user.usedInviteCode);
  const hasNoAccess = !isConnected || !isInvited || !user.usedInviteCode;

  const handleSetScore = useCallback(
    async (newScore: number, time: string) => {
      const res = await handleSignMessage(newScore.toString());
      const hash = hashSHA256(newScore.toString(), res?.key ?? '');

      addScore({
        game: Applications.FARTY_BERA,
        hash,
        key: res?.key ?? '',
        message: res?.message ?? '',
        signature: res?.signature ?? '',
        time,
        userAddress: address,
        value: newScore,
      });
    },
    [user, address],
  );

  useEffect(() => {
    // @ts-ignore
    addEventListener('SetScore', handleSetScore);

    return () => {
      // @ts-ignore
      removeEventListener('SetScore', handleSetScore);
    };
  }, [addEventListener, removeEventListener, handleSetScore]);

  useEffect(() => {
    if (isLoaded) {
      sendMessage('GameController', 'getuseraddress', address);
    }
  }, [isLoaded]);

  useEffect(() => {
    sendMessage('GameController', 'changeSounds', application.softHide ? 0 : 1);
  }, [application.softHide]);

  useEffect(() => {
    if (!isInvited && user.usedInviteCode) {
      setIsInvited(true);
    }
  }, [user.usedInviteCode]);

  useEffect(() => {
    const hasFartyBera = applications.some(
      (app) => app.id === Applications.FARTY_BERA,
    );
    const hasConnectWallet = applications.some(
      (app) => app.id === Applications.CONNECT_WALLET,
    );
    const hasInviteCode = applications.some(
      (app) => app.id === Applications.INVITE_CODE,
    );
    const maxIndex = Math.max(...applications.map((app) => app.zIndex));

    if (!isConnected && hasFartyBera && !hasConnectWallet) {
      setApplications([
        ...applications.filter((app) => app.id !== Applications.INVITE_CODE),
        {
          ...ApplicationData[Applications.CONNECT_WALLET],
          zIndex: maxIndex + 1,
        },
      ]);
    } else if (isConnected && hasConnectWallet && !isLoading) {
      setApplications(
        applications.filter((app) => app.id !== Applications.CONNECT_WALLET),
      );
    }

    if (isInvited || user.usedInviteCode) {
      return;
    }

    if (
      isConnected &&
      !hasInviteCode &&
      !isInvited &&
      !isLoading &&
      user.address
    ) {
      setApplications([
        ...applications,
        {
          ...ApplicationData[Applications.INVITE_CODE],
          zIndex: maxIndex + 1,
        },
      ]);
    }
  }, [
    applications.length,
    isInvited,
    isLoading,
    isConnected,
    user.address,
    user.usedInviteCode,
  ]);

  async function handleCloseWindow(event?: MouseEvent<HTMLButtonElement>) {
    event?.stopPropagation();
    setApplications(
      applications
        .filter(
          (app) =>
            app.id !== Applications.CONNECT_WALLET &&
            app.id !== Applications.INVITE_CODE &&
            app.id !== Applications.FLAPPY_BERA_LEADERBOARD,
        )
        .map((app) => {
          if (app.id === Applications.FARTY_BERA) {
            return {
              ...app,
              softHide: true,
            };
          }

          return app;
        }),
    );
  }

  async function handleSuccessInvite() {
    setIsInvited(true);
    setApplications(
      applications.filter((app) => app.id !== Applications.INVITE_CODE),
    );
  }

  function handleConnectWallet(event?: MouseEvent<HTMLButtonElement>) {
    event?.stopPropagation();
    open();
  }

  function handleOpenFlappyBeraLeaderboard(
    event?: MouseEvent<HTMLButtonElement>,
  ) {
    event?.stopPropagation();
    const maxIndex = Math.max(...applications.map((app) => app.zIndex));
    setApplications([
      ...applications,
      {
        ...ApplicationData[Applications.FLAPPY_BERA_LEADERBOARD],
        zIndex: maxIndex + 1,
      },
    ]);
  }

  return (
    <Window center application={application} onClose={handleCloseWindow}>
      <div
        className="flex flex-col p-1 pt-0.5 border-outset gap-2 justify-between h-full"
        style={{
          filter: hasNoAccess ? 'blur(8px)' : 'none',
          pointerEvents: hasNoAccess ? 'none' : 'auto',
        }}
      >
        <div
          className={clsx(
            'border-inset-black flex items-center justify-center',
            application.fullScreen ? 'size-full' : 'w-[100vh] h-[60vh]',
          )}
        >
          <Spinner className={clsx(isLoaded ? 'hidden' : 'visible')} />
          <Unity
            className={clsx('size-full', isLoaded ? 'visible' : 'hidden')}
            style={{
              height: '100%',
              width: '100%',
            }}
            tabIndex={1}
            unityProvider={unityProvider}
          />
        </div>
        <div className="flex justify-between items-center">
          {!isTouch && (
            <div className="flex gap-[11px]">
              <img
                alt={application.id}
                className="size-10"
                src="/images/farty-bera-logo.png"
              />
              <div className="flex flex-col">
                <span className="font-bold text-base">{application.name}</span>
                <span className="font-normal text-[13px]">
                  Created by {application.creator}
                </span>
              </div>
            </div>
          )}
          {isTouch ? (
            <div className="flex flex-1 justify-center gap-2">
              <Button
                className="flex px-5 py-2 justify-center"
                type="primary"
                onClick={handleConnectWallet}
              >
                {isConnected ? truncateMiddle(address ?? '') : 'Connect Wallet'}
              </Button>
            </div>
          ) : (
            <div className="flex flex-1 md:flex-none justify-between md:justify-normal items-center gap-2 md:gap-8">
              <div className="flex flex-col md:flex-row text-base text-right md:flex-nowrap gap-2 items-center">
                <span className="font-bold whitespace-nowrap">
                  Highest Score
                </span>
                <span className="font-normal">{user.fartyHighScore ?? 0}</span>
              </div>
              <Button
                className="px-2 flex gap-[5px]"
                type="primary"
                onClick={handleOpenFlappyBeraLeaderboard}
              >
                <img
                  alt={application.id}
                  className="size-6"
                  src="/images/crown.png"
                />
                Leaderboard
              </Button>
            </div>
          )}
        </div>
      </div>
      {!isConnected && <ConnectWindow onClose={handleCloseWindow} />}
      {!isInvited && (
        <InviteCodeWindow
          onClose={handleCloseWindow}
          onSuccess={handleSuccessInvite}
        />
      )}
    </Window>
  );
}
