import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

import {
  CommonLayout,
  DesktopApp,
  FartyBeraGame,
  GameExplorerWip,
  LeaderboardWip,
  StatsWindow,
} from '../components';
import { ApplicationData, UNDER_DEVELOPMENT } from '../constants';
import { getUser } from '../services';

const apps = Array.from(Object.values(ApplicationData));

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.query?.id as string;
  const user = await getUser(id, false);

  return {
    props: {
      user: user || null,
    },
  };
}

export default function Index({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
      <CommonLayout className="gap-4">
        <FartyBeraGame />
        <StatsWindow />
        <LeaderboardWip />
        <GameExplorerWip />
        {apps
          .filter((app) => !app.system || UNDER_DEVELOPMENT.includes(app.id))
          .map((app) => (
            <DesktopApp key={app.name} application={app} />
          ))}
      </CommonLayout>
    </>
  );
}
