import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { cookieToInitialState } from 'wagmi';

import { VideoIntro } from '../components';
import { config } from '../config';
import { ApplicationData, Applications } from '../constants';
import {
  ApplicationsProvider,
  FartyBeraProvider,
  UserProvider,
  Web3ModalProvider,
} from '../contexts';

const queryClient = new QueryClient();

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
        <meta content="Farty Bera" property="og:title" />
        <meta content="website" property="og:type" />
        <meta content="http://my.site.com" property="og:url" />
        <meta
          content="https://www.fartybera.xyz/images/ooga-booga.png"
          property="og:image"
        />
        <meta content="#C86F02" name="theme-color" />
      </Head>
      <Web3ModalProvider initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <ApplicationsProvider
              initialState={[ApplicationData[Applications.STATS]]}
            >
              <FartyBeraProvider>
                <main>
                  <VideoIntro />
                  <Component {...pageProps} />
                </main>
              </FartyBeraProvider>
            </ApplicationsProvider>
          </UserProvider>
        </QueryClientProvider>
      </Web3ModalProvider>
    </>
  );
}

export default CustomApp;
