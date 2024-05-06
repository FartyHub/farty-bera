import clsx from 'clsx';
import { MouseEvent } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import { Applications } from '../../constants';
import { useApplications } from '../../contexts';
import { useTouchDevice } from '../../hooks';
import { Application } from '../../types';

type Props = {
  application: Application;
};

const FULL_SCREEN_MOBILE_APPS = [
  Applications.FARTY_BERA,
  Applications.LEADERBOARD,
];

export function DesktopApp({ application }: Props): JSX.Element {
  const { desktopIconUrl, disabled, name } = application;
  const {
    applications,
    focusedApplication,
    setApplications,
    setFocusedApplication,
  } = useApplications();
  const { isTouch } = useTouchDevice();
  const isFocused = focusedApplication?.id === application.id;

  function handleOnDoubleClick() {
    if (disabled) {
      return;
    }

    if (applications.some((app) => app.id === application.id)) {
      const maxIndex = Math.max(...applications.map((app) => app.zIndex));
      setApplications(
        applications.map((app) =>
          app.id === application.id
            ? {
                ...app,
                fullScreen:
                  isTouch && FULL_SCREEN_MOBILE_APPS.includes(application.id),
                softHide: false,
                zIndex: maxIndex + 1,
              }
            : app,
        ),
      );
    } else {
      setApplications([
        ...applications,
        {
          ...application,
          fullScreen:
            isTouch && FULL_SCREEN_MOBILE_APPS.includes(application.id),
          zIndex: applications.length + 1,
        },
      ]);
    }
  }

  function handleOnClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setFocusedApplication(application);
  }

  return (
    <div className={clsx('flex items-center text-center justify-center')}>
      <OutsideClickHandler
        onOutsideClick={() => {
          setFocusedApplication(null);
        }}
      >
        <button
          className={clsx(
            'flex flex-col items-center gap-2 text-center justify-center cursor-default',
          )}
          onClick={handleOnClick}
          onDoubleClick={handleOnDoubleClick}
          onTouchEnd={handleOnDoubleClick}
        >
          <img alt={name} className="h-12 w-auto" src={desktopIconUrl} />
          <span
            className={clsx(
              'text-white text-sm whitespace-break-spaces border',
              isFocused ? 'bg-[#C86F02] border-dotted' : 'border-transparent',
            )}
          >
            {name}
          </span>
        </button>
      </OutsideClickHandler>
    </div>
  );
}
