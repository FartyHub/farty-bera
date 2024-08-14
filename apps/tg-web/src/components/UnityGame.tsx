/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CHAIN } from '@tonconnect/ui-react';
import WebApp from '@twa-dev/sdk';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Unity } from 'react-unity-webgl';
import { Address, Cell, SendMode, beginCell, toNano } from 'ton-core';
import * as uuid from 'uuid';

import { useUnityGame } from '../contexts';
import { useGetNewInvoice, useTonConnect } from '../hooks';
import { getTransactions } from '../services';

import { Spinner } from './Spinner';

type Props = {};

const RETRY_REJECTED_COUNT = 20;
const RETRY_INTERVAL = 5000;

export function UnityGame(_props: Props) {
  const {
    addEventListener,
    isLoaded,
    removeEventListener,
    sendMessage,
    unityProvider,
  } = useUnityGame();
  const [senderArgs, setSenderArgs] = useState<{
    propId: string;
    sendMode: SendMode;
    to: string;
    value: string;
  } | null>(null);
  const [starsPropId, setStarsPropId] = useState<string>('');
  const { mutate: getNewInvoice } = useGetNewInvoice({
    onSuccess: ({ id, url }) => {
      try {
        WebApp.openInvoice(url, (status) => {
          setTimeout(() => {
            sendMessage(
              'UnityWebReceiver',
              'PaymentCallBack',
              JSON.stringify({
                isTestnet: import.meta.env.VITE_IS_MAINNET !== 'true',
                propId: starsPropId,
                telegramInvoiceId: id,
                ...(status === 'paid'
                  ? { cancelled: false }
                  : { cancelled: true }),
              }),
            );
          }, 1000);
        });
      } catch (error) {
        sendMessage(
          'UnityWebReceiver',
          'PaymentCallBack',
          JSON.stringify({
            cancelled: true,
            isTestnet: import.meta.env.VITE_IS_MAINNET !== 'true',
            telegramInvoiceId: id,
          }),
        );
      }
    },
  });

  async function sendCallback(
    address: string,
    body: Cell,
    count = 1,
    rejected = 0,
  ) {
    const ref = body.beginParse();
    const strData = ref.loadStringTail();
    ref.endParse();
    const rawData = Buffer.from(strData).toString('hex');
    const propId = strData.split(':')[0];

    try {
      if ((rejected === 1 && count > RETRY_REJECTED_COUNT) || rejected === 2) {
        throw new Error('Transaction rejected');
      }

      const res = await getTransactions(address);
      const result: any[] = Array.from(res?.transactions ?? []);

      const transaction = result.find((item) =>
        (item?.in_msg?.raw_body as string)?.includes(rawData),
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

        return true;
      } else {
        await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));

        return await sendCallback(address, body, count + 1, rejected);
      }
    } catch (error) {
      console.log('[Payment Error]', error);
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

      return false;
    }
  }

  const { connected, network, sender, tonConnectUI, wallet } = useTonConnect({
    sendCallback,
  });

  tonConnectUI.onModalStateChange(({ closeReason, status }) => {
    if (
      !connected &&
      status === 'closed' &&
      closeReason === 'action-cancelled' &&
      isLoaded
    ) {
      sendMessage(
        'UnityWebReceiver',
        'PaymentCallBack',
        JSON.stringify({
          address: wallet,
          cancelled: true,
          isTestnet: import.meta.env.VITE_IS_MAINNET !== 'true',
          propId: senderArgs?.propId ?? '',
          tx: '',
        }),
      );
    }
  });

  async function handleShareGame() {
    WebApp.openTelegramLink(
      `https://t.me/share/url?url=t.me%2F${import.meta.env.VITE_BOT_USERNAME}%2F${import.meta.env.VITE_WEB_SHORTNAME}%3Fstartapp%3D${WebApp.initDataUnsafe.user?.id ?? ''}`,
    );

    setTimeout(
      () => sendMessage('UnityWebReceiver', 'ShareGameCallBack', 1),
      // eslint-disable-next-line no-magic-numbers
      500,
    );
  }

  useEffect(
    () => {
      if (senderArgs && connected && sender) {
        console.log(
          'Connected to: ',
          network === CHAIN.MAINNET ? 'mainnet' : 'testnet',
        );

        const { propId, sendMode, to, value } = senderArgs;
        const uid = uuid.v4();
        const body = beginCell().storeStringTail(`${propId}:${uid}`).endCell();
        WebApp.showPopup(
          {
            buttons: [
              {
                type: 'ok',
              },
            ],
            message:
              'After confirming in your wallet, please wait for the redirect or wait 5-10 seconds to complete the transaction before returning to the game.',
            title: 'Important!',
          },
          () => {
            sender.send({
              body,
              sendMode,
              to: Address.parse(to),
              value: toNano(value),
            });
            setSenderArgs(null);
          },
        );
      }
    } /* eslint-disable-next-line react-hooks/exhaustive-deps */,
    [connected, sender, senderArgs],
  );

  async function handlePayment(value: string, propId: string) {
    try {
      if (connected) {
        await tonConnectUI.disconnect();
      }

      tonConnectUI.openModal();

      setSenderArgs({
        propId,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        to: import.meta.env.VITE_MASTER_ADDRESS,
        value,
      });
    } catch (error) {
      console.log(error);
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

  async function handleStarsPayment(value: string, propId: string) {
    setStarsPropId(propId);

    getNewInvoice(value);
  }

  useEffect(() => {
    addEventListener('ShareGame', handleShareGame);
    // @ts-ignore
    addEventListener('PaymentRequest', handlePayment);
    // @ts-ignore
    addEventListener('PaymentRequestStars', handleStarsPayment);

    return () => {
      removeEventListener('ShareGame', handleShareGame);
      // @ts-ignore
      removeEventListener('PaymentRequest', handlePayment);
      // @ts-ignore
      removeEventListener('PaymentRequestStars', handleStarsPayment);
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
          fromId: WebApp.initDataUnsafe.start_param ?? '',
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
