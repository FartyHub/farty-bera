/* eslint-disable @typescript-eslint/ban-ts-comment */
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { useAccount } from 'wagmi';

import { User } from '@farty-bera/api-lib';

import { ApplicationData, Applications } from '../../constants';
import { useApplications, useUser } from '../../contexts';
import { Spinner } from '../atoms';
import { Window } from '../elements';

import { ConnectWindow } from './ConnectWindow';
import { InviteCodeWindow } from './InviteCodeWindow';

export function FartyBeraGame() {
  const {
    addEventListener,
    isLoaded,
    removeEventListener,
    sendMessage,
    unityProvider,
    UNSAFE__unityInstance: unityInstance,
  } = useUnityContext({
    codeUrl: 'https://storage.googleapis.com/farty-bera-build/web.wasm',
    dataUrl: 'https://storage.googleapis.com/farty-bera-build/web.data',
    frameworkUrl:
      'https://storage.googleapis.com/farty-bera-build/web.framework.js',
    loaderUrl: 'https://storage.googleapis.com/farty-bera-build/web.loader.js',
    // codeUrl: 'build/web.wasm',
    // dataUrl: 'build/web.data',
    // frameworkUrl: 'build/web.framework.js',
    // loaderUrl: 'build/web.loader.js',
  });
  const { applications, setApplications } = useApplications();
  const { address, isConnected } = useAccount();
  const { setUser, user = {} as User } = useUser();
  const application =
    applications.find((app) => app.id === Applications.FARTY_BERA) ||
    ApplicationData[Applications.FARTY_BERA];

  const [isInvited, setIsInvited] = useState<boolean>(!!user.usedInviteCode);
  const hasNoAccess = !isConnected || !isInvited;

  const handleSetScore = useCallback(
    (newScore: number) => {
      setUser({
        fartyGamesPlayed: (user.fartyGamesPlayed ?? 0) + 1,
        fartyHighScore: Math.max(user.fartyHighScore ?? 0, newScore),
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user],
  );

  useEffect(() => {
    // @ts-expect-error
    addEventListener('SetScore', handleSetScore);

    return () => {
      // @ts-expect-error
      removeEventListener('SetScore', handleSetScore);
    };
  }, [addEventListener, removeEventListener, handleSetScore]);

  useEffect(
    () => {
      if (isLoaded) {
        sendMessage('GameController', 'getuseraddress', address);
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoaded],
  );

  useEffect(() => {
    if (isInvited) {
      return;
    }

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
      setIsInvited(false);
      setApplications([
        ...applications,
        {
          ...ApplicationData[Applications.CONNECT_WALLET],
          zIndex: maxIndex + 1,
        },
      ]);
    } else if (isConnected && hasConnectWallet) {
      setApplications(
        applications.filter((app) => app.id !== Applications.CONNECT_WALLET),
      );
    }

    if (isConnected && !hasInviteCode && !isInvited) {
      setApplications([
        ...applications,
        {
          ...ApplicationData[Applications.INVITE_CODE],
          zIndex: maxIndex + 1,
        },
      ]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications.length, isInvited, isConnected]);

  async function handleUnityQuit() {
    await unityInstance?.Quit();
  }

  async function handleCloseWindow() {
    await handleUnityQuit();
    setApplications(
      applications.filter(
        (app) =>
          app.id !== Applications.CONNECT_WALLET &&
          app.id !== Applications.FARTY_BERA &&
          app.id !== Applications.INVITE_CODE,
      ),
    );
  }

  async function handleSuccessInvite() {
    setIsInvited(true);
    setApplications(
      applications.filter((app) => app.id !== Applications.INVITE_CODE),
    );
  }

  return (
    <Window center application={application} onClose={handleUnityQuit}>
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
          <div className="flex flex-col text-base text-right">
            <span className="font-bold">Highest Score</span>
            <span className="font-normal">{user.fartyHighScore ?? 0}</span>
          </div>
        </div>
      </div>
      {!isConnected && <ConnectWindow onClose={handleCloseWindow} />}
      {!isInvited && (
        <InviteCodeWindow
          isGameLoaded={isLoaded}
          onClose={handleCloseWindow}
          onSuccess={handleSuccessInvite}
        />
      )}
    </Window>
  );
}
