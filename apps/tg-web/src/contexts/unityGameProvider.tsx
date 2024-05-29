/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { useUnityContext } from 'react-unity-webgl';

const UnityGameContext = createContext<{
  addEventListener: (eventName: string, callback: (data: any) => void) => void;
  isLoaded: boolean;
  removeEventListener: (
    eventName: string,
    callback: (data: any) => void,
  ) => void;
  sendMessage: (objectName: string, methodName: string, value: any) => void;
  unityProvider: any;
}>({
  addEventListener: () => {},
  isLoaded: false,
  removeEventListener: () => {},
  sendMessage: () => {},
  unityProvider: {},
});

export function useUnityGame() {
  return useContext(UnityGameContext);
}

export function UnityGameProvider({ children }: { children: ReactNode }) {
  const {
    addEventListener,
    isLoaded,
    removeEventListener,
    sendMessage,
    unityProvider,
  } = useUnityContext({
    // codeUrl: 'https://storage.googleapis.com/tg-mini-app-build/tg.wasm',
    // dataUrl: 'https://storage.googleapis.com/tg-mini-app-build/tg.data',
    // frameworkUrl:
    //   'https://storage.googleapis.com/tg-mini-app-build/tg.framework.js',
    // loaderUrl: 'https://storage.googleapis.com/tg-mini-app-build/tg.loader.js',
    codeUrl: 'https://storage.googleapis.com/tg-mini-app-build/Build.wasm',
    dataUrl: 'https://storage.googleapis.com/tg-mini-app-build/Build.data',
    frameworkUrl:
      'https://storage.googleapis.com/tg-mini-app-build/Build.framework.js',
    loaderUrl:
      'https://storage.googleapis.com/tg-mini-app-build/Build.loader.js',
  });

  const values = useMemo(
    () => ({
      addEventListener,
      isLoaded,
      removeEventListener,
      sendMessage,
      unityProvider,
    }),
    [
      addEventListener,
      isLoaded,
      removeEventListener,
      sendMessage,
      unityProvider,
    ],
  );

  return (
    <UnityGameContext.Provider value={values}>
      {children}
    </UnityGameContext.Provider>
  );
}
