import React, {
  ReactNode,
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
  setUser: (newUser: UpdateUserDto) => void;
  user?: User;
}>({
  setUser: () => {},
});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>();
  const { address } = useAccount();
  const { mutate: updateUser } = useUpdateUser({
    onSuccess: (newUser) => {
      setUser(newUser);
    },
  });

  function handleSetUser(newUser: UpdateUserDto) {
    if (!address || !newUser) {
      return;
    }

    setUser({
      ...user,
      ...newUser,
    } as User);
    updateUser({
      address: address,
      updateUserDto: newUser,
    });
  }

  async function onAddressChange(newAddress: string) {
    let newUser = await getUser(newAddress, false);

    if (!newUser) {
      newUser = await createUser({
        address: newAddress,
        usedInviteCode: '',
      });
    }

    setUser(newUser);
  }

  const values = useMemo(
    () => ({
      setUser: handleSetUser,
      user,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user],
  );

  useEffect(() => {
    if (!address) {
      return;
    }

    onAddressChange(address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
