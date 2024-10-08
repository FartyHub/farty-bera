import {
  useDynamicContext,
  useUserWallets,
  useSwitchWallet,
  useSendBalance,
} from '@dynamic-labs/sdk-react-core';
import { useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
} from 'wagmi';
type Props = {
  sendCallback?: (
    address: string,
    body: any,
    count?: number,
    rejected?: number,
  ) => Promise<boolean>;
};

export function useStarknet(props?: Props) {
  const userWallets = useUserWallets();
  const { address, chain, isConnected } = useAccount();
  const { connectAsync: connect, connectors } = useConnect();
  const { disconnectAsync: disconnect } = useDisconnect();
  const { sendTransaction } = useSendTransaction();
  const { handleLogOut, primaryWallet, setShowAuthFlow, user } =
    useDynamicContext();
  const switchWallet = useSwitchWallet();
  const { open } = useSendBalance();

  useEffect(() => {
    console.log('userWallets', address, isConnected, chain);

    if (userWallets[0]?.isAuthenticated && !primaryWallet) {
      switchWallet(userWallets[0].id);
    }
  }, [userWallets, switchWallet, primaryWallet, address, isConnected, chain]);

  return {
    address: userWallets[0]?.address ?? '',
    chain: userWallets[0]?.chain,
    connect,
    connected: userWallets[0]?.isAuthenticated && user?.email,
    connectors,
    disconnect,
    handleLogOut,
    open,
    sendTransaction,
    setShowAuthFlow,
  };
}
