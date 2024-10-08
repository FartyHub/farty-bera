/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useUnityContext } from 'react-unity-webgl';

import { useIPFunctions } from '../hooks';

type SavedData = {
  address: string;
  propId: string;
  value: string;
};

const UnityGameContext = createContext<{
  addEventListener: (eventName: string, callback: (data: any) => void) => void;
  isLoaded: boolean;
  removeEventListener: (
    eventName: string,
    callback: (data: any) => void,
  ) => void;
  savedData?: SavedData;
  sendMessage: (objectName: string, methodName: string, value: any) => void;
  setSavedData: Dispatch<SetStateAction<SavedData | undefined>>;
  unityProvider: any;
}>({
  addEventListener: () => {},
  isLoaded: false,
  removeEventListener: () => {},
  sendMessage: () => {},
  setSavedData: () => {},
  unityProvider: {},
});

export function useUnityGame() {
  return useContext(UnityGameContext);
}

export function UnityGameProvider({ children }: { children: ReactNode }) {
  const [savedData, setSavedData] = useState<SavedData>();
  const { region = '' } = useIPFunctions();
  const isInEurope = region.toUpperCase() === 'EU';
  const europeSuffix = isInEurope ? '-eu' : '';
  const {
    addEventListener,
    isLoaded,
    removeEventListener,
    sendMessage,
    unityProvider,
  } = useUnityContext({
    codeUrl: `https://storage.googleapis.com/tg-mini-app-build${europeSuffix}/tg.wasm`,
    dataUrl: `https://storage.googleapis.com/tg-mini-app-build${europeSuffix}/tg.data`,
    frameworkUrl: `https://storage.googleapis.com/tg-mini-app-build${europeSuffix}/tg.framework.js`,
    loaderUrl: `https://storage.googleapis.com/tg-mini-app-build${europeSuffix}/tg.loader.js`,
    // codeUrl: 'https://storage.googleapis.com/tg-mini-app-build/Build.wasm',
    // dataUrl: 'https://storage.googleapis.com/tg-mini-app-build/Build.data',
    // frameworkUrl:
    //   'https://storage.googleapis.com/tg-mini-app-build/Build.framework.js',
    // loaderUrl:
    //   'https://storage.googleapis.com/tg-mini-app-build/Build.loader.js',
    // codeUrl: 'Build/Build.wasm',
    // dataUrl: 'Build/Build.data',
    // frameworkUrl: 'Build/Build.framework.js',
    // loaderUrl: 'Build/Build.loader.js',
  });

  const values = useMemo(
    () => ({
      addEventListener,
      isLoaded,
      removeEventListener,
      savedData,
      sendMessage,
      setSavedData,
      unityProvider,
    }),
    [
      addEventListener,
      isLoaded,
      removeEventListener,
      sendMessage,
      unityProvider,
      savedData,
      setSavedData,
    ],
  );

  return (
    <UnityGameContext.Provider value={values}>
      {children}
    </UnityGameContext.Provider>
  );
}
