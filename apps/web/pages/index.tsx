import {
  CommonLayout,
  DesktopApp,
  FartyBeraGame,
  GameExplorerWip,
  LeaderboardWip,
  StatsWindow,
} from '../components';
import { ApplicationData, UNDER_DEVELOPMENT } from '../constants';

const apps = Array.from(Object.values(ApplicationData));

export default function Index() {
  return (
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
  );
}
