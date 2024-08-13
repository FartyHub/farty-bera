'use client';
import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { useUnityContext } from 'react-unity-webgl';

const BeraTowerProviderContext = createContext<{
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

export function useBeraTower() {
  return useContext(BeraTowerProviderContext);
}

export function BeraTowerProvider({ children }: { children: ReactNode }) {
  const {
    addEventListener,
    isLoaded,
    removeEventListener,
    sendMessage,
    unityProvider,
    unload,
  } = useUnityContext({
    codeUrl: 'https://storage.googleapis.com/farty-bera-build/bt.wasm',
    dataUrl: 'https://storage.googleapis.com/farty-bera-build/bt.data',
    frameworkUrl:
      'https://storage.googleapis.com/farty-bera-build/bt.framework.js',
    loaderUrl: 'https://storage.googleapis.com/farty-bera-build/bt.loader.js',
    // codeUrl: 'build/bt.wasm',
    // dataUrl: 'build/bt.data',
    // frameworkUrl: 'build/bt.framework.js',
    // loaderUrl: 'build/bt.loader.js',
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
    <BeraTowerProviderContext.Provider value={values}>
      {children}
    </BeraTowerProviderContext.Provider>
  );
}
