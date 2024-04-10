import clsx from 'clsx';
import { Unity, useUnityContext } from 'react-unity-webgl';

import { Spinner } from '../atoms';

type Props = {
  className?: string;
};

export function FartyBeraGame({ className }: Props) {
  const { isLoaded, unityProvider } = useUnityContext({
    codeUrl: 'https://storage.googleapis.com/farty-bera/Build/web.wasm',
    dataUrl: 'https://storage.googleapis.com/farty-bera/Build/web.data',
    frameworkUrl:
      'https://storage.googleapis.com/farty-bera/Build/web.framework.js',
    loaderUrl: 'https://storage.googleapis.com/farty-bera/Build/web.loader.js',
  });

  return (
    <>
      <Spinner className={clsx(isLoaded ? 'hidden' : 'visible')} />
      <Unity
        className={clsx(
          'w-full h-auto max-h-[70vh] rounded-lg',
          isLoaded ? 'visible' : 'hidden',
          className,
        )}
        unityProvider={unityProvider}
      />
    </>
  );
}
