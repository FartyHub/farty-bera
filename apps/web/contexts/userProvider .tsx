/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from 'js-cookie';
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';

import { UpdateUserDto, User } from '@farty-bera/api-lib';

import { GlobalConfig } from '../config';
import { useLogin, useUpdateUser } from '../hooks';
import { getUser } from '../services';
import { get4361Message, getCustomNaNoId } from '../utils';
import { checkHasTokenValueExpired, checkIsCurrentUser } from '../utils/jwt';

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

const ACCESS_TOKEN = 'farty_token';

const UserContext = createContext<{
  error: string;
  fetchUser: (newAddress?: string) => void;
  isLoading: boolean;
  setOnFailedUpdate: Dispatch<SetStateAction<(() => void) | undefined>>;
  setOnSuccessfulUpdate: Dispatch<SetStateAction<(() => void) | undefined>>;
  setUser: (newUser: UpdateUserDto) => void;
  user?: User;
}>({
  error: '',
  fetchUser: () => {},
  isLoading: false,
  setOnFailedUpdate: () => {},
  setOnSuccessfulUpdate: () => {},
  setUser: () => {},
});

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>();
  const [error, setError] = useState<string>('');
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [onSuccessfulUpdate, setOnSuccessfulUpdate] = useState<() => void>();
  const [onFailedUpdate, setOnFailedUpdate] = useState<() => void>();
  const { address, chainId, connector, isConnecting } = useAccount();
  const { disconnect, reset } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { isPending: isLoggingIn, mutateAsync: login } = useLogin();
  const { isPending, mutate: updateUser } = useUpdateUser({
    onError: (err) => {
      setError(err.message);
      onFailedUpdate?.();
      setOnFailedUpdate(() => {});
    },
    onSuccess: (newUser) => {
      setUser(newUser);
      setError('');
      onSuccessfulUpdate?.();
      setOnSuccessfulUpdate(() => {});
    },
  });

  async function handleSignMessage() {
    setIsSigning(true);

    if (!address || !chainId) {
      throw new Error('Invalid address or chainId');
    }

    const signPayload = getSignMessage(address, chainId);

    const message = get4361Message(signPayload);

    try {
      const signature = await signMessageAsync({
        account: address,
        connector,
        message,
      });

      const payload = {
        key: address,
        message,
        signature,
      };

      const res = (await login(payload)) as any;

      const otpToken = (Cookies.get(ACCESS_TOKEN) ?? res.accessToken) as string;
      const hasExpired = otpToken && checkHasTokenValueExpired(otpToken);
      const isSameUser =
        otpToken && checkIsCurrentUser(otpToken, address ?? '');

      if (!hasExpired && isSameUser) {
        setUser(res.user);

        return;
      }

      disconnect();
    } catch (err) {
      disconnect();
      console.log(err);

      setError('Failed to Sign');
    } finally {
      setIsSigning(false);
    }
  }

  function handleSetUser(newUser: UpdateUserDto) {
    if (!address || !newUser) {
      return;
    }

    updateUser({
      address: address,
      updateUserDto: newUser,
    });
  }

  async function fetchUser(newAddress?: string) {
    const newUser = await getUser(newAddress ?? address ?? '', false);

    if (newUser) {
      setUser(newUser);
    }
  }

  const values = useMemo(
    () => ({
      error,
      fetchUser,
      isLoading: isPending || isSigning || isConnecting || isLoggingIn,
      setOnFailedUpdate,
      setOnSuccessfulUpdate,
      setUser: handleSetUser,
      user,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      user,
      isPending,
      isSigning,
      isConnecting,
      isLoggingIn,
      error,
      onSuccessfulUpdate,
      onFailedUpdate,
    ],
  );

  useEffect(() => {
    if (!address) {
      Cookies.remove('wagmi.store');
      reset();
      disconnect({
        connector,
      });
      setUser(undefined);

      return;
    }

    handleSignMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
