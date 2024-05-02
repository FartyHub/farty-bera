/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import clsx from 'clsx';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { useAccount } from 'wagmi';

import { User } from '@farty-bera/api-lib';

import { ApplicationData, Applications, X_URL } from '../../constants';
import { useApplications, useUser } from '../../contexts';
import { useCreateScore } from '../../hooks';
import { Button, Spinner } from '../atoms';
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
  const { address = '', isConnected } = useAccount();
  const { setUser, user = {} as User } = useUser();
  const { mutate: addScore } = useCreateScore();
  const application =
    applications.find((app) => app.id === Applications.FARTY_BERA) ||
    ApplicationData[Applications.FARTY_BERA];

  const [isInvited, setIsInvited] = useState<boolean>(!!user.usedInviteCode);
  const hasNoAccess = !isConnected || !isInvited || !user.usedInviteCode;

  const handleSetScore = useCallback(
    (newScore: number) => {
      addScore({
        game: Applications.FARTY_BERA,
        userAddress: address,
        value: newScore,
      });
      setUser({
        fartyGamesPlayed: (user.fartyGamesPlayed ?? 0) + 1,
        fartyHighScore: Math.max(user.fartyHighScore ?? 0, newScore),
      });
    },
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
    } else if (isConnected && hasConnectWallet) {
      setApplications(
        applications.filter((app) => app.id !== Applications.CONNECT_WALLET),
      );
    }

    if (isInvited || user.usedInviteCode) {
      return;
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
  }, [applications.length, isInvited, isConnected, user.usedInviteCode]);

  async function handleCloseWindow(event?: MouseEvent<HTMLButtonElement>) {
    event?.stopPropagation();
    setApplications(
      applications
        .filter(
          (app) =>
            app.id !== Applications.CONNECT_WALLET &&
            app.id !== Applications.INVITE_CODE,
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

  async function handleShareHighScore(isTwitter?: boolean) {
    const shareUrl = `${window.location.origin}/?id=${user.id}`;
    // eslint-disable-next-line sonarjs/no-nested-template-literals
    const shareText = `I am so farty! I just hit a new high score of ${user.fartyHighScore} in the Farty Bera game ${isTwitter ? '@fartybera ' : `[@fartybera](${X_URL})`}. Bet you can't beat that!${isTwitter ? '%0a' : '\n'}${shareUrl}`;

    if (isTwitter) {
      window.open(
        `https://twitter.com/intent/post?text=${shareText}`,
        '_blank',
      );
    } else {
      navigator.clipboard.writeText(shareText);
      // eslint-disable-next-line no-alert
      alert('Share message copied to clipboard!');

      window.open(
        'https://discord.com/channels/1227137926849363978/1227137926849363981',
        '_blank',
      );
    }
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
          <div className="flex items-center gap-8">
            <div className="flex text-base text-right flex-nowrap gap-2">
              <span className="font-bold">Highest Score</span>
              <span className="font-normal">{user.fartyHighScore ?? 0}</span>
            </div>
            <div className="flex items-center gap-2 mr-2">
              <Button type="primary" onClick={() => handleShareHighScore(true)}>
                <div className="flex flex-nowrap items-center gap-1">
                  Share on
                  <img
                    alt="x icon"
                    className="size-4"
                    src="images/x-icon.svg"
                  />
                </div>
              </Button>
              <Button type="primary" onClick={() => handleShareHighScore()}>
                Share on Discord
              </Button>
            </div>
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
