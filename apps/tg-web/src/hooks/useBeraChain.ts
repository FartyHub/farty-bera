/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConnectErrorType, SendTransactionErrorType } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { parseEther } from 'viem';
import { berachainTestnetbArtio } from 'viem/chains';
import {
  useAccount,
  useDisconnect,
  useConnect,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { metaMask } from 'wagmi/connectors';

type Props = {
  // no op
};

export function useBeraChain(_props?: Props) {
  const [transferTo, setTransferTo] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('1');
  const [hash, setTxHash] = useState<string>('');
  const { address = '', chain, status } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync: disconnect } = useDisconnect();
  const { sendTransactionAsync } = useSendTransaction();
  const { data: txData, isLoading: isGettingTx } = useWaitForTransactionReceipt(
    {
      hash: hash as `0x${string}`,
    },
  );

  useEffect(
    () => {
      if (!isGettingTx && hash) {
        setTxHash('');
      }
    } /* eslint-disable-next-line react-hooks/exhaustive-deps */,
    [isGettingTx],
  );

  async function connectWallet({
    onError,
  }: {
    onError?: (
      error: ConnectErrorType,
      variables: any,
      context: unknown,
    ) => void;
  }) {
    await connectAsync(
      {
        chainId: berachainTestnetbArtio.id,
        connector: metaMask(),
      },
      {
        onError,
      },
    );
  }

  async function sendBera({
    onError,
  }: {
    onError?: (
      error: SendTransactionErrorType,
      variables: any,
      context: unknown,
    ) => void;
  }) {
    await sendTransactionAsync(
      {
        account: address as `0x${string}`,
        to: transferTo as `0x${string}`,
        value: parseEther(transferAmount),
      },
      {
        onError,
        onSuccess: (tx) => {
          setTxHash(tx);
        },
      },
    );
  }

  return {
    address,
    chainId: chain?.name,
    connectWallet,
    connected: status === 'connected',
    connectors,
    disconnect,
    hash,
    isGettingTx,
    sendBera,
    setTransferAmount,
    setTransferTo,
    setTxHash,
    status,
    transferAmount,
    transferTo,
    txData,
  };
}
