/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { useUnityContext } from 'react-unity-webgl';

const FartyBeraContext = createContext<{
  addEventListener: (eventName: string, callback: (data: any) => void) => void;
  isLoaded: boolean;
  removeEventListener: (
    eventName: string,
    callback: (data: any) => void,
  ) => void;
  sendMessage: (objectName: string, methodName: string, value: any) => void;
  unityProvider: any;
  unload: () => Promise<void>;
}>({
  addEventListener: () => {},
  isLoaded: false,
  removeEventListener: () => {},
  sendMessage: () => {},
  unityProvider: {},
  unload: async () => {},
});

export function useFartyBera() {
  return useContext(FartyBeraContext);
}

export function FartyBeraProvider({ children }: { children: ReactNode }) {
  const {
    addEventListener,
    isLoaded,
    removeEventListener,
    sendMessage,
    unityProvider,
    unload,
  } = useUnityContext({
    codeUrl: 'https://storage.googleapis.com/farty-bera-build/web.wasm',
    dataUrl: 'https://storage.googleapis.com/farty-bera-build/web.data',
    frameworkUrl:
      'https://storage.googleapis.com/farty-bera-build/web.framework.js',
    loaderUrl: 'https://storage.googleapis.com/farty-bera-build/web.loader.js',
    // codeUrl: 'build/web.wasm',
    // dataUrl: 'build/web.data',
    // frameworkUrl: 'build/web.framework.js',
    // loaderUrl: 'build/web.loader.js',
  });

  const values = useMemo(
    () => ({
      addEventListener,
      isLoaded,
      removeEventListener,
      sendMessage,
      unityProvider,
      unload,
    }),
    [
      addEventListener,
      isLoaded,
      removeEventListener,
      sendMessage,
      unityProvider,
      unload,
    ],
  );

  return (
    <FartyBeraContext.Provider value={values}>
      {children}
    </FartyBeraContext.Provider>
  );
}
