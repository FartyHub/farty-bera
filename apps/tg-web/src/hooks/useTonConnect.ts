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
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    tonConnectUI,
    wallet: wallet?.account.address ?? null,
  };
}
