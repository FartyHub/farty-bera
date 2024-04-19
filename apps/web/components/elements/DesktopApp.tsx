import clsx from 'clsx';
import { MouseEvent } from 'react';

import { useApplications } from '../../contexts';
import { Application } from '../../types';

type Props = {
  application: Application;
};

export function DesktopApp({ application }: Props): JSX.Element {
  const { disabled, iconUrl, name } = application;
  const {
    applications,
    focusedApplication,
    setApplications,
    setFocusedApplication,
  } = useApplications();
  const isFocused = focusedApplication?.name === application.name;

  function handleOnDoubleClick() {
    if (disabled) {
      return;
    }

    if (applications.some((app) => app.name === application.name)) {
      const maxIndex = Math.max(...applications.map((app) => app.zIndex));
      setApplications(
        applications.map((app) =>
          app.name === application.name
            ? { ...app, zIndex: maxIndex + 1 }
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
        isFocused ? 'bg-blue-500/75' : 'bg-transparent',
      )}
      onClick={handleOnClick}
      onDoubleClick={handleOnDoubleClick}
    >
      <img alt={name} className="size-12" src={iconUrl} />
      <span className="text-white text-sm whitespace-break-spaces">{name}</span>
    </div>
  );
}
