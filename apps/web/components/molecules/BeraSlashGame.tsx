import clsx from 'clsx';
import { MouseEvent } from 'react';
import { Unity } from 'react-unity-webgl';

import { ApplicationData, Applications } from '../../constants';
import { useApplications, useBeraSlash } from '../../contexts';
import { useTouchDevice } from '../../hooks';
import { Spinner } from '../atoms';
import { Window } from '../elements';

type Props = {
  // no props
};

export function BeraSlashGame(_props: Props) {
  const { isLoaded, unityProvider, unload } = useBeraSlash();
  const { applications, setApplications } = useApplications();
  const { isTouch } = useTouchDevice();
  const application =
    applications.find((app) => app.id === Applications.BERA_SLASH) ||
    ApplicationData[Applications.BERA_SLASH];

  async function handleCloseWindow(event?: MouseEvent<HTMLButtonElement>) {
    event?.stopPropagation();
    setApplications(
      applications.filter((app) => app.id !== Applications.BERA_SLASH),
    );
    await unload();
  }

  return (
    <Window center application={application} onClose={handleCloseWindow}>
      <div className="flex flex-col p-1 pt-0.5 border-outset gap-2 justify-between h-full">
        <div
          className={clsx(
            'border-inset-black flex items-center justify-center',
            application.fullScreen ? 'size-full' : 'w-[100vh] h-[60vh]',
          )}
        >
          <Spinner className={clsx(isLoaded ? 'hidden' : 'visible')} />
          <Unity
            className={clsx('size-full', isLoaded ? 'visible' : 'hidden')}
            style={{
              height: '100%',
              width: '100%',
            }}
            tabIndex={1}
            unityProvider={unityProvider}
          />
        </div>
        <div className="flex justify-between items-center">
          {!isTouch && (
            <div className="flex gap-[11px]">
              <img
                alt={application.id}
                className="size-10"
                src="/images/farty-bera-logo.png"
              />
              <div className="flex flex-col">
                <span className="font-bold text-base">{application.name}</span>
                <span className="font-normal text-[13px]">
                  Created by {application.creator}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Window>
  );
}
