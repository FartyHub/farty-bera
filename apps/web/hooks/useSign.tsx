/* eslint-disable no-console */
import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

import { GlobalConfig } from '../config';
import { get4361Message, getCustomNaNoId, hashSHA256 } from '../utils';

const getSignMessage = (
  address: string,
  chainId: number | string,
  data: string,
) => ({
  address: address,
  chainId: chainId,
  domain: window.location.host,
  issuedAt: new Date().toISOString(),
  nonce: getCustomNaNoId(),
  statement: hashSHA256(data, address),
  uri: window.location.origin,
  version: GlobalConfig.WELCOME_SIGNATURE_VERSION,
});

export function useSign() {
  const { address, chainId, connector } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setLoading] = useState<boolean>(true);

  async function handleSignMessage(data: string, encode = true) {
    setLoading(true);

    if (!address || !chainId) {
      throw new Error('Invalid address or chainId');
    }

    const signPayload = getSignMessage(address, chainId, data);

    const message = get4361Message(signPayload);

    try {
      const signature = await signMessageAsync({
        account: address,
        connector,
        message,
      });

      return {
        key: address,
        message: encode ? encodeURIComponent(message) : message,
        signature,
      };
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    return {
      key: '',
      message: '',
      signature: '',
    };
  }

  return {
    handleSignMessage,
    isLoading,
  };
}
