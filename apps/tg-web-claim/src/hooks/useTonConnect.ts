/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-magic-numbers */
import { CHAIN } from '@tonconnect/protocol';
import {
  TonConnectUI,
  useTonConnectUI,
  useTonWallet,
} from '@tonconnect/ui-react';
import { Sender, SenderArguments } from 'ton-core';

export function useTonConnect(): {
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
        } catch (error: any) {
          console.error(error);

          throw error;
        }
      },
    },
    tonConnectUI,
    wallet: wallet?.account.address ?? null,
  };
}
