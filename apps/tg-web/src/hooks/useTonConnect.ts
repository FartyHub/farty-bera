/* eslint-disable no-magic-numbers */
import { CHAIN } from '@tonconnect/protocol';
import {
  TonConnectUI,
  useTonConnectUI,
  useTonWallet,
} from '@tonconnect/ui-react';
import { Cell, Sender, SenderArguments } from 'ton-core';

type Props = {
  sendCallback?: (
    address: string,
    body: Cell,
    count?: number,
    rejected?: boolean,
  ) => Promise<boolean>;
};

export function useTonConnect(props?: Props): {
  connected: boolean;
  network: CHAIN | null;
  sender: Sender;
  tonConnectUI: TonConnectUI;
  wallet: string | null;
} {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  return {
    connected: !!wallet?.account.address,
    network: wallet?.account.chain ?? null,
    sender: {
      send: async (args: SenderArguments) => {
        try {
          await tonConnectUI.sendTransaction({
            messages: [
              {
                address: args.to.toString(),
                amount: args.value.toString(),
                payload: args.body?.toBoc().toString('base64'),
              },
            ],
            validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
          });
          await tonConnectUI.disconnect();

          setTimeout(() => {
            props?.sendCallback?.(
              wallet?.account.address ?? '',
              args.body as Cell,
            );
          }, 1000);
        } catch (error) {
          console.error(error);

          setTimeout(() => {
            props?.sendCallback?.(
              wallet?.account.address ?? '',
              args.body as Cell,
              0,
              true,
            );
          }, 1000);
        }
      },
    },
    tonConnectUI,
    wallet: wallet?.account.address ?? null,
  };
}
