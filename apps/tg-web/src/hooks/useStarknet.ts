/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-magic-numbers */
import {
  argent,
  InjectedConnector,
  RequestResult,
  useAccount,
  useConnect,
  useContract,
  useDisconnect,
  useNetwork,
  useSendTransaction,
} from '@starknet-react/core';
import { useState } from 'react';
import { Abi } from 'starknet';

const abi = [
  {
    inputs: [
      {
        name: 'recipient',
        type: 'core::starknet::contract_address::ContractAddress',
      },
      {
        name: 'amount',
        type: 'core::integer::u256',
      },
    ],
    name: 'transfer',
    outputs: [],
    state_mutability: 'external',
    type: 'function',
  },
] as const satisfies Abi;

type Props = {
  sendCallback?: (
    address: string,
    body: any,
    count?: number,
    rejected?: number,
  ) => Promise<boolean>;
};

export function useStarknet(props?: Props): {
  connect: () => Promise<void>;
  connected: boolean;
  disconnect: () => Promise<void>;
  error: string;
  network?: bigint;
  send(
    userAddress: string,
    amount: bigint,
  ): Promise<RequestResult<'wallet_addInvokeTransaction'>>;
  wallet: string | null;
} {
  const [error, setError] = useState<string>('');
  const { connectAsync, connectors } = useConnect();
  const { address, chainId, connector, status } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { chain } = useNetwork();
  const { contract } = useContract({
    abi,
    address: chain.nativeCurrency.address,
  });
  const { sendAsync } = useSendTransaction({});

  async function connect() {
    console.log('Using', connectors[0].name);
    await connectAsync({
      connector: connectors[0],
    });
  }

  async function disconnect() {
    await disconnectAsync();
  }

  async function send(userAddress: string, amount: bigint) {
    if (contract) {
      return sendAsync([contract.populate('transfer', [userAddress, amount])]);
    } else {
      throw new Error('Contract not available');
    }
  }

  return {
    connect,
    connected: status === 'connected',
    disconnect,
    error,
    network: chainId,
    send,
    // sender: {
    //   send: async (args: SenderArguments) => {
    //     try {
    //       await tonConnectUI.sendTransaction({
    //         messages: [
    //           {
    //             address: args.to.toString(),
    //             amount: args.value.toString(),
    //             payload: args.body?.toBoc().toString('base64'),
    //           },
    //         ],
    //         validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
    //       });
    //       await tonConnectUI.disconnect();
    //       setTimeout(() => {
    //         props?.sendCallback?.(
    //           wallet?.account.address ?? '',
    //           args.body as Cell,
    //         );
    //       }, 1000);
    //     } catch (error: any) {
    //       console.error(error);
    //       const onUserReject = String(error).includes('UserRejectsError');
    //       setTimeout(() => {
    //         props?.sendCallback?.(
    //           wallet?.account.address ?? '',
    //           args.body as Cell,
    //           0,
    //           onUserReject ? 1 : 2,
    //         );
    //       }, 1000);
    //       throw error;
    //     }
    //   },
    // },
    wallet: address ?? '',
  };
}
