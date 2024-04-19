import { CommonLayout, DesktopApp, FartyBeraGame } from '../components';
import { ApplicationData } from '../constants';

const apps = Array.from(Object.values(ApplicationData));

export default function Index() {
  return (
    <CommonLayout className="gap-4">
      <FartyBeraGame />
      {apps.map((app) => (
        <DesktopApp key={app.name} application={app} />
      ))}
    </CommonLayout>
  );
}
