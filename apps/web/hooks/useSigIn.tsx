import { getAccount, getWalletClient, signMessage } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { useAccount, useConfig } from 'wagmi';

import { GlobalConfig } from '../config';
import { get4361Message, getCustomNaNoId } from '../utils';

const getSignMessage = (address: string, chainId: number | string) => ({
  address: address,
  chainId: chainId,
  domain: window.location.host,
  issuedAt: new Date().toISOString(),
  nonce: getCustomNaNoId(),
  statement: GlobalConfig.WELCOME_SIGNATURE_STATEMENT,
  uri: window.location.origin,
  version: GlobalConfig.WELCOME_SIGNATURE_VERSION,
});

export function useSignIn() {
  const { isConnected, isConnecting } = useAccount();
  const config = useConfig();
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(isConnecting);
  }, [isConnecting]);

  useEffect(() => {
    if (isConnected) {
      handleSignMessage();
    }
  }, [isConnected]);

  async function handleSignMessage() {
    setLoading(true);
    const client = await getWalletClient(config);

    if (!client) {
      throw new Error('Wallet client not found');
    }

    const account = getAccount(config);
    const chains = config.chains;
    const chain = chains.find((ch: any) => ch.id === account.chainId);

    const signPayload = getSignMessage(account.address!, chain?.id || 1);

    const message = get4361Message(signPayload);

    try {
      const signature = await signMessage(config, {
        message,
      });

      const payload = {
        chainType: 'evm',
        key: account.address!,
        message,
        signature,
      };
      console.log(payload);
      // const res = await signIn(payload);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    handleSignMessage,
    isLoading,
  };
}
