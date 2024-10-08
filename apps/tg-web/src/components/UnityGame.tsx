/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import WebApp from '@twa-dev/sdk';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Unity } from 'react-unity-webgl';
import * as uuid from 'uuid';

import { useUnityGame } from '../contexts';
import {
  useGetFartyChannelChatMember,
  useGetFartyDenChatMember,
  useGetNewInvoice,
  useSaveUser,
  useStarknet,
} from '../hooks';
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
  const [senderArgs, setSenderArgs] = useState<{
    propId: string;
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

  // async function sendCallback(
  //   address: string,
  //   body: Cell,
  //   count = 1,
  //   rejected = 0,
  // ) {
  //   const ref = body.beginParse();
  //   const strData = ref.loadStringTail();
  //   ref.endParse();
  //   const rawData = Buffer.from(strData).toString('hex');
  //   const propId = strData.split(':')[0];

  //   try {
  //     if ((rejected === 1 && count > RETRY_REJECTED_COUNT) || rejected === 2) {
  //       throw new Error('Transaction rejected');
  //     }

  //     const res = await getTransactions(address);
  //     const result: any[] = Array.from(res?.transactions ?? []);

  //     const transaction = result.find((item) =>
  //       (item?.in_msg?.raw_body as string)?.includes(rawData),
  //     );

  //     if (transaction) {
  //       sendMessage(
  //         'UnityWebReceiver',
  //         'PaymentCallBack',
  //         JSON.stringify({
  //           address,
  //           isTestnet: import.meta.env.VITE_IS_MAINNET !== 'true',
  //           propId,
  //           tx: String(transaction.hash),
  //         }),
  //       );

  //       return true;
  //     } else {
  //       await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));

  //       return await sendCallback(address, body, count + 1, rejected);
  //     }
  //   } catch (err) {
  //     console.log('[Payment Error]', err);
  //     sendMessage(
  //       'UnityWebReceiver',
  //       'PaymentCallBack',
  //       JSON.stringify({
  //         address,
  //         cancelled: true,
  //         isTestnet: import.meta.env.VITE_IS_MAINNET !== 'true',
  //         propId,
  //         tx: '',
  //       }),
  //     );

  //     return false;
  //   }
  // }

  const {
    address,
    chain,
    connect,
    connected,
    connectors,
    disconnect,
    open,
    sendTransaction,
    setShowAuthFlow,
  } = useStarknet();

  // tonConnectUI.onModalStateChange(({ closeReason, status }) => {
  //   if (
  //     !connected &&
  //     status === 'closed' &&
  //     closeReason === 'action-cancelled' &&
  //     isLoaded
  //   ) {
  //     sendMessage(
  //       'UnityWebReceiver',
  //       'PaymentCallBack',
  //       JSON.stringify({
  //         address: wallet,
  //         cancelled: true,
  //         isTestnet: import.meta.env.VITE_IS_MAINNET !== 'true',
  //         propId: senderArgs?.propId ?? '',
  //         tx: '',
  //       }),
  //     );
  //   }
  // });

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
      if (senderArgs && connected) {
        console.log('Connected to:', chain);

        // const { propId, to, value } = senderArgs;
        // const uid = uuid.v4();
        // const body = beginCell().storeStringTail(`${propId}:${uid}`).endCell();
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
            // sender.send({
            //   body,
            //   sendMode,
            //   to: Address.parse(to),
            //   value: toNano(value),
            // });
            setSenderArgs(null);
          },
        );
      }
    } /* eslint-disable-next-line react-hooks/exhaustive-deps */,
    [connected, senderArgs],
  );

  async function handlePayment(value: string, propId: string) {
    // console.log('Disconnecting to Starknet...');
    // if (connected) {
    //   await disconnect();
    // }

    // console.log('Connecting to Starknet...');
    // await connect(
    //   {
    //     chainId:
    //       import.meta.env.VITE_IS_MAINNET !== 'true'
    //         ? kakarotSepolia.id
    //         : mainnet.id,
    //     connector: connectors[0],
    //   },
    //   {
    //     onError: (err) => {
    //       console.log(err);
    //       sendMessage(
    //         'UnityWebReceiver',
    //         'PaymentCallBack',
    //         JSON.stringify({
    //           address,
    //           cancelled: true,
    //           isTestnet: import.meta.env.VITE_IS_MAINNET !== 'true',
    //           propId,
    //           tx: '',
    //         }),
    //       );
    //     },
    //     onSuccess: async () => {
    //       console.log('Sending payment...', {
    //         recipientAddress:
    //           import.meta.env.VITE_MASTER_ADDRESS_STARKNET ?? '',
    //         value: BigInt(value),
    //       });
    //       const res = await sendTransaction({
    //         to: import.meta.env.VITE_MASTER_ADDRESS_STARKNET ?? '',
    //         value: BigInt(value),
    //       });
    //       console.log(res);
    //     },
    //   },
    // );

    setSavedData({
      address,
      propId,
      value,
    });

    console.log('Sending payment...', {
      recipientAddress: import.meta.env.VITE_MASTER_ADDRESS_STARKNET ?? '',
      value: BigInt(value),
    });

    try {
      const res = await open();
      // const res = await sendTransaction(
      //   {
      //     to: import.meta.env.VITE_MASTER_ADDRESS_STARKNET ?? '',
      //     value: BigInt(value),
      //   },
      //   {
      //     onError: (err) => {
      //       console.log(err);
      //       sendMessage(
      //         'UnityWebReceiver',
      //         'PaymentCallBack',
      //         JSON.stringify({
      //           address,
      //           cancelled: true,
      //           isTestnet: import.meta.env.VITE_IS_MAINNET !== 'true',
      //           propId,
      //           tx: '',
      //         }),
      //       );
      //     },
      //     onSuccess: (data, vars) => {
      //       console.log('Success', data, vars);
      //     },
      //   },
      // );
      console.log(res);
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

    // setSenderArgs({
    //   propId,
    //   to: import.meta.env.VITE_MASTER_ADDRESS,
    //   value,
    // });
  }

  async function handleStarsPayment(value: string, propId: string) {
    // setStarsPropId(propId);

    // getNewInvoice(value);
    handlePayment(value, propId);
  }

  async function handleSocialTask(taskId: string) {
    switch (taskId) {
      case '1':
        WebApp.openLink('https://twitter.com/fartybera');

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
          WebApp.openTelegramLink('https://t.me/+572PnbuackhkMTE9');
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
          WebApp.openTelegramLink('https://t.me/+Ndgsd6EIIARhYTE1');
        }
        break;
      case '8':
        WebApp.openLink('https://x.com/KingdomlyApp');

        setTimeout(
          () => sendMessage('UnityWebReceiver', 'TaskCallBack', 1),
          // eslint-disable-next-line no-magic-numbers
          1000,
        );
        break;
      case '9':
        WebApp.openLink('https://app.beraland.xyz/dl/Ecosystem');

        setTimeout(
          () => sendMessage('UnityWebReceiver', 'TaskCallBack', 1),
          // eslint-disable-next-line no-magic-numbers
          1000,
        );
        break;
      case '10':
        WebApp.openLink('https://x.com/ramen_finance');

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
      console.log('Connecting to Starknet...');
      if (!connected) {
        setShowAuthFlow(true);
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
      <Spinner className={clsx(isLoaded && connected ? 'hidden' : 'visible')} />
      {<DynamicWidget />}
      {connected && (
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
      )}
    </div>
  );
}
