import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import Script from 'next/script';
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
import { getCookie } from '../utils';

const queryClient = new QueryClient();

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
      <Script src="https://telegram.org/js/games.js" />
    </>
  );
}

export default CustomApp;
