/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { parseEther } from 'viem';
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

  async function connectWallet() {
    await connectAsync({ connector: metaMask() });
  }

  async function sendBera() {
    const tx = await sendTransactionAsync({
      account: address as `0x${string}`,
      to: transferTo as `0x${string}`,
      value: parseEther(transferAmount),
    });
    setTxHash(tx);
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
