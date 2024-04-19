import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
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
            <Component {...pageProps} />
          </main>
        </ApplicationsProvider>
      </Web3ModalProvider>
    </>
  );
}

export default CustomApp;
