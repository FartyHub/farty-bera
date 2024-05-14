/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWeb3Modal } from '@web3modal/wagmi/react';
import clsx from 'clsx';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { Unity } from 'react-unity-webgl';
import { useAccount } from 'wagmi';

import { SendTelegramGameScoreDto, User } from '@farty-bera/api-lib';

import { ApplicationData, Applications, X_URL } from '../../constants';
import { useApplications, useFartyBera, useUser } from '../../contexts';
import { useCreateScore, useSendGameScore, useTouchDevice } from '../../hooks';
import { truncateMiddle } from '../../utils';
import { Button, Spinner } from '../atoms';
import { Window } from '../elements';

import { ConnectWindow } from './ConnectWindow';
import { InviteCodeWindow } from './InviteCodeWindow';

type Props = {
  isTelegram: boolean;
  telegramMessageContext: SendTelegramGameScoreDto | null;
};

export function FartyBeraGame({ isTelegram, telegramMessageContext }: Props) {
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
  const { setUser, user = {} as User } = useUser();
  const { mutate: addScore } = useCreateScore();
  const { mutate: sendGameScore } = useSendGameScore();
  const { isTouch } = useTouchDevice();
  const application =
    applications.find((app) => app.id === Applications.FARTY_BERA) ||
    ApplicationData[Applications.FARTY_BERA];

  const [isInvited, setIsInvited] = useState<boolean>(!!user.usedInviteCode);
  const hasNoAccess = !isConnected || !isInvited || !user.usedInviteCode;

  const handleSetScore = useCallback(
    (newScore: number) => {
      if (isTelegram && telegramMessageContext) {
        sendGameScore({
          ...telegramMessageContext,
          score: newScore,
        });
      } else {
        addScore({
          game: Applications.FARTY_BERA,
          userAddress: address,
          value: newScore,
        });
        setUser({
          fartyGamesPlayed: (user.fartyGamesPlayed ?? 0) + 1,
          fartyHighScore: Math.max(user.fartyHighScore ?? 0, newScore),
        });
      }
    },
    [user, isTelegram, telegramMessageContext, address],
  );

  useEffect(() => {
    addEventListener('SetScore', handleSetScore);

    return () => {
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

    if (isTelegram && !hasFartyBera) {
      setApplications([
        ...applications,
        {
          ...ApplicationData[Applications.FARTY_BERA],
          fullScreen: true,
          system: true,
          zIndex: maxIndex + 1,
        },
      ]);
    }

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
  }, [
    applications.length,
    isInvited,
    isConnected,
    user.usedInviteCode,
    isTelegram,
  ]);

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

  async function handleShareTGScore() {
    (window as any).TelegramGameProxy.shareScore();
  }

  async function handleShareHighScore(isTwitter?: boolean) {
    const shareUrl = `${window.location.origin}`;
    // eslint-disable-next-line sonarjs/no-nested-template-literals
    const shareText = `I am so farty! I just hit a new high score of ${user.fartyHighScore} in the Farty Bera game ${isTwitter ? '@fartybera ' : `[@fartybera](${X_URL})`}. Bet you can't beat that!${isTwitter ? '%0a' : '\n'}${shareUrl}`;

    if (isTwitter) {
      window.open(
        `https://twitter.com/intent/post?text=${shareText}`,
        '_blank',
      );
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText);
        // eslint-disable-next-line no-alert
        alert('Share message copied to clipboard!');
      }

      if (isTouch) {
        window.open(
          'discord://discordapp.com/channels/1227137926849363978/1227137926849363981',
        );
      } else {
        window.open(
          'https://discord.com/channels/1227137926849363978/1227137926849363981',
          '_blank',
        );
      }
    }
  }

  function handleConnectWallet(event?: MouseEvent<HTMLButtonElement>) {
    event?.stopPropagation();
    open();
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
          {isTelegram ? (
            <div className="flex flex-1 justify-center gap-2">
              <Button
                className="px-2"
                type="primary"
                onClick={handleShareTGScore}
              >
                Share Score
              </Button>
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
              <div className="flex items-stretch gap-2 md:mr-2">
                <Button
                  className="px-1"
                  type="primary"
                  onClick={() => handleShareHighScore(true)}
                >
                  <div className="flex md:flex-row items-center gap-1 flex-nowrap">
                    <span className="whitespace-nowrap">Share on</span>
                    <img
                      alt="x icon"
                      className="size-4"
                      src="images/x-icon.svg"
                    />
                  </div>
                </Button>
                <Button
                  className="px-1"
                  type="primary"
                  onClick={() => handleShareHighScore()}
                >
                  Share on Discord
                </Button>
              </div>
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
