/* eslint-disable @typescript-eslint/no-explicit-any */
import { STRK_TOKEN_ADDRESS, bigDecimal } from '@argent/x-shared';
import {
  useAccount,
  useConnect,
  useContract,
  useDisconnect,
  useSendTransaction,
  useTransactionReceipt,
} from '@starknet-react/core';
import { useState } from 'react';
import { Abi, constants } from 'starknet';
import { useStarknetkitConnectModal } from 'starknetkit';

type Props = {
  // no op
};

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

export function useStarknet(_props?: Props) {
  const [transferTo, setTransferTo] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('1');
  const [hash, setTxHash] = useState<string>('');
  const { address = '', status } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync: disconnect } = useDisconnect();
  const { contract } = useContract({
    abi,
    address: STRK_TOKEN_ADDRESS,
  });
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as any,
  });
  const { sendAsync: sendStrk } = useSendTransaction({
    calls:
      contract && transferTo
        ? [
            contract.populate('transfer', [
              transferTo,
              // transferAmount
              Number(bigDecimal.parseEther('1').value),
            ]),
          ]
        : undefined,
  });
  const { data: txData, isLoading: isGettingTx } = useTransactionReceipt({
    hash,
  });

  async function connectWallet() {
    const { connector } = await starknetkitConnectModal();

    if (!connector) {
      throw new Error('No connector');
    }

    await connectAsync({ connector: connector as any });
  }

  return {
    address,
    chainId:
      import.meta.env.VITE_IS_MAINNET !== 'true'
        ? constants.NetworkName.SN_SEPOLIA
        : constants.NetworkName.SN_MAIN,
    connectWallet,
    connected: status === 'connected',
    connectors,
    disconnect,
    hash,
    isGettingTx,
    sendStrk,
    setTransferAmount,
    setTransferTo,
    setTxHash,
    status,
    txData,
  };
}
