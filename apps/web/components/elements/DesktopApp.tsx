import clsx from 'clsx';
import { MouseEvent } from 'react';

import { useApplications } from '../../contexts';
import { Application } from '../../types';

type Props = {
  application: Application;
};

export function DesktopApp({ application }: Props): JSX.Element {
  const { desktopIconUrl, disabled, name } = application;
  const {
    applications,
    focusedApplication,
    setApplications,
    setFocusedApplication,
  } = useApplications();
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
            ? { ...app, softHide: false, zIndex: maxIndex + 1 }
            : app,
        ),
      );
    } else {
      setApplications([
        ...applications,
        {
          ...application,
          zIndex: applications.length + 1,
        },
      ]);
    }
  }

  function handleOnClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    setFocusedApplication(application);
  }

  return (
    <div
      className={clsx(
        'flex flex-col items-center gap-2 text-center justify-center cursor-default',
      )}
      role="button"
      onClick={handleOnClick}
      onDoubleClick={handleOnDoubleClick}
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
    </div>
  );
}
