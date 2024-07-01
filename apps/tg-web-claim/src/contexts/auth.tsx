import WebApp from '@twa-dev/sdk';
import {
  FunctionComponent,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useSaveUser, useTonConnect } from '../hooks';

export type FartyClawUser = {
  address: string;
  chatId: string;
  createdAt: Date;
  deletedAt?: Date;
  firstName: string;
  id: string;
  languageCode: string;
  lastName: string;
  telegramId: string;
  updatedAt: Date;
};

export interface AuthContextValue {
  user?: FartyClawUser;
}

const AuthContext = createContext<AuthContextValue>({});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
  children,
}) => {
  const { wallet } = useTonConnect();
  const { mutate: saveUser } = useSaveUser({
    onSuccess: (user: FartyClawUser) => {
      setUser(user);
    },
  });
  const [user, setUser] = useState<FartyClawUser>();

  useEffect(() => {
    saveUser({
      address: wallet ?? '',
      initData: WebApp.initData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [WebApp.initData, wallet]);

  const value = useMemo(
    () => ({
      user,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
