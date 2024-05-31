/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import WebApp from '@twa-dev/sdk';
import clsx from 'clsx';
import { useEffect } from 'react';
import { Unity } from 'react-unity-webgl';
import { Address, Cell, SendMode, beginCell, toNano } from 'ton-core';
import * as uuid from 'uuid';

import { useUnityGame } from '../contexts';
import { useTonConnect } from '../hooks';
import { getTransactions } from '../services';

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

  async function sendCallback(address: string, body: Cell, count = 1) {
    const ref = body.beginParse();
    const strData = ref.loadStringTail();
    ref.endParse();
    const rawData = Buffer.from(strData).toString('hex');
    const propId = strData.split(':')[0];
    const res = await getTransactions(address);
    const result: any[] = Array.from(res?.transactions ?? []);

    try {
      if (result.length > 0) {
        const transaction = result.find((item) =>
          (item?.in_msg?.raw_body as string).includes(rawData),
        );

        if (transaction) {
          sendMessage(
            'UnityWebReceiver',
            'PaymentCallBack',
            JSON.stringify({
              address,
              isTestnet: import.meta.env.VITE_IS_MAINNET !== 'true',
              propId,
              tx: String(transaction.hash),
            }),
          );

          return;
        } else if (count < 5) {
          setTimeout(() => sendCallback(address, body, count + 1), 5000);

          return;
        }
      }

      sendMessage(
        'UnityWebReceiver',
        'PaymentCallBack',
        JSON.stringify({
          address,
          cancelled: true,
          isTestnet: import.meta.env.VITE_IS_MAINNET !== 'true',
          propId,
          tx: '',
        }),
      );
    } catch (error) {
      sendMessage(
        'UnityWebReceiver',
        'PaymentCallBack',
        JSON.stringify({
          address,
          cancelled: true,
          isTestnet: import.meta.env.VITE_IS_MAINNET !== 'true',
          propId,
          tx: '',
        }),
      );
    }
  }

  const { connected, sender, wallet } = useTonConnect({
    sendCallback,
  });

  async function handleShareGame() {
    WebApp.openTelegramLink(
      `https://t.me/share/url?url=t.me%2F${import.meta.env.VITE_BOT_USERNAME}%2F${import.meta.env.VITE_WEB_SHORTNAME}`,
    );

    setTimeout(
      () => sendMessage('UnityWebReceiver', 'ShareGameCallBack', 1),
      // eslint-disable-next-line no-magic-numbers
      500,
    );
  }

  async function handlePayment(value: string, propId: string) {
    // WebApp.showAlert(`Payment: ${value} - ${propId}`);
    const uid = uuid.v4();
    const body = beginCell().storeStringTail(`${propId}:${uid}`).endCell();
    try {
      await sender.send({
        body,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        to: Address.parse(import.meta.env.VITE_MASTER_ADDRESS),
        value: toNano(value),
      });
    } catch (error) {
      sendMessage(
        'UnityWebReceiver',
        'PaymentCallBack',
        JSON.stringify({
          address: wallet,
          cancelled: true,
          isTestnet: import.meta.env.VITE_IS_MAINNET !== 'true',
          propId,
          tx: '',
        }),
      );
    }
  }

  useEffect(() => {
    addEventListener('ShareGame', handleShareGame);
    // @ts-ignore
    addEventListener('PaymentRequest', handlePayment);

    return () => {
      removeEventListener('ShareGame', handleShareGame);
      // @ts-ignore
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
      <Spinner className={clsx(connected && isLoaded ? 'hidden' : 'visible')} />
      <Unity
        className={clsx(connected && isLoaded ? 'visible' : 'hidden')}
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
