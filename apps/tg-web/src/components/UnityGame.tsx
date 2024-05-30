/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import WebApp from '@twa-dev/sdk';
import clsx from 'clsx';
import { useEffect } from 'react';
import { Unity } from 'react-unity-webgl';

import { useUnityGame } from '../contexts';

import { Spinner } from './Spinner';

type Props = {};

export function UnityGame(_props: Props) {
  const {
    addEventListener,
    isLoaded,
    removeEventListener,
    sendMessage,
    unityProvider,
  } = useUnityGame();

  async function handleShareGame() {
    WebApp.openTelegramLink(
      `https://t.me/share/url?url=t.me%2F${import.meta.env.VITE_BOT_USERNAME}%2F${import.meta.env.VITE_WEB_SHORTNAME}`,
    );
    sendMessage('UnityWebReceiver', 'ShareGameCallBack', 1);
  }

  async function handlePayment(value: string) {
    // (window as any).TelegramGameProxy.shareScore();
    WebApp.showAlert(`Payment: ${value}`);
  }

  useEffect(() => {
    addEventListener('ShareGame', handleShareGame);
    addEventListener('PaymentRequest', handlePayment);

    return () => {
      removeEventListener('ShareGame', handleShareGame);
      removeEventListener('PaymentRequest', handlePayment);
    };
  }, [addEventListener, removeEventListener, handleShareGame, handlePayment]);

  useEffect(() => {
    if (isLoaded) {
      // WebApp.showAlert(JSON.stringify(WebApp.initDataUnsafe.user));
      sendMessage(
        'UnityWebReceiver',
        'GetUserInfo',
        JSON.stringify({
          firstName: WebApp.initDataUnsafe.user?.first_name ?? '',
          nickname: WebApp.initDataUnsafe.user?.username ?? '',
          photoUrl:
            WebApp.initDataUnsafe.user?.photo_url ??
            'https://storage.googleapis.com/tg-mini-app-build/placeholder.png',
          uid: WebApp.initDataUnsafe.user?.id ?? 0,
          username: WebApp.initDataUnsafe.user?.username ?? '',
        }),
      );
    }
  }, [isLoaded]);

  return (
    <div className={clsx('flex items-center justify-center h-screen w-screen')}>
      <Spinner className={clsx(isLoaded ? 'hidden' : 'visible')} />
      <Unity
        className={clsx(isLoaded ? 'visible' : 'hidden')}
        devicePixelRatio={3}
        style={{
          height: '100%',
          width: '100%',
        }}
        tabIndex={1}
        unityProvider={unityProvider}
      />
    </div>
  );
}
