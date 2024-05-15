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
import { useAccount } from 'wagmi';

import { UpdateUserDto, User } from '@farty-bera/api-lib';

import { useUpdateUser } from '../hooks';
import { createUser, getUser } from '../services';

const UserContext = createContext<{
  error: string;
  isLoading: boolean;
  setOnFailedUpdate: Dispatch<SetStateAction<(() => void) | undefined>>;
  setOnSuccessfulUpdate: Dispatch<SetStateAction<(() => void) | undefined>>;
  setUser: (newUser: UpdateUserDto) => void;
  user?: User;
}>({
  error: '',
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
  const [onSuccessfulUpdate, setOnSuccessfulUpdate] = useState<() => void>();
  const [onFailedUpdate, setOnFailedUpdate] = useState<() => void>();
  const { address } = useAccount();
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

  function handleSetUser(newUser: UpdateUserDto) {
    if (!address || !newUser) {
      return;
    }

    updateUser({
      address: address,
      updateUserDto: newUser,
    });
  }

  async function onAddressChange(newAddress: string) {
    const newUser = await getUser(newAddress, false);

    if (!newUser) {
      // newUser = await createUser({
      //   address: newAddress,
      //   usedInviteCode: '',
      // });
    }

    setUser(newUser);
  }

  const values = useMemo(
    () => ({
      error,
      isLoading: isPending,
      setOnFailedUpdate,
      setOnSuccessfulUpdate,
      setUser: handleSetUser,
      user,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, isPending, error, onSuccessfulUpdate, onFailedUpdate],
  );

  useEffect(() => {
    if (!address) {
      setUser(undefined);

      return;
    }

    onAddressChange(address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
