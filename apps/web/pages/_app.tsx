import clsx from 'clsx';
import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { useState } from 'react';
import { cookieToInitialState } from 'wagmi';

import { config } from '../config';
import { ApplicationData, Applications } from '../constants';
import { ApplicationsProvider, Web3ModalProvider } from '../contexts';

export function getCookie(name: string) {
  if (typeof document === 'undefined') return;

  const value = '; ' + document.cookie;
  const decodedValue = decodeURIComponent(value);
  const parts = decodedValue.split('; ' + name + '=');

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
}

function CustomApp({ Component, pageProps }: AppProps) {
  const initialState = cookieToInitialState(config, getCookie('wagmi'));
  const [showVideo, setShowVideo] = useState<boolean>(true);
  const [hasVideoEnded, setHasVideoEnded] = useState<boolean>(false);

  function handleVideoEnded() {
    setHasVideoEnded(true);

    setTimeout(() => {
      setShowVideo(false);
    }, 1000);
  }

  return (
    <>
      <Head>
        <title>Farty Bera</title>
      </Head>
      <Web3ModalProvider initialState={initialState}>
        <ApplicationsProvider
          initialState={[ApplicationData[Applications.STATS]]}
        >
          <main>
            <video
              autoPlay
              muted
              className={clsx(
                'fixed inset-0 object-cover size-full z-[1000]',
                'transition-opacity duration-500 ease-in-out',
                hasVideoEnded ? 'opacity-0' : 'opacity-100',
                showVideo ? 'visible' : 'hidden',
              )}
              onEnded={handleVideoEnded}
            >
              <source
                src="https://storage.googleapis.com/farty-bera-build/intro.webm"
                type="video/webm"
              />
            </video>
            {!hasVideoEnded ? null : <Component {...pageProps} />}
          </main>
        </ApplicationsProvider>
      </Web3ModalProvider>
    </>
  );
}

export default CustomApp;
