import { MouseEvent } from 'react';

import { ApplicationData, Applications } from '../../constants';
import { useApplications } from '../../contexts';
import { Button } from '../atoms';
import { Window } from '../elements';

export function LeaderboardWip() {
  const { applications, setApplications } = useApplications();
  const application = ApplicationData[Applications.LEADERBOARD];

  async function handleClose(event?: MouseEvent<HTMLButtonElement>) {
    event?.stopPropagation();
    setApplications(applications.filter((app) => app.id !== application.id));
  }

  return (
    <Window center application={application} className="w-[300px]">
      <div className="flex flex-col p-3 gap-3 text-sm">
        <img alt="bear" className="w-8 h-auto" src="/images/warning-icon.svg" />
        <div className="text-[13px]">
          <p>
            Leaderboard is not available right now. The devs are not sleeping to
            work on it. Stay tuned.
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            className="flex px-5 py-2 justify-center w-full"
            type="primary"
            onClick={handleClose}
          >
            I will wait
          </Button>
          <Button
            className="flex px-5 py-2 justify-center w-full"
            type="primary"
            onClick={handleClose}
          >
            Go dev
          </Button>
        </div>
      </div>
    </Window>
  );
}
