/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import WebApp from '@twa-dev/sdk';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Unity } from 'react-unity-webgl';

import { useUnityGame } from '../contexts';
import {
  useGetFartyChannelChatMember,
  useGetFartyDenChatMember,
  useGetNewInvoice,
  useSaveUser,
  useStarknet,
} from '../hooks';

import { Spinner } from './Spinner';

type Props = {};

export function UnityGame(_props: Props) {
  const {
    addEventListener,
    isLoaded,
    removeEventListener,
    savedData,
    sendMessage,
    setSavedData,
    unityProvider,
  } = useUnityGame();
  const { mutate: saveUser } = useSaveUser();
  const { data: fartyChannelChatMember } = useGetFartyChannelChatMember(
    WebApp.initData,
  );
  const { data: fartyDenChatMember } = useGetFartyDenChatMember(
    WebApp.initData,
  );
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
      } catch (err) {
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

  const {
    address,
    connected,
    connectWallet,
    disconnect,
    hash,
    isGettingTx,
    sendStrk,
    setTransferAmount,
    setTransferTo,
    setTxHash,
    txData,
  } = useStarknet();
  console.log('txData', isGettingTx, txData);

  async function handleShareGame() {
    if (WebApp.initDataUnsafe.user?.username) {
      WebApp.openTelegramLink(
        `https://t.me/share/url?url=t.me%2F${import.meta.env.VITE_BOT_USERNAME}%2F${import.meta.env.VITE_WEB_SHORTNAME}%3Fstartapp%3D${WebApp.initDataUnsafe.user?.id ?? ''}`,
      );
    } else {
      window.open(
        `https://t.me/share/url?url=t.me%2F${import.meta.env.VITE_BOT_USERNAME}%2F${import.meta.env.VITE_WEB_SHORTNAME}%3Fstartapp%3D${WebApp.initDataUnsafe.start_param ?? ''}`,
        '_blank',
      );
    }

    setTimeout(
      () => sendMessage('UnityWebReceiver', 'ShareGameCallBack', 1),
      // eslint-disable-next-line no-magic-numbers
      500,
    );
  }

  useEffect(
    () => {
      if (hash && connected && txData?.statusReceipt === 'success') {
        sendMessage(
          'UnityWebReceiver',
          'PaymentCallBack',
          JSON.stringify({
            ...savedData,
            isTestnet: import.meta.env.VITE_IS_MAINNET !== 'true',
            tx: hash,
          }),
        );
      }
    } /* eslint-disable-next-line react-hooks/exhaustive-deps */,
    [connected, hash, txData],
  );

  async function handleSendStrk() {
    try {
      const { transaction_hash } = await sendStrk();
      setTxHash(transaction_hash);
    } catch (err) {
      console.log(err);
      sendMessage(
        'UnityWebReceiver',
        'PaymentCallBack',
        JSON.stringify({
          ...savedData,
          cancelled: true,
          isTestnet: import.meta.env.VITE_IS_MAINNET !== 'true',
          tx: '',
        }),
      );
      await disconnect();
    }
  }

  useEffect(() => {
    console.log('Connected:', connected);
    if (connected) {
      handleSendStrk();
    }
  }, [connected]);

  async function handlePayment(value: string, propId: string) {
    try {
      setSavedData({
        address,
        propId,
        value,
      });
      setTransferAmount(value);
      setTransferTo(import.meta.env.VITE_MASTER_ADDRESS_STARKNET ?? '');

      if (connected) {
        await disconnect();
      }

      await connectWallet();
    } catch (err) {
      console.log(err);
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

  async function handleStarsPayment(value: string, propId: string) {
    // setStarsPropId(propId);

    // getNewInvoice(value);
    handlePayment(value, propId);
  }

  async function handleSocialTask(taskId: string) {
    switch (taskId) {
      case '1':
        if (WebApp.initDataUnsafe.user?.username) {
          WebApp.openLink('https://twitter.com/fartybera');
        } else {
          window.open('https://twitter.com/fartybera', '_blank');
        }

        setTimeout(
          () => sendMessage('UnityWebReceiver', 'TaskCallBack', 1),
          // eslint-disable-next-line no-magic-numbers
          1000,
        );
        break;
      case '2':
        console.log(fartyDenChatMember);
        if (fartyDenChatMember?.status === 'member') {
          setTimeout(
            () => sendMessage('UnityWebReceiver', 'TaskCallBack', 1),
            // eslint-disable-next-line no-magic-numbers
            500,
          );
        } else {
          sendMessage('UnityWebReceiver', 'TaskCallBack', 0);

          if (WebApp.initDataUnsafe.user?.username) {
            WebApp.openTelegramLink('https://t.me/+572PnbuackhkMTE9');
          } else {
            window.open('https://t.me/+572PnbuackhkMTE9', '_blank');
          }
        }
        break;
      case '3':
        console.log(fartyChannelChatMember);
        if (fartyChannelChatMember?.status === 'member') {
          setTimeout(
            () => sendMessage('UnityWebReceiver', 'TaskCallBack', 1),
            // eslint-disable-next-line no-magic-numbers
            500,
          );
        } else {
          sendMessage('UnityWebReceiver', 'TaskCallBack', 0);

          if (WebApp.initDataUnsafe.user?.username) {
            WebApp.openTelegramLink('https://t.me/+Ndgsd6EIIARhYTE1');
          } else {
            window.open('https://t.me/+Ndgsd6EIIARhYTE1', '_blank');
          }
        }
        break;
      case '8':
        if (WebApp.initDataUnsafe.user?.username) {
          WebApp.openLink('https://x.com/KingdomlyApp');
        } else {
          window.open('https://x.com/KingdomlyApp', '_blank');
        }

        setTimeout(
          () => sendMessage('UnityWebReceiver', 'TaskCallBack', 1),
          // eslint-disable-next-line no-magic-numbers
          1000,
        );
        break;
      case '9':
        if (WebApp.initDataUnsafe.user?.username) {
          WebApp.openLink('https://app.beraland.xyz/dl/Ecosystem');
        } else {
          window.open('https://app.beraland.xyz/dl/Ecosystem', '_blank');
        }

        setTimeout(
          () => sendMessage('UnityWebReceiver', 'TaskCallBack', 1),
          // eslint-disable-next-line no-magic-numbers
          1000,
        );
        break;
      case '10':
        if (WebApp.initDataUnsafe.user?.username) {
          WebApp.openLink('https://x.com/ramen_finance');
        } else {
          window.open('https://x.com/ramen_finance', '_blank');
        }

        setTimeout(
          () => sendMessage('UnityWebReceiver', 'TaskCallBack', 1),
          // eslint-disable-next-line no-magic-numbers
          1000,
        );
        break;
    }
  }

  useEffect(() => {
    addEventListener('ShareGame', handleShareGame);
    // @ts-ignore
    addEventListener('PaymentRequest', handlePayment);
    // @ts-ignore
    addEventListener('PaymentRequestStars', handleStarsPayment);
    addEventListener('TaskRequest', handleSocialTask);

    return () => {
      removeEventListener('ShareGame', handleShareGame);
      // @ts-ignore
      removeEventListener('PaymentRequest', handlePayment);
      // @ts-ignore
      removeEventListener('PaymentRequestStars', handleStarsPayment);
      removeEventListener('TaskRequest', handleSocialTask);
    };
  }, [
    addEventListener,
    removeEventListener,
    handleShareGame,
    handlePayment,
    handleSocialTask,
  ]);

  useEffect(() => {
    if (isLoaded) {
      if (connected) {
        console.log('Disconnecting to Starknet...');
        disconnect();
      }

      saveUser(WebApp.initData);
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
    <div
      className={clsx(
        'flex flex-col gap-2 items-center justify-center h-screen w-screen',
      )}
    >
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
