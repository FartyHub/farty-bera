import { MouseEvent } from 'react';

import { ApplicationData, Applications } from '../../constants';
import { useApplications } from '../../contexts';
import { Button } from '../atoms';
import { Window } from '../elements';

export function TaskNotEligible() {
  const { applications, setApplications } = useApplications();
  const application = ApplicationData[Applications.TASK_NOT_ELIGIBLE];

  async function handleClose(event?: MouseEvent<HTMLButtonElement>) {
    event?.stopPropagation();
    setApplications(applications.filter((app) => app.id !== application.id));
  }

  return (
    <Window center application={application} className="w-[367px]">
      <div className="flex flex-col p-3 gap-3 text-sm">
        <img alt="bear" className="w-8 h-auto" src="/images/warning-icon.svg" />
        <div className="text-[13px]">
          <p>
            You were not one of the early fartyberas but it&apos;s fine!
            <br />
            Keep playing to top up the score. Ooga booga.
          </p>
        </div>
        <div className="flex justify-end gap-1">
          <Button
            className="flex px-5 py-2 justify-center w-[101px]"
            type="primary"
            onClick={handleClose}
          >
            OK
          </Button>
        </div>
      </div>
    </Window>
  );
}
