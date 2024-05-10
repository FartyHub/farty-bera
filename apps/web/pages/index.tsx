import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';

import { SendTelegramGameScoreDto } from '@farty-bera/api-lib';

import {
  CommonLayout,
  DesktopApp,
  FartyBeraGame,
  GameExplorerWip,
  Leaderboard,
  StatsWindow,
} from '../components';
import { ApplicationData, UNDER_DEVELOPMENT } from '../constants';
import { useTouchDevice } from '../hooks';
import { getUser } from '../services';

const apps = Array.from(Object.values(ApplicationData));

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.query?.id as string;
  const telegramMessageContext: SendTelegramGameScoreDto = {
    chatId: Number(context.query?.chatId ?? '0'),
    editMessage: context.query?.editMessage === 'true',
    force: context.query?.force === 'true',
    inlineMessageId: String(context.query?.inlineMessageId ?? ''),
    messageId: Number(context.query?.messageId ?? '0'),
    score: Number(context.query?.score ?? '0'),
    userId: Number(context.query?.userId ?? '0'),
  };
  const botId = context.query?.botId as string;
  const user = await getUser(id, false);
  const isTelegram = process.env.NEXT_PUBLIC_BOT_ID === botId;

  return {
    props: {
      isTelegram,
      telegramMessageContext: isTelegram ? telegramMessageContext : null,
      user: user || null,
    },
  };
}

export default function Index({
  isTelegram,
  telegramMessageContext,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { setIsTouch } = useTouchDevice();

  useEffect(() => {
    setIsTouch(isTelegram);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTelegram]);

  return (
    <>
      <Head>
        {user && (
          <>
            <meta content="summary_large_image" name="twitter:card" />
            <meta content="@fartybera" name="twitter:site" />
            <meta content="Farty High Score" name="twitter:title" />
            <meta
              content={`I am so farty! I just hit a new high score of ${user.fartyHighScore} in the Farty Bera game. Bet you can't beat that!`}
              name="twitter:description"
            />
            <meta
              content="https://storage.googleapis.com/farty-bera-build/high-score.png"
              name="twitter:image"
            />
            <meta content="Farty High Score" property="og:title" />
            <meta content="website" property="og:type" />
            <meta content="http://www.fartybera.xyz" property="og:url" />
            <meta
              content={`I am so farty! I just hit a new high score of ${user.fartyHighScore} in the Farty Bera game. Bet you can't beat that!`}
              name="og:description"
            />
            <meta
              content="https://storage.googleapis.com/farty-bera-build/high-score.png"
              property="og:image"
            />
            <meta content="#C86F02" name="theme-color" />
          </>
        )}
      </Head>
      <CommonLayout className="gap-4" isTelegram={isTelegram}>
        <FartyBeraGame
          isTelegram={isTelegram}
          telegramMessageContext={telegramMessageContext}
        />
        <StatsWindow />
        <Leaderboard />
        <GameExplorerWip />
        {!isTelegram &&
          apps
            .filter((app) => !app.system || UNDER_DEVELOPMENT.includes(app.id))
            .map((app) => <DesktopApp key={app.name} application={app} />)}
      </CommonLayout>
    </>
  );
}
