'use client';
import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { useUnityContext } from 'react-unity-webgl';

const BeraDropProviderContext = createContext<{
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

export function useBeraDrop() {
  return useContext(BeraDropProviderContext);
}

export function BeraDropProvider({ children }: { children: ReactNode }) {
  const {
    addEventListener,
    isLoaded,
    removeEventListener,
    sendMessage,
    unityProvider,
    unload,
  } = useUnityContext({
    codeUrl: 'https://storage.googleapis.com/farty-bera-build/bd.wasm',
    dataUrl: 'https://storage.googleapis.com/farty-bera-build/bd.data',
    frameworkUrl:
      'https://storage.googleapis.com/farty-bera-build/bd.framework.js',
    loaderUrl: 'https://storage.googleapis.com/farty-bera-build/bd.loader.js',
    // codeUrl: 'build_/bd.wasm.br',
    // dataUrl: 'build_/bd.data.br',
    // frameworkUrl: 'build_/bd.framework.js.br',
    // loaderUrl: 'build_/bd.loader.js',
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
    <BeraDropProviderContext.Provider value={values}>
      {children}
    </BeraDropProviderContext.Provider>
  );
}
