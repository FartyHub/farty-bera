/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgentTMA, SessionAccountInterface } from '@argent/tma-wallet';
import { STRK_TOKEN_ADDRESS, bigDecimal } from '@argent/x-shared';
import { useEffect, useState } from 'react';
import {
  GetTransactionReceiptResponse,
  uint256,
  validateAndParseAddress,
} from 'starknet';

type Props = {
  // no op
};

const argentTMA = ArgentTMA.init({
  // "sepolia" | "mainnet" (not supperted yet)
  appName: 'Farty Claw',
  // Your Telegram app name
  appTelegramUrl: `https://t.me/fartyberabot/fartyclaw`,
  environment: 'sepolia', // Your Telegram app URL
  sessionParams: {
    allowedMethods: [
      // List of contracts/methods allowed to be called by the session key
      {
        contract: STRK_TOKEN_ADDRESS,
        selector: 'transfer',
      },
    ],
    // eslint-disable-next-line prettier/prettier
    validityDays: 90 // session validity (in days) - default: 90
  },
});

export function useStarknet(_props?: Props) {
  const [transferTo, setTransferTo] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('0.001');
  const [hash, setTxHash] = useState<string>('');
  const [txData, setTxData] = useState<GetTransactionReceiptResponse>();
  const [account, setAccount] = useState<SessionAccountInterface>();
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    argentTMA.connect().then((result) => {
      if (!result) {
        setIsConnected(false);
        throw new Error('Not connected');
      }

      if (account?.getSessionStatus() !== 'VALID') {
        const { account: acc } = result;

        setAccount(acc);
        setIsConnected(false);
      }

      const { account: acc, callbackData } = result;
      setAccount(acc);
      setIsConnected(true);
      console.log('callback data:', callbackData);
    });
  }, []);

  useEffect(() => {
    if (hash && account) {
      account.getTransactionReceipt(hash).then((data) => {
        setTxData(data as GetTransactionReceiptResponse);
      });
    }
  }, [account, hash]);

  async function connectWallet() {
    const res = await argentTMA.requestConnection('custom_callback_data');
    console.log(res);
  }

  async function disconnect() {
    await argentTMA.clearSession();
    setIsConnected(false);
    setAccount(undefined);
  }

  async function sendStrk(address: string, amount: string) {
    console.log('Send', validateAndParseAddress(address), amount);
    const txHash = await account?.execute({
      calldata: [
        validateAndParseAddress(address),
        uint256.bnToUint256(Number(amount)),
      ],
      contractAddress: STRK_TOKEN_ADDRESS,
      entrypoint: 'transfer',
    });

    console.log('txHash', txHash);
    setTxHash(txHash?.transaction_hash ?? '');
  }

  return {
    account,
    connectWallet,
    disconnect,
    hash,
    isConnected,
    sendStrk,
    setTransferAmount,
    setTransferTo,
    setTxData,
    setTxHash,
    txData,
  };
}
