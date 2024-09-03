'use client';
import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { useUnityContext } from 'react-unity-webgl';

const BeraSlashProviderContext = createContext<{
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

export function useBeraSlash() {
  return useContext(BeraSlashProviderContext);
}

export function BeraSlashProvider({ children }: { children: ReactNode }) {
  const {
    addEventListener,
    isLoaded,
    removeEventListener,
    sendMessage,
    unityProvider,
    unload,
  } = useUnityContext({
    codeUrl: 'https://storage.googleapis.com/farty-bera-build/bs.wasm',
    dataUrl: 'https://storage.googleapis.com/farty-bera-build/bs.data',
    frameworkUrl:
      'https://storage.googleapis.com/farty-bera-build/bs.framework.js',
    loaderUrl: 'https://storage.googleapis.com/farty-bera-build/bs.loader.js',
    // codeUrl: 'build_/bs.wasm',
    // dataUrl: 'build_/bs.data',
    // frameworkUrl: 'build_/bs.framework.js',
    // loaderUrl: 'build_/bs.loader.js',
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
    <BeraSlashProviderContext.Provider value={values}>
      {children}
    </BeraSlashProviderContext.Provider>
  );
}
